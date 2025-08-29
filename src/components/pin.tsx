import type { Interview } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { Eye, Newspaper, Sparkles } from "lucide-react";
import { TooltipButton } from "./tooltip-button";

interface InterviewPinProps {
  interview: Interview;
  onMockPage?: boolean;
}

export const InterviewPin = ({
  interview,
  onMockPage = false,
}: InterviewPinProps) => {
  const navigate = useNavigate();

  return (
    // Added fixed height and flexbox for a consistent layout
    <Card className="p-4 rounded-md shadow-none hover:shadow-md shadow-gray-100 cursor-pointer transition-all space-y-4 h-72 flex flex-col">
      {/* This wrapper pushes the footer to the bottom */}
      <div className="flex-grow overflow-hidden">
        <CardTitle className="text-lg truncate">
          {interview?.position}
        </CardTitle>

        {/* Added the line-clamp utility to truncate the description */}
        <CardDescription className="line-clamp-4 text-sm text-muted-foreground mt-2">
          {interview?.description}
        </CardDescription>

        <div className="w-full flex items-center gap-2 flex-wrap mt-4">
          {/* Show the first 4 tech stack items */}
          {interview?.techStack
            .split(",")
            .slice(0, 4)
            .map((word, index) => (
              <Badge
                key={index}
                variant={"outline"}
                className="text-xs text-muted-foreground"
              >
                {word}
              </Badge>
            ))}

          {/* If there are more than 4, show a "+N" badge */}
          {interview?.techStack.split(",").length > 4 && (
            <Badge variant="secondary">
              +{interview?.techStack.split(",").length - 4}
            </Badge>
          )}
        </div>
      </div>

      <CardFooter
        className={cn(
          "w-full flex items-center p-0",
          onMockPage ? "justify-end" : "justify-between"
        )}
      >
        <p className="text-[12px] text-muted-foreground truncate whitespace-nowrap">
          {`${new Date(interview?.createdAt.toDate()).toLocaleDateString(
            "en-US",
            { dateStyle: "long" }
          )}`}
        </p>

        {!onMockPage && (
          <div className="flex items-center justify-center">
            <TooltipButton
              content="View"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/${interview?.id}`, { replace: true });
              }}
              disbaled={false}
              buttonClassName="hover:text-sky-500"
              icon={<Eye />}
              loading={false}
            />

            <TooltipButton
              content="Feedback"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/feedback/${interview?.id}`, {
                  replace: true,
                });
              }}
              disbaled={false}
              buttonClassName="hover:text-yellow-500"
              icon={<Newspaper />}
              loading={false}
            />

            <TooltipButton
              content="Start"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/interview/${interview?.id}`, {
                  replace: true,
                });
              }}
              disbaled={false}
              buttonClassName="hover:text-sky-500"
              icon={<Sparkles />}
              loading={false}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
