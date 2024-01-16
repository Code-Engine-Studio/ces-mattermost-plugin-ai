/* eslint-disable quotes */
/* eslint-disable react/prop-types */
/* eslint-disable object-curly-spacing */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { useState } from 'react';
import styled from 'styled-components';

import { createPost } from '../../client';

import { StateProps } from './index';

const QuestionsList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  padding-block: 5px;
  margin-top: 0px;
  margin-bottom: 0px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const QuestionInput = styled.input`
  padding: 5px 10px;
  text-align: left;
  border: 1px solid rgba(var(--center-channel-color-rgb), 0.16);
  border-radius: 5px;
  background-color: transparent;
  width: 100%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const DEFAULT_QUESTIONS = [
  'Who are you?',
  'Give me some training resources and accounts',
  "What is your company's mission and vision?",
];

const RHSView = (props: StateProps) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [questions, setQuestions] = useState<string[]>(DEFAULT_QUESTIONS);
  const [questionInputs, setQuestionInputs] =
    useState<string[]>(DEFAULT_QUESTIONS);

  const {
    entities: {
      users: { currentUserId, profiles },
    },
    pluginChannelId,
  } = props;

  const { roles = '' } = profiles[currentUserId];
  const isAdmin = roles.includes('system_admin');

  const handleClickEditButton = () => {
    setQuestionInputs(questions);
    setIsEditMode(true);
  };

  const handleClickSaveButton = () => {
    const newQuestions = questionInputs.filter(question => question);
    setQuestions(newQuestions);
    setIsEditMode(false);
  };

  const handleClickCancelButton = () => {
    setIsEditMode(false);
  };

  const handleUpdateQuestion = (index: number, question: string) => {
    if (questionInputs[index] === question) {
      return;
    }

    const newQuestions = [...questionInputs];
    newQuestions[index] = question;
    setQuestionInputs(newQuestions);
  };

  const handleAddQuestion = () => {
    const newQuestions = [...questionInputs, ''];
    setQuestionInputs(newQuestions);
  };

  const handleClickQuestion = (question: string) => {
    const time = new Date().getTime();
    const newPost = {
      file_ids: [],
      message: question,
      props: { disable_group_highlight: true },
      metadata: {},
      channel_id: pluginChannelId,
      pending_post_id: `${currentUserId}:${time}`,
      user_id: currentUserId,
      create_at: 0,
      update_at: time,
      reply_count: 0,
    };
    createPost(newPost);
  };

  return (
    <div className="focalboard-body">
      <div className="RHSChannelBoards">
        <div className="rhs-boards-header">
          <span className="linked-boards">Mai Questions</span>
          {isAdmin && !isEditMode && (
            <button
              type="button"
              className="Button emphasis--primary"
              onClick={handleClickEditButton}
            >
              <span>Edit</span>
            </button>
          )}
          {isEditMode && (
            <ButtonsContainer>
              <button
                type="button"
                className="Button emphasis--secondary"
                onClick={handleClickCancelButton}
              >
                <span>Cancel</span>
              </button>
              <button
                type="button"
                className="Button emphasis--primary"
                onClick={handleClickSaveButton}
              >
                <span>Save</span>
              </button>
            </ButtonsContainer>
          )}
        </div>
        <QuestionsList>
          {!isEditMode &&
            questions.map((question, index) => (
              <li key={`mai-question-${index}`}>
                <QuestionButton
                  type="button"
                  onClick={() => handleClickQuestion(question)}
                >
                  {question}
                </QuestionButton>
              </li>
            ))}
          {isEditMode &&
            questionInputs.map((question, index) => (
              <li key={`mai-question-${index}`}>
                <QuestionInput
                  type="text"
                  defaultValue={question}
                  onBlur={e => handleUpdateQuestion(index, e.target.value)}
                />
              </li>
            ))}
        </QuestionsList>
        {isEditMode && (
          <button
            type="button"
            className="Button emphasis--primary"
            onClick={handleAddQuestion}
          >
            <span>New Question</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default RHSView;
