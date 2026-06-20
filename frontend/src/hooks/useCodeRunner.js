import { useState } from "react";

export const useCodeRunner = () => {
  const [code, setCode] = useState(
    `// Tulis kode JavaScript di sini
const mentor = "AuraJS";
console.log("Halo dari " + mentor + "!");`,
  );
  const [consoleOutput, setConsoleOutput] = useState([]);

  const runCode = () => {
    setConsoleOutput([]); // Reset output
    const tempLogs = [];

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

    try {
      const execute = new Function(code);
      execute();
    } catch (err) {
      tempLogs.push({ type: "error", text: `${err.name}: ${err.message}` });
    }

    console.log = originalLog;
    console.error = originalError;

    if (tempLogs.length === 0) {
      setConsoleOutput([
        {
          type: "system",
          text: "Kode berhasil dijalankan tanpa output console.log().",
        },
      ]);
    } else {
      setConsoleOutput(tempLogs);
    }
  };

  const clearConsole = () => setConsoleOutput([]);

  return {
    code,
    setCode,
    consoleOutput,
    runCode,
    clearConsole,
  };
};
