import './index.css';

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  SendBirdProvider,
  ChannelList,
  Channel,
  ChannelSettings,
} from 'sendbird-uikit';
import 'sendbird-uikit/dist/index.css';

import ChannelPreview from './ChannelPreview';
import Message from './Message';
import getCustomPaginatedQuery from './CustomUserList';

export default function Chat({ userId, theme, nickname, useCustomQuery }) {
  const history = useHistory();
  useEffect(() => {
    if (!userId || !nickname) {
      history.push('/');
    }
  }, [userId, nickname, history]);
  const [showSettings, setShowSettings] = useState(false);
  const [currentChannelUrl, setCurrentChannelUrl] = useState(null);

  return (
    <div style={{ height: '100vh' }}>
      <SendBirdProvider
        appId={process.env.APP_ID}
        theme={theme}
        userId={userId}
        nickname={nickname}
        userListQuery={
          useCustomQuery
            ? getCustomPaginatedQuery
            : null
        }
      >
        <div className="sendbird-app__wrap">
          <div className="sendbird-app__channellist-wrap">
            <ChannelList
              renderChannelPreview={ChannelPreview}
              onChannelSelect={(channel) => {
                if (channel && channel.url) {
                  setCurrentChannelUrl(channel.url);
                }
              }}
            />
          </div>
          <div className="sendbird-app__conversation-wrap">
            <Channel
              renderChatItem={Message}
              channelUrl={currentChannelUrl}
              onChatHeaderActionClick={() => { setShowSettings(true); }}
            />
          </div>
        </div>
        {showSettings && (
          <div className="sendbird-app__settingspanel-wrap">
            <ChannelSettings
              channelUrl={currentChannelUrl}
              onCloseClick={() => { setShowSettings(false); }}
            />
          </div>
        )}
      </SendBirdProvider>
    </div>
  )
}
