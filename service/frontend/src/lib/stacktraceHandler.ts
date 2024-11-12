import {
  SourceMapConsumer,
  type RawSourceMap,
  type MappedPosition,
} from "source-map-js";
import { pbGet } from "$lib/queries/get";
import { bufferToJSON } from "./utils";

interface SourceMap {
  consumer: SourceMapConsumer;
  fileName: string;
  fileNameInline: string;
}

interface StackFrame {
  col: number;
  file: string;
  function: string;
  line: number;
  raw: string;
}

interface StackTrace {
  message: string;
  frames: StackFrame[];
  fileNames: string[];
}

interface UnifiedPosition {
  column: number | null;
  file: string | null;
  line: number | null;
  method: string | null;
}

interface EnhancedStacktraceResult {
  decodedStacktrace: string;
  codeContext: CodeContextLine[] | null;
  decodedFileName: string | null;
}

function parseStackTrace(stackframes: StackFrame[]): StackTrace {
  const frames: StackFrame[] = [];
  const fileNames: Set<string> = new Set();

  for (const frame of stackframes) {
    frames.push({
      methodName: frame.function,
      fileName: frame.file,
      lineNumber: frame.line,
      column: frame.col,
    });
    fileNames.add(frame.file);
  }

  return {
    message: "Error", // You might want to pass this separately if available
    frames,
    fileNames: Array.from(fileNames),
  };
}

async function fetchSourceMaps(
  fileNames: string[],
  appId: string,
  bundle: string
): Promise<SourceMap[]> {
  const sourceMaps: SourceMap[] = [];

  for (const fileName of fileNames) {
    const mapFile = `${fileName.split("/").pop()}.map`;
    try {
      const { data: sourceMapRecord, error } =
        await pbGet.getSourceMapByFileName(mapFile, appId, bundle);
      if (error || !sourceMapRecord) {
        console.warn(
          `Failed to fetch source map for ${mapFile}: ${
            error || "Unknown error"
          }`
        );
        continue;
      }
      const rawSourceMap: RawSourceMap = bufferToJSON((sourceMapRecord.map as { data: Uint8Array, type: string }).data);
      const consumer = new SourceMapConsumer(rawSourceMap);
      sourceMaps.push({
        consumer,
        fileName,
        fileNameInline: fileName,
      });
    } catch (error) {
      console.error(`Error fetching source map for ${fileName}:`, error);
    }
  }

  return sourceMaps;
}

function transform(sourceMaps: SourceMap[], stackTrace: StackTrace): string {
  const bindings = calculateBindings(sourceMaps, stackTrace);
  if (Object.keys(bindings).length === 0) {
    return (
      stackTrace.message +
      "\n" +
      stackTrace.frames
        .map((frame) => generateStackTraceLine(toUnifiedPosition(frame)))
        .join("\n")
    );
  }

  const result = [stackTrace.message];
  const transformed = stackTrace.frames.map((frame) =>
    generateStackTraceLine(
      toUnifiedPosition(tryGetOriginalPosition(frame, bindings) ?? frame)
    )
  );
  return result.concat(transformed).join("\n");
}

function tryGetOriginalPosition(
  stackFrame: StackFrame,
  bindings: Record<string, SourceMap>
): MappedPosition | null {
  const { column, fileName, lineNumber } = stackFrame;
  if (
    !fileName ||
    !bindings[fileName] ||
    lineNumber == null ||
    column == null
  ) {
    console.warn(
      `Original position not found for frame: ${JSON.stringify(stackFrame)}`
    );
    return null;
  }
  return bindings[fileName].consumer.originalPositionFor({
    line: lineNumber,
    column,
  });
}

function generateStackTraceLine(position: UnifiedPosition): string {
  const { column, file, line, method } = position;
  return `  at${method ? ` ${method}` : ""} (${file}:${line}:${column})`;
}

function toUnifiedPosition(
  position: MappedPosition | StackFrame
): UnifiedPosition {
  if ("lineNumber" in position) {
    return {
      column: position.column || 0,
      file: position.fileName || "",
      line: position.lineNumber || 0,
      method: position.methodName || "",
    };
  }
  return {
    column: position.column || 0,
    file: position.source || "",
    line: position.line || 0,
    method: position.name || "",
  };
}

function calculateBindings(
  sourceMaps: SourceMap[],
  stackTrace: StackTrace
): Record<string, SourceMap> {
  const bindings: Record<string, SourceMap> = {};
  for (const fileName of stackTrace.fileNames) {
    for (const sourceMap of sourceMaps) {
      if (
        fileName === sourceMap.fileNameInline ||
        fileName === sourceMap.fileName
      ) {
        bindings[fileName] = sourceMap;
      }
    }
  }
  return bindings;
}

function extractCodeFromSourceMap(
  consumer: SourceMapConsumer,
  fileName: string,
  lineNumber: number,
  contextLines: number = 5
): string | null {
  const sourceContent = consumer.sourceContentFor(fileName);
  if (!sourceContent) {
    console.warn(`Source content not found in source map for ${fileName}`);
    return null;
  }

  const lines = sourceContent.split("\n");
  const startLine = Math.max(0, lineNumber - contextLines - 1);
  const endLine = Math.min(lines.length, lineNumber + contextLines);

  return lines
    .slice(startLine, endLine)
    .map((line, index) => {
      const currentLineNumber = startLine + index + 1;
      const indicator = currentLineNumber === lineNumber ? ">" : " ";
      return `${indicator} ${currentLineNumber
        .toString()
        .padStart(5)}: ${line}`;
    })
    .join("\n");
}

async function decodeStacktrace(
  stackframes: StackFrame[],
  appId: string,
  bundle: string
): Promise<string> {
  try {
    console.log(stackframes);
    const parsedStackTrace = parseStackTrace(stackframes);
    const sourceMaps = await fetchSourceMaps(
      parsedStackTrace.fileNames,
      appId,
      bundle
    );
    return transform(sourceMaps, parsedStackTrace);
  } catch (error) {
    console.error("Error decoding stacktrace:", error);
    throw new Error("Failed to decode stacktrace");
  }
}

interface CodeContextLine {
  line: number;
  isHighlighted: boolean;
  text: string;
}

interface EnhancedStacktraceResult {
  decodedStacktrace: string;
  codeContext: CodeContextLine[] | null;
}

function formatCodeContext(
  codeContext: string | null,
  errorLine: number
): CodeContextLine[] | null {
  if (!codeContext) return null;

  const lines = codeContext.split("\n");
  const formattedContext: CodeContextLine[] = [];

  for (const line of lines) {
    const match = line.match(/^(>?\s*)(\d+):\s(.*)$/);
    if (match) {
      const [, , lineNumber, code] = match;
      const currentLineNumber = parseInt(lineNumber, 10);
      formattedContext.push({
        line: currentLineNumber,
        isHighlighted: currentLineNumber === errorLine,
        text: code.trimEnd(), // Remove trailing whitespace
      });
    }
  }

  return formattedContext;
}

async function enhancedDecodeStacktrace(
  stackframes: StackFrame[],
  appId: string,
  bundle: string
): Promise<EnhancedStacktraceResult> {
  try {
    const parsedStackTrace = parseStackTrace(stackframes);
    const sourceMaps = await fetchSourceMaps(
      parsedStackTrace.fileNames,
      appId,
      bundle
    );
    console.log({sourceMaps});
    const decodedStacktrace = transform(sourceMaps, parsedStackTrace);

    const bindings = calculateBindings(sourceMaps, parsedStackTrace);
    const firstFrame = parsedStackTrace.frames[0];
    const originalPosition = tryGetOriginalPosition(firstFrame, bindings);

    let codeContext: CodeContextLine[] | null = null;
    if (originalPosition && originalPosition.source) {
      const sourceMap = bindings[firstFrame.fileName || ""];
      if (sourceMap) {
        const rawCodeContext = extractCodeFromSourceMap(
          sourceMap.consumer,
          originalPosition.source,
          originalPosition.line || 0
        );
        codeContext = formatCodeContext(
          rawCodeContext,
          originalPosition.line || 0
        );
      }
    }

    const decodedFileName = originalPosition ? originalPosition.source : null;

    return {
      decodedStacktrace,
      codeContext,
      decodedFileName,
    };
  } catch (error) {
    console.error("Error decoding stacktrace:", error);
    throw new Error("Failed to decode stacktrace");
  }
}

export { decodeStacktrace, enhancedDecodeStacktrace };
