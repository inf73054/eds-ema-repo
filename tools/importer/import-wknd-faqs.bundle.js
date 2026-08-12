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

  // tools/importer/import-wknd-faqs.js
  var import_wknd_faqs_exports = {};
  __export(import_wknd_faqs_exports, {
    default: () => import_wknd_faqs_default
  });

  // tools/importer/parsers/accordion-faq.js
  function parse(element, { document: document2 }) {
    const cells = [];
    const cmpItems = Array.from(element.querySelectorAll(".cmp-accordion__item"));
    if (cmpItems.length) {
      cmpItems.forEach((item) => {
        const titleEl = item.querySelector(".cmp-accordion__title, .cmp-accordion__header button, .cmp-accordion__header");
        const panel = item.querySelector(".cmp-accordion__panel");
        if (!titleEl && !panel) return;
        const questionEl = document2.createElement("p");
        questionEl.textContent = titleEl ? titleEl.textContent.trim() : "";
        const answer = document2.createElement("div");
        if (panel) {
          [...panel.childNodes].forEach((n) => answer.appendChild(n.cloneNode(true)));
          if (!answer.textContent.trim()) answer.textContent = panel.textContent.trim();
        }
        cells.push([questionEl, answer]);
      });
    } else {
      const items = Array.from(element.querySelectorAll(":scope > details.faq-item, :scope > details, .faq-item"));
      items.forEach((item) => {
        const summary = item.querySelector("summary .faq-question span, .faq-question span, summary span, summary");
        const answer = item.querySelector(".faq-answer, .faq-answer p");
        if (!summary && !answer) return;
        const questionEl = document2.createElement("p");
        questionEl.textContent = summary ? summary.textContent.trim() : "";
        cells.push([questionEl, answer || ""]);
      });
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

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
      a.setAttribute("href", href.replace(/\.html$/, ""));
    });
  }

  // tools/importer/import-wknd-faqs.js
  var parsers = {
    "accordion-faq": parse
  };
  var PAGE_TEMPLATE = {
    name: "wknd-faqs",
    description: 'WKND FAQs: H1 + hero image + intro (default content), a 7-item accordion (accordion-faq), and a "Need more help?" contact block (default content).',
    urls: [
      "https://wknd.site/us/en/faqs.html"
    ],
    blocks: [
      { name: "accordion-faq", instances: [".cmp-accordion"] }
    ],
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
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      if (blockDef.name.startsWith("section-")) return;
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_wknd_faqs_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const smd = WebImporter.Blocks.createBlock(document2, {
        name: "Section Metadata",
        cells: [["Style", "faqs"]]
      });
      main.appendChild(smd);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = "/us/en/faqs";
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_wknd_faqs_exports);
})();
