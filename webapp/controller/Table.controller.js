sap.ui.define(
  [
    "sapui5/project/frontend/controller/Base.controller",
    "sapui5/project/frontend/utils/Delay",
    "sap/ui/core/BusyIndicator",
    "sapui5/project/frontend/service/ODataRequest",
  ],
  function (BaseController, Delay, BusyIndicator, ODataRequest) {
    "use strict";

    const SALES_MODEL = "sales";

    return BaseController.extend("sapui5.project.frontend.controller.Table", {
      onInit: function () {
        this.oDataRequest = new ODataRequest(this);
        // Delay.debounce(async () => this.searchSales(0), 500);
      },

      async openEmployeeValueHelp() {
        const modelData = await this.oDataRequest.getMatchcode();

        console.log(modelData);
      },

      // async searchSales(page) {
      //   try {
      //     BusyIndicator.show(0);
      //     const { Sales } = await Request.getSales(page);

      //     Sales.map((item) => {
      //       item.dateCreated = `${formatter.dateLocaleFormat(
      //         item.createAt,
      //         "en-US"
      //       )}`;
      //       item.totalPrice = (item.unitPrice * item.quantity).toFixed(2);
      //     });

      //     this.setModel(SALES_MODEL, { results: Sales });

      //     BusyIndicator.hide();
      //   } catch (err) {
      //     console.log(err);
      //     BusyIndicator.hide();
      //   }
      // },

      // openCreateForm() {
      //   this.openDialog(
      //     this.getI18nText("LabelCreateForm"),
      //     "createDialog",
      //     "sapui5project.view.fragments.Form"
      //   );
      // },

      // deleteSale(saleId) {
      //   console.log(saleId);
      // },

      // _delete(saleId) {},
    });
  }
);
