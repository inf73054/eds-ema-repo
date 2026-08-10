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

  // tools/importer/import-wknd-adventure.js
  var import_wknd_adventure_exports = {};
  __export(import_wknd_adventure_exports, {
    default: () => import_wknd_adventure_default
  });

  // tools/importer/parsers/trip-details.js
  function parse(element, { document: document2 }) {
    const items = [...element.querySelectorAll(".cmp-contentfragment__element")];
    const rows = [];
    items.forEach((item) => {
      const key = item.querySelector(".cmp-contentfragment__element-title, dt");
      const val = item.querySelector(".cmp-contentfragment__element-value, dd");
      if (!key && !val) return;
      const kDiv = document2.createElement("div");
      kDiv.textContent = key ? key.textContent.trim() : "";
      const vDiv = document2.createElement("div");
      vDiv.textContent = val ? val.textContent.trim() : "";
      rows.push([kDiv, vDiv]);
    });
    if (rows.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const head = document2.createElement("div");
    head.textContent = "Trip Details";
    const cells = [[head, ""], ...rows];
    const block = WebImporter.Blocks.createBlock(document2, { name: "table", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-adventure.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
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
        'nav[aria-label="Breadcrumb"]',
        ".cmp-breadcrumb",
        // hidden mobile navigation menu appended at end of <body> (Home/Magazine/…)
        "#mobileNav",
        'a[href="#mobileNav"]',
        ".cmp-navigation",
        "nav.navigation"
      ]);
      element.querySelectorAll('.cmp-carousel__actions, .cmp-carousel__action, .cmp-carousel__indicators, [class*="carousel__action"]').forEach((el) => el.remove());
      element.querySelectorAll('.cmp-carousel button, [class*="carousel"] button').forEach((btn) => btn.remove());
      element.querySelectorAll('h5, [class*="sharing"], [data-cmp-is="sharing"]').forEach((el) => {
        if (/share this/i.test(el.textContent || "")) {
          const next = el.nextElementSibling;
          el.remove();
          if (next && next.querySelector && next.querySelector('a[href*="pinterest"], a[href*="facebook"], a[href*="twitter"]')) {
            next.remove();
          }
        }
      });
      element.querySelectorAll("h3.cmp-contentfragment__title, .cmp-contentfragment__title").forEach((el) => el.remove());
      element.querySelectorAll(".cmp-tabs").forEach((tabs) => {
        const labels = [...tabs.querySelectorAll(".cmp-tabs__tab")].map((t) => t.textContent.trim());
        const panels = [...tabs.querySelectorAll(".cmp-tabs__tabpanel")];
        const frag = document.createElement("div");
        panels.forEach((panel, i) => {
          const label = labels[i] || "";
          if (label) {
            const h = document.createElement("h2");
            h.textContent = label;
            frag.appendChild(h);
          }
          const body = panel.querySelector(".cmp-contentfragment__element-value, article, .cmp-container") || panel;
          [...body.children].forEach((child) => {
            frag.appendChild(child.cloneNode(true));
          });
        });
        tabs.replaceWith(frag);
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["header", "footer", "search"]);
      element.querySelectorAll("a[href]").forEach((a) => {
        let href = (a.getAttribute("href") || "").replace(/^https?:\/\/wknd\.site/i, "");
        if (!href.startsWith("/us/en")) return;
        let p = href.replace(/\.html$/, "");
        p = p === "/us/en" ? "/" : p.replace(/^\/us\/en/, "");
        if (p === "") p = "/";
        a.setAttribute("href", p);
      });
    }
  }

  // tools/importer/import-wknd-adventure.js
  var parsers = {
    "trip-details": parse
  };
  var PAGE_TEMPLATE = {
    name: "wknd-adventure",
    description: "WKND adventure detail: hero image + H1 + trip-details table + Overview/Itinerary/What-to-Bring content (default). Tabs flattened to headings + content by the adventure transformer.",
    urls: [
      "https://wknd.site/us/en/adventures/bali-surf-camp.html"
    ],
    blocks: [
      { name: "trip-details", instances: ["dl.cmp-contentfragment__elements"] }
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
  var import_wknd_adventure_default = {
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
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const pathname = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const slug = pathname.split("/").pop();
      const path = `/adventures/${slug}`;
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
  return __toCommonJS(import_wknd_adventure_exports);
})();
