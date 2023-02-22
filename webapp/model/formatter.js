sap.ui.define([], () => {
  "use strict";

  return {
    dateLocaleFormat(date, locale) {
      return date === null ? "" : new Date(date).toLocaleString(locale);
    },
  };
});
