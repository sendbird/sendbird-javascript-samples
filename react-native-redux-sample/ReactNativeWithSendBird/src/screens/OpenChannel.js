import React, { Component } from 'react';
import { View, ListView, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { 
    initOpenChannel,
    getOpenChannelList,
    onOpenChannelPress,
    clearCreatedOpenChannel,
    clearSeletedOpenChannel,
    openChannelProgress
} from '../actions'
import { 
    Button, 
    ListItem, 
    Avatar, 
    Spinner 
} from '../components';
import { sbCreateOpenChannelListQuery } from '../sendbirdActions';

class OpenChannel extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: 'Open Channel',
            headerLeft: (
                <Button 
                    containerViewStyle={{marginLeft: 0, marginRight: 0}}
                    buttonStyle={{paddingLeft: 14}}
                    icon={{ name: 'chevron-left', type: 'font-awesome', color: '#7d62d9', size: 14 }}
                    backgroundColor='transparent'
                    onPress={ () => navigation.goBack() }
                />
            ),
            headerRight: (
                <Button 
                    containerViewStyle={{marginLeft: 0, marginRight: 0}}
                    buttonStyle={{paddingRight: 14}}
                    iconRight={{ name: 'plus', type: 'font-awesome', color: '#7d62d9', size: 14 }}
                    backgroundColor='transparent'
                    onPress={ () => { navigation.navigate('OpenChannelCreate') } }
                />
            )
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            enterChannel: false,
            openChannelListQuery: null,
            list: [],
            openChannelList: ds.cloneWithRows([])
        }
    }

    componentDidMount() {
        this._initOpenChannelList();
    }

    componentWillReceiveProps(props) {
        const { list, channel, createdChannel } = props;
    
        if (list !== this.props.list) {
            if (list.length === 0) {
                this.setState({ list: [], openChannelList: ds.cloneWithRows([]) });    
            } else {
                const newList = [...this.state.list, ...list];
                this.setState({ list: newList, openChannelList: ds.cloneWithRows(newList) });
            }
        }
        
        if (createdChannel) {
            const newList = [...[createdChannel], ...this.state.list];
            this.setState({ list: newList, openChannelList: ds.cloneWithRows(newList) }, () => {
                this.props.clearCreatedOpenChannel();
            });
        }

        if (channel) {
            this.props.clearSeletedOpenChannel();

            this.props.navigation.navigate(
                'Chat', 
                { 
                    channelUrl: channel.url, 
                    title: channel.name, 
                    memberCount: channel.participantCount,
                    isOpenChannel: channel.isOpenChannel(),
                    _initListState: this._initEnterState
                }
            );
        }
    }

    _initEnterState = () => {
        this.setState({ enterChannel: false });
    }

    _initOpenChannelList = () => {
        this.props.initOpenChannel();
        this._getOpenChannelList(true);
    }

    _getOpenChannelList = (init) => {
        this.props.openChannelProgress(true);
        if (init) {
            const openChannelListQuery = sbCreateOpenChannelListQuery();
            this.setState({ openChannelListQuery }, () => {
                this.props.getOpenChannelList(this.state.openChannelListQuery);        
            });
        } else {
            this.props.getOpenChannelList(this.state.openChannelListQuery);
        }
    }
    
    _onListItemPress = (channelUrl) => {
        if (!this.state.enterChannel) {
            this.setState({ enterChannel: true }, () => {
                this.props.onOpenChannelPress(channelUrl);
            })
        }
    }

    _handleScroll = (e) => {
        if (e.nativeEvent.contentOffset.y < -100 && !this.props.isLoading) {
            this._initOpenChannelList();
        }
    }
    
    _renderList = (rowData) => {
        return (
            <ListItem
                component={TouchableHighlight}
                containerStyle={{backgroundColor: '#fff'}}
                key={rowData.url}
                avatar={(
                    <Avatar 
                        source={rowData.coverUrl ? {uri: rowData.coverUrl} : require('../img/icon_sb_68.png')} 
                    />
                )}
                title={rowData.name.length > 30 ? rowData.name.substring(0, 26) + '...' : rowData.name}
                titleStyle={{fontWeight: '500', fontSize: 16}}
                subtitle={rowData.participantCount + ' Participant'}
                subtitleStyle={{fontWeight: '300', fontSize: 11}}
                onPress={ () => this._onListItemPress(rowData.url) }
            />
        )
    }

    render() {
        return (
            <View>
                <Spinner visible={this.props.isLoading} />
                <ListView
                    enableEmptySections={true}
                    renderRow={this._renderList}
                    dataSource={this.state.openChannelList}
                    onEndReached={() => this._getOpenChannelList(false)}
                    onEndReachedThreshold={-50}
                    onScroll={this._handleScroll}
                />
            </View>
        )
    }
}

const styles = {
};

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

function mapStateToProps({ openChannel })  {
    const { isLoading, list, createdChannel, channel } = openChannel;
    return { isLoading, list, createdChannel, channel };
}

export default connect(
    mapStateToProps,
    { 
        initOpenChannel,
        getOpenChannelList,
        onOpenChannelPress,
        clearCreatedOpenChannel,
        clearSeletedOpenChannel,
        openChannelProgress
    }
)(OpenChannel);
