var React = require('react-native');
var {
  View,
  Text,
  Image,
  TextInput,
  ListView,
  TouchableHighlight,
  StyleSheet
} = React;

var TopBar = require('../common/topBar');
var sendbird = require('sendbird');
var searchIcon = require('../../img/icon-search.png');
var PULLDOWN_DISTANCE = 40;

module.exports = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      channelList: [],
      dataSource: ds.cloneWithRows([]),
      page: 0,
      next: 0,
      channelName: ''
    };
  },
  componentWillMount: function() {
    this.getChannelList(1);
  },
  render: function() {
    return (
      <View style={styles.container}>
        <TopBar
          onBackPress={this.onBackPress}
          title='Open Chat'
        />

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.searchContainer}>
            <Image style={styles.searchIcon} source={searchIcon} />
            <TextInput
              style={styles.input}
              value={this.state.channelName}
              onChangeText={(text) => this.getChannelSearch(text)}
              placeholder={'Search Channels'}
              maxLength={20}
              multiline={false}
              />
          </View>
        </View>

        <View style={styles.listContainer}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
              <TouchableHighlight onPress={() => this.onChannelPress(rowData.channel_url)}>
                <View style={styles.listItem}>
                  <View style={styles.listIcon}>
                    <Image style={styles.channelIcon} source={{uri: rowData.cover_img_url}} />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.titleLabel}># {rowData.name}</Text>
                    <Text style={styles.memberLabel}>{rowData.member_count} members</Text>
                  </View>
                </View>
              </TouchableHighlight>
            }
            onEndReached={() => this.getChannelList(this.state.next)}
            onEndReachedThreshold={PULLDOWN_DISTANCE}
          />
        </View>
      </View>
    );
  },
  onChannelPress: function(url) {
    sendbird.joinChannel(
      url,
      {
        successFunc: (data) => {
          sendbird.connect({
            successFunc: (data) => {
              this.props.navigator.push({ name: 'chat' });
            },
            errorFunc: (status, error) => {
              console.log(status, error);
            }
          });
        },
        errorFunc: (status, error) => {
          console.log(status, error);
        }
      }
    );
  },
  getChannelList: function(page) {
    if (page == 0) {
      return;
    }
    sendbird.getChannelList({
      page: page,
      limit: 20,
      successFunc : (data) => {
        this.setState({
          channelList: this.state.channelList.concat(data.channels),
        });
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.state.channelList),
          page: data.page,
          next: data.next
        });
      },
      errorFunc: (status, error) => {
        console.log(status, error);
      }
    });
  },
  getChannelSearch: function(text) {
    this.setState({channelName: text});
    sendbird.getChannelSearch({
      query: this.state.channelName,
      successFunc : (data) => {
        this.setState({
          channelList: data.channels,
        });
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.state.channelList),
          page: data.page,
          next: data.next
        });
      },
      errorFunc: (status, error) => {
        console.log(status, error);
      }
    });
  },
  onBackPress: function() {
    this.props.navigator.pop();
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  searchContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#abb8c4',
    marginTop: 5,
    height: 60,
  },
  searchIcon: {
    width: 20,
    height: 20
  },
  input: {
    width: 220,
    color: '#555555',
    padding: 5,
    height: 40,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
  listContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 10
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
  channelIcon: {
    width: 30,
    height: 30
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  titleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#60768b',
  },
  memberLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#abb8c4',
  }
});
