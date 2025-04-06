import { Progress } from "./ui/progress";
import { useEffect, useState } from "react";
import { Bot, Sparkles } from "lucide-react";

export function LoadingStep() {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Analyzing your resume...");

  useEffect(() => {
    const messages = [
      "Analyzing your resume...",
      "Finding matching job positions...",
      "Crafting personalized cover letters...",
      "Finalizing your results..."
    ];

    const timer = setTimeout(() => {
      setProgress(25);
      setStatusMessage(messages[0]);
    }, 500);

    const timer2 = setTimeout(() => {
      setProgress(50);
      setStatusMessage(messages[1]);
    }, 1500);

    const timer3 = setTimeout(() => {
      setProgress(75);
      setStatusMessage(messages[2]);
    }, 2500);

    const timer4 = setTimeout(() => {
      setProgress(90);
      setStatusMessage(messages[3]);
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="py-12 text-center">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Bot className="w-16 h-16 text-indigo-500" />
          <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-3">Generating Cover Letters</h3>

      <div className="max-w-md mx-auto">
        <p className="text-gray-600 mb-4">
          {statusMessage}
        </p>
        <Progress value={progress} className="h-2 bg-gray-200" />
        <p className="mt-2 text-sm text-gray-500">{Math.round(progress)}% complete</p>
      </div>
    </div>
  );
}
