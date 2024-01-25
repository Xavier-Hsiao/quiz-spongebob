import { useEffect } from "react";
import styles from "./App.module.scss";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Loader from "./components/Loader/Loader";
import Error from "./components/Error/Error";
import StartScreen from "./components/StartScreen/StartScreen";
import Question from "./components/Question/Question";
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
          action.payload ===
          state.questions[state.currQuestion].question.correctOption
            ? state.points + question.points
            : state.points,
      };
    default:
      throw new Error("Action unknown!");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const questionsNum = state.questions.length;
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
          <Question
            question={state.questions[state.currQuestion]}
            answer={state.currAnswer}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
