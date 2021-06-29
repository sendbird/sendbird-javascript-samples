import { INIT_MEMBER, MEMBER_LIST_SUCCESS, MEMBER_LIST_FAIL } from './types';
import { sbGetParticipantList, sbGetGroupChannel } from '../sendbirdActions';

export const initMember = () => {
  return { type: INIT_MEMBER };
};

export const getParticipantList = participantListQuery => {
  return dispatch => {
    if (participantListQuery.hasNext) {
      return sbGetParticipantList(participantListQuery)
        .then(participants => {
          const list = participants.map(participant => {
            return {
              nickname: participant.nickname,
              profileUrl: participant.profileUrl,
              isOnline: ' '
            };
          });
          dispatch({
            type: MEMBER_LIST_SUCCESS,
            list: list
          });
        })
        .catch(error => {
          dispatch({ type: MEMBER_LIST_FAIL });
        });
    } else {
      dispatch({ type: MEMBER_LIST_FAIL });
      return new Promise.resolve(true);
    }
  };
};

export const getMemberList = channelUrl => {
  return dispatch => {
    return sbGetGroupChannel(channelUrl)
      .then(channel => {
        const list = channel.members.map(member => {
          return {
            nickname: member.nickname,
            profileUrl: member.profileUrl,
            isOnline: member.connectionStatus === 'online' ? 'online' : 'offline'
          };
        });
        dispatch({
          type: MEMBER_LIST_SUCCESS,
          list: list
        });
      })
      .catch(error => dispatch({ type: MEMBER_LIST_FAIL }));
  };
};
