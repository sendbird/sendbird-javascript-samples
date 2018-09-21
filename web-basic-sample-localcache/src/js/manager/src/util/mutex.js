
const LOCK_TIMEOUT = 60000;
const LOCK_INTERVAL = 200;

export default class Mutex {
  constructor() {
    this.locked = false;
    this.lockedAt = new Date().getTime() + LOCK_TIMEOUT;
  }
  isLocked() { return this.locked; }

  lock(routine) {
    if(!this.locked) {
      this.locked = true;
      this.lockedAt = new Date().getTime();
      routine(() => this.unlock());
    } else {
      setTimeout(() => {
        if(new Date().getTime() - this.lockedAt < LOCK_TIMEOUT) {
          this.lock(routine);
        }
      },
      LOCK_INTERVAL);
    }
  }
  unlock() {
    this.locked = false;
    this.lockedAt = new Date().getTime() + LOCK_TIMEOUT;
  }
}