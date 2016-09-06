import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native'

import ImageButton from './imageButton';

var backIcon = require('../img/btn-back.png');
var addIcon = require('../img/btn-add.png');
var listIcon = require('../img/btn-list.png');

export default class TopBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.leftButton}>
          <ImageButton
            underlayColor={'#4e4273'}
            onPress={this.props.onBackPress}
            imageStyle={styles.imageButton}
            image={backIcon}
          />
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <Text style={styles.titleLabel}>{this.props.title}</Text>
        </View>

        <View style={styles.rightButton}>
          {this._renderButton()}
        </View>
      </View>
    );
  }

  _renderButton() {
    if (this.props.onCreateOpenChannel) {
      return (
        <ImageButton
          underlayColor={'#4e4273'}
          onPress={this.props.onCreateOpenChannel}
          imageStyle={[styles.imageButton, {width: 20, height: 20}]}
          image={addIcon}
        />
      )
    } else if (this.props.onOpenMenu) {
        return (
          <ImageButton
            underlayColor={'#4e4273'}
            onPress={this.props.onOpenMenu}
            imageStyle={[styles.imageButton, {width: 30, height: 30}]}
            image={listIcon}
          />
        )
    } else if (this.props.onGroupChannel) {
      return (
        <ImageButton
          underlayColor={'#4e4273'}
          onPress={this.props.onGroupChannel}
          imageStyle={[styles.imageButton, {width: 30, height: 30}]}
          image={listIcon}
        />
      )
    } else if (this.props.onInvite) {
      return (
        <ImageButton
          underlayColor={'#4e4273'}
          onPress={this.props.onInvite}
          imageStyle={[styles.imageButton, {width: 20, height: 20}]}
          image={addIcon}
        />
      )
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#4e4273',
    paddingTop: 20,
    paddingBottom: 2,
  },
  titleLabel: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 18
  },
  leftButton: {
    justifyContent: 'flex-start',
    paddingLeft: 5
  },
  rightButton: {
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  imageButton: {
    width: 30,
    height: 30
  }
});
