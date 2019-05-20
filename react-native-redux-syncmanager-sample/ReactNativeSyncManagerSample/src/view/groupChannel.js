

import React from 'react';
import {
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import {
  Avatar,
  ListItem
} from 'react-native-elements';
import moment from 'moment';
import { createChannelTitle } from '../utils';
import { style } from '../style/groupChannel';

const MAX_SUBTITLE_LENGTH = 27;

export default class GroupChannelView extends React.Component {
	constructor(props) {
		super(props);
	}
  render() {
		const channel = this.props.channel;
		const lastMessage = channel.lastMessage;
    const title = createChannelTitle(channel);
    let subtitle = 'Channel created';
    if(lastMessage) {
      subtitle = lastMessage.isFileMessage() ? lastMessage.name : lastMessage.message;
      if (subtitle.length > MAX_SUBTITLE_LENGTH) {
        subtitle = subtitle.substring(0, MAX_SUBTITLE_LENGTH - 3) + '...';
      }
    }
    return (
      <ListItem
        component={TouchableHighlight}
        containerStyle={style.container}
        activeOpacity={0.95}
        key={channel.url}
        leftAvatar={<Avatar source={{uri: channel.coverUrl}} rounded={true} />}
        title={<View style={style.titleContainer}>
          <View style={{flexDirection: 'row'}}>
            <Text>{title}</Text>
            <View style={style.memberCount}>
              <Text style={style.titleText}>{channel.memberCount}</Text>
            </View>
          </View>
          <View>
            <Text style={style.titleText}>
							{moment(lastMessage ? lastMessage.createdAt : channel.createdAt).fromNow()}
            </Text>
          </View>
        </View>}
        titleStyle={style.title}
        subtitle={<View style={style.lastMessage}>
            <Text style={style.lastMessageText}>{subtitle}</Text>
            {(channel.unreadMessageCount > 0 &&
              <View style={style.unreadCount}>
                <Text style={style.unreadCountText}>{(channel.unreadMessageCount > 9)
                  ? '9+'
                  : channel.unreadMessageCount}</Text>
              </View>)}
          </View>}
        subtitleStyle={style.subtitle}
				onPress={() => {
					if(this.props.onPress) {
						this.props.onPress(channel);
					}
				}}
      />
    );
  }
}