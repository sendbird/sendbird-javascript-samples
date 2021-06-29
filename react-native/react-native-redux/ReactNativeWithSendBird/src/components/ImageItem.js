import React, { Component } from 'react';
import { CachedImage } from 'react-native-cached-image';
import { Image, View } from 'react-native';

class ImageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 100,
      height: 100,
      isMounted: false
    };
  }

  componentDidMount() {
    this.setState(
      {
        isMounted: true
      },
      () => {
        Image.getSize(this.props.message, (width, height) => {
          const { resizeWidth, resizeHeight } = this._imageResize(width, height);
          if (this.state.isMounted) this.setState({ width: resizeWidth, height: resizeHeight });
        });
      }
    );
  }
  componentWillUnmount() {
    this.setState({
      isMounted: false
    });
  }

  _imageResize = (width, height) => {
    const IMAGE_MAX_SIZE = 160;
    const scaleWidth = IMAGE_MAX_SIZE / width;
    const scaleHeight = IMAGE_MAX_SIZE / height;

    let scale = scaleWidth <= scaleHeight ? scaleWidth : scaleHeight;
    if (scale > 1) {
      scale = 1;
    }

    const resizeWidth = width * scale;
    const resizeHeight = height * scale;
    return { resizeWidth: resizeWidth, resizeHeight: resizeHeight };
  };

  render() {
    return (
      <View style={{}}>
        <CachedImage
          style={{ width: this.state.width, height: this.state.height }}
          source={{ uri: this.props.message }}
          resizeMode="contain"
        />
      </View>
    );
  }
}

export { ImageItem };
