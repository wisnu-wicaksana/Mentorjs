/**
 * Helper to extract top-level variable names from JavaScript code.
 * Matches declaration keywords (let, const, var) only at nesting depth 0
 * to prevent capturing loop variables or nested function scope variables.
 * 
 * @param {string} codeText - The raw JavaScript code to parse.
 * @returns {Array<string>} List of declared top-level variable names.
 */
export const extractTopLevelVariables = (codeText) => {
  // Strip comments
  const cleanCode = codeText
    .replace(/\/\*[\s\S]*?\*\//g, '') // multiline comments
    .replace(/\/\/.*/g, '');           // single line comments

  const variables = new Set();
  let braceDepth = 0;
  let parenDepth = 0;
  let inString = false;
  let stringChar = '';
  
  let i = 0;
  while (i < cleanCode.length) {
    const char = cleanCode[i];
    
    // Handle strings
    if (inString) {
      if (char === stringChar && cleanCode[i - 1] !== '\\') {
        inString = false;
      }
      i++;
      continue;
    } else if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      i++;
      continue;
    }
    
    // Handle braces
    if (char === '{') { braceDepth++; i++; continue; }
    if (char === '}') { braceDepth--; i++; continue; }
    if (char === '(') { parenDepth++; i++; continue; }
    if (char === ')') { parenDepth--; i++; continue; }
    
    // Match variables at depth 0
    if (braceDepth === 0 && parenDepth === 0) {
      const match = cleanCode.substring(i).match(/^(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      if (match) {
        variables.add(match[2]);
        i += match[0].length;
        continue;
      }
    }
    i++;
  }
  return Array.from(variables);
};
