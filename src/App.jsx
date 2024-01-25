import { useEffect } from "react";
import styles from "./App.module.scss";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Loader from "./components/Loader/Loader";
import Error from "./components/Error/Error";
import StartScreen from "./components/StartScreen/StartScreen";
import Question from "./components/Question/Question";
import NextButton from "./components/NextButton/NextButton";
import Progress from "./components/Progress/Progress";
import FinishScreen from "./components/FinishScreen/FinishScrenn";
import { useReducer } from "react";

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
};

function reducer(state, action) {
  // We only have current question index in state object. But for points increment validation, we have to access to question object in questions array to get the correctOption property. That's why we have to create a question variable
  const question = state.questions[state.currQuestion];

  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
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
    default:
      throw new Error("Action unknown!");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const questionsNum = state.questions.length;
  const maxPoints = state.questions.reduce((prev, cur) => prev + cur.points, 0);

  // Handle side effect: fetch questions data
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:8000/questions");
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
    console.log("Updating highScore in useEffect:", state.highScore);
    localStorage.setItem("highScore", JSON.stringify(state.highScore));
  }, [state.highScore]);

  return (
    <div className={styles.app}>
      <Header />
      <Main>
        {state.status === "loading" && <Loader />}
        {state.status === "error" && <Error />}
        {state.status === "ready" && (
          <StartScreen questionsNum={questionsNum} dispatch={dispatch} />
        )}
        {state.status === "active" && (
          <>
            <Progress
              questionIndex={state.currQuestion}
              questionsNum={questionsNum}
              maxPoints={maxPoints}
              points={state.points}
            />
            <Question
              question={state.questions[state.currQuestion]}
              answer={state.currAnswer}
              dispatch={dispatch}
            />
            <NextButton
              dispatch={dispatch}
              answer={state.currAnswer}
              questionIndex={state.currQuestion}
              questionsNum={questionsNum}
            />
          </>
        )}
        {state.status === "finished" && (
          <FinishScreen
            maxPoints={maxPoints}
            points={state.points}
            highScore={state.highScore}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
