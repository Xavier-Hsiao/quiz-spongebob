import { createContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

// The reason we use reducer:
// 1. questions and status usually change at the same time
// 2. centralize the state management

const initialState = {
  // All questions fetched from json-server
  questions: [],
  // "loading", "error", "ready", "active", "finished"
  status: "loading",
  // Keep track of the current question, 0-based
  currQuestion: 0,
  // Keep track of the current answer, should be an array index
  currAnswer: null,
  // Keep track of user scores
  points: 0,
  // Keep track of the highest score
  highScore: parseInt(localStorage.getItem("highScore"), 10) || 0,
  // Keep track of timer
  secondsRemaining: 10,
};

const SECS_PER_QUESTION = 30;

function reducer(state, action) {
  // We only have current question index in state object. But for points increment validation, we have to access to question object in questions array to get the correctOption property. That's why we have to create a question variable
  const question = state.questions[state.currQuestion];

  switch (action.type) {
    case "dataReceived":
      const { questions } = action.payload;

      return {
        ...state,
        questions,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      return {
        ...state,
        currAnswer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        currQuestion: state.currQuestion + 1,
        // Prevent the answer shows right after entering the next question
        currAnswer: null,
      };
    case "finished":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "reset":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };
    case "countdown":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        // Go back to "finished" status once the timer countdowns to 0
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown!");
  }
}

function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const questionsNum = state.questions.length;
  const maxPoints = state.questions.reduce((prev, cur) => prev + cur.points, 0);

  // Handle side effect: fetch questions data
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          "https://helpful-kleicha-41f04d.netlify.app/.netlify/functions/api"
        );
        const data = await res.json();

        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
        console.log(err);
      }
    };

    fetchQuestions();
  }, []);

  // Handle side effect: set highScore to local storage
  useEffect(() => {
    localStorage.setItem("highScore", JSON.stringify(state.highScore));
  }, [state.highScore]);

  return (
    <QuizContext.Provider value={{ state, dispatch, questionsNum, maxPoints }}>
      {children}
    </QuizContext.Provider>
  );
}

export { QuizProvider, QuizContext };
