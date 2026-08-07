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

  // tools/importer/import-wknd-nav.js
  var import_wknd_nav_exports = {};
  __export(import_wknd_nav_exports, {
    default: () => import_wknd_nav_default
  });
  var PRIMARY = [
    { text: "Magazine", href: "/magazine" },
    { text: "Adventures", href: "/adventures" },
    { text: "FAQs", href: "/faqs" },
    { text: "About Us", href: "/about-us" }
  ];
  var import_wknd_nav_default = {
    transform: (payload) => {
      const { document } = payload;
      const main = document.createElement("main");
      const brand = document.createElement("div");
      const brandP = document.createElement("p");
      const brandLink = document.createElement("a");
      brandLink.setAttribute("href", "/");
      brandLink.textContent = "WKND";
      brandP.appendChild(brandLink);
      brand.appendChild(brandP);
      main.appendChild(brand);
      main.appendChild(document.createElement("hr"));
      const sections = document.createElement("div");
      const ul = document.createElement("ul");
      PRIMARY.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", item.href);
        a.textContent = item.text;
        li.appendChild(a);
        ul.appendChild(li);
      });
      sections.appendChild(ul);
      main.appendChild(sections);
      main.appendChild(document.createElement("hr"));
      const tools = document.createElement("div");
      const toolsP = document.createElement("p");
      toolsP.textContent = ":search:";
      tools.appendChild(toolsP);
      main.appendChild(tools);
      return [{
        element: main,
        path: "/nav",
        report: { title: "Nav", template: "wknd-nav" }
      }];
    }
  };
  return __toCommonJS(import_wknd_nav_exports);
})();
