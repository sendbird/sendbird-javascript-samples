import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { CachedImage } from 'react-native-cached-image';

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

export { TextItem, FileItem, ImageItem };
