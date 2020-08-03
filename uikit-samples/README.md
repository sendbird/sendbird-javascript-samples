# UIKIT Samples

Find the code samples for UIKIT react in the sub directories

* simple-react-app - Most simple usecase using <App /> component
* composed-react-app - A chat application combining various smart components
* custom-react-app - An example with custom Message, ChannelPreview and UserList examples

## Sendbird UIKIT React

Find the docs at: https://docs.sendbird.com/javascript/ui_kit_getting_started


## Customized Samples

These samples show how to use and customize Sendbird UIKit. They are integrated in [codesandbox](https://codesandbox.io).<br />
And [Material UI](https://material-ui.com/) is used for custom components.

You have to set your own APP_ID, USER_ID, and NICKNAME in `const.js` in each example to make them work.<br />
And there are some commented links in the samples. They will be usefull for reference.


### 1-1) Using Sendbird App
##### [[View in codesandbox](https://codesandbox.io/s/1-1-using-sendbird-app-9xum5)]

You can see how to use `App` component in this sample.


### 1-2) Basic format of Sendbird UIkit Customization
##### [[View in codesandbox](https://codesandbox.io/s/1-2-customization-basic-format-q4e6c)]

You can see a basic format for customizing in this sample.


> Note: Imported as different name to origin
```js
import {
  Channel as SBConversation,
  ChannelList as SBChannelList,
  ChannelSettings as SBChannelSettings,
} from 'sendbird-uikit'
```


### 2-1) Customizing MessageItem
##### [[View in codesandbox](https://codesandbox.io/s/2-1-customizing-messageitem-0nop5?file=)]

You can see how to customize message item of the `Channel` component in this sample.

#### App.js
If you enable the toggle button, you can see that the message item customization is applied.

#### CustomizedApp.js
You can see a `renderChatItem` prop of the `Channel`(SBConversation) component.<br />
Set a function returning customized message item. You can get these function parameters.
```js
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

#### CustomizedMessageItems
Make your own customized message item components here.


### 2-2) Customizing MessageListParams
##### [[View in codesandbox](https://codesandbox.io/s/2-2-customizing-messagelistparams-45573)]

You can see how to customize message list of the `Channel` component in this sample.

#### App.js
If you enable the toggle button, you can see that the message list customization are applied.<br />
You will see only the messages that you sent

#### CustomizedApp.js
You can see a `queries` prop of the `Channel`(SBConversation) component.

```js
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

> Use object json type input, don't create sendbird message list params instance

MessageListParams
* [Sendbird API Reference](https://sendbird.github.io/core-sdk-javascript/module-model_params_messageListParams-MessageListParams.html)
* [GitHub SendBird.d.ts](https://github.com/sendbird/SendBird-SDK-JavaScript/blob/master/SendBird.d.ts#L488)


### 2-3) Customizing MessageParams
##### [[View in codesandbox](https://codesandbox.io/s/2-3-customizing-messageparams-phqii)]

You can see how to customize message params through props of the `Channel` component in this sample.

#### App.js
If you enable the toggle button, you can send or update as a highlighted message.

#### CustomizedApp.js
You can see the used props.
```js
<Channel
  onBeforeSendUserMessage={(text) => {}}
  onBeforeSendFileMessage={(file) => {}}
  onBeforeUpdateUserMessage={handleUpdateUserMessage}
>
```
You should return `UserMessageParams` and `FileMessageParams` *instance* in each functions.
```js
const handleUpdateUserMessage = (text) => {
  const userMessageParams = new sdk.UserMessageParams();
  userMessageParams.message = text;
  return userMessageParams;
}
```

UserMessageParams
* [Sendbird API Reference](https://sendbird.github.io/core-sdk-javascript/module-model_params_userMessageParams-UserMessageParams.html)
* [GitHub SendBird.d.ts](https://github.com/sendbird/SendBird-SDK-JavaScript/blob/master/SendBird.d.ts#L407)

FileMessageParams
* [Sendbird API Reference](https://sendbird.github.io/core-sdk-javascript/module-model_params_fileMessageParams-FileMessageParams.html)
* [GitHub SendBird.d.ts](https://github.com/sendbird/SendBird-SDK-JavaScript/blob/master/SendBird.d.ts#L440)

#### CustomizedMessageItems
If the customType of message is `highlight`, show background color with yellow.


### 2-4) Customizing ChatHeader
##### [[View in codesandbox](https://codesandbox.io/s/2-4-customizing-chatheader-voi0z)]

You can see how to customize chat header of the `Channel` component in this sample.

#### App.js
If you enable the toggle button, you can see that the chat header customization is applied.

#### CustomizedApp.js
You can see a `renderChatHeader` prop of the `Channel`(SBConversation) component.<br />
Set a function returning customized chat header. You can get channel and user instance as function parameters.

```js
<Channel
  renderChatHeader={({ channel, user }) => (
    <CustomizedHeader />
  )}
>
```

#### CustomizedHeader.js
Make your own customized chat header component here.


### 2-5) Customizing MessageInput
##### [[View in codesandbox](https://codesandbox.io/s/2-5-customizing-chatinput-wgi9d)]

You can see how to customize message input of the `Channel` component in this sample.

#### App.js
If you enable the toggle button, you can see that the message input customization is applied.

#### CustomizedApp.js
You can see a `renderMessageInput` prop of the `Channel`(SBConversation) component.<br />
Set a function returning customized message input. You can get channel, user, and disabled values as function parameters.

```js
<Channel
  renderMessageInput={({ channel, user, disabled }) => (
    <CustomizedMessageInput />
  )}
>
```

#### CustomizedMessageInput.js
Make your own customized message input component here.


### 3-1) Customizing ChannelPreviewItem
##### [[View in codesandbox](https://codesandbox.io/s/3-1-customizing-channelpreviewitem-ycsvs)]

You can see how to customize channel preview item of the `ChannelList` component in this sample.

#### App.js
If you enable the toggle button, you can see that the channel preview item customization is applied.

#### CustomizedApp.js
You can see a `renderChannelPreview` prop of the `ChannelList`(SBChannelList) component.<br />
Set a function returning customized channel preview item. You can get channel and onLeaveChannel as function parameters.

```js
<ChannelList
  renderChannelPreview={({ channel, onLeaveChannel }) => (
    <CustomizedChannelPreviewItem />
  )}
>
```

#### CustomizedChannelPreviewItem.js
Make your own customized channel preview item component here.<br />
You can use the `onLeaveChannel` function in the component.
```js
function CustomizedChannelPreviewItem(props) {
  const { channel, onLeaveChannel } = props;

  ...
  onLeaveChannel(channel);
}
```

### 3-2) Customizing ChannelListQuery
##### [[View in codesandbox](https://codesandbox.io/s/3-2-customizing-channellistquery-z2y89?file=)]

You can see how to customize channel list query of the `ChannelList` component in this sample.

#### App.js
If you enable the toggle button, you can see that the channel list customization is applied.
You will ses the empty channels(means created channel but it has no message sent by user).

#### CustomizedApp.js
You can see a `queries` prop of the `ChannelList`(SBChannelList) component.

```js
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

> Use object json type input, don't create sendbird query

ChannelListQuery
* [Sendbird API Reference](https://sendbird.github.io/core-sdk-javascript/module-model_query_groupChannelListQuery-GroupChannelListQuery.html)
* [GitHub SendBird.d.ts](https://github.com/sendbird/SendBird-SDK-JavaScript/blob/master/SendBird.d.ts#L1764)

ApplicationUserListQuery
* [Sendbird API Reference](https://sendbird.github.io/core-sdk-javascript/module-model_query_applicationUserListQuery-ApplicationUserListQuery.html)
* [GitHub SendBird.d.ts](https://github.com/sendbird/SendBird-SDK-JavaScript/blob/master/SendBird.d.ts#L1313)


### 3-3) Customizing ChannelParams
##### [[View in codesandbox](https://codesandbox.io/s/3-3-customizing-channellist-sg9kx)]

You can see how to customize channel preview item of the `ChannelList` component in this sample.

#### App.js
If you enable the toggle button, you can create channel using GroupChannelParams.

#### CustomizedApp.js
You can see this prop.
```js
<ChannelList
  onBeforeCreateChannel={handleOnBeforeCreateChannel}
>
```
You can get array of selectredUsers as a function parameter.<br />
And you should return `GroupChannelParams` *instance* in the function.
```js
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

GroupChannelParams
* [Sendbird API Reference](https://sendbird.github.io/core-sdk-javascript/module-model_params_groupChannelParams-GroupChannelParams.html)
* [GitHub SendBird.d.ts](https://github.com/sendbird/SendBird-SDK-JavaScript/blob/master/SendBird.d.ts#L1448)

#### CustomizedChannelPreviewItem.js
If the customType of channel is `highlight`, show background color with yellow.
