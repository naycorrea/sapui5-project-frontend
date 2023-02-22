sap.ui.define(
  [
    "sapui5/project/frontend/controller/Base.controller",
    "sap/ui/model/json/JSONModel",
  ],
  function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend(
      "sapui5.project.frontend.service.ODataRequest",
      {
        constructor: function (oView) {
          this._oView = oView;
        },

        async getMatchcode() {
          const that = this._oView;
          const oView = that.getView();

          const oModel = that.getModel("oDataMatchcodeModel");

          oModel.read("/Products", {
            success(odata) {
              console.log(odata);
            },
            error(err) {
              console.log(err);
            },
          });
        },
      }
    );
  }
);
