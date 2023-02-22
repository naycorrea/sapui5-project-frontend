sap.ui.define(
  [
    "sapui5/project/frontend/controller/Base.controller",
    "sapui5/project/frontend/utils/Delay",
    "sap/ui/core/BusyIndicator",
    "sapui5/project/frontend/service/ODataRequest",
    "sapui5/project/frontend/service/Request",
    "sapui5/project/frontend/controller/ValueHelpDialog",
    "sap/ui/model/json/JSONModel",
    "sapui5/project/frontend/model/formatter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
  ],
  function (
    BaseController,
    Delay,
    BusyIndicator,
    ODataRequest,
    Request,
    ValueHelpDialog,
    JSONModel,
    formatter,
    MessageBox,
    MessageToast
  ) {
    "use strict";

    const SALES_MODEL = "sales";
    const SEARCH_STATUS_MODEL = "searchStatus";
    const SALE_MODEL = "sale";
    const SAVE_MODEL = "saveModel";

    let sale_Id;

    return BaseController.extend("sapui5.project.frontend.controller.Table", {
      onInit() {
        this.oDataRequest = new ODataRequest(this);
        this.oValueHelpDialog = new ValueHelpDialog(this);
        Delay.debounce(async () => this.searchSales(0), 500);
      },

      async searchSales(page) {
        try {
          BusyIndicator.show(0);
          const { Sales, Page, TotalPages } = await Request.getSales(page);

          Sales.map((item) => {
            item.dateCreated = `${formatter.dateLocaleFormat(
              item.createAt,
              "en-US"
            )}`;
            item.totalPrice = (item.unitPrice * item.quantity).toFixed(2);
          });

          this.setModel(SALES_MODEL, { results: Sales });
          this.setModel(SEARCH_STATUS_MODEL, {
            currentPage: Page,
            totalPages: TotalPages,
          });

          this.enabledPaginationButtons(Page, TotalPages);

          BusyIndicator.hide();
        } catch (err) {
          console.log(err);
          BusyIndicator.hide();
        }
      },

      async changePage(page) {
        const { currentPage, totalPages } =
          this.getModelValues(SEARCH_STATUS_MODEL);

        let nextPage = currentPage + page;
        if (nextPage < 0) nextPage = 0;
        if (nextPage >= totalPages) nextPage = totalPages - 1;

        await this.searchSales(nextPage);
      },

      enabledPaginationButtons(page, totalPages) {
        const prevButton = this.byId("prevButton");
        const nextButton = this.byId("nextButton");

        if (page === 0) {
          prevButton.setEnabled(false);
        } else {
          prevButton.setEnabled(true);
        }

        if (page < totalPages - 1) {
          nextButton.setEnabled(true);
        } else {
          nextButton.setEnabled(false);
        }
      },

      async openEmployeeValueHelp(inputId) {
        const modelData = await this.oDataRequest.getMatchcode(
          "oDataMatchcodeModel",
          "/Employees"
        );

        const params = {
          model: modelData,
          columns: new JSONModel({
            cols: [
              { label: "Employee", template: "FirstName" },
              { label: "Employee", template: "LastName" },
            ],
          }),
          title: this.getI18nText("LabelEmployee"),
          supportMultiselect: false,
          path: "/results",
          key: "EmployeeID",
          descriptionKey: "FirstName",
          filterBar: ["FirstName"],
        };

        this.oValueHelpDialog.GetInputs(inputId);

        this.oValueHelpDialog.openValueHelp(params);
      },

      async openProductValueHelp(inputId) {
        const modelData = await this.oDataRequest.getMatchcode(
          "oDataMatchcodeModel",
          "/Products"
        );

        const params = {
          model: modelData,
          columns: new JSONModel({
            cols: [{ label: "Product", template: "ProductName" }],
          }),
          title: this.getI18nText("LabelProduct"),
          supportMultiselect: false,
          path: "/results",
          key: "ProductID",
          descriptionKey: "ProductName",
          filterBar: ["ProductName"],
        };

        this.oValueHelpDialog.GetInputs(inputId);

        this.oValueHelpDialog.openValueHelp(params);
      },

      populateInput(multiInputId, inputId, path, property) {
        const id = this.getMultiInputKeys(multiInputId);
        const input = this.byId(inputId);

        const oModel = this.getModel("oDataMatchcodeModel");

        const setProperty = oModel.getProperty(`/${path}(${id})/${property}`);

        input.setValue(setProperty);
      },

      async _getSaleById(saleId) {
        const sale = await Request.getSaleById(saleId);

        this.setModel(SALE_MODEL, sale);
      },

      async openForm(saleId) {
        sale_Id = saleId;

        if (saleId !== "") {
          await this._getSaleById(saleId);
        } else {
          this.setModel(SALE_MODEL, {});
        }

        this.openDialog(
          this.getI18nText("LabelForm"),
          "dialogId",
          "sapui5.project.frontend.view.fragments.Form"
        );
      },

      closeForm() {
        this.closeDialog("dialogId");
      },

      async deleteSale(saleId) {
        const that = this;

        MessageBox.confirm(
          this.getI18nText("ApproveDeleteMessage"),
          async (evt) => {
            if (evt == "OK") {
              await Request.removeSale(saleId);

              MessageBox.success(
                this.getI18nText("MessageSaleSuccessfullyDeleted"),
                {
                  actions: [MessageBox.Action.OK],
                  emphasizedAction: MessageBox.Action.OK,
                  onClose: async function () {
                    await that.searchSales(0);
                  },
                }
              );
            } else {
              MessageToast.show(this.getI18nText("CancelDeleteSale"));
            }
          }
        );
      },

      async save() {
        const that = this;
        const oModel = this.getModel("oDataMatchcodeModel");
        const saveModel = this.getModel(SALE_MODEL).getData();

        this.setModel(SAVE_MODEL, saveModel);

        const employeeId = this.getMultiInputKeys("formEmployeeFirstName");
        const productId = this.getMultiInputKeys("formProduct");

        const firstName = oModel.getProperty(
          `/Employees(${employeeId})/FirstName`
        );
        const productName = oModel.getProperty(
          `/Products(${productId})/ProductName`
        );

        this.updateModel(SAVE_MODEL, {
          employeeId:
            employeeId.length > 0 ? employeeId[0] : saveModel.employeeId,
          employeeFirstName:
            firstName !== undefined ? firstName : saveModel.employeeFirstName,
          productId: productId.length > 0 ? productId[0] : saveModel.productId,
          productName:
            productName !== undefined ? productName : saveModel.productName,
        });

        const sale = this.getModelValues(SAVE_MODEL);

        if (sale_Id === "") {
          await Request.addSale(sale);

          MessageBox.success(
            this.getI18nText("MessageSaleSuccessfullyCreated"),
            {
              actions: [MessageBox.Action.OK],
              emphasizedAction: MessageBox.Action.OK,
              onClose: async function () {
                await that.searchSales(0);
                that.closeForm();
              },
            }
          );
        } else {
          await Request.updateSale(sale_Id, sale);

          MessageBox.success(
            this.getI18nText("MessageSaleSuccessfullyUpdated"),
            {
              actions: [MessageBox.Action.OK],
              emphasizedAction: MessageBox.Action.OK,
              onClose: async function () {
                await that.searchSales(0);
                that.closeForm();
              },
            }
          );
        }
      },
    });
  }
);
