import { 
    INIT_INVITE,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    CREATE_GROUP_CHANNEL_SUCCESS,
    CREATE_GROUP_CHANNEL_FAIL,
    INVITE_GROUP_CHANNEL_SUCCESS,
    INVITE_GROUP_CHANNEL_FAIL
} from './types';
import { 
    sbGetUserList, 
    sbGetGroupChannel,
    sbCreateGroupChannel,
    sbInviteGroupChannel 
} from '../sendbirdActions';

export const initInvite = () => {
    return { type: INIT_INVITE };
}

export const getUserList = (userListQuery, channelUrl=null) => {
    return (dispatch) => {
        if (userListQuery.hasNext) {
            sbGetUserList(userListQuery)
            .then((users) => {
                if (channelUrl) {
                    sbGetGroupChannel(channelUrl)
                    .then((channel) => {
                        const channelMemberIds = channel.members.map((member) => {
                            return member.userId;
                        });
                        const list = users.filter((user) => {
                            return channelMemberIds.indexOf(user.userId) < 0;
                        });
                        dispatch({ type: USER_LIST_SUCCESS, list: list });
                    })
                    .catch((error) => {
                        dispatch({ type: USER_LIST_SUCCESS, list: users });
                    })
                } else {
                    dispatch({ type: USER_LIST_SUCCESS, list: users });
                }
            })
            .catch((error) => {
                dispatch({ type: USER_LIST_FAIL });
            })
        } else {
            dispatch({ type: USER_LIST_FAIL });
        }
    }
}

export const createGroupChannel = (inviteUserIdList, isDistinct) => {
    return (dispatch) => {
        sbCreateGroupChannel(inviteUserIdList, isDistinct)
        .then((channel) => {
            dispatch({ 
                type: CREATE_GROUP_CHANNEL_SUCCESS,
                channel: channel
            });
        })
        .catch((error) => {
            dispatch({ type: CREATE_GROUP_CHANNEL_FAIL });
        })
    }
}

export const inviteGroupChannel = (inviteUserIdList, channelUrl) => {
    return (dispatch) => {
        sbInviteGroupChannel(inviteUserIdList, channelUrl)
        .then((channel) => {
            dispatch({
                type: INVITE_GROUP_CHANNEL_SUCCESS,
                channel: channel
            })
        })
        .catch((error) => {
            dispatch({ type: INVITE_GROUP_CHANNEL_FAIL });
        })
    }
}
