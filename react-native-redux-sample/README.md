# Sample JavaScript React-Native Redux

React-Native sample using [SendBird SDK](https://github.com/smilefam/SendBird-SDK-JavaScript).
Redux pattern is applied to the project.

## How to run the sample

> Make sure that you have installed Node.js 6.x or above.

1. Install React Native CLI (if not installed)

        npm install -g react-native-cli

2. Install package

        npm install

3. Start sample.

        react-native run-android
        react-native run-ios

## FAQ

Q. **How to attach push notification using SendBird?**

A. This sample uses **[react-native-push-notification](https://github.com/zo0r/react-native-push-notification)** plugin. Firstly you can follow the instructions for proper plugin setup (both Android and iOS). Then SendBird SDK requires more treaks on the code to handle the push notification.

In your Application component, SendBird should figure out whether it's foreground or background for connection management. The following code does it using AppState event listener.

```javascript
import { AppState } from 'react-native';

/// abbrev.

const sb = null;
class App extends Component {
        _handleAppStateChange = (currentAppState) => {
                if (currentAppState === 'active') {
                        if(sb) {
                                sb.setForegroundState();
                        }
                } else if (currentAppState === 'background') {
                        if(sb) {
                                sb.setBackgroundState();
                        }
                }
        }
        componentDidMount() {
                AppState.addEventListener('change', this._handleAppStateChange);
        }
        componentWillUnmount() {
                AppState.removeEventListener('change', this._handleAppStateChange);
        }
        render() {
                return ...
        }
}
```

Registering device token (named registrationId in iOS and pushToken in Android) into SendBird SDK is essential to receive push notification. In PushNotification.configure(...), you can see onRegister callback. Put the following code to register device token.

```javascript
import { Platform } from 'react-native';

/// abbrev.

const sb = new SendBird({ 'appId': APP_ID });
PushNotification.configure({
        onRegister: function(token) {
                if (Platform.OS === 'ios') {
                        sb.registerAPNSPushTokenForCurrentUser(token['token'], function(result, error) {
                        });
                } else {
                        sb.registerGCMPushTokenForCurrentUser(token['token'], function(result, error) {
                        });
                }
        },
        onNotification: function(notification) {
                // TODO: put some code to handle notification data
        },
        ...
```

For payload control, you can get the notification data in onNotification callback. You'd like to put some code into it. You can see an example in React Native sample, and github for push notification plugin as well.

Q. **What if push notification is not coming anyway?**

A. Check that the app is foreground or alive in background. GCM doesn't show notification when the app is in activated state. If it's not the case, check that you have multiple devices for the same user account. GCM message arrives only at one device for a single device token.