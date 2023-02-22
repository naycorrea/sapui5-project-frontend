sap.ui.define(
  [
    "sapui5/project/frontend/controller/Base.controller",
    "sapui5/project/frontend/service/ODataRequest",
  ],
  function (BaseController, ODataRequest) {
    "use strict";

    return BaseController.extend("sapui5.project.frontend.controller.Home", {
      onInit: function () {
        this.oDataRequest = new ODataRequest(this);
      },

      async openEmployeeValueHelp() {
        const modelData = await this.oDataRequest.getMatchcode();

        console.log(modelData);
      },
    });
  }
);
