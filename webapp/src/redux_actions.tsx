export const selectPost = (postid: string) => {
  return {
    type: 'SELECT_AI_POST',
    postId: postid,
  };
};

export const selectChannel = (channelId: string) => {
  return {
    type: 'SELECT_CHANNEL',
    data: channelId,
  };
};

let openRHSAction: any = null;

export const openRHS = () => {
  if (openRHSAction) {
    return openRHSAction;
  }
  return {
    type: 'NONE',
  };
};

export const setOpenRHSAction = (action: any) => {
  openRHSAction = action;
};
