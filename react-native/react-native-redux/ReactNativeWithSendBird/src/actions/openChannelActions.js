import {
  INIT_OPEN_CHANNEL,
  OPEN_CHANNEL_PROGRESS_START,
  OPEN_CHANNEL_PROGRESS_END,
  OPEN_CHANNEL_LIST_SUCCESS,
  OPEN_CHANNEL_LIST_FAIL,
  GET_OPEN_CHANNEL_SUCCESS,
  GET_OPEN_CHANNEL_FAIL,
  ADD_OPEN_CHANNEL_ITEM,
  CLEAR_ADD_OPEN_CHANNEL,
  CLEAR_SELECTED_OPEN_CHANNEL
} from './types';
import { sbGetOpenChannelList, sbGetOpenChannel } from '../sendbirdActions';

export const initOpenChannel = () => {
  return { type: INIT_OPEN_CHANNEL };
};

export const getOpenChannelList = openChannelListQuery => {
  return dispatch => {
    if (openChannelListQuery.hasNext) {
      return sbGetOpenChannelList(openChannelListQuery)
        .then(channels =>
          dispatch({
            type: OPEN_CHANNEL_LIST_SUCCESS,
            list: channels
          })
        )
        .catch(error => dispatch({ type: OPEN_CHANNEL_LIST_FAIL }));
    } else {
      dispatch({ type: OPEN_CHANNEL_LIST_FAIL });
      return Promise.resolve(true);
    }
  };
};

export const onOpenChannelPress = channelUrl => {
  return dispatch => {
    return sbGetOpenChannel(channelUrl)
      .then(channel =>
        dispatch({
          type: GET_OPEN_CHANNEL_SUCCESS,
          channel: channel
        })
      )
      .catch(error => dispatch({ type: GET_OPEN_CHANNEL_FAIL }));
  };
};

export const addOpenChannelItem = channel => {
  return {
    type: ADD_OPEN_CHANNEL_ITEM,
    channel: channel
  };
};

export const clearCreatedOpenChannel = () => {
  return { type: CLEAR_ADD_OPEN_CHANNEL };
};

export const clearSelectedOpenChannel = () => {
  return { type: CLEAR_SELECTED_OPEN_CHANNEL };
};

export const openChannelProgress = start => {
  return {
    type: start ? OPEN_CHANNEL_PROGRESS_START : OPEN_CHANNEL_PROGRESS_END
  };
};
