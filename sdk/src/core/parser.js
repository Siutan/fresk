/**
 * Port from https://github.com/stacktracejs/error-stack-parser
 * and https://github.com/antfu-collective
 * Modified by Siutan to support Fresk
 */

/**
 * @typedef {Object} ParseOptions
 * @property {number | [number, number]} [slice] - Slice the stack from the given index.
 * @property {boolean} [allowEmpty=false] - Whether to return empty stack or throw an error when `stack` not found.
 */

/**
 * @typedef {Object} StackFrameLite
 * @property {string} [function] - Function name.
 * @property {any[]} [args] - Arguments.
 * @property {string} [file] - File name.
 * @property {number} [col] - Column number.
 * @property {number} [line] - Line number.
 * @property {string} [raw] - Raw stack frame string.
 */

const FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/
const CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m
const SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/

/**
 * Given an Error object, extract the most information from it.
 *
 * @param {Error} error - Error object
 * @param {ParseOptions} [options] - Parsing options
 * @return {StackFrameLite[]} Array of StackFrames
 */
export function parse(error, options) {
  if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined')
    return parseOpera(error, options)
  else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP))
    return parseV8OrIE(error, options)
  else if (error.stack)
    return parseFFOrSafari(error, options)
  else if (options?.allowEmpty)
    return []
  else
    throw new Error('Cannot parse given Error object, ', error)
}

/**
 * Parse stack string from V8, Firefox, or IE into an array of StackFrames.
 *
 * @param {string} stackString - Stack string
 * @param {ParseOptions} [options] - Parsing options
 * @return {StackFrameLite[]} Array of StackFrames
 */
export function parseStack(stackString, options) {
  if (stackString.match(CHROME_IE_STACK_REGEXP))
    return parseV8OrIeString(stackString, options)
  else
    return parseFFOrSafariString(stackString, options)
}

/**
 * Separate line and column numbers from a string of the form: (URI:Line:Column)
 *
 * @param {string} urlLike - URL-like string
 * @return {[string, (string|undefined), (string|undefined)]} Array containing file, line, and column
 */
export function extractLocation(urlLike) {
  if (!urlLike.includes(':'))
    return [urlLike, undefined, undefined]

  const regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/
  const parts = regExp.exec(urlLike.replace(/[()]/g, ''))
  return [parts[1], parts[2] || undefined, parts[3] || undefined]
}

/**
 * Apply slice options to an array of lines.
 *
 * @param {Array} lines - Array of lines
 * @param {ParseOptions} [options] - Parsing options
 * @return {Array} Sliced array of lines
 */
function applySlice(lines, options) {
  if (options && options.slice != null) {
    if (Array.isArray(options.slice))
      return lines.slice(options.slice[0], options.slice[1])
    return lines.slice(0, options.slice)
  }
  return lines
}

/**
 * Parse V8 or IE stack trace.
 *
 * @param {Error} error - Error object
 * @param {ParseOptions} [options] - Parsing options
 * @return {StackFrameLite[]} Array of StackFrames
 */
export function parseV8OrIE(error, options) {
  return parseV8OrIeString(error.stack, options)
}

/**
 * Parse V8 or IE stack string.
 *
 * @param {string} stack - Stack string
 * @param {ParseOptions} [options] - Parsing options
 * @return {StackFrameLite[]} Array of StackFrames
 */
export function parseV8OrIeString(stack, options) {
  const filtered = applySlice(
    stack.split('\n').filter((line) => {
      return !!line.match(CHROME_IE_STACK_REGEXP)
    }),
    options,
  )

  return filtered.map((line) => {
    if (line.includes('(eval ')) {
      line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(,.*$)/g, '')
    }
    let sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').replace(/^.*?\s+/, '')

    const location = sanitizedLine.match(/ (\(.+\)$)/)
    sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine

    const locationParts = extractLocation(location ? location[1] : sanitizedLine)
    const functionName = (location && sanitizedLine) || undefined
    const fileName = ['eval', '<anonymous>'].includes(locationParts[0]) ? undefined : locationParts[0]

    return {
      function: functionName,
      file: fileName,
      line: locationParts[1] ? +locationParts[1] : undefined,
      col: locationParts[2] ? +locationParts[2] : undefined,
      raw: line,
    }
  })
}

/**
 * Parse Firefox or Safari stack trace.
 *
 * @param {Error} error - Error object
 * @param {ParseOptions} [options] - Parsing options
 * @return {StackFrameLite[]} Array of StackFrames
 */
export function parseFFOrSafari(error, options) {
  return parseFFOrSafariString(error.stack, options)
}

/**
 * Parse Firefox or Safari stack string.
 *
 * @param {string} stack - Stack string
 * @param {ParseOptions} [options] - Parsing options
 * @return {StackFrameLite[]} Array of StackFrames
 */
export function parseFFOrSafariString(stack, options) {
  const filtered = applySlice(
    stack.split('\n').filter((line) => {
      return !line.match(SAFARI_NATIVE_CODE_REGEXP)
    }),
    options,
  )

  return filtered.map((line) => {
    if (line.includes(' > eval'))
      line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1')

    if (!line.includes('@') && !line.includes(':')) {
      return {
        function: line,
      }
    } else {
      const functionNameRegex = /(([^\n\r"\u2028\u2029]*".[^\n\r"\u2028\u2029]*"[^\n\r@\u2028\u2029]*(?:@[^\n\r"\u2028\u2029]*"[^\n\r@\u2028\u2029]*)*(?:[\n\r\u2028\u2029][^@]*)?)?[^@]*)@/
      const matches = line.match(functionNameRegex)
      const functionName = (matches && matches[1]) ? matches[1] : undefined
      const locationParts = extractLocation(line.replace(functionNameRegex, ''))

      return {
        function: functionName,
        file: locationParts[0],
        line: locationParts[1] ? +locationParts[1] : undefined,
        col: locationParts[2] ? +locationParts[2] : undefined,
        raw: line,
      }
    }
  })
}

/**
 * Parse Opera stack trace.
 *
 * @param {Error} e - Error object
 * @param {ParseOptions} [options] - Parsing options
 * @return {StackFrameLite[]} Array of StackFrames
 */
export function parseOpera(e, options) {
  if (!e.stacktrace || (e.message.includes('\n') && e.message.split('\n').length > e.stacktrace.split('\n').length))
    return parseOpera9(e)
  else if (!e.stack)
    return parseOpera10(e)
  else
    return parseOpera11(e, options)
}

/**
 * Parse Opera 9 stack trace.
 *
 * @param {Error} e - Error object
 * @param {ParseOptions} [options] - Parsing options
 * @return {StackFrameLite[]} Array of StackFrames
 */
export function parseOpera9(e, options) {
  const lineRE = /Line (\d+).*script (?:in )?(\S+)/i
  const lines = e.message.split('\n')
  const result = []

  for (let i = 2, len = lines.length; i < len; i += 2) {
    const match = lineRE.exec(lines[i])
    if (match) {
      result.push({
        file: match[2],
        line: +match[1],
        raw: lines[i],
      })
    }
  }

  return applySlice(result, options)
}

/**
 * Parse Opera 10 stack trace.
 *
 * @param {Error} e - Error object
 * @param {ParseOptions} [options] - Parsing options
 * @return {StackFrameLite[]} Array of StackFrames
 */
export function parseOpera10(e, options) {
  const lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i
  const lines = e.stacktrace.split('\n')
  const result = []

  for (let i = 0, len = lines.length; i < len; i += 2) {
    const match = lineRE.exec(lines[i])
    if (match) {
      result.push({
        function: match[3] || undefined,
        file: match[2],
        line: match[1] ? +match[1] : undefined,
        raw: lines[i],
      })
    }
  }

  return applySlice(result, options)
}

/**
 * Parse Opera 11+ stack trace.
 *
 * @param {Error} error - Error object
 * @param {ParseOptions} [options] - Parsing options
 * @return {StackFrameLite[]} Array of StackFrames
 */
export function parseOpera11(error, options) {
  const filtered = applySlice(
    error.stack.split('\n').filter((line) => {
      return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/)
    }),
    options,
  )

  return filtered.map((line) => {
    const tokens = line.split('@')
    const locationParts = extractLocation(tokens.pop())
    const functionCall = (tokens.shift() || '')
    const functionName = functionCall
      .replace(/<anonymous function(: (\w+))?>/, '$2')
      .replace(/\([^)]*\)/g, '') || undefined
    let argsRaw
    if (functionCall.match(/\(([^)]*)\)/))
      argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1')

    const args = (argsRaw === undefined || argsRaw === '[arguments not available]')
      ? undefined
      : argsRaw.split(',')

    return {
      function: functionName,
      args,
      file: locationParts[0],
      line: locationParts[1] ? +locationParts[1] : undefined,
      col: locationParts[2] ? +locationParts[2] : undefined,
      raw: line,
    }
  })
}