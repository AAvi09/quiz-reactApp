import React from "react";

const StartScreen = ({ numQuestions }) => {
  return (
    <div className="start">
      <h2> welcome to the react quiz!</h2>
      <h3>{numQuestions} questions to test your react mastery</h3>
      <button>Let's start</button>
    </div>
  );
};

export default StartScreen;
