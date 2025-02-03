import Header from "./Header";
import Body from "./Body";
import { useEffect, useReducer } from "react";

const initialState = {
  questions: [],

  // "loading","error","ready","active","finished"
  status: "loading",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    default:
      throw new Error("action type unknown");
  }
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
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
        <p>1/15</p>
        <p>Question?</p>
      </Body>
    </div>
  );
}

export default App;
