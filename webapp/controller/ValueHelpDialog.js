sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",
    "sap/m/SearchField",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator",
  ],
  function (
    UIComponent,
    Fragment,
    SearchField,
    Filter,
    FilterOperator,
    BusyIndicator
  ) {
    "use strict";

    let infoParams;

    return UIComponent.extend(
      "sapui5.project.frontend.controller.ValueHelpDialog",
      {
        constructor: function (oController) {
          this._oController = oController;
        },

        GetInputs: function (buttonPress) {
          this._oMultiInput = this._oController.getView().byId(buttonPress);
        },

        openValueHelp: function (info) {
          BusyIndicator.show(0);
          const oController = this;
          const oView = this._oController.getView();

          Fragment.load({
            name: "sapui5.project.frontend.view.fragments.ValueHelpDialog",
            controller: this,
          }).then(
            function name(oFragment) {
              oController._oValueHelpDialog = oFragment;
              oView.addDependent(oController._oValueHelpDialog);

              oController._oBasicSearchField = new SearchField({
                search: function () {
                  oController._oValueHelpDialog.getFilterBar().search();
                },
              });

              const oFilterBar = oController._oValueHelpDialog.getFilterBar();
              oFilterBar.setFilterBarExpanded(false);
              oFilterBar.setBasicSearch(oController._oBasicSearchField);

              oController._oValueHelpDialog.getTableAsync().then(
                function (oTable) {
                  oTable.setModel(info.model);
                  oTable.setModel(info.columns, "columns");

                  if (oTable.bindRows) {
                    oTable.bindAggregation("rows", info.path);
                  }

                  oController._oValueHelpDialog.update();
                }.bind(this)
              );

              oController._oValueHelpDialog.setTokens(
                this._oMultiInput.getTokens()
              );

              infoParams = info;

              oController._oValueHelpDialog.setTitle(info.title);
              oController._oValueHelpDialog.setSupportMultiselect(
                info.supportMultiselect
              );
              oController._oValueHelpDialog.setKey(info.key);
              oController._oValueHelpDialog.setDescriptionKey(
                info.descriptionKey
              );
              oController._oValueHelpDialog.open();
              BusyIndicator.hide();
            }.bind(this)
          );
        },

        onValueHelpOkPress: function (oEvent) {
          const aTokens = oEvent.getParameter("tokens");
          this._oMultiInput.setTokens(aTokens);

          this._oValueHelpDialog.close();
        },

        onValueHelpCancelPress: function () {
          this._oValueHelpDialog.close();
        },

        onValueHelpAfterClose: function () {
          this._oValueHelpDialog.destroy();
        },

        onFilterBarSearch: function (oEvent) {
          this._oFilterTable(oEvent, infoParams.filterBar);
        },

        _oFilterTable: function (oEvent, filtersArray) {
          const sSearchQuery = this._oBasicSearchField.getValue(),
            aSelectionSet = oEvent.getParameter("selectionSet");
          const aFilters = aSelectionSet.reduce(function (aResult, oControl) {
            if (oControl.getValue()) {
              aResult.push(
                new Filter({
                  path: oControl.getName(),
                  operator: FilterOperator.Contains,
                  value1: oControl.getValue(),
                })
              );
            }

            return aResult;
          }, []);

          const oFilters = [];

          for (const i in filtersArray) {
            const sFilters = new Filter({
              path: filtersArray[i],
              operator: FilterOperator.Contains,
              value1: sSearchQuery,
            });

            oFilters.push(sFilters);
          }

          aFilters.push(
            new Filter({
              filters: oFilters,
              and: false,
            })
          );

          this._filterTable(
            new Filter({
              filters: aFilters,
              and: true,
            })
          );
        },

        _filterTable: function (oFilter) {
          const oValueHelpDialog = this._oValueHelpDialog;

          oValueHelpDialog.getTableAsync().then(function (oTable) {
            if (oTable.bindRows) {
              oTable.getBinding("rows").filter(oFilter);
            }

            oValueHelpDialog.update();
          });
        },
      }
    );
  }
);
