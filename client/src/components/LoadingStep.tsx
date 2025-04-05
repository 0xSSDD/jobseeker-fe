import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export function LoadingStep() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(30);
    }, 500);

    const timer2 = setTimeout(() => {
      setProgress(60);
    }, 1500);

    const timer3 = setTimeout(() => {
      setProgress(90);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-6 md:p-8 text-center">
        <div className="py-8 space-y-6">
          <div className="mx-auto w-16 h-16 border-4 border-[#0077B5] border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-xl font-semibold text-[#333333]">Finding the best matches</h3>
          <div className="max-w-md mx-auto">
            <p className="text-[#86888A] mb-4">
              We're analyzing your resume and searching for opportunities that match your skills and experience.
            </p>
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
