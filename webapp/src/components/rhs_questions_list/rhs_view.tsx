/* eslint-disable quotes */
/* eslint-disable react/prop-types */
/* eslint-disable object-curly-spacing */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { selectChannel } from '../../redux_actions';

import { createPost, getAIQuestions } from '../../client';

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

const RHSView = (props: StateProps) => {
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState<string[]>([]);

  const {
    entities: {
      users: { currentUserId },
    },
    pluginChannelId,
  } = props;

  useEffect(() => {
    getAIQuestions().then(({ data }) => setQuestions(data));
  }, []);
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
    createPost(newPost).then(() => dispatch(selectChannel(pluginChannelId)));
		
  };

  return (
    <div className="focalboard-body">
      <div className="RHSChannelBoards">
        <div className="rhs-boards-header">
          <span className="linked-boards">Mai Questions</span>
        </div>
        <QuestionsList>
          {questions.map((question, index) => (
            <li key={`mai-question-${index}`}>
              <QuestionButton
                type="button"
                onClick={() => handleClickQuestion(question)}
              >
                {question}
              </QuestionButton>
            </li>
          ))}
        </QuestionsList>
      </div>
    </div>
  );
};

export default RHSView;
