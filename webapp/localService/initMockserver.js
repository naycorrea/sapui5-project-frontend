sap.ui.define(
  ["sapui5/project/frontend/localService/mockserver"],
  (mockserver) => {
    "use strict";

    // initialize the mock server
    mockserver.init().then(() => {
      // initialize the embedded component on the HTML page
      sap.ui.require(["sap/ui/core/ComponentSupport"]);
    });
  }
);
