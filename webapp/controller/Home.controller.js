sap.ui.define(
  [
    "sapui5/project/frontend/controller/Base.controller",
    "sapui5/project/frontend/service/ODataRequest",
    "sapui5/project/frontend/controller/ValueHelpDialog",
    "sap/ui/model/json/JSONModel",
  ],
  function (BaseController, ODataRequest, ValueHelpDialog, JSONModel) {
    "use strict";

    return BaseController.extend("sapui5.project.frontend.controller.Home", {
      onInit: function () {},
    });
  }
);
