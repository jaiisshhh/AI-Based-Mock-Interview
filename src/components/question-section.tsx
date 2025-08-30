import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Volume2, VolumeX } from "lucide-react";
import { RecordAnswer } from "./record-answer";

interface QuestionSectionProps {
  questions: { question: string; answer: string }[];
}

export const QuestionSection = ({ questions }: QuestionSectionProps) => {
  const [activeQuestion, setActiveQuestion] = useState(questions[0]?.question);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWebCam, setIsWebCam] = useState(false);

  const [currentSpeech, setCurrentSpeech] =
    useState<SpeechSynthesisUtterance | null>(null);

  const handlePlayQuestion = (qst: string) => {
    if (isPlaying && currentSpeech?.text === qst) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSpeech(null);
      return;
    }

    if (currentSpeech) {
      window.speechSynthesis.cancel();
    }

    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(qst);
      window.speechSynthesis.speak(speech);
      setIsPlaying(true);
      setCurrentSpeech(speech);
      speech.onend = () => {
        setIsPlaying(false);
        setCurrentSpeech(null);
      };
    }
  };

  const handleNextQuestion = () => {
    const currentIndex = questions.findIndex(
      (q) => q.question === activeQuestion
    );
    if (currentIndex < questions.length - 1) {
      const nextQuestionValue = questions[currentIndex + 1].question;
      setActiveQuestion(nextQuestionValue);
    } else {
      console.log("All questions have been answered!");
    }
  };

  useEffect(() => {
    if (activeQuestion) {
      handlePlayQuestion(activeQuestion);
    }
  }, [activeQuestion]);

  // ✨ ADDED: This useEffect checks for camera permission on component load
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        // Query the browser for the current camera permission status
        const permissionStatus = await navigator.permissions.query({
          name: "camera",
        });

        // If permission is already granted, set the webcam state to true
        if (permissionStatus.state === "granted") {
          setIsWebCam(true);
        }
      } catch (error) {
        console.error("Could not check camera permission:", error);
      }
    };

    checkCameraPermission();
  }, []); // The empty array ensures this runs only once when the component mounts

  return (
    <div className="w-full min-h-96 border rounded-md p-4">
      <Tabs
        value={activeQuestion}
        onValue-change={setActiveQuestion}
        className="w-full space-y-12"
        orientation="vertical"
      >
        <TabsList className="bg-transparent w-full flex flex-wrap items-center justify-start gap-4">
          {questions?.map((tab, i) => (
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-emerald-200 data-[state=active]:shadow-md text-xs px-2"
              )}
              key={tab.question}
              value={tab.question}
            >
              {`Question #${i + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>

        {questions?.map((tab, i) => (
          <TabsContent key={i} value={tab.question}>
            <p className="text-base text-left tracking-wide text-neutral-500">
              {tab.question}
            </p>

            <div className="w-full flex items-center justify-end">
              <TooltipButton
                content={isPlaying ? "Stop" : "Start"}
                icon={
                  isPlaying ? (
                    <VolumeX className="min-w-5 min-h-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="min-w-5 min-h-5 text-muted-foreground" />
                  )
                }
                onClick={() => handlePlayQuestion(tab.question)}
              />
            </div>

            <RecordAnswer
              question={tab}
              isWebCam={isWebCam}
              setIsWebCam={setIsWebCam}
              onSaveSuccess={handleNextQuestion}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
