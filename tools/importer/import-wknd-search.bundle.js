/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-wknd-search.js
  var import_wknd_search_exports = {};
  __export(import_wknd_search_exports, {
    default: () => import_wknd_search_default
  });
  var import_wknd_search_default = {
    transform: (payload) => {
      const { document } = payload;
      const main = document.createElement("main");
      const h1 = document.createElement("h1");
      h1.textContent = "Search";
      main.appendChild(h1);
      const source = document.createElement("div");
      source.textContent = "/query-index.json";
      const block = WebImporter.Blocks.createBlock(document, {
        name: "search",
        cells: [[source]]
      });
      main.appendChild(block);
      return [{
        element: main,
        path: "/search",
        report: { title: "Search", template: "wknd-search" }
      }];
    }
  };
  return __toCommonJS(import_wknd_search_exports);
})();
