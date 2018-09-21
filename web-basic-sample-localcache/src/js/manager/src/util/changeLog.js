
export default class ChangeLog {
  constructor(arg) {
    this.taskNumber = arg.taskNumber;
    this.action = arg.action || ChangeLog.Action.NOOP;
    this.item = arg.item;
  }
  static get Action() {
    return {
      NOOP: 'noop',
      INSERT: 'insert',
      UPDATE: 'update',
      REMOVE: 'remove',
      MOVE: 'move',
      CLEAR: 'clear'
    };
  }
}