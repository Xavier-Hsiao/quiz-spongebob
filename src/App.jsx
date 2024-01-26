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
import FinishScreen from "./components/FinishScreen/FinishScreen";
import Footer from "./components/Footer/Footer";
import Timer from "./components/Timer/Timer";
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

function App() {
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
            <Footer>
              <NextButton
                dispatch={dispatch}
                answer={state.currAnswer}
                questionIndex={state.currQuestion}
                questionsNum={questionsNum}
              />
              <Timer
                secondsRemaining={state.secondsRemaining}
                dispatch={dispatch}
              />
            </Footer>
          </>
        )}
        {state.status === "finished" && (
          <FinishScreen
            maxPoints={maxPoints}
            points={state.points}
            highScore={state.highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
