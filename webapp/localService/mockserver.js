sap.ui.define(
  ["sap/ui/core/util/MockServer", "sapui5/project/frontend/utils/ReaderJson"],
  (MockServer, ReaderJson) => {
    "use strict";

    const originPath = "aurora/fiori/app";

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
      async init() {
        const manifest = await ReaderJson.getJson(
          `${originPath}/manifest.json`
        );
        const rootUri = manifest.envs.url + "/";

        const mockServer = new MockServer({
          rootUri,
          requests: await getRequests(),
        });

        MockServer.config({
          autoRespond: true,
          autoRespondAfter: 300,
        });

        mockServer.start();
      },
    };
  }
);
