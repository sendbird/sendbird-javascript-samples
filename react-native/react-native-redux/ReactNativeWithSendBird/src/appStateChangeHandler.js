export default (function() {
  var instance;

  function AppStateChangeHandler() {
    this.cbs = {};
    this.addCallback = (key, cb) => {
      this.cbs[key] = cb;
      return () => {
        delete this.cbs[key];
      };
    };

    this.notify = () => {
      for (let key in this.cbs) {
        this.cbs[key]();
      }
    };
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = new AppStateChangeHandler();
      }
      return instance;
    }
  };
})();
