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

  // tools/importer/import-wknd-footer.js
  var import_wknd_footer_exports = {};
  __export(import_wknd_footer_exports, {
    default: () => import_wknd_footer_default
  });
  var NAV = [
    { text: "Magazine", href: "/us/en/magazine" },
    { text: "Adventures", href: "/us/en/adventures" },
    { text: "FAQs", href: "/us/en/faqs" },
    { text: "About Us", href: "/us/en/about-us" }
  ];
  var SOCIAL = [
    { text: "Facebook", href: "https://www.facebook.com/" },
    { text: "Twitter", href: "https://twitter.com/" },
    { text: "Instagram", href: "https://www.instagram.com/" }
  ];
  var import_wknd_footer_default = {
    transform: (payload) => {
      const { document } = payload;
      const main = document.createElement("main");
      const el = (tag, attrs, text) => {
        const n = document.createElement(tag);
        if (attrs) Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
        if (text != null) n.textContent = text;
        return n;
      };
      const linkList = (items) => {
        const ul = document.createElement("ul");
        items.forEach((it) => {
          const li = document.createElement("li");
          li.appendChild(el("a", { href: it.href }, it.text));
          ul.appendChild(li);
        });
        return ul;
      };
      const top = document.createElement("div");
      const brandP = document.createElement("p");
      brandP.appendChild(el("a", { href: "/us/en" }, "WKND"));
      top.appendChild(brandP);
      top.appendChild(linkList(NAV));
      top.appendChild(el("h4", null, "Follow Us"));
      top.appendChild(linkList(SOCIAL));
      main.appendChild(top);
      main.appendChild(document.createElement("hr"));
      const legal = document.createElement("div");
      legal.appendChild(el("p", null, "\xA9 2019, WKND Site."));
      const attr = document.createElement("p");
      attr.append(
        document.createTextNode("WKND is a fictitious adventure and travel website created by Adobe to demonstrate how anyone can use Adobe Experience Manager to build a beautiful, feature-rich website over a single weekend. This site is built entirely with Adobe Experience Manager "),
        el("a", { href: "https://docs.adobe.com/content/help/en/experience-manager-core-components/using/introduction.html" }, "Core Components"),
        document.createTextNode(" and "),
        el("a", { href: "https://github.com/adobe/aem-project-archetype" }, "Archetype"),
        document.createTextNode(" that are available as open source code to the public. The entire "),
        el("a", { href: "https://github.com/adobe/aem-guides-wknd/" }, "site source code"),
        document.createTextNode(" is available as open source as well and is accompanied with a "),
        el("a", { href: "https://docs.adobe.com/content/help/en/experience-manager-learn/getting-started-wknd-tutorial-develop/overview.html" }, "detailed tutorial"),
        document.createTextNode(" on how to recreate the site.")
      );
      legal.appendChild(attr);
      const stock = document.createElement("p");
      stock.append(
        document.createTextNode("Many of the beautiful images in the WKND site are available for purchase via "),
        el("a", { href: "https://stock.adobe.com/" }, "Adobe Stock"),
        document.createTextNode(".")
      );
      legal.appendChild(stock);
      main.appendChild(legal);
      return [{
        element: main,
        path: "/footer",
        report: { title: "Footer", template: "wknd-footer" }
      }];
    }
  };
  return __toCommonJS(import_wknd_footer_exports);
})();
