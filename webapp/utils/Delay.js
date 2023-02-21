sap.ui.define([], () => {
  "use strict";

  let debounce;

  return {
    debounce(func, wait) {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        func();
      }, wait || 300);
    },
  };
});
