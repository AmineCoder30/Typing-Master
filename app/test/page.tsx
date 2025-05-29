"use client";

import { useState, useEffect, useRef, use } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/language-selector";
import { VirtualKeyboard } from "@/components/virtual-keyboard";
import { getRandomTextForLanguage } from "@/lib/language-texts";
import { SUPPORTED_LANGUAGES } from "@/components/language-selector";
import { RotateCcw, Play, Square, Globe, Keyboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TypingTestPage() {
  const router = useRouter();
  // The currently selected language code (e.g., "en", "fr")
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  // The text that the user needs to type
  const [currentText, setCurrentText] = useState("");
  // The user's input as they type
  const [userInput, setUserInput] = useState("");
  // Whether the typing test is currently active (started)
  const [isActive, setIsActive] = useState(false);
  // The elapsed time in seconds since the test started
  const [timeElapsed, setTimeElapsed] = useState(0);
  // The calculated words per minute (WPM) score
  const [wpm, setWpm] = useState(0);
  // The current typing accuracy percentage
  const [accuracy, setAccuracy] = useState(100);
  // The number of typing errors made by the user
  const [errors, setErrors] = useState(0);
  // Whether the typing test has finished
  const [isFinished, setIsFinished] = useState(false);
  // The current position (index) in the text being typed
  const [currentPosition, setCurrentPosition] = useState(0);
  // Set of character indices currently being animated for feedback
  const [animatingChars, setAnimatingChars] = useState<Set<number>>(new Set());
  // Array of characters that the user has typed so far
  const [typedChars, setTypedChars] = useState<string[]>([]);
  // Ref to the textarea element for focusing
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentLanguageInfo =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];
  const isRTL = currentLanguageInfo.direction === "rtl";
  const currentChar = currentText[userInput.length] || "";

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    setSelectedLanguage(savedLanguage);

    // Initialize with random text for the selected language
    const randomText = getRandomTextForLanguage(savedLanguage);
    setCurrentText(randomText);

    // Listen for language changes from navigation
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail;
      setSelectedLanguage(newLanguage);
      const newText = getRandomTextForLanguage(newLanguage);
      setCurrentText(newText);
      // Reset test when language changes
      resetTest();
    };

    window.addEventListener(
      "languageChanged",
      handleLanguageChange as EventListener
    );
    return () =>
      window.removeEventListener(
        "languageChanged",
        handleLanguageChange as EventListener
      );
  }, []);

  const resetTest = () => {
    setUserInput("");
    setIsActive(false);
    setTimeElapsed(0);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setIsFinished(false);
    setCurrentPosition(0);
    setAnimatingChars(new Set());
    setTypedChars([]);
  };

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    localStorage.setItem("selectedLanguage", languageCode);
    const newText = getRandomTextForLanguage(languageCode);
    setCurrentText(newText);
    resetTest();
    textareaRef.current?.focus();
    // Notify navigation component
    window.dispatchEvent(
      new CustomEvent("languageChanged", { detail: languageCode })
    );
  };
  // restart the test when the page loaded

  const handleKeyPress = (key: string) => {
    if (isFinished) return;
    console.log("userInput:", userInput);
    // Handle backspace key
    if (key === "Backspace") {
      if (userInput.length > 0) {
        const newInput = userInput.slice(0, -1);
        setUserInput(newInput);
        setTypedChars(newInput.split(""));
      }
      return;
    }

    // Ignore special keys that shouldn't be typed
    if (["Shift", "Ctrl", "Alt", "Tab", "CapsLock", "Enter"].includes(key)) {
      return;
    }

    // Add the pressed key to input (space or any other character)
    const newInput = userInput + key;
    setUserInput(newInput);
    setTypedChars(newInput.split(""));

    // Start the test if not already active
    if (!isActive && newInput.length === 1) {
      setIsActive(true);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isFinished) {
      interval = setInterval(() => {
        setTimeElapsed((time) => time + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isFinished]);

  useEffect(() => {
    // Update current position and trigger animation
    if (userInput.length !== currentPosition) {
      setCurrentPosition(userInput.length);

      // Add animation for the newly typed character
      if (userInput.length > currentPosition) {
        const newAnimatingChars = new Set(animatingChars);
        newAnimatingChars.add(userInput.length - 1);
        setAnimatingChars(newAnimatingChars);

        // Remove animation after 300ms
        setTimeout(() => {
          setAnimatingChars((prev) => {
            const updated = new Set(prev);
            updated.delete(userInput.length - 1);
            return updated;
          });
        }, 300);
      }
    }

    // Calculate WPM
    const wordsTyped = userInput.trim().split(" ").length;
    const minutes = timeElapsed / 60;
    const currentWpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
    setWpm(currentWpm);

    // Calculate accuracy and errors
    let correctChars = 0;
    let errorCount = 0;

    for (let i = 0; i < userInput.length; i++) {
      if (i < currentText.length) {
        if (userInput[i] === currentText[i]) {
          correctChars++;
        } else {
          errorCount++;
        }
      } else {
        errorCount++;
      }
    }

    setErrors(errorCount);
    const currentAccuracy =
      userInput.length > 0
        ? Math.round((correctChars / userInput.length) * 100)
        : 100;
    setAccuracy(currentAccuracy);
  }, [userInput, timeElapsed, currentText, currentPosition, animatingChars]);

  const restartTest = () => {
    const randomText = getRandomTextForLanguage(selectedLanguage);
    setCurrentText(randomText);
    resetTest();
    textareaRef.current?.focus();
  };

  const finishTest = () => {
    setIsFinished(true);
    setIsActive(false);
    // Store results in localStorage for the results page
    const results = {
      wpm,
      accuracy,
      timeElapsed,
      errors,
      textLength: currentText.length,
      date: new Date().toISOString(),
    };
    localStorage.setItem("lastTestResults", JSON.stringify(results));
    router.push("/results");
  };

  useEffect(() => {
    if (userInput.length >= currentText.length && !isFinished) {
      setIsFinished(true);
      setIsActive(false);
    }
  }, [userInput.length, currentText.length, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderTextWithHighlight = () => {
    return currentText.split("").map((char, index) => {
      let className = "text-muted-foreground transition-all duration-200";
      const isAnimating = animatingChars.has(index);

      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = `text-green-600 bg-green-100 dark:bg-green-900/30 transition-all duration-200 ${
            isAnimating ? "animate-pulse scale-110" : ""
          }`;
        } else {
          className = `text-red-600 bg-red-100 dark:bg-red-900/30 transition-all duration-200 ${
            isAnimating ? "animate-bounce" : ""
          }`;
        }
      } else if (index === userInput.length) {
        className =
          "bg-primary/20 text-foreground animate-pulse border-l-2 border-primary";
      }

      return (
        <span
          key={index}
          className={className}
          style={{
            transform: isAnimating ? "scale(1.1)" : "scale(1)",
            transition: "all 0.2s ease-in-out",
          }}
        >
          {char}
        </span>
      );
    });
  };

  const progress = (userInput.length / currentText.length) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Typing Speed Test</h1>
        <p className="text-muted-foreground">
          Use your keyboard or click the virtual keys below
        </p>
      </div>

      {/* Language Selector */}
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Language Selection
          </CardTitle>
          <CardDescription>Choose your target typing language</CardDescription>
        </CardHeader>
        <CardContent>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            variant="dropdown"
          />
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription>Speed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold transition-all duration-300">
              {wpm}
            </div>
            <div className="text-xs text-muted-foreground">WPM</div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription>Accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold transition-all duration-300">
              {accuracy}%
            </div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription>Errors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 transition-all duration-300">
              {errors}
            </div>
            <div className="text-xs text-muted-foreground">Mistakes</div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription>Time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold transition-all duration-300">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-xs text-muted-foreground">Elapsed</div>
          </CardContent>
        </Card>
      </div>

      {/* Text Display */}
      <Card className="transition-all duration-300 hover:shadow-md overflow-x-hidden">
        <div className="relative w-full h-3 bg-muted  overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out relative"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, 
        #ef4444 0%,  
#f97316 20%,  
#eab308 40%,  
#22c55e 60%,  
#3b82f6 80%,  
#8b5cf6 100%  

        )`,
            }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Text to Type
            <Badge variant="outline" className="ml-auto">
              {currentLanguageInfo.flag} {currentLanguageInfo.name}
            </Badge>
          </CardTitle>
          <CardDescription>
            {isActive
              ? `Next key: ${
                  currentChar === " " ? "Space" : currentChar.toUpperCase()
                }`
              : "Start typing to begin the test"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "text-lg leading-relaxed font-mono p-4 bg-muted/50 rounded-lg min-h-[120px] select-none",
              isRTL && "text-right"
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {renderTextWithHighlight()}
          </div>
        </CardContent>
        <CardContent>
          <VirtualKeyboard
            currentChar={currentChar}
            typedChars={typedChars}
            onKeyPress={handleKeyPress}
            isActive={isActive || !isFinished}
            language={selectedLanguage}
          />
        </CardContent>
      </Card>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={restartTest}
          variant="outline"
          size="lg"
          className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          Restart Test
        </Button>

        <Button
          onClick={finishTest}
          size="lg"
          className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
          disabled={userInput.length < 50}
        >
          <Square className="w-4 h-4" />
          Finish Test
        </Button>
      </div>

      {/* Status */}
      <div className="text-center">
        {isActive && !isFinished && (
          <Badge variant="default" className="animate-pulse">
            Test in Progress
          </Badge>
        )}
        {isFinished && (
          <Badge variant="secondary" className="animate-bounce">
            Test Completed
          </Badge>
        )}
        {!isActive && !isFinished && userInput.length === 0 && (
          <Badge variant="outline">Ready to Start</Badge>
        )}
      </div>
    </div>
  );
}
