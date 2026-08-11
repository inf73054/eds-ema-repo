/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

  // tools/importer/import-wknd-article.js
  var import_wknd_article_exports = {};
  __export(import_wknd_article_exports, {
    default: () => import_wknd_article_default
  });

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function isCardSection(el) {
    return el.tagName === "SECTION" && el.querySelector("img") && el.querySelector("h3");
  }
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".header",
        ".footer",
        "search",
        '[class*="languagenavigation"]',
        '[class*="sign-in"]',
        // hidden mobile nav menu (Home/Magazine/…) appended near end of <body>
        "#mobileNav",
        'a[href="#mobileNav"]',
        ".cmp-navigation",
        "nav.navigation",
        // Adobe demdex ID-syncing iframe/link tracking artifact
        'a[href*="demdex.net"]',
        '[id*="demdex"]',
        '[class*="demdex"]'
      ]);
      element.querySelectorAll("a[href]").forEach((a) => {
        if (/demdex\.net/i.test(a.getAttribute("href") || "") || /adobe id syncing/i.test(a.textContent || "")) {
          a.remove();
        }
      });
      const cardSections = [...element.querySelectorAll("section")].filter(isCardSection);
      if (cardSections.length) {
        let currentGroup = null;
        cardSections.forEach((section) => {
          const prev = section.previousElementSibling;
          if (!currentGroup || prev && !isCardSection(prev) && !prev.classList.contains("cards-team-grid")) {
            currentGroup = document.createElement("div");
            currentGroup.className = "cards-team-grid";
            section.parentNode.insertBefore(currentGroup, section);
          }
          currentGroup.appendChild(section);
        });
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["header", "footer", "search"]);
      element.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href") || "";
        if (/demdex\.net/i.test(href) || /adobe id syncing/i.test(a.textContent || "")) {
          (a.closest("p") || a).remove();
        }
      });
      element.querySelectorAll("ul").forEach((ul) => {
        const links = [...ul.querySelectorAll(":scope > li a, :scope > li > p > a")].map((a) => (a.textContent || "").trim());
        if (links[0] === "Home" && links.includes("Magazine") && links.includes("About Us")) {
          ul.remove();
        }
      });
      rewriteInternalLinks(element);
    }
  }
  function rewriteInternalLinks(element) {
    element.querySelectorAll("a[href]").forEach((a) => {
      let href = a.getAttribute("href") || "";
      href = href.replace(/^https?:\/\/wknd\.site/i, "");
      if (!href.startsWith("/us/en")) return;
      let p = href.replace(/\.html$/, "");
      if (p === "/us/en") p = "/";
      else p = p.replace(/^\/us\/en/, "");
      if (p === "") p = "/";
      a.setAttribute("href", p);
    });
  }

  // tools/importer/import-wknd-article.js
  var PAGE_TEMPLATE = {
    name: "wknd-article",
    description: "WKND magazine article: breadcrumb, H1 + byline, long-form rich-text body with subheadings/blockquote/inline images, author bio, and a related-articles list. All default content.",
    urls: [
      "https://wknd.site/us/en/magazine/arctic-surfing.html"
    ],
    blocks: [],
    sections: []
  };
  var transformers = [transform];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_wknd_article_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      executeTransformers("afterTransform", main, payload);
      const smd = WebImporter.Blocks.createBlock(document2, {
        name: "Section Metadata",
        cells: [["Style", "article"]]
      });
      main.appendChild(smd);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      main.querySelectorAll('a[href*="demdex"], a[href*="dest5.html"]').forEach((a) => (a.closest("p") || a).remove());
      const pathname = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const slug = pathname.split("/").pop();
      const path = `/magazine/${slug}`;
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: []
        }
      }];
    }
  };
  return __toCommonJS(import_wknd_article_exports);
})();
