
import SendBird from 'sendbird';

export = SyncManager;
export as namespace SyncManager;

type GroupChannel = SendBird.SendBirdInstance.GroupChannel;
type UserMessage = SendBird.SendBirdInstance.UserMessage;
type FileMessage = SendBird.SendBirdInstance.FileMessage;
type AdminMessage = SendBird.SendBirdInstance.AdminMessage;

declare const SyncManager: SyncManagerStatic;

interface SyncManagerStatic {
  Channel: ChannelManagerStatic;
  Message: MessageManagerStatic;
  Exception: SyncManagerExceptionStatic;
}

// ChannelManager
interface ChannelManagerStatic {
  new (sb:SendBird): ChannelManager;
  instance: ChannelManager;
}
interface ChannelManager {
  createMyGroupChannelCollection(query:GroupChannelListQuery): ChannelCollection;
  createPublicGroupChannelCollection(query:PublicGroupChannelListQuery):  ChannelCollection;
  removeChannelCollection(collection:ChannelCollection): void;
  start(): void;
  stop(): void;
  reset(): void;
  clearCache(): void;
}
interface ChannelCollection {
  getIndex(channel:GroupChannel, list:Array<GroupChannel>): number;
  findIndex(channel:GroupChannel, list:Array<GroupChannel>): number;
  isMatchingWithQuery(channel:GroupChannel): boolean;
  loadChannels(callback?:() => void): void;
  subscribe(key:string, handler:(changeLog:ChannelChangeLog) => void): void;
  unsubscribe(key:string): void;
}
interface ChannelChangeLog {
  taskNumber: number;
  action: string;
  item: GroupChannel;
}

// MessageManager
interface MessageManagerStatic {
  new (sb:SendBird): MessageManager;
  instance: MessageManager;
}
interface MessageManager {
  createMessageCollection(channel:GroupChannel, filter:MessageFilter): MessageCollection;
  removeMessageCollection(collection:MessageCollection): void;
  syncChangeLog(channel:GroupChannel): void;
  start(): void;
  stop(): void;
  reset(): void;
  clearCache(): void;
}
interface MessageFilter {
  messageTypeFilter: 0 | 1 | 2 | 3; // 0: ALL, 1: USER, 2: FILE, 3: ADMIN
  customTypeFilter: string;
  senderUserIdsFilter: Array<string>;
  limit:number;
}
interface MessageCollection {
  getIndex(message:UserMessage | FileMessage | AdminMessage, list:Array<UserMessage> | Array<FileMessage> | Array<AdminMessage>): number;
  findIndex(message:UserMessage | FileMessage | AdminMessage, list:Array<UserMessage> | Array<FileMessage> | Array<AdminMessage>): number;
  isMatchingWithQuery(message:UserMessage | FileMessage | AdminMessage): boolean;
  appendMyMessage(message:UserMessage | FileMessage | AdminMessage): void;
  updateMyMessage(message:UserMessage | FileMessage | AdminMessage): void;
  removeMyMessage(message:UserMessage | FileMessage | AdminMessage): void;
  subscribe(key:string, handler:(changeLog:MessageChangeLog) => void): void;
  unsubscribe(key:string): void;
}
interface MessageChangeLog {
  taskNumber: number;
  action: string;
  item: UserMessage | FileMessage | AdminMessage;
}

// SyncManager exception
interface SyncManagerExceptionStatic extends Error {
  new (message:string): SyncManagerException;
}
interface SyncManagerException {
  code: number;
  message: string;
}