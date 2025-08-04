import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sun, Moon, TimerReset } from "lucide-react";

const MODES = {
  pomodoro: { label: "Focus", duration: 25 * 60 },
  shortBreak: { label: "Break", duration: 5 * 60 },
  longBreak: { label: "Long Break", duration: 15 * 60 },
};

export default function App() {
  const [mode, setMode] = useState("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(MODES[mode].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(MODES[mode].duration);
  }, [mode]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            handleAutoSwitch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleAutoSwitch = () => {
    if (mode === "pomodoro") {
      const nextMode = (cycles + 1) % 4 === 0 ? "longBreak" : "shortBreak";
      setMode(nextMode);
      setCycles(cycles + 1);
    } else {
      setMode("pomodoro");
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const resetTimer = () => setSecondsLeft(MODES[mode].duration);
  const formatTime = (s) =>
    \`\${String(Math.floor(s / 60)).padStart(2, "0")}:\${String(s % 60).padStart(2, "0")}\`;

  return (
    <div
      className={\`\${darkMode ? "bg-black text-white" : "bg-white text-black"} min-h-screen flex items-center justify-center p-4 transition-colors\`}
    >
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {Object.entries(MODES).map(([key, val]) => (
              <Button
                key={key}
                variant={mode === key ? "default" : "outline"}
                onClick={() => setMode(key)}
              >
                {val.label}
              </Button>
            ))}
          </div>

          <div className="text-6xl font-mono">{formatTime(secondsLeft)}</div>
          <Progress value={(secondsLeft / MODES[mode].duration) * 100} className="w-full" />

          <div className="flex gap-3">
            <Button onClick={() => setIsRunning((r) => !r)}>
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button variant="ghost" onClick={resetTimer}>
              <TimerReset className="w-4 h-4" />
            </Button>
            <Button variant="ghost" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">Completed cycles: {cycles}</div>
        </CardContent>
      </Card>
    </div>
  );
}
