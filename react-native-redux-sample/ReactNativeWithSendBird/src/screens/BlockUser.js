import React, { Component } from 'react';
import { View, ListView, Text, TouchableHighlight, Alert } from 'react-native';
import { connect } from 'react-redux';
import { initBlockUser, getBlockUserList, onUnblockUserPress } from '../actions';
import { Button, Spinner, ListItem, Avatar } from '../components';
import { sbCreateBlockedUserListQuery } from '../sendbirdActions';

class BlockUser extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: 'Block Users',
            headerLeft: (
                <Button 
                    containerViewStyle={{marginLeft: 0, marginRight: 0}}
                    buttonStyle={{paddingLeft: 14}}
                    icon={{ name: 'chevron-left', type: 'font-awesome', color: '#7d62d9', size: 18 }}
                    backgroundColor='transparent'
                    onPress={ () => navigation.goBack() }
                />
            )
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            blockedUserListQuery: null,
            list: [],
            blockUserList: ds.cloneWithRows([])
        }
    }

    componentDidMount() {
        this._initBlockUser();
    }

    componentWillReceiveProps(props) {
        const { list, unblockedUserId } = props;
        
        if (list !== this.props.list) {        
            const newList = [...this.state.list, ...list];
            this.setState({ isLoading: false, list: newList, blockUserList: ds.cloneWithRows(newList) });
        }

        if (unblockedUserId !== this.props.unblockedUserId) {
            const newList = this.state.list.filter((user) => {
                return user.userId !== unblockedUserId;
            });
            this.setState({ isLoading: false, list: newList, blockUserList: ds.cloneWithRows(newList) });
        }
    }

    _initBlockUser = () => {
        this.props.initBlockUser();
        this._getBlockUserList(true);
    }

    _onUnblockUserPress = (unblockUserId) => {
        Alert.alert(
            'User Unblock',
            'Are you sure want to unblock user?',
            [
                {text: 'Cancel'},
                {
                    text: 'OK', onPress: () => {
                        this.setState({ isLoading: true });
                        this.props.onUnblockUserPress(unblockUserId)
                    }
                },
            ]
        )
    }

    _getBlockUserList = (init) => {
        if (!init && !this.props.blockedUserListQuery) {
            return;
        }
        this.setState({ isLoading: true }, () => {
            if (init) {
                const blockedUserListQuery = sbCreateBlockedUserListQuery()
                this.setState({ blockedUserListQuery }, () => {
                    this.props.getBlockUserList(this.state.blockedUserListQuery);
                });
            } else {
                this.props.getBlockUserList(this.state.blockedUserListQuery);
            }
        })
    }
    
    _renderList = (rowData) => {
        return (
            <ListItem
                key={rowData.userId}
                component={TouchableHighlight}
                containerStyle={{backgroundColor: '#fff'}}
                avatar={(
                    <Avatar 
                        rounded
                        source={rowData.profileUrl ? {uri: rowData.profileUrl} : require('../img/icon_sb_68.png')} 
                    />
                )}
                title={rowData.nickname}
                titleStyle={{fontWeight: '500', fontSize: 16}}
                rightTitle={rowData.isOnline}
                rightTitleStyle={{color: '#37b24d'}}
                rightIcon={<Text></Text>}
                onPress={() => this._onUnblockUserPress(rowData.userId)}
            />
        )
    }

    render() {
        return (
            <View>
                <Spinner visible={this.state.isLoading} />
                <ListView
                    enableEmptySections={true}
                    renderRow={this._renderList}
                    dataSource={this.state.blockUserList}
                    onEndReached={() => this._getBlockUserList(false)}
                    onEndReachedThreshold={-100}
                />
            </View>
        )
    }
}

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
})

function mapStateToProps({ blockUser }) {
    const { list, unblockedUserId } = blockUser;
    return { list, unblockedUserId };
}

export default connect(
    mapStateToProps, { initBlockUser, getBlockUserList, onUnblockUserPress }
)(BlockUser);
