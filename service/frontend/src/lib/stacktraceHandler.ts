import { SourceMapConsumer, type RawSourceMap, type MappedPosition } from "source-map-js";
import { pbGet } from "$lib/queries/get";

interface SourceMap {
  consumer: SourceMapConsumer;
  fileName: string;
  fileNameInline: string;
}

interface StackFrame {
  fileName?: string; // Make fileName optional
  lineNumber?: number; // Make lineNumber optional
  column?: number; // Make column optional
  methodName?: string; // Make methodName optional
  source?: string; // Make source optional
  name?: string; // Make name optional
  line?: number; // Make line optional
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

async function decodeStacktrace(stacktrace: string, buildId: string): Promise<string> {
  try {
    const parsedStackTrace = parseStackTrace(stacktrace);
    const sourceMaps = await fetchSourceMaps(parsedStackTrace.fileNames, buildId);
    return transform(sourceMaps, parsedStackTrace);
  } catch (error) {
    console.error("Error decoding stacktrace:", error);
    throw new Error("Failed to decode stacktrace");
  }
}

function parseStackTrace(stacktrace: string): StackTrace {
  const lines = stacktrace.split("\n");
  const message = lines[0];
  const frames: StackFrame[] = [];
  const fileNames: Set<string> = new Set();

  for (let i = 1; i < lines.length; i++) {
    const match = lines[i].match(/at (.+?) \((.+):(\d+):(\d+)\)/);
    if (match) {
      const [_, methodName, fileName, lineNumber, columnNumber] = match;
      frames.push({
        methodName,
        fileName,
        lineNumber: parseInt(lineNumber, 10),
        column: parseInt(columnNumber, 10),
      });
      fileNames.add(fileName);
    }
  }

  return {
    message,
    frames,
    fileNames: Array.from(fileNames),
  };
}

async function fetchSourceMaps(fileNames: string[], buildId: string): Promise<SourceMap[]> {
  const sourceMaps: SourceMap[] = [];

  for (const fileName of fileNames) {
    const mapFile = `${fileName.split("/").pop()}.map`;
    try {
      const { data: sourceMapRecord, error } = await pbGet.getSourceMapByFileName(mapFile, buildId);
      if (error || !sourceMapRecord) {
        throw new Error(`Failed to fetch source map for ${mapFile}: ${error || "Unknown error"}`);
      }
      const rawSourceMap: RawSourceMap = sourceMapRecord.map;
      const consumer = await new SourceMapConsumer(rawSourceMap);
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
    return stackTrace.message + '\n' + stackTrace.frames.map(frame => generateStackTraceLine(toUnifiedPosition(frame))).join('\n');
  }

  const result = [stackTrace.message];
  const transformed = stackTrace.frames.map(frame =>
    generateStackTraceLine(
      toUnifiedPosition(tryGetOriginalPosition(frame, bindings) ?? frame)
    )
  );
  return result.concat(transformed).join('\n');
}

function tryGetOriginalPosition(
  stackFrame: StackFrame,
  bindings: Record<string, SourceMap>
): MappedPosition | null {
  const { column, fileName, lineNumber } = stackFrame;
  if (!fileName || !bindings[fileName] || lineNumber == null || column == null) {
    console.warn(`Original position not found for frame: ${JSON.stringify(stackFrame)}`);
    return null;
  }
  return bindings[fileName].consumer.originalPositionFor({ line: lineNumber, column });
}

function generateStackTraceLine(position: UnifiedPosition): string {
  const { column, file, line, method } = position;
  return `  at${method ? ` ${method}` : ''} (${file}:${line}:${column})`;
}

function toUnifiedPosition(position: MappedPosition | StackFrame): UnifiedPosition {
  if ('lineNumber' in position) {
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

function calculateBindings(sourceMaps: SourceMap[], stackTrace: StackTrace): Record<string, SourceMap> {
  const bindings: Record<string, SourceMap> = {};
  for (const fileName of stackTrace.fileNames) {
    for (const sourceMap of sourceMaps) {
      if (fileName === sourceMap.fileNameInline || fileName === sourceMap.fileName) {
        bindings[fileName] = sourceMap;
      }
    }
  }
  return bindings;
}

export { decodeStacktrace };