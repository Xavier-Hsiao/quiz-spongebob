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
import useQuizContext from "./contexts/useQuizContext";

function App() {
  const { state, dispatch } = useQuizContext();

  return (
    <div className={styles.app}>
      <Header />
      <Main>
        {state.status === "loading" && <Loader />}
        {state.status === "error" && <Error />}
        {state.status === "ready" && <StartScreen />}
        {state.status === "active" && (
          <>
            <Progress />
            <Question
              question={state.questions[state.currQuestion]}
              answer={state.currAnswer}
              dispatch={dispatch}
            />
            <Footer>
              <NextButton />
              <Timer />
            </Footer>
          </>
        )}
        {state.status === "finished" && <FinishScreen />}
      </Main>
    </div>
  );
}

export default App;
