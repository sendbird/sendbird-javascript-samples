import React, { useContext, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, Text, View } from 'react-native';

import Channel from '../component/channel';
import { handleNotificationAction } from '../utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../context';
import { useGroupChannelCollection } from '../hooks/useGroupChannelCollection';
import { useConnectionHandler } from '../hooks/useConnectionHandler';

const Channels = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sendbird, currentUser } = useContext(AppContext);

  const [error, setError] = useState(null);
  const { groupChannels, refreshing, next, refresh } = useGroupChannelCollection(sendbird, currentUser.userId);

  useEffect(() => {
    if (route.params?.action) {
      const { action, data } = route.params;
      switch (action) {
        case 'leave':
          data.channel.leave(err => {
            if (err) setError('Failed to leave the channel.');
          });
          break;
      }
    }
  }, [route.params]);

  useConnectionHandler(
    sendbird,
    'page-channel',
    {
      onReconnectStarted: () => {
        setError('Connecting..');
      },
      onReconnectSucceeded: () => {
        setError(null);
        refresh();
        handleNotificationAction(navigation, sendbird, currentUser, 'channels').catch(err => console.error(err));
      },
      onReconnectFailed: () => {
        setError('Connection failed. Please check the network status.');
      },
    },
    [refresh],
  );

  return (
    <>
      <StatusBar backgroundColor="#742ddd" barStyle="light-content" />
      <SafeAreaView style={style.container}>
        <FlatList
          data={groupChannels}
          renderItem={({ item }) => (
            <Channel
              key={item.url}
              channel={item}
              onPress={channel => navigation.navigate('Chat', { channel: channel.serialize(), currentUser })}
            />
          )}
          keyExtractor={item => item.url}
          onRefresh={refresh}
          refreshing={refreshing}
          contentContainerStyle={{ flexGrow: 1 }}
          ListHeaderComponent={
            error && (
              <View style={style.errorContainer}>
                <Text style={style.error}>{error}</Text>
              </View>
            )
          }
          ListEmptyComponent={
            <View style={style.emptyContainer}>
              <Text style={style.empty}>{'No Channels'}</Text>
            </View>
          }
          onEndReached={next}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaView>
    </>
  );
};

const style = {
  container: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: '#333',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
  loading: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 24,
    color: '#999',
    alignSelf: 'center',
  },
};

export default Channels;
