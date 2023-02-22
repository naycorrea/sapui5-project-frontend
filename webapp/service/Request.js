sap.ui.define(
  [
    "sapui5/project/frontend/utils/HttpRequest",
    "sapui5/project/frontend/utils/ReaderJson",
  ],
  (HttpService, ReaderJson) => {
    "use strict";

    let ROOT_URL;

    return {
      async _getRoot() {
        if (ROOT_URL) {
          return ROOT_URL;
        }

        const manifest = await ReaderJson.getJson(
          "sapui5/project/frontend/manifest.json"
        );

        ROOT_URL = manifest.envs.microserviceUrl;

        return ROOT_URL;
      },

      async _request(path, method = "GET", data = {}) {
        const root = await this._getRoot();
        const url = `${root}/${path}`;

        return HttpService.request({
          url,
          data,
          method,
          contentType: "application/json",
        });
      },

      _saleInfo(sale) {
        return JSON.stringify({
          employeeId: sale.employeeId,
          employeeFirstName: sale.employeeFirstName,
          employeeLastName: sale.employeeLastName,
          country: sale.country === undefined ? "Brazil" : sale.country,
          productId: sale.productId,
          productName: sale.productName,
          unitPrice: sale.unitPrice,
          quantity: sale.quantity,
        });
      },

      async getSales(page) {
        const path = `getAll?currentPage=${page}`;

        return this._request(path);
      },

      async getSaleById(saleId) {
        const path = `findById?id=${saleId}`;

        return this._request(path);
      },

      async addSale(sale) {
        return this._request("create", "POST", this._saleInfo(sale));
      },

      async updateSale(saleId, sale) {
        const path = `update?id=${saleId}`;

        return this._request(path, "PATCH", this._saleInfo(sale));
      },

      async removeSale(saleId) {
        const path = `delete?id=${saleId}`;

        return this._request(path, "DELETE");
      },
    };
  }
);
