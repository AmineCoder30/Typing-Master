"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VirtualKeyboardProps {
  currentChar: string;
  typedChars: string[];
  onKeyPress: (key: string) => void;
  isActive: boolean;
  className?: string;
  language?: string;
}

interface KeyLayout {
  key: string;
  display: string;
  width?: "normal" | "wide" | "extra-wide";
  type?: "letter" | "number" | "symbol" | "space" | "special";
}

const englishKeyboardLayout: KeyLayout[][] = [
  // Number row
  [
    { key: "`", display: "`", type: "symbol" },
    { key: "1", display: "1", type: "number" },
    { key: "2", display: "2", type: "number" },
    { key: "3", display: "3", type: "number" },
    { key: "4", display: "4", type: "number" },
    { key: "5", display: "5", type: "number" },
    { key: "6", display: "6", type: "number" },
    { key: "7", display: "7", type: "number" },
    { key: "8", display: "8", type: "number" },
    { key: "9", display: "9", type: "number" },
    { key: "0", display: "0", type: "number" },
    { key: "-", display: "-", type: "symbol" },
    { key: "=", display: "=", type: "symbol" },
    { key: "Backspace", display: "⌫", width: "wide", type: "special" },
  ],
  // Top row
  [
    { key: "Tab", display: "Tab", width: "wide", type: "special" },
    { key: "q", display: "Q", type: "letter" },
    { key: "w", display: "W", type: "letter" },
    { key: "e", display: "E", type: "letter" },
    { key: "r", display: "R", type: "letter" },
    { key: "t", display: "T", type: "letter" },
    { key: "y", display: "Y", type: "letter" },
    { key: "u", display: "U", type: "letter" },
    { key: "i", display: "I", type: "letter" },
    { key: "o", display: "O", type: "letter" },
    { key: "p", display: "P", type: "letter" },
    { key: "[", display: "[", type: "symbol" },
    { key: "]", display: "]", type: "symbol" },
    { key: "\\", display: "\\", width: "wide", type: "symbol" },
  ],
  // Home row
  [
    { key: "CapsLock", display: "Caps", width: "extra-wide", type: "special" },
    { key: "a", display: "A", type: "letter" },
    { key: "s", display: "S", type: "letter" },
    { key: "d", display: "D", type: "letter" },
    { key: "f", display: "F", type: "letter" },
    { key: "g", display: "G", type: "letter" },
    { key: "h", display: "H", type: "letter" },
    { key: "j", display: "J", type: "letter" },
    { key: "k", display: "K", type: "letter" },
    { key: "l", display: "L", type: "letter" },
    { key: ";", display: ";", type: "symbol" },
    { key: "'", display: "'", type: "symbol" },
    { key: "Enter", display: "⏎", width: "extra-wide", type: "special" },
  ],
  // Bottom row
  [
    { key: "Shift", display: "Shift", width: "extra-wide", type: "special" },
    { key: "z", display: "Z", type: "letter" },
    { key: "x", display: "X", type: "letter" },
    { key: "c", display: "C", type: "letter" },
    { key: "v", display: "V", type: "letter" },
    { key: "b", display: "B", type: "letter" },
    { key: "n", display: "N", type: "letter" },
    { key: "m", display: "M", type: "letter" },
    { key: ",", display: ",", type: "symbol" },
    { key: ".", display: ".", type: "symbol" },
    { key: "/", display: "/", type: "symbol" },
    { key: "Shift", display: "Shift", width: "extra-wide", type: "special" },
  ],
  // Space row
  [
    { key: "Ctrl", display: "Ctrl", width: "wide", type: "special" },
    { key: "Alt", display: "Alt", width: "normal", type: "special" },
    { key: " ", display: "Space", width: "extra-wide", type: "space" },
    { key: "Alt", display: "Alt", width: "normal", type: "special" },
    { key: "Ctrl", display: "Ctrl", width: "wide", type: "special" },
  ],
];

const arabicKeyboardLayout: KeyLayout[][] = [
  // Number row
  [
    { key: "`", display: "`", type: "symbol" },
    { key: "1", display: "1", type: "number" },
    { key: "2", display: "2", type: "number" },
    { key: "3", display: "3", type: "number" },
    { key: "4", display: "4", type: "number" },
    { key: "5", display: "5", type: "number" },
    { key: "6", display: "6", type: "number" },
    { key: "7", display: "7", type: "number" },
    { key: "8", display: "8", type: "number" },
    { key: "9", display: "9", type: "number" },
    { key: "0", display: "0", type: "number" },
    { key: "-", display: "-", type: "symbol" },
    { key: "=", display: "=", type: "symbol" },
    { key: "Backspace", display: "⌫", width: "wide", type: "special" },
  ],
  // Top row
  [
    { key: "Tab", display: "Tab", width: "wide", type: "special" },
    { key: "ض", display: "ض", type: "letter" },
    { key: "ص", display: "ص", type: "letter" },
    { key: "ث", display: "ث", type: "letter" },
    { key: "ق", display: "ق", type: "letter" },
    { key: "ف", display: "ف", type: "letter" },
    { key: "غ", display: "غ", type: "letter" },
    { key: "ع", display: "ع", type: "letter" },
    { key: "ه", display: "ه", type: "letter" },
    { key: "خ", display: "خ", type: "letter" },
    { key: "ح", display: "ح", type: "letter" },
    { key: "ج", display: "ج", type: "letter" },
    { key: "د", display: "د", type: "letter" },
    { key: "\\", display: "\\", width: "wide", type: "symbol" },
  ],
  // Home row
  [
    { key: "CapsLock", display: "Caps", width: "extra-wide", type: "special" },
    { key: "ش", display: "ش", type: "letter" },
    { key: "س", display: "س", type: "letter" },
    { key: "ي", display: "ي", type: "letter" },
    { key: "ب", display: "ب", type: "letter" },
    { key: "ل", display: "ل", type: "letter" },
    { key: "ا", display: "ا", type: "letter" },
    { key: "ت", display: "ت", type: "letter" },
    { key: "ن", display: "ن", type: "letter" },
    { key: "م", display: "م", type: "letter" },
    { key: "ك", display: "ك", type: "letter" },
    { key: "ئ", display: "ئ", type: "letter" },
    { key: "Enter", display: "⏎", width: "extra-wide", type: "special" },
  ],
  // Bottom row
  [
    { key: "Shift", display: "Shift", width: "extra-wide", type: "special" },
    { key: "ء", display: "ء", type: "letter" },
    { key: "ؤ", display: "ؤ", type: "letter" },
    { key: "ر", display: "ر", type: "letter" },
    { key: "لا", display: "لا", type: "letter" },
    { key: "ى", display: "ى", type: "letter" },
    { key: "ة", display: "ة", type: "letter" },
    { key: "و", display: "و", type: "letter" },
    { key: "ز", display: "ز", type: "letter" },
    { key: "ظ", display: "ظ", type: "letter" },
    { key: "د", display: "د", type: "letter" },
    { key: "Shift", display: "Shift", width: "extra-wide", type: "special" },
  ],
  // Space row
  [
    { key: "Ctrl", display: "Ctrl", width: "wide", type: "special" },
    { key: "Alt", display: "Alt", width: "normal", type: "special" },
    { key: " ", display: "Space", width: "extra-wide", type: "space" },
    { key: "Alt", display: "Alt", width: "normal", type: "special" },
    { key: "Ctrl", display: "Ctrl", width: "wide", type: "special" },
  ],
];

export function VirtualKeyboard({
  currentChar,
  typedChars,
  onKeyPress,
  isActive,
  className,
  language = "en",
}: VirtualKeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [animatingKeys, setAnimatingKeys] = useState<Set<string>>(new Set());
  const keyboardRef = useRef<HTMLDivElement>(null);

  const keyboardLayout =
    language === "ar" ? arabicKeyboardLayout : englishKeyboardLayout;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isActive) return;

      const key = event.key.toLowerCase();

      // Prevent default behavior for space to avoid page scroll or button trigger
      if (key === " " || key === "spacebar") {
        event.preventDefault();
      }

      setPressedKeys((prev) => new Set(prev).add(key));
      setAnimatingKeys((prev) => new Set(prev).add(key));
      onKeyPress(event.key);

      setTimeout(() => {
        setAnimatingKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 200);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    };

    if (isActive) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isActive, onKeyPress]);

  const getKeyClassName = (keyData: KeyLayout) => {
    const baseClasses =
      "relative flex items-center justify-center rounded-lg border-2 transition-all duration-200 font-medium select-none";

    // Width classes
    const widthClasses = {
      normal: "h-12 min-w-[2.5rem] px-2",
      wide: "h-12 min-w-[4rem] px-3",
      "extra-wide": "h-12 min-w-[6rem] px-4",
    };

    // Type-based styling
    const typeClasses = {
      letter:
        "bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100",
      number:
        "bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 border-blue-300 dark:border-blue-600 text-blue-900 dark:text-blue-100",
      symbol:
        "bg-gradient-to-b from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 border-purple-300 dark:border-purple-600 text-purple-900 dark:text-purple-100",
      space:
        "bg-gradient-to-b from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 border-green-300 dark:border-green-600 text-green-900 dark:text-green-100",
      special:
        "bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
    };

    const key = keyData.key.toLowerCase();
    const currentCharLower = currentChar.toLowerCase();

    // State-based classes
    let stateClasses = "";

    // Current character highlighting
    if (
      key === currentCharLower ||
      (currentChar === " " && keyData.type === "space")
    ) {
      stateClasses +=
        " ring-4 ring-yellow-400 ring-opacity-75 shadow-lg shadow-yellow-400/50 animate-pulse bg-gradient-to-b from-yellow-200 to-yellow-300 dark:from-yellow-600 dark:to-yellow-700 border-yellow-400 dark:border-yellow-500";
    }

    // Pressed state
    if (pressedKeys.has(key)) {
      stateClasses += " scale-95 shadow-inner";
    }

    // Animation state
    if (animatingKeys.has(key)) {
      stateClasses +=
        " animate-bounce bg-gradient-to-b from-green-300 to-green-400 dark:from-green-500 dark:to-green-600 border-green-400 dark:border-green-400";
    }

    // Hover state
    stateClasses += " hover:scale-105 hover:shadow-md cursor-pointer";

    return cn(
      baseClasses,
      widthClasses[keyData.width || "normal"],
      typeClasses[keyData.type || "letter"],
      stateClasses
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Virtual Keyboard */}
      <div
        ref={keyboardRef}
        className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700 shadow-2xl"
      >
        <div className="space-y-2">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1 flex-wrap">
              {row.map((keyData, keyIndex) => (
                <button
                  key={`${rowIndex}-${keyIndex}`}
                  className={getKeyClassName(keyData)}
                  onClick={() => {
                    onKeyPress(keyData.key);
                  }}
                  disabled={false}
                >
                  <span className="text-sm font-semibold">
                    {keyData.display}
                  </span>

                  {/* Glow effect for current character */}
                  {(keyData.key.toLowerCase() === currentChar.toLowerCase() ||
                    (currentChar === " " && keyData.type === "space")) && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 via-yellow-300/30 to-yellow-400/20 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Keyboard Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-slate-300 dark:border-slate-600"></div>
            <span>Letters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 border border-blue-300 dark:border-blue-600"></div>
            <span>Numbers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-b from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 border border-purple-300 dark:border-purple-600"></div>
            <span>Symbols</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-b from-yellow-200 to-yellow-300 dark:from-yellow-600 dark:to-yellow-700 border border-yellow-400 dark:border-yellow-500 animate-pulse"></div>
            <span>Next Key</span>
          </div>
        </div>
      </div>
    </div>
  );
}
