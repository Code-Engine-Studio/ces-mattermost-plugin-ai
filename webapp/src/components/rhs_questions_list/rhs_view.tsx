/* eslint-disable react/jsx-no-literals */
/* eslint-disable import/no-unresolved */
import React from 'react';
import styled from 'styled-components';

import {createPost} from '../../client';

import {BotUsername} from '../../constants';

import {stateProps} from './index';

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

const RHSView = (props: stateProps) => {
  const {
    entities: {
      channels: {currentChannelId},
      users: {currentUserId},
    },
    pluginChannelId,
  } = props;
  const questions = [
    'Who are you?',
    'Give me some training resources and accounts',
    "What is your company's mission and vision?",
  ];

  const handleCopyToClipboard = (question: string) => {
    const time = new Date().getTime();
    const isDirectMessage = pluginChannelId === currentChannelId;
    const newPost = {
      file_ids: [],
      message: isDirectMessage ? question : `@${BotUsername} ${question}`,
      props: {disable_group_highlight: true},
      metadata: {},
      channel_id: currentChannelId,
      pending_post_id: `${currentUserId}:${time}`,
      user_id: currentUserId,
      create_at: 0,
      update_at: time,
      reply_count: 0,
    };
    createPost(newPost);
  };

  return (
    <div className='focalboard-body'>
      <div className='RHSChannelBoards'>
        <div className='rhs-boards-header'>
          <span className='linked-boards'>Ask Mai any questions below</span>
          <button
            type='button'
            className='Button emphasis--primary'
          >
            <i className='CompassIcon icon-plus AddIcon'/>
            <span>Add</span>
          </button>
        </div>
        <QuestionsList className='rhs-boards-list'>
          {questions.map((question, index) => (
            <li key={`mai-question-${index}`}>
              <QuestionButton
                type='button'
                onClick={() => handleCopyToClipboard(question)}
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
