import {
  INIT_INVITE,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  CREATE_GROUP_CHANNEL_SUCCESS,
  CREATE_GROUP_CHANNEL_FAIL,
  INVITE_GROUP_CHANNEL_SUCCESS,
  INVITE_GROUP_CHANNEL_FAIL
} from './types';
import { sbGetUserList, sbGetGroupChannel, sbCreateGroupChannel, sbInviteGroupChannel } from '../sendbirdActions';

export const initInvite = () => {
  return { type: INIT_INVITE };
};

const getUserListFilter = (userListQuery, channelUrl, prevUsers, resolve, reject) => {
  if (!userListQuery.hasNext) {
    return resolve(prevUsers);
  }
  return sbGetUserList(userListQuery)
    .then(users => {
      if (channelUrl) {
        return sbGetGroupChannel(channelUrl)
          .then(channel => {
            const channelMemberIds = channel.members.map(member => {
              return member.userId;
            });
            const list = users.filter(user => {
              return channelMemberIds.indexOf(user.userId) < 0;
            });
            const filteredUsers = [...prevUsers, ...list];
            if (filteredUsers.length < userListQuery.limit / 2) {
              return getUserListFilter(userListQuery, channelUrl, filteredUsers, resolve, reject);
            } else {
              resolve(filteredUsers);
            }
          })
          .catch(() => {
            resolve([...users, ...prevUsers]);
          });
      } else {
        resolve([...users, ...prevUsers]);
      }
    })
    .catch(() => {
      resolve(prevUsers);
    });
};

export const getUserList = (userListQuery, channelUrl = null) => {
  return dispatch => {
    if (userListQuery.hasNext) {
      return new Promise((resolve, reject) => {
        const users = [];
        return getUserListFilter(userListQuery, channelUrl, users, resolve, reject);
      })
        .then(users => {
          dispatch({ type: USER_LIST_SUCCESS, list: users });
        })
        .catch(() => {
          dispatch({ type: USER_LIST_FAIL });
        });
    } else {
      dispatch({ type: USER_LIST_FAIL });
      return Promise.resolve(true);
    }
  };
};

export const createGroupChannel = (inviteUserIdList, isDistinct) => {
  return dispatch => {
    return sbCreateGroupChannel(inviteUserIdList, isDistinct)
      .then(channel => {
        dispatch({
          type: CREATE_GROUP_CHANNEL_SUCCESS,
          channel: channel
        });
      })
      .catch(error => {
        dispatch({ type: CREATE_GROUP_CHANNEL_FAIL });
      });
  };
};

export const inviteGroupChannel = (inviteUserIdList, channelUrl) => {
  return dispatch => {
    return sbInviteGroupChannel(inviteUserIdList, channelUrl)
      .then(channel => {
        dispatch({
          type: INVITE_GROUP_CHANNEL_SUCCESS,
          channel: channel
        });
      })
      .catch(error => {
        dispatch({ type: INVITE_GROUP_CHANNEL_FAIL });
      });
  };
};
