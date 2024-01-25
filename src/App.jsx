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
  index: 0,
};

function reducer(state, action) {
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
          <Question question={state.questions[state.index]} />
        )}
      </Main>
    </div>
  );
}

export default App;
