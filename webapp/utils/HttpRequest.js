sap.ui.define([], () => {
  "use strict";

  return {
    async request(ajaxRequest) {
      return new Promise((res, rej) => {
        jQuery.ajax({
          ...ajaxRequest,
          success: (r) => res(r),
          error: (err) => rej(err),
        });
      });
    },
  };
});
