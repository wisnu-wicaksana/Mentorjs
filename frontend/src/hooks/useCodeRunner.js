import { useState } from "react";
import { extractTopLevelVariables } from "../utils/parser";

export const useCodeRunner = () => {
  const [code, setCode] = useState(
    `// Write JavaScript code here\nconst mentor = "MentorJS";\nconsole.log("Hello from " + mentor + "!");`,
  );
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [variables, setVariables] = useState([]);

  const runCode = () => {
    setConsoleOutput([]); // Reset output
    setVariables([]);    // Reset variables
    const tempLogs = [];
    let capturedVars = [];

    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      const formattedLog = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg),
        )
        .join(" ");
      tempLogs.push({ type: "log", text: formattedLog });
      originalLog(...args);
    };

    console.error = (...args) => {
      const formattedError = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg),
        )
        .join(" ");
      tempLogs.push({ type: "error", text: formattedError });
      originalError(...args);
    };

    // Extract top-level variables
    const varNames = extractTopLevelVariables(code);
    
    // Create instrumentation suffix
    let instrumentedCode = code;
    if (varNames.length > 0) {
      const trackerSnippet = `
        if (typeof _onVariableUpdate === 'function') {
          _onVariableUpdate({
            ${varNames.map(name => `"${name}": typeof ${name} !== 'undefined' ? ${name} : undefined`).join(',\n')}
          });
        }
      `;
      instrumentedCode += '\n' + trackerSnippet;
    }

    try {
      const execute = new Function('_onVariableUpdate', instrumentedCode);
      execute((varsObj) => {
        capturedVars = Object.entries(varsObj).map(([name, val]) => {
          let type = typeof val;
          if (Array.isArray(val)) {
            type = 'array';
          } else if (val === null) {
            type = 'null';
          }
          return { name, type, value: val };
        });
      });
      setVariables(capturedVars);
    } catch (err) {
      tempLogs.push({ type: "error", text: `${err.name}: ${err.message}` });
    }

    console.log = originalLog;
    console.error = originalError;

    if (tempLogs.length === 0) {
      setConsoleOutput([
        {
          type: "system",
          text: "Code executed successfully with no console.log() output.",
        },
      ]);
    } else {
      setConsoleOutput(tempLogs);
    }
  };

  const clearConsole = () => {
    setConsoleOutput([]);
    setVariables([]);
  };

  return {
    code,
    setCode,
    consoleOutput,
    variables,
    runCode,
    clearConsole,
  };
};
