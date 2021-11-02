import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  container: {
    paddingTop: 5,
    transform: [{ scaleY: -1 }]
  },
  messageTextContainer: {
    maxWidth: 240,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 4,
    borderRadius: 8
  },
  messageText: {
    fontSize: 15
  },
  messageFile: {
    fontSize: 15,
    marginLeft: 8
  },
  imageContainer: {
    minWidth: 100,
    minHeight: 100,
    marginBottom: 4,
    borderRadius: 8
  },
  image: {
    borderRadius: 8
  },
  videoContainer: {
    minWidth: 240,
    minHeight: 180,
    marginBottom: 4,
    borderRadius: 8
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 8
  },
  avatarContainer: {
    backgroundColor: 'transparent',
    width: 34,
    height: 34
  },
  nickname: {
    fontSize: 13,
    color: '#7048e8',
    paddingBottom: 4
  },
  contentContainer: {
    flexDirection: 'column'
  },
  normalMessageContainer: {
    justifyContent: 'flex-start',
    paddingHorizontal: 10
  },
  adminMessageContainer: {
    padding: 8,
    backgroundColor: '#e6e9f0'
  },
  createdAtContainer: {},
  createdAt: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4
  },
  readReceiptContainer: {
    flexDirection: 'column-reverse',
    paddingHorizontal: 4,
    marginRight: 4,
    marginBottom: 8
  },
  failedMessageLabelContainer: {
    flexDirection: 'column-reverse',
    paddingHorizontal: 4,
    marginRight: 10,
    marginBottom: 8
  },
  readReceipt: {
    fontSize: 10,
    color: '#f03e3e'
  }
});
