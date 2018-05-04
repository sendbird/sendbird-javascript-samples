import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { 
    createOpenChannel, 
    initOpenChannelCreate, 
    addOpenChannelItem, 
    openChannelProgress,
    onOpenChannelPress, 
} from '../actions';
import { Button, Input, Spinner, FormValidationMessage } from '../components';
import SendBird from 'sendbird';

class OpenChannelCreate extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: 'Open Channel Create',
            headerLeft: (
                <Button 
                    containerViewStyle={{marginLeft: 0, marginRight: 0}}
                    buttonStyle={{paddingLeft: 14}}
                    icon={{ name: 'chevron-left', type: 'font-awesome', color: '#7d62d9', size: 18 }}
                    backgroundColor='transparent'
                    onPress={ () => navigation.goBack() }
                />
            ),
            headerRight: (
                <Button 
                    containerViewStyle={{marginLeft: 0, marginRight: 0}}
                    buttonStyle={{paddingRight: 14}}
                    color={'#7d62d9'}
                    title='create'
                    backgroundColor='transparent'
                    onPress={ () => { params.handleHeaderRight() } }
                />
            )
        }
    }

    constructor(props) {
        super(props);
        this.state = { 
            isLoading: false, 
            channelName: '' 
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleHeaderRight: this._onCreateButtonPress });
        this.props.initOpenChannelCreate();
    }

    componentWillReceiveProps(props) {
        const { channel, error } = props;
        
        if (channel) {
            this.props.openChannelProgress(true);
            this.setState({ isLoading: false }, () => {
                this.props.addOpenChannelItem(channel);
                this.props.navigation.goBack();
                this.props.onOpenChannelPress(channel.url);
            });
        }

        if (error) {
            this.setState({ isLoading: false });
        }
    }

    _onOpenChannelNameChanged = (channelName) => {
        this.setState({ channelName });
    }

    _onCreateButtonPress = () => {
        const { channelName } = this.state;
        this.setState({ isLoading: true }, () => {
            this.props.createOpenChannel(channelName);
        });
    }

    render() {
        return (
            <View style={{backgroundColor: '#fff', flex: 1}}>
                <Spinner visible={this.state.isLoading} />
                <View style={{margin: 14, marginTop: 100}}>
                    <Input 
                        maxLength={12}
                        label='Channel Name'
                        value={this.state.channelName}
                        onChangeText={this._onOpenChannelNameChanged}
                    />
                </View>
                <FormValidationMessage labelStyle={{marginLeft: 14}}>
                    {this.props.error}
                </FormValidationMessage>
            </View>
        )
    }
}

function mapStateToProps({ openChannelCreate }) {
    const { error, channel } = openChannelCreate;
    return { error, channel };
}

export default connect(
    mapStateToProps, 
    { 
        createOpenChannel,
        initOpenChannelCreate,
        addOpenChannelItem,
        openChannelProgress,
        onOpenChannelPress,
    }
)(OpenChannelCreate);
