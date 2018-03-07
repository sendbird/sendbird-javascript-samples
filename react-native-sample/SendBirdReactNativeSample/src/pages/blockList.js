import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  ListView,
  TouchableHighlight,
  Alert,
  StyleSheet
} from 'react-native'

import {APP_ID, PULLDOWN_DISTANCE} from '../consts';
import TopBar from '../components/topBar';
import SendBird from 'sendbird';
var sb = null;

export default class BlockList extends Component {
  constructor(props) {
    super(props);
    sb = SendBird.getInstance();
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      channel: props.route.channel,
      list: [],
      dataSource: ds.cloneWithRows([]),
      listQuery: sb.createBlockedUserListQuery()
    };
    this._onUserPress = this._onUserPress.bind(this);
    this._onBackPress = this._onBackPress.bind(this);
    this._getBlockList = this._getBlockList.bind(this);
  }

  componentWillMount() {
    this._getBlockList();
  }

  _onUserPress(obj) {
    var _SELF = this;
    Alert.alert(
      'Unblock User',
      null,
      [
        {text: 'Unblock', onPress: () => {
          sb.unblockUser(obj, function(response, error) {
            if(error) {
              console.log(error);
              return;
            }

            _SELF.setState({list: _SELF.state.list.filter((user) => {
              return user.userId !== obj.userId;
            })}, ()=> {
              _SELF.setState({dataSource: _SELF.state.dataSource.cloneWithRows(_SELF.state.list)});
            });
          });
        }},
        {text: 'Cancel'}
      ]
    )
  }

  _getBlockList() {
    var _SELF = this;
    this.state.listQuery.next(function(response, error) {
      if (error) {
        if (response.length == 0) {
          return;
        }
        console.log('Get Participant List Fail.', error);
        return;
      }

      _SELF.setState({list: _SELF.state.list.concat(response)}, () => {
        _SELF.setState({dataSource: _SELF.state.dataSource.cloneWithRows(_SELF.state.list)});
      });
    });
  }

  _onBackPress() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <TopBar
          onBackPress={this._onBackPress}
          title='Blocked Users'
           />

        <View style={styles.listContainer}>
          <ListView
            enableEmptySections={true}
            onEndReached={() => this._getBlockList()}
            onEndReachedThreshold={PULLDOWN_DISTANCE}
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
              <TouchableHighlight onPress={() => this._onUserPress(rowData)}>
                <View style={styles.listItem}>
                  <View style={styles.listIcon}>
                    <Image style={styles.profileIcon} source={{uri: rowData.profileUrl.replace('http://', 'https://')}} />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.memberLabel}>{rowData.nickname}</Text>
                  </View>
                </View>
              </TouchableHighlight>
            }
          />
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  listContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fc',
    borderBottomWidth: 0.5,
    borderColor: '#D0DBE4',
    padding: 5
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15
  },
  profileIcon: {
    width: 30,
    height: 30
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  memberLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#60768b',
  }
});
