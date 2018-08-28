import React from 'react';
import { View, Text, TextInput, Dimensions, Platform } from 'react-native';
import { Icon } from 'react-native-elements';

const { width } = Dimensions.get('window');

const MessageInput = (props) => (
    <View style={styles.containerStyle}>
        <Icon
            containerStyle={styles.iconContainerStyle}
            iconStyle={styles.iconStyle}
            name='plus'
            type='font-awesome'
            color={'#494e57'}
            size={20}
            onPress={props.onLeftPress}
        />
        <Icon
            containerStyle={styles.iconContainerStyle}
            iconStyle={styles.iconStyle}
            name='image'
            type='material-community-icons'
            color={'#494e57'}
            size={20}
            onPress={props.onImageIconPress}
        />
        <Icon
            containerStyle={styles.iconContainerStyle}
            iconStyle={styles.iconStyle}
            name={props.isRecording ? 'stop' : 'microphone'}
            type={'foundation'}
            color={props.isRecording ? 'red' : '#494e57'}
            size={20}
            onPress={props.onAudioIconPress}
        />
        <View style={styles.inputViewStyle}>
            { props.isRecording
            ?   <Text style={styles.recordingTextStyle}>
                    {'is recording..'}
                </Text>
            :   <TextInput
                    style={styles.inputStyle}
                    placeholder={'Your message'}
                    autoCapitalize='none'
                    autoCorrect={false}
                    selectionColor={'#212529'}
                    underlineColorAndroid='transparent'
                    value={props.textMessage}
                    onChangeText={props.onChangeText}
                    onSubmitEditing={props.onSubmitEditing}
                />
            }
        </View>
        <Icon
            containerStyle={{marginLeft: 0}}
            iconStyle={{margin: 0, padding: 0}}
            name='send'
            type='material-icons'
            color={props.textMessage.length > 0 ? '#7d62d9' : '#494e57'}
            size={20}
            onPress={props.onRightPress}
        />
    </View>
    );

const styles = {
    containerStyle: {
        flexDirection: 'row',
        backgroundColor:'#fff'
    },
    iconContainerStyle: {
        margin: 10
    },
    iconStyle: {
        margin: 0,
        padding: 0
    },
    recordingTextStyle: {
        justifyContent: 'center',
        fontSize: 12,
        color: 'grey',
        minHeight: 36,
        width: width - ( 50 * 3)
    },
    inputViewStyle: {
        paddingLeft: 8,
        paddingRight: 8
    },
    inputStyle: {
        color: '#212529',
        ...Platform.select({
            android: {
                minHeight: 36,
                width: width - ( 50 * 3)
            },
            ios: {
                minHeight: 36,
                width: width - ( 50 * 3)
            },
        })
    }
}

export { MessageInput }
