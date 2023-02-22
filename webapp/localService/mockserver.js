sap.ui.define(
  ["sap/ui/core/util/MockServer", "sapui5/project/frontend/utils/ReaderJson"],
  (MockServer, ReaderJson) => {
    "use strict";

    const originPath = "sapui5/project/frontend";
    const mockPath = `${originPath}/localService/mockdata`;

    async function getRequests() {
      return [
        {
          method: "GET",
          path: /.+/,
          response: (oXhr) => {
            oXhr.respondJSON(200, {}, {});
            return true;
          },
        },
      ];
    }

    return {
      async _initMockData(dataSourceName) {
        const manifest = await ReaderJson.getJson(
          `${originPath}/manifest.json`
        );
        const sJsonFilesUrl = sap.ui.require.toUrl(mockPath);

        let rootUri = manifest["sap.app"].dataSources[`${dataSourceName}`].uri;

        let url =
          originPath +
          "/" +
          manifest["sap.app"].dataSources[`${dataSourceName}`].settings
            .localUri;

        console.log(url);

        let localUri = sap.ui.require.toUrl(url);

        const mockServer = new MockServer({
          rootUri,
        });

        MockServer.config({
          autoRespond: true,
          autoRespondAfter: 300,
        });

        mockServer.simulate(localUri, {
          sMockdataBaseUrl: sJsonFilesUrl,
        });

        const sRequests = mockServer.getRequests();

        mockServer.setRequests(sRequests);
        mockServer.start();
      },

      async init() {
        await this._initMockData("Matchcode");

        // const manifest = await ReaderJson.getJson(
        //   `${originPath}/manifest.json`
        // );
        // const rootUri = manifest.envs.microserviceUrl + "/";

        // const mockServer = new MockServer({
        //   rootUri,
        //   requests: await getRequests(),
        // });

        // MockServer.config({
        //   autoRespond: true,
        //   autoRespondAfter: 300,
        // });

        // mockServer.start();
      },
    };
  }
);
