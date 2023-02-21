sap.ui.define([], () => {
  "use strict";

  function readJson(path) {
    return new Promise((resolve, reject) => {
      jQuery.ajax({
        type: "get",
        dataType: "json",
        url: sap.ui.require.toUrl(path),
        success: resolve,
        error: reject,
      });
    });
  }

  return {
    async getJson(path) {
      return readJson(path);
    },
  };
});
