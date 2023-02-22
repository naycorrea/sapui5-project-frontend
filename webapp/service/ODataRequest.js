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

        async getMatchcode(model, path) {
          const that = this._oView;
          const oView = that.getView();

          const oModel = that.getModel(model);

          oModel.read(path, {
            success(oData) {
              let matchcode = new JSONModel(oData);

              oView.setModel(matchcode);

              return matchcode;
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
