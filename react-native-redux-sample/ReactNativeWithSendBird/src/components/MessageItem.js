import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Clipboard } from 'react-native';
import { Icon } from 'react-native-elements';
import { CachedImage } from 'react-native-cached-image';
import Sound from 'react-native-sound';

const TextItem = (props) => {
    return (
        <View style={{}}>
            <Text style={{fontSize: 12, color: props.isUser ? '#fff' : '#000'}}>{props.message}</Text>
        </View>
    )
}

class FileItem extends Component {
    constructor(props) {
        super(props);
    }

    _renderMessage() {
        if (this.props.message.length > 13) {
            return this.props.message.substring(0, 10) + '...';
        } 
        return this.props.message;
    }

    render() {
        return (
            <View style={{flexDirection: 'row'}}>
                <Icon
                    containerStyle={{marginLeft: 0}}
                    iconStyle={{margin: 0, padding: 0}}
                    name='file'
                    type='font-awesome'
                    color={this.props.isUser ? '#fff' : '#000'}
                    size={16}
                />
                <Text style={{marginLeft: 8}}>{ this._renderMessage() }</Text>
            </View>
        )
    }
}

class AudioItem extends Component {
    state = {
        isPlaying: false
    }

    componentDidMount() {
        Clipboard.setString(this.props.message);
        this._sound = new Sound(this.props.message, '', (error) => {
            if (error) {
                alert('failed to load the sound' + error);
            }
        });
    }

    _play = () => {
        this.setState({ isPlaying: true });
        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.

        setTimeout(() => {
          this._sound.play((success) => {
            if (success) {
                this.setState({ isPlaying: false })
            } else {
              alert('playback failed due to audio decoding errors');
            }
          });
        }, 300);
    }

    _onIconPress = () => {
        this._play();
    }

    render() {
        return (
            <TouchableOpacity onPress={this._onIconPress}>
                <View style={{flexDirection: 'row'}}>
                    <Icon
                        containerStyle={{marginLeft: 0}}
                        iconStyle={{margin: 0, padding: 0}}
                        name={this.state.isPlaying ? 'stop' :  'play-circle-filled'}
                        type='material-icons'
                        color={'#ffffff'}
                        size={24}
                    />
                    <Text style={{marginLeft: 8}}>{this.state.isPlaying ? 'playing...' :  'Play'}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

class ImageItem extends Component {
    constructor(props) {
        super(props);
        this.props.isMounted = false;
        this.state = {
            width: 100,
            height: 100
        }
    }

    componentDidMount() {
        this.props.isMounted = true;
        Image.getSize(this.props.message, (width, height) => {
            const { resizeWidth, resizeHeight } = this._imageResize(width, height);
            if(this.props.isMounted)
                this.setState({width: resizeWidth, height: resizeHeight});
        });
    }
    componentWillUnmount() {
        this.props.isMounted = false;
    }

    _imageResize = (width, height) => {
        const IMAGE_MAX_SIZE = 160;
        const scaleWidth = IMAGE_MAX_SIZE / width;
        const scaleHeight = IMAGE_MAX_SIZE / height;
    
        let scale = (scaleWidth <= scaleHeight) ? scaleWidth : scaleHeight;
        if (scale > 1) {
            scale = 1;
        }
    
        const resizeWidth = (width * scale);
        const resizeHeight = (height * scale);
        return { 'resizeWidth': resizeWidth, 'resizeHeight': resizeHeight };
    }

    render() {
        return (
            <View style={{}}>
                <CachedImage 
                    style={{width: this.state.width, height: this.state.height}} 
                    source={{ uri: this.props.message }} 
                    resizeMode='contain'
                />
            </View>
        )
    }
}

const styles = {

}

export { AudioItem, TextItem, FileItem, ImageItem };
