# Sendbird UIKit for React samples
![Platform](https://img.shields.io/badge/platform-JAVASCRIPT-orange.svg)
![Languages](https://img.shields.io/badge/language-JAVASCRIPT-orange.svg)
[![npm](https://img.shields.io/npm/v/sendbird.svg?style=popout&colorB=red)](https://www.npmjs.com/package/sendbird)

Sendbird UIKit for React is a development kit with an user interface that enables an easy and fast integration of standard chat features into new or existing client apps. Here are three UIKit samples for React in the submodules.

* **simple-react-app** is a chat app which is comprised of UIKit’s most essential components.
* **composed-react-app** is a chat app which contains various smart components.
* **custom-react-app** is a chat app which contains customizable sample codes for **Message**, **ChannelPreview**, and **UserList**. 

### More about Sendbird UIKit for React

Find out more about Sendbird UIKit for React at [UIKit for React doc](https://sendbird.com/docs/uikit/v1/javascript/getting-started/about-uikit). If you need any help in resolving any issues or have questions, visit [our community](https://community.sendbird.com).

<br />

## UIKit components and ways to customize
These samples are here to help you better understand UIKit for React by going over the core components and ways to customize. On each core component sample, there is an attached CodeSandbox link in which you can see the sample codes and alter them to see how the changes are rendered.

<br />

## Before getting started

This section shows you what you need for testing Sendbird UIKit sample app for React sample app.

### Requirements

The minimum requirements for UIKit for React are:

- React 16.8.0+
- React DOM 16.8.0+
- Sendbird Chat SDK for JavaScript 3.0.115+
- css-vars-ponyfill 2.3.2
- date-fns 2.16.1

### Implement Chat with App component

The `App` component is a collection of all UIKit components you need to implement chat. This is included in all core component samples, so be sure to set your own APP_ID, USER_ID, and NICKNAME in  `const.js` in each to customize your sample. On the [CodeSandbox](https://codesandbox.io/s/1-1-using-sendbird-app-9xum5) link, you will see that the props of the `App` component refer to use the values of the correspondings of `const.js` for initialization. 

Try setting your own by downloading the Sendbird sample.

```javascript
import { App as SendbirdApp } from 'sendbird-uikit'
```

### Import components to customize UIKit

Here is a list of the essential components that you need to import before you start customizing chat. Note that the names of the components are changed as shown in the code below. 

Try [importing components on CodeSandbox](https://codesandbox.io/s/1-2-customization-basic-format-q4e6c).

```javascript
import {
  Channel as SBConversation,
  ChannelList as SBChannelList,
  ChannelSettings as SBChannelSettings,
} from 'sendbird-uikit'
```

### Referring to CodeSandbox 

Each CodeSandbox sample has `App.js` and `CustomizedApp.js` which operate based on the imported `const.js`. CodeSandbox is a code editor that provides an instant live preview. The preview has two buttons placed at the top center. If you click the left button, you will see unaltered `App.js`. If you click the right button, you will see the customized component from `CustomizedApp.js`, and any changes you make on them applied and rendered on the live preview.

If you would like to get a deeper understanding of how CodeSandbox works, refer to **CustomizedMessageItems**, **CustomizedHeader**, **CustomizedMessageInput**, and **CustomizedChannelPreviewItem** which you can find on corresponding CodeSandbox samples. 

<br />

## Getting Started 

This section explains what you need to know before testing the sample app.

### Message item

The **renderChatItem** is a `ReactElement` prop in the Channel component which you can use to customize `message` by setting a function. This prop provides three arguments: **message**, **onUpdateMessage**, and **onDeleteMessage**. The **message** represents an already sent or received message of an `BaseMessage` object; **onUpdateMessage** and **onDeleteMessage** are callback functions which you can implement with custom code for events related to the corresponding user actions.

Try your [message item on CodeSandbox](https://codesandbox.io/s/2-1-customizing-messageitem-0nop5?file=).

```javascript
<Channel
    renderChatItem={({
        message,
        onDeleteMessage,
        onUpdateMessage,
        onResendMessage,
        emojiContainer,
    }) => {
        <CustomizedMessageItem />
    }}
>
```

> Note: You can try making your own customized message item by using `<CustomizedMessageItem />` on the CodeSandbox sample. 

### Message list params

The **queries.messageListParams** is an `instance` prop in the **channel** component which you can use to retrieve a list of messages by specifying the properties of `MessageListParams`. 

Try your [message list params on CodeSandbox](https://codesandbox.io/s/2-2-customizing-messagelistparams-45573).

> Note: On CodeSandbox’s preview, only the messages you sent will be displayed. 

```javascript
// Pass arguments in JSON data input format to the query instance.
<Channel
    queries={{
        messageListParams: {
            senderUserIds: [USER_ID],
            prevResultSize: 30,
            includeReplies: false,
            includeReactions: false
        }
   }}
>
```

### Message params 

The **onBeforeSendUserMessage**, **onBeforeSendFileMessage**, and **onBeforeUpdateUserMessage** are `callback function` props in the **channel** component. The first two execute additional operations for a user message and a file message respectively; the corresponding modified messages are returned through the **text** and the **file** arguments respectively. The **onBeforeUpdateUserMessage** executes additional operations for a user message before updating it. 

Try your [message params on CodeSandbox](https://codesandbox.io/s/2-3-customizing-messageparams-phqii)

> Note: On the CodeSandbox’s preview, you can send or update a message in highlight.

```javascript
<Channel
    onBeforeSendUserMessage={(text) => {}}
    onBeforeSendFileMessage={(file) => {}}
    onBeforeUpdateUserMessage={handleUpdateUserMessage}
>
```

In order to complete an operation you intend to carry out with each function, you should return `UserMessageParams` and `FileMessageParams` objects.

```javascript
const handleUpdateUserMessage = (text) => {
    const userMessageParams = new sdk.UserMessageParams();
    userMessageParams.message = text;
    return userMessageParams;
}
```

Find out more about `UserMessageParams` and `FileMessageParams` on the [API reference of Sendbird Chat SDK for JavaScript](https://sendbird.github.io/core-sdk-javascript/module-model_params_userMessageParams-UserMessageParams.html).

### Chat header

The **renderChatHeader** is a `ReactElement` prop in the **channel** component which you can use to customize the header of `channel` by setting a function. This prop provides two arguments: **channel** and **user**. The channel refers to a `GroupChannel` object which is a collection of properties necessary to render the current channel view. The **user** refers to a `User` object which represents the current user.

Try your [chat header on CodeSandbox](https://codesandbox.io/s/2-4-customizing-chatheader-voi0z)

```javascript
<Channel
    renderChatHeader={({ channel, user }) => (
        <CustomizedHeader />
    )}
>
```

> Note: You can try making your own customized chat header item by using `<CustomizedHeader />` on the CodeSandbox sample. 

### Message input

The **renderMessageInput** is a `ReactElement` prop in the **Channel** component which allows you to customize the message input by setting a function. This prop provides three arguments: **channel**, **user**, and **disabled**. The **channel** refers to a `GroupChannel` object which is a collection of properties necessary to render the current channel view. The **user** refers to a `User` object which represents the current user. The **disabled** refers to whether to enable the message input box or not.

Try your [message input on CodeSandbox](https://codesandbox.io/s/2-5-customizing-chatinput-wgi9d)


```javascript
<Channel
    renderMessageInput={({ channel, user, disabled }) => (
        <CustomizedMessageInput />
    )}
>
```

> Note: You can try making your own customized message input item by using `<CustomizedMessageInput />` on the CodeSandbox sample. 

### Channel preview item

The **renderChannelPreview** is a `ReactElement` prop in the **ChannelList** component which allows you to customize channel preview by setting a function. This prop provides two arguments: **channel** and **onLeaveChannel**. The **channel** refers to a `GroupChannel` object which is a collection of properties necessary to render the current channel view. The **onLeaveChannel** has a callback function as an argument which can be implemented with custom code for events related to the corresponding user action. 

Try your [channel preview item on CodeSandbox](https://codesandbox.io/s/3-1-customizing-channelpreviewitem-ycsvs)

```javascript
<ChannelList
    renderChannelPreview={({ channel, onLeaveChannel }) => (
        <CustomizedChannelPreviewItem />
    )}
>
```

#### CustomizedChannelPreviewItem.js

You can make your own customized channel preview item component in this file. You can use the **onLeaveChannel** function in the component.

```javascript
function CustomizedChannelPreviewItem(props) {
    const { channel, onLeaveChannel } = props;
    ...
    
    onLeaveChannel(channel);
}
```

> Note: You can try making your own customized channel preview item by using `<CustomizedMessageItem />` and using the **onLeaveChannel** function in the component on the CodeSandbox sample.  

### Channel list query

The **queries.channelListQuery** is an `instance` prop in the **ChannelList** component which filters channels by using its options.  

Try your [channel list query item on CodeSandbox](https://codesandbox.io/s/3-2-customizing-channellistquery-z2y89?file=) 

> Note: On the CodeSandbox’s preview, the empty channels that you see means that the channels are successfully created and there are no messages sent by users.

```javascript
// Pass arguments in JSON data input format to the query instance.
<ChannelList
    queries={{
        channelListQuery: {
            includeEmpty: true,
            limit: 50,
            order: "chronological"
        },
        applicationUserListQuery: {
            limit: 50,
        }
    }}
>
```

Find out more about `ChannelListQuery` and `ApplicationUserListQuery` on the [API reference of Sendbird Chat SDK for JavaScript](https://sendbird.github.io/core-sdk-javascript/module-model_query_groupChannelListQuery-GroupChannelListQuery.html).

### Channel params

The **onBeforeCreateChannel** is a prop of the **ChannelList** component which can be implemented with custom code for events related to the corresponding user actions.

Try your [channel param on CodeSandbox](https://codesandbox.io/s/3-3-customizing-channellist-sg9kx) 

> Note: you can create a channel using `GroupChannelParams`.

```javascript
<ChannelList
    onBeforeCreateChannel={handleOnBeforeCreateChannel}
>
```
You can get an array of **selectedUsers** in a function argument. In order to complete an operation you intend to carry out with the function, you should return a `GroupchannelParams` object after specifying its properties. 

```javascript
const handleOnBeforeCreateChannel = (selectedUsers) => {
    const channelParams = new sdk.GroupChannelParams();
    channelParams.addUserIds(selectedUsers);
    channelParams.name = "Hello Sendbird!!";
    channelParams.overUrl = null;
    channelParams.coverImage = null;
    channelParams.customType = HIGHLIGHT;
    
    return channelParams;
}
```

Find out more about `GroupChannelParams` on the [API reference of Sendbird Chat SDK for JavaScript](https://sendbird.github.io/core-sdk-javascript/module-model_params_groupChannelParams-GroupChannelParams.html).
