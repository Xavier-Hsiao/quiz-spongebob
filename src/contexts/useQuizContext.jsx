import { QuizContext } from "./QuizContext";
import { useContext } from "react";

export default function useQuizContext() {
  const context = useContext(QuizContext);

  if (context === undefined)
    throw new Error("QuizContext was used outside QuizProvider!");

  return context;
}
