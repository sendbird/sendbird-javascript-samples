
import React from 'react';
import {
  Text,
  TouchableHighlight
} from 'react-native';
import {
  Avatar,
  ListItem
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { style } from '../style/user';

export default class UserView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }
  componentDidMount() {
    if(this.props.selected) {
      this.setState({ selected: this.state.selected });
    }
  }
  toggle() {
    if(this.props.selectable) {
      const selected = !this.state.selected;
      if(this.props.onPress) {
        this.props.onPress(selected, this.props.user);
      }
      this.setState({ selected });
    }
  }
  render() {
    const user = this.props.user;
    return (
      <ListItem
        component={TouchableHighlight}
        containerStyle={style.container}
        activeOpacity={0.95}
        key={user.userId}
        leftAvatar={(
          <Avatar 
              rounded={true}
              source={user.profileUrl ? {uri: user.profileUrl} : require('../img/icon_sb_68.png')} 
          />
        )}
        title={user.nickname || '(Unnamed user)'}
        titleStyle={style.nickname}
        leftIcon={(this.props.selectable ?
          <Icon 
              containerStyle={style.selectContainer}
              iconStyle={style.select}
              name='md-checkmark-circle'
              color={this.state.selected ? '#6741d9' : '#e3e3e3'}
              size={28}
          />
          : <Text></Text>
        )}
        rightIcon={( <Text></Text> )}
        onPress={ this.toggle.bind(this) }
      />
    );
  }
}