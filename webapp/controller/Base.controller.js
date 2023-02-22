sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
  ],
  (Controller, UIComponent, JSONModel, MessageBox, Fragment) => {
    "use strict";

    return Controller.extend("sapui5.project.frontend.controller.Base", {
      getModel(modelName) {
        return this.getView().getModel(modelName);
      },
      getModelValues(modelName) {
        return this.getView().getModel(modelName).getData();
      },

      setModel(modelName, data) {
        return this.getView().setModel(new JSONModel(data), modelName);
      },

      updateModel(modelName, changes) {
        const model = this.getModel(modelName);
        const data = model.getData();

        model.setData({ ...data, ...changes });
      },

      getI18nText(key) {
        return this.getView().getModel("i18n").getResourceBundle().getText(key);
      },

      getRouter() {
        return UIComponent.getRouterFor(this);
      },

      messageBox(type, message) {
        MessageBox[type](this.getI18nText(message));
      },

      openDialog(title, id, path) {
        const oView = this.getView();

        if (!this.byId(id)) {
          Fragment.load({
            id: oView.getId(),
            name: path,
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            oDialog.setTitle(title);
            oDialog.open();
          });
        }
      },

      closeDialog(id) {
        this.byId(id).destroy();
      },

      getMultiInputKeys(id) {
        const selectedKeys = this.byId(id).getTokens();

        return selectedKeys.map((oToken) => {
          return oToken.getKey();
        });
      },
    });
  }
);
