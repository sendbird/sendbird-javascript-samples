
export default class SyncManagerException extends Error {
  constructor(message) {
    super(message);
    this.name = 'SyncManagerException';
  }
}