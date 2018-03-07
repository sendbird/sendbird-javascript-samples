import React, { Component } from 'react';
import { TextInput, ScrollView } from 'react-native';
//import TextField from 'react-native-md-textinput';

class Input extends Component {
    render() {
        const { label, value, maxLength, onChangeText } = this.props;
        return (
            <ScrollView>
                <TextInput
                    textFocusColor={'#7d62d9'}
                    textBlurColor={'#000'}
                    highlightColor={'#7d62d9'}
                    borderColor={'#d9d9d9'}
                    keyboardType={'default'}
                    autoCapitalize='none'
                    duration={100}
                    autoCorrect={false}
                    label={label}
                    value={value}
                    maxLength={maxLength}
                    onChangeText={onChangeText}
                />
            </ScrollView>
        )
    }

}

export { Input };
