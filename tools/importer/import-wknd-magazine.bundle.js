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

  // tools/importer/import-wknd-magazine.js
  var import_wknd_magazine_exports = {};
  __export(import_wknd_magazine_exports, {
    default: () => import_wknd_magazine_default
  });

  // tools/importer/parsers/teaser-columns.js
  function parse(element, { document: document2 }) {
    const content = element.querySelector(".cmp-teaser__content") || element;
    const img = element.querySelector("img");
    const body = [];
    const pretitle = content.querySelector(".cmp-teaser__pretitle");
    if (pretitle && pretitle.textContent.trim()) {
      const p = document2.createElement("p");
      const strong = document2.createElement("strong");
      strong.textContent = pretitle.textContent.trim();
      p.appendChild(strong);
      body.push(p);
    }
    const title = content.querySelector(".cmp-teaser__title, h1, h2, h3");
    if (title) {
      const h = document2.createElement("h2");
      h.textContent = title.textContent.trim();
      body.push(h);
    }
    const desc = content.querySelector(".cmp-teaser__description");
    if (desc && desc.textContent.trim()) {
      const p = document2.createElement("p");
      p.textContent = desc.textContent.trim();
      body.push(p);
    }
    const cta = content.querySelector(".cmp-teaser__action-link, a");
    if (cta && cta.getAttribute("href")) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.setAttribute("href", cta.getAttribute("href"));
      a.textContent = cta.textContent.trim() || "Read More";
      p.appendChild(a);
      body.push(p);
    }
    if (!img && body.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[img || "", body]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-magazine.js
  function parse2(element, { document: document2 }) {
    const items = [...element.querySelectorAll(":scope > li")];
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = items.map((li) => {
      const article = li.querySelector("article") || li;
      const img = article.querySelector("img");
      const links = [...article.querySelectorAll("a")];
      const textLink = links.find((a) => a.textContent.trim()) || links[0];
      const href = textLink ? textLink.getAttribute("href") : null;
      const titleText = textLink ? textLink.textContent.trim() : "";
      let desc = "";
      const descEl = [...article.children].find((c) => c.tagName !== "A" && c.textContent.trim());
      if (descEl) desc = descEl.textContent.trim();
      const body = [];
      if (titleText) {
        const h3 = document2.createElement("h3");
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = titleText;
          h3.appendChild(a);
        } else {
          h3.textContent = titleText;
        }
        body.push(h3);
      }
      if (desc) {
        const p = document2.createElement("p");
        p.textContent = desc;
        body.push(p);
      }
      return [img || "", body];
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-magazine", cells });
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
      let p = href.replace(/\.html$/, "");
      if (p === "/us/en") p = "/";
      else p = p.replace(/^\/us\/en/, "");
      if (p === "") p = "/";
      a.setAttribute("href", p);
    });
  }

  // tools/importer/import-wknd-magazine.js
  var parsers = {
    "teaser-columns": parse,
    "cards-magazine": parse2
  };
  var PAGE_TEMPLATE = {
    name: "wknd-magazine",
    description: "WKND Magazine hub: H1, featured article teaser (columns-article), All Articles grid (cards-magazine, 5 cards), Members Only heading + 2 locked teasers (columns-article).",
    urls: [
      "https://wknd.site/us/en/magazine.html"
    ],
    blocks: [
      // teasers (featured + members-only) -> columns-article
      { name: "teaser-columns", instances: [".cmp-teaser"] },
      // article listing -> cards-magazine
      { name: "cards-magazine", instances: ["ul.cmp-image-list"] }
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
  var import_wknd_magazine_default = {
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
      const membersHeading = [...main.querySelectorAll("h2")].find((h) => /members only/i.test(h.textContent));
      if (membersHeading) {
        const firstRowText = (t) => t.querySelector("tr") ? t.querySelector("tr").textContent.replace(/\s+/g, " ").trim().toLowerCase() : "";
        const all = [...main.querySelectorAll("h2, table")];
        const headingIdx = all.indexOf(membersHeading);
        const membersBlocks = all.filter((el, i) => i > headingIdx && el.tagName === "TABLE" && firstRowText(el).startsWith("columns"));
        if (membersBlocks.length >= 2) {
          const first = membersBlocks[0];
          first.parentNode.insertBefore(document2.createElement("hr"), first);
          const last = membersBlocks[membersBlocks.length - 1];
          const smd = WebImporter.Blocks.createBlock(document2, {
            name: "Section Metadata",
            cells: [["Style", "members"]]
          });
          if (last.nextSibling) last.parentNode.insertBefore(smd, last.nextSibling);
          else last.parentNode.appendChild(smd);
        }
      }
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      main.querySelectorAll('a[href*="demdex"], a[href*="dest5.html"]').forEach((a) => (a.closest("p") || a).remove());
      const path = "/magazine";
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
  return __toCommonJS(import_wknd_magazine_exports);
})();
