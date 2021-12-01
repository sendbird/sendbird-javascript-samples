const sendbird = new SendBird({ appId: APP_ID });

const options = new SendBirdSyncManager.Options();
options.messageCollectionCapacity = MESSAGE_COLLECTION_CAPACITY;
options.messageResendPolicy = MESSAGE_RESEND_POLICY;
options.automaticMessageResendRetryCount = AUTOMATIC_MESSAGE_RESEND_RETRY_COUNT;
options.maxFailedMessageCountPerChannel = MAX_FAILED_MESSAGE_COUNT_PER_CHANNEL;
options.failedMessageRetentionDays = FAILED_MESSAGE_RETENTION_DAYS;

SendBirdSyncManager.sendbird = sendbird;
SendBirdSyncManager.setup(USER_ID, options, () => {
  sendbird.setErrorFirstCallback(true);
  sendbird
    .connect(USER_ID)
    .then(user => {
      // Do something...
    })
    .catch(error => {
      // Handle error.
    });
});

const sendbird = new SendBird({ appId: APP_ID, localCacheEnabled: true });
sendbird.setErrorFirstCallback(true);
sendbird
  .connect(USER_ID)
  .then(user => {
    // Do something...
  })
  .catch(error => {
    // Handle error.
  });

const myGroupChannelListQuery = sendbird.GroupChannel.createMyGroupChannelListQuery();
myGroupChannelListQuery.includeEmpty = INCLUDE_EMPTY;
myGroupChannelListQuery.order = ORDER;
myGroupChannelListQuery.limit = LIMIT;

const channelCollection = new SendBirdSyncManager.ChannelCollection(myGroupChannelListQuery);

const groupChannelFilter = new sendbird.GroupChannelFilter();
groupChannelFilter.includeEmpty = INCLUDE_EMPTY;

const groupChannelCollection = sendbird.GroupChannel.createGroupChannelCollection()
  .setOrder(ORDER)
  .setFilter(FILTER)
  .setLimit(LIMIT)
  .build();

const collectionHandler = new SendBirdSyncManager.ChannelCollection.CollectionHandler();
collectionHandler.onChannelEvent = (action, channels) => {
  switch (action) {
    case 'insert':
      // Do something...
      break;
    case 'update':
      // Do something...
      break;
    case 'move':
      // Do something...
      break;
    case 'remove':
      // Do something...
      break;
    case 'clear':
      // Do something...
      break;
  }
};
channelCollection.setCollectionHandler(collectionHandler);

channelCollection.setGroupChannelCollectionHandler({
  onChannelsAdded: (context, channels) => {
    // Do something...
  },
  onChannelsUpdated: (context, channels) => {
    // Do something...
  },
  onChannelsDeleted: (context, channelUrls) => {
    // Do something...
  }
});

channelCollection.fetch(() => {
  // Do something...
});

if (groupChannelCollection.hasMore) {
  groupChannelCollection
    .loadMore()
    .then(channels => {
      // Do something...
    })
    .catch(error => {
      // Handle error.
    });
}

channelCollection.setCollectionHandler(null);
channelCollection.remove();

groupChannelCollection.dispose();

const messageFilter = {
  messageTypeFilter: MESSAGE_TYPE_FILTER
};
const messageCollection = new SendBirdSyncManager.MessageCollection(channel, messageFilter, STARTING_POINT);
messageCollection.limit = LIMIT;

const messageFilter = new sendbird.MessageFilter();
messageFilter.messageType = MESSAGE_TYPE;
const messageCollection = channel
  .createMessageCollection()
  .setFilter(messageFilter)
  .setStartingPoint(STARTING_POINT)
  .setLimit(LIMIT)
  .build();

const messageCollectionHandler = new SendBirdSyncManager.MessageCollection.CollectionHandler();
messageCollectionHandler.onPendingMessageEvent = (messages, action) => {
  // Do something...
};
messageCollectionHandler.onSucceededMessageEvent = (messages, action) => {
  // Do something...
};
messageCollectionHandler.onFailedMessageEvent = (messages, action, reason) => {
  // Do something...
};
messageCollectionHandler.onNewMessage = message => {
  // Do something...
};
messageCollectionHandler.onMessageEvent = (action, messages, action) => {
  // Do something...
};
messageCollectionHandler.onChannelUpdated = channel => {
  // Do something...
};
messageCollectionHandler.onChannelDeleted = channel => {
  // Do something...
};
messageCollection.setCollectionHandler(messageCollectionHandler);

messageCollection.setMessageCollectionHandler({
  onMessagesAdded: (context, channel, messages) => {
    // Do something...
  },
  onMessagesUpdated: (context, channel, messages) => {
    // Do something...
  },
  onMessagesDeleted: (context, channel, messages) => {
    // Do something...
  },
  onChannelUpdated: (context, channel) => {
    // Do something...
  },
  onChannelDeleted: (context, channel) => {
    // Do something...
  },
  onHugeGapDetected: () => {
    // Do something...
  }
});

messageCollection
  .initialize(MESSAGE_COLLECTION_INIT_POLICY)
  .onCacheResult((error, messages) => {
    if (error) {
      // Handle error.
    }
    // Do something...
  })
  .onApiResult((error, messages) => {
    if (error) {
      // Handle error.
    }
    // Do something...
  });

messageCollection.fetchSucceededMessages('next', error => {
  if (error) {
    // Handle error;
  }
  // Do something...
});

if (messageCollection.hasNext) {
  messageCollection
    .loadNext()
    .then(messages => {
      // Do something...
    })
    .catch(error => {
      // Handle error.
    });
}

messageCollection.fetchSucceededMessages('prev', error => {
  if (error) {
    // Handle error;
  }
  // Do something...
});

if (messageCollection.hasPrevious) {
  messageCollection
    .loadPrevious()
    .then(messages => {
      // Do something...
    })
    .catch(error => {
      // Handle error.
    });
}

const pendingMessage = channel.sendUserMessage(USER_MESSAGE_PARAMS, (error, message) => {
  messageCollection.handleSendMessageResponse(error, message);
});
messageCollection.appendMessage(pendingMessage);

channel.sendUserMessage(USER_MESSAGE_PARAMS, (error, message) => {
  /**
   * Pending message will be delivered to `MessageCollectionHandler.onMessagesAdded()`.
   * The result of sending, either a succeeded or failed message, will be delivered to `MessageCollectionHandler.onMessagesUpdated()`.
   * Do NOT add the pending, succeeded or failed message objects from the return value of `sendUserMessage()`, `sendFileMessage()`, and from the callback.
   */
});

const pendingMessage = channel.sendFileMessage(FILE_MESSAGE_PARAMS, (error, message) => {
  messageCollection.handleSendMessageResponse(error, message);
});
messageCollection.appendMessage(pendingMessage);

channel.sendFileMessage(FILE_MESSAGE_PARAMS, (error, message) => {
  /**
   * Pending message will be delivered to `MessageCollectionHandler.onMessagesAdded()`.
   * The result of sending, either a succeeded or failed message, will be delivered to `MessageCollectionHandler.onMessagesUpdated()`.
   * Do NOT add the pending, succeeded or failed message objects from the return value of `sendUserMessage()`, `sendFileMessage()`, and from the callback.
   */
});

const pendingMessage = channel.resendUserMessage(failedMessage, (error, message) => {
  messageCollection.handleSendMessageResponse(error, message);
});
messageCollection.appendMessage(pendingMessage);

channel.resendUserMessage(failedMessage, (error, message) => {
  /**
   * Pending message will be delivered to `MessageCollectionHandler.onMessagesUpdated()`.
   * The result of sending, either a succeeded or failed message, will be delivered to `MessageCollectionHandler.onMessagesUpdated()`.
   * Do NOT add the pending, succeeded or failed message objects from the return value of `resendUserMessage()`, `resendFileMessage()`, and from the callback.
   */
});

const pendingMessage = channel.resendFileMessage(failedMessage, (error, message) => {
  messageCollection.handleSendMessageResponse(error, message);
});
messageCollection.appendMessage(pendingMessage);

channel.resendFileMessage(failedMessage, (error, message) => {
  /**
   * Pending message will be delivered to `MessageCollectionHandler.onMessagesUpdated()`.
   * The result of sending, either a succeeded or failed message, will be delivered to `MessageCollectionHandler.onMessagesUpdated()`.
   * Do NOT add the pending, succeeded or failed message objects from the return value of `resendUserMessage()`, `resendFileMessage()`, and from the callback.
   */
});

messageCollection.setCollectionHandler(null);
messageCollection.remove();

messageCollection.dispose();

messageCollectionHandler.onNewMessage = message => {
  // Do something...
};

const channelHandler = new sendbird.ChannelHandler();
channelHandler.onMessageReceived = (channel, message) => {
  // Do something...
};
sendbird.addChannelHandler(CHANNEL_HANDLER_KEY, channelHandler);

channel.updateUserMessage(message.messageId, USER_MESSAGE_PARAMS, (error, message) => {
  messageCollection.updateMessage(message);
});

channel.updateUserMessage(message.messageId, USER_MESSAGE_PARAMS, (error, message) => {
  /**
   * Updated message will be handled internally and will be delivered to `MessageCollectionHandler.onMessagesUpdated()`.
   */
});

channel.deleteMessage(message, error => {
  messageCollection.deleteMessage(message);
});

channel.deleteMessage(message, error => {
  /**
   * The result will be delivered to `MessageCollectionHandler.onMessagesDeleted()`.
   */
});

messageCollection.deleteMessage(failedMessage);

messageCollection
  .removeFailedMessages(failedMessages)
  .then(requestIds => {
    // Do something...
  })
  .catch(error => {
    // Handle error.
  });

messageCollection
  .removeAllFailedMessages()
  .then(() => {
    // Do something...
  })
  .catch(error => {
    // Handle error.
  });

messageCollection.resetViewpointTimestamp(TIMESTAMP);

messageCollection.dispose();
messageCollection = channel
  .createMessageCollection()
  .setFilter(messageFilter)
  .setStartingPoint(messageCollection.startingPoint)
  .setLimit(LIMIT)
  .build();
messageCollection
  .initialize(MESSAGE_COLLECTION_INIT_POLICY)
  .onCacheResult((error, messages) => {
    if (error) {
      // Handle error.
    }
    // Do something...
  })
  .onApiResult((error, messages) => {
    if (error) {
      // Handle error.
    }
    // Do something...
  });

messageCollection.fetchPendingMessages(error => {
  if (error) {
    // Handle error;
  }
  // Do something...
});

const pendingMessages = messageCollection.pendingMessages;

messageCollection.fetchFailedMessages(error => {
  if (error) {
    // Handle error;
  }
  // Do something...
});

const failedMessages = messageCollection.failedMessages;

const messageCount = messageCollection.messageCount;

const messageCount = messageCollection.succeededMessages.length;

SendBirdSyncManager.getInstance().clearCache(error => {
  if (error) {
    // Handle error.
  }
  // Do something...
});

sendbird
  .clearCachedMessages(CHANNEL_URLS)
  .then(() => {
    // Do something...
  })
  .catch(error => {
    // Handle error.
  });
