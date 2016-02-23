var React = require('react-native');
var {
  View,
  Text,
  Image,
  ListView,
  StyleSheet
} = React;

var TopBar = require('../common/topBar');
var sendbird = require('sendbird');

module.exports = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      channel: null,
      memberList: [],
      dataSource: ds.cloneWithRows([])
    };
  },
  componentWillMount: function() {
    sendbird.getChannelInfo((data) => {
      this.setState({channel: data}, () => this.getMemberList());
    });
  },
  render: function() {
    return (
      <View style={styles.container}>
        <TopBar
          onBackPress={this.onBackPress}
          title='Member List'
        />

        <View style={styles.memberListContainer}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
              <View style={styles.listItem}>
                <View style={styles.listIcon}>
                  <Image style={styles.memberIcon} source={{uri: rowData.picture}} />
                </View>
                <View style={styles.listInfo}>
                  <Text style={this.onlineStyle(rowData.is_online)}>{rowData.is_online ? 'online' : 'offline'}</Text>
                  <Text style={styles.nameLabel}>{rowData.nickname}</Text>
                </View>
              </View>
            }
          />
        </View>
      </View>
    );
  },
  getMemberList: function() {
    sendbird.getMemberList(
      this.state.channel.channel_url,
      {
        successFunc : (data) => {
          this.setState({
            memberList: this.state.memberList.concat(data.members),
          });
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.memberList)
          });
        },
        errorFunc: (status, error) => {
          console.log(status, error);
        }
      }
    );
  },
  onBackPress: function() {
    this.props.navigator.pop();
  },
  onlineStyle: function(flag) {
    var _color = flag ? '#4f398f' : '#abb8c4'
    return {
      fontSize: 12,
      fontWeight: '400',
      color: _color,
    }
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  memberListContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
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
  memberIcon: {
    width: 30,
    height: 30
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  nameLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#60768b',
  }
});
