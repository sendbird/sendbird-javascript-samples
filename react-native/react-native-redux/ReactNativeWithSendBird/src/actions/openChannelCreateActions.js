import { INIT_OPEN_CHANNEL_CREATE, OPEN_CHANNEL_CREATE_SUCCESS, OPEN_CHANNEL_CREATE_FAIL } from './types';
import { sbCreateOpenChannel } from '../sendbirdActions';

export const initOpenChannelCreate = () => {
  return { type: INIT_OPEN_CHANNEL_CREATE };
};

export const createOpenChannel = channelName => {
  return dispatch => {
    return sbCreateOpenChannel(channelName)
      .then(channel =>
        dispatch({
          type: OPEN_CHANNEL_CREATE_SUCCESS,
          channel: channel
        })
      )
      .catch(error =>
        dispatch({
          type: OPEN_CHANNEL_CREATE_FAIL,
          error: error
        })
      );
  };
};
