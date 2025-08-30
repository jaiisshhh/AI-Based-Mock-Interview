import {
  CircleStop,
  Loader,
  Mic,
  RefreshCw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
// ✨ ADDED: useRef and useCallback for the new logic
import { useEffect, useState, useRef, useCallback } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import type { ResultType } from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { useAuth } from "@clerk/clerk-react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { toast } from "sonner";

import { db } from "@/config/firebase.config";
import { chatSession } from "@/srcipts";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { SaveModal } from "./save-modal";
import { TooltipButton } from "./tooltip-button";

interface RecordAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
  onSaveSuccess: () => void;
}

interface AIResponse {
  ratings: number;
  feedback: string;
}

export const RecordAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
  onSaveSuccess,
}: RecordAnswerProps) => {
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState<"speech" | "text">("speech");

  const { userId } = useAuth();
  const { interviewId } = useParams();
  // ✨ ADDED: A ref to track the previous recording state
  const wasRecordingRef = useRef(isRecording);

  const cleanJsonResponse = (responseText: string) => {
    let cleanText = responseText.trim();
    cleanText = cleanText.replace(/(json|```|`)/g, "");
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  // ✨ MODIFIED: Wrapped generateResult in useCallback for optimization
  const generateResult = useCallback(
    async (
      qst: string,
      qstAns: string,
      userAns: string
    ): Promise<AIResponse> => {
      setIsAiGenerating(true);
      const prompt = `
        Question: "${qst}"
        User Answer: "${userAns}"
        Correct Answer: "${qstAns}"
        Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer feedback for improvement.
        Return the result in JSON format with the fields "ratings" (number) and "feedback" (string).
      `;

      try {
        const aiResult = await chatSession.sendMessage(prompt);
        const parsedResult: AIResponse = cleanJsonResponse(
          aiResult.response.text()
        );
        return parsedResult;
      } catch (error) {
        console.log(error);
        toast("Error", {
          description: "An error occurred while generating feedback.",
        });
        return { ratings: 0, feedback: "Unable to generate feedback" };
      } finally {
        setIsAiGenerating(false);
      }
    },
    [] // This function doesn't have reactive dependencies, so the array is empty
  );

  // ✨ MODIFIED: Wrapped getAIFeedback in useCallback for stable reference in useEffect
  const getAIFeedback = useCallback(async () => {
    if (isRecording) {
      stopSpeechToText();
    }

    if (inputMode === "speech" && userAnswer?.length < 30) {
      toast.error("Error", {
        description: "Your answer should be more than 30 characters",
      });
      return;
    }

    const result = await generateResult(
      question.question,
      question.answer,
      userAnswer
    );
    setAiResult(result);
  }, [isRecording, userAnswer, question, stopSpeechToText, generateResult]);

  // ✨ ADDED: This effect automatically triggers AI feedback when recording stops in speech mode
  useEffect(() => {
    // Check if it *was* recording and now it is *not*, and we are in speech mode
    if (wasRecordingRef.current && !isRecording && inputMode === "speech") {
      // Ensure there's an answer to process before calling the API
      if (userAnswer && userAnswer.trim().length > 0) {
        getAIFeedback();
      }
    }
    // Update the ref to the current recording state for the next render
    wasRecordingRef.current = isRecording;
  }, [isRecording, inputMode, userAnswer, getAIFeedback]);

  const toggleRecording = () => {
    if (isRecording) {
      stopSpeechToText();
      // NOTE: We don't call getAIFeedback here directly. The useEffect above handles it.
    } else {
      startSpeechToText();
    }
  };

  const recordNewAnswer = () => {
    setUserAnswer("");
    setAiResult(null); // Also clear the previous AI result
    if (isRecording) {
      stopSpeechToText();
    }
    startSpeechToText();
  };

  const saveUserAnswer = async () => {
    setLoading(true);

    if (!aiResult) {
      setLoading(false);
      return;
    }

    const currentQuestion = question.question;
    try {
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", currentQuestion)
      );
      const querySnap = await getDocs(userAnswerQuery);

      if (!querySnap.empty) {
        toast.info("Already Answered", {
          description: "You have already answered this question",
        });
        return;
      } else {
        await addDoc(collection(db, "userAnswers"), {
          mockIdRef: interviewId,
          question: question.question,
          correct_ans: question.answer,
          user_ans: userAnswer,
          feedback: aiResult.feedback,
          rating: aiResult.ratings,
          userId,
          createdAt: serverTimestamp(),
        });

        toast("Saved", { description: "Your answer has been saved.." });

        onSaveSuccess();
        setUserAnswer("");
        setAiResult(null);
        if (isRecording) {
          stopSpeechToText();
        }
      }
    } catch (error) {
      toast("Error", {
        description: "An error occurred while saving your answer.",
      });
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleInputModeChange = (isChecked: boolean) => {
    setInputMode(isChecked ? "text" : "speech");
  };

  useEffect(() => {
    const combineTranscripts = results
      .filter((result): result is ResultType => typeof result !== "string")
      .map((result) => result.transcript)
      .join(" ");

    setUserAnswer(combineTranscripts);
  }, [results]);

  return (
    <div className="w-full flex flex-col md:flex-row items-start gap-6 mt-4">
      {/* Camera & Controls */}
      <div className="md:w-2/5 w-full flex flex-col items-center gap-4">
        <SaveModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={saveUserAnswer}
          loading={loading}
        />

        <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
          {isWebCam ? (
            <WebCam
              onUserMedia={() => setIsWebCam(true)}
              onUserMediaError={() => setIsWebCam(false)}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
          )}
        </div>

        <div className="flex justify-center gap-3">
          <TooltipButton
            content={isWebCam ? "Turn Off" : "Turn On"}
            icon={isWebCam ? <VideoOff /> : <Video />}
            onClick={() => setIsWebCam(!isWebCam)}
          />

          <TooltipButton
            content={isRecording ? "Stop Recording" : "Start Recording"}
            icon={isRecording ? <CircleStop /> : <Mic />}
            onClick={toggleRecording}
            disbaled={inputMode === "text"}
          />

          <TooltipButton
            content="Record Again"
            icon={<RefreshCw />}
            onClick={recordNewAnswer}
            disbaled={inputMode === "text"}
          />

          <TooltipButton
            content="Save Result"
            icon={
              isAiGenerating ? ( 
                <Loader className="min-w-5 min-h-5 animate-spin" />
              ) : (
                <Save className="min-w-5 min-h-5" />
              )
            }
            onClick={() => setOpen(!open)}
            disbaled={!aiResult}
          />
        </div>
      </div>

      {/* Answer */}
      <div className="md:w-3/5 w-full">
        <div className="w-full h-120 p-4 border rounded-md bg-gray-50 overflow-y-auto">
          <div className="flex items-center space-x-3 mb-4">
            <Label
              htmlFor="input-mode-toggle"
              className={inputMode === "speech" ? "font-bold" : ""}
            >
              Speech
            </Label>
            <Switch
              id="input-mode-toggle"
              checked={inputMode === "text"}
              onCheckedChange={handleInputModeChange}
            />
            <Label
              htmlFor="input-mode-toggle"
              className={inputMode === "text" ? "font-bold" : ""}
            >
              Text
            </Label>
          </div>

          <h2 className="text-lg font-semibold">Your Answer:</h2>

          {inputMode === "speech" ? (
            <>
              <p className="text-sm mt-2 text-gray-700 whitespace-pre-line">
                {userAnswer || "Start recording to see your answer here."}
              </p>
              {interimResult && (
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Listening: </strong>
                  {interimResult}
                </p>
              )}
            </>
          ) : (
            <>
              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="mt-2 h-64 bg-white"
              />
              <div className="w-full flex justify-center mt-4">
                <Button
                  onClick={getAIFeedback}
                  size="sm"
                  disabled={isAiGenerating}
                >
                  {isAiGenerating ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
