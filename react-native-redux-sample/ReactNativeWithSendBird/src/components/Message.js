import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { MessageAvatar } from './MessageAvatar';
import { MessageContainer } from './MessageContainer';

class Message extends Component {
    constructor(props) {
        super(props);
    }

    _renderMessageAvatar = () => {
        return this.props.isUser ? null : (
            <MessageAvatar 
                isShow={this.props.isShow}
                uri={this.props.profileUrl}
                onPress={this.props.onPress}
            />
        )
    }

    render() {
        return (
             <View style={styles.messageViewStyle}>
                <View style={{flexDirection: this.props.isUser ? 'row-reverse' : 'row', paddingLeft: 14, paddingRight: 14, paddingTop: 4}}>
                    { this._renderMessageAvatar() }
                    <MessageContainer 
                        isShow={this.props.isShow}
                        isUser={this.props.isUser}
                        nickname={this.props.nickname}
                        message={this.props.message}
                        time={this.props.time}
                        readCount={this.props.readCount}
                    />
                </View>
            </View>
        )
    }
}

const AdminMessage = (props) => {
    return (
        <View style={[
                styles.messageViewStyle, 
                {
                    padding: 8, 
                    marginTop: 8, 
                    marginBottom: 8, 
                    marginLeft: 14,
                    marginRight: 14,
                    backgroundColor: '#e6e9f0'
                },
            ]}>
            <Text>{ props.message }</Text>
        </View>
    )
}

const styles = {
    messageViewStyle: {
        transform: [{ scaleY: -1 }]
    }
};

export { Message, AdminMessage };
