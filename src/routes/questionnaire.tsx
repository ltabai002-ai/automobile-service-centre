import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ShowroomQuestionnaire, { type QuestionnaireData } from "@/components/ShowroomQuestionnaire";

export const Route = createFileRoute("/questionnaire")({
  head: () => ({
    meta: [
      { title: "Requirements & Role Questionnaire — InField Showroom App" },
      { name: "description", content: "Tell us your dealership role and feature requirements to personalize your InField experience." },
    ],
  }),
  component: QuestionnairePage,
});

function QuestionnairePage() {
  const navigate = useNavigate();

  const handleComplete = (data: QuestionnaireData) => {
    // Save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("infield_user_preferences", JSON.stringify(data));
    }
    // Redirect to home page with query param
    navigate({ to: "/", search: { quizCompleted: "true" } });
  };

  const handleSkip = () => {
    navigate({ to: "/" });
  };

  return (
    <ShowroomQuestionnaire
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}
