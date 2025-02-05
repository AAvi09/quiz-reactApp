import Header from "./Header";
import Body from "./Body";
import { useEffect, useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";

const initialState = {
  questions: [],

  // "loading","error","ready","active","finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newanswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        status: "active",
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...state,
        status: "ready",
        index: 0,
        answer: null,
        points: 0,
        highscore: 0,
      };
    default:
      throw new Error("action type unknown");
  }
};
function App() {
  const [{ questions, status, index, answer, points, highscore }, dispatch] =
    useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/questions`);
        if (!response.ok) {
          throw new Error("failed to fetch questions");
        }
        const data = await response.json();
        dispatch({ type: "dataReceived", payload: data });
        console.log(data);
      } catch (err) {
        dispatch({ type: "dataFailed" });
        console.error(err);
      }
    };
    fetchQuestions();
  }, []);
  return (
    <div>
      <Header />

      <Body>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              maxPossiblePoints={maxPossiblePoints}
              points={points}
              answer={answer}
            />
            <Questions
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={numQuestions}
            />
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Body>
    </div>
  );
}

export default App;
