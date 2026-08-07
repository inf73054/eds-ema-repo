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
    { text: "Magazine", href: "/magazine" },
    { text: "Adventures", href: "/adventures" },
    { text: "FAQs", href: "/faqs" },
    { text: "About Us", href: "/about-us" }
  ];
  var SOCIAL = [
    { text: "Facebook", href: "#facebook" },
    { text: "Twitter", href: "#twitter" },
    { text: "Instagram", href: "#instagram" }
  ];
  var import_wknd_footer_default = {
    transform: (payload) => {
      const { document } = payload;
      const main = document.createElement("main");
      const wrap = document.createElement("div");
      const brandP = document.createElement("p");
      const brandLink = document.createElement("a");
      brandLink.setAttribute("href", "/");
      brandLink.textContent = "WKND";
      brandP.appendChild(brandLink);
      wrap.appendChild(brandP);
      const navUl = document.createElement("ul");
      NAV.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", item.href);
        a.textContent = item.text;
        li.appendChild(a);
        navUl.appendChild(li);
      });
      wrap.appendChild(navUl);
      const follow = document.createElement("h4");
      follow.textContent = "Follow Us";
      wrap.appendChild(follow);
      const socialUl = document.createElement("ul");
      SOCIAL.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", item.href);
        a.textContent = item.text;
        li.appendChild(a);
        socialUl.appendChild(li);
      });
      wrap.appendChild(socialUl);
      const copy = document.createElement("p");
      copy.textContent = "\xA9 2019, WKND Site.";
      wrap.appendChild(copy);
      main.appendChild(wrap);
      return [{
        element: main,
        path: "/footer",
        report: { title: "Footer", template: "wknd-footer" }
      }];
    }
  };
  return __toCommonJS(import_wknd_footer_exports);
})();
