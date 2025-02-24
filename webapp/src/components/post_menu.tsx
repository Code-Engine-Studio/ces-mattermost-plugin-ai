import React from 'react';

import {Post} from '@mattermost/types/posts';

import {doReaction, doTranscribe, doSummarize} from '../client';

import {useSelectPost} from '@/hooks';

import IconAI from './assets/icon_ai';
import IconReactForMe from './assets/icon_react_for_me';
import DotMenu, {DropdownMenuItem} from './dot_menu';
import IconThreadSummarization from './assets/icon_thread_summarization';

type Props = {
    post: Post,
}

const PostMenu = (props: Props) => {
    const selectPost = useSelectPost();
    const post = props.post;

    const summarizePost = async (postId: string) => {
        const result = await doSummarize(postId);
        selectPost(result.postid, result.channelid);
    };

    const meetingSummary = async (postId: string) => {
        const result = await doTranscribe(postId);
        selectPost(result.postid, result.channelid);
    };

    return (
        <DotMenu
            icon={<IconAI/>}
            title='AI Actions'
        >
            <DropdownMenuItem onClick={() => summarizePost(post.id)}><span className='icon'><IconThreadSummarization/></span>{'Summarize Thread'}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => meetingSummary(post.id)}><span className='icon'><IconThreadSummarization/></span>{'Summarize Meeting Audio'}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => doReaction(post.id)}><span className='icon'><IconReactForMe/></span>{'React for me'}</DropdownMenuItem>
        </DotMenu>
    );
};

export default PostMenu;
