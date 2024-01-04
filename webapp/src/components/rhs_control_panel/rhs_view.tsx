/* eslint-disable react/jsx-no-literals */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
import React from "react";
import styled from "styled-components";

const QuestionsList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-block: 0;
`;

const QuestionButton = styled.button`
  padding: 5px 10px;
  text-align: left;
  border: 1px solid rgba(var(--center-channel-color-rgb), 0.16);
  box-shadow: var(--elevation-1);
  border-radius: 5px;
  cursor: pointer;
  background-color: transparent;
  width: 100%;

  :hover {
    background: rgba(var(--center-channel-color-rgb), 0.08);
    fill: currentcolor;
  }
`;

const RHSView = () => {
  const questions = [
    "Who are you?",
    "Give me some training resources and accounts",
    "What is your company's mission and vision?",
  ];

  const handleCopyToClipboard = (question: string) => {
    navigator.clipboard.writeText(question);
  };

  return (
    <div className="focalboard-body">
      <div className="RHSChannelBoards">
        <div className="rhs-boards-header">
          <span className="linked-boards">Mai Questions</span>
          <button type="button" className="Button emphasis--primary">
            <i className="CompassIcon icon-plus AddIcon" />
            <span>Add</span>
          </button>
        </div>
        <QuestionsList className="rhs-boards-list">
          {questions.map((question, index) => (
            <li key={`mai-question-${index}`}>
              <QuestionButton
                type="button"
                onClick={() => handleCopyToClipboard(question)}
              >
                {question}
                <i className="CompassIcon icon-dots-horizontal OptionsIcon" />
              </QuestionButton>
            </li>
          ))}
        </QuestionsList>
      </div>
    </div>
  );
};

export default RHSView;
