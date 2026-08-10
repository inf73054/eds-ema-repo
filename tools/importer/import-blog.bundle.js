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

  // tools/importer/import-blog.js
  var import_blog_exports = {};
  __export(import_blog_exports, {
    default: () => import_blog_default
  });

  // tools/importer/parsers/hero-collage.js
  function parse(element, { document }) {
    const columns = element.querySelectorAll(":scope > div");
    const textColumn = columns[0] || element;
    const imageColumn = columns[1] || element;
    const heading = textColumn.querySelector('h1, h2, [class*="h1-heading"], [class*="heading"]');
    const subheading = textColumn.querySelector('p, [class*="subheading"]');
    const ctaLinks = Array.from(textColumn.querySelectorAll(".button-group a, a.button"));
    const textCell = [];
    if (heading) textCell.push(heading);
    if (subheading) textCell.push(subheading);
    ctaLinks.forEach((a) => textCell.push(a));
    const images = Array.from(imageColumn.querySelectorAll("img"));
    if (!heading && !subheading && images.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([textCell, images]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-collage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document }) {
    const columns = element.querySelectorAll(":scope > div");
    const imageColumn = columns[0] || element;
    const contentColumn = columns[1] || element;
    const image = imageColumn.querySelector("img");
    const contentCell = Array.from(contentColumn.children);
    if (!image && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([image || "", contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link, :scope > a"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img");
      const bodyCell = [];
      const tag = card.querySelector(".tag");
      if (tag) bodyCell.push(tag);
      const date = card.querySelector(".article-card-meta .paragraph-sm, .paragraph-sm");
      if (date) bodyCell.push(date);
      const title = card.querySelector('h1, h2, h3, h4, [class*="heading"]');
      if (title) bodyCell.push(title);
      const href = card.getAttribute("href");
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = title ? title.textContent : href;
        bodyCell.push(link);
      }
      cells.push([img || "", bodyCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        ".navbar",
        "footer.footer"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        ".navbar",
        "footer.footer"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-astro-cid")) {
            el.removeAttribute(attr.name);
          }
        });
      });
      element.querySelectorAll("div.container").forEach((container) => {
        const parent = container.parentNode;
        if (!parent) return;
        while (container.firstChild) {
          parent.insertBefore(container.firstChild, container);
        }
        container.remove();
      });
      element.querySelectorAll("[class]").forEach((el) => {
        const kept = [...el.classList].filter((c) => !c.startsWith("utility-") && !c.startsWith("grid-layout") && !c.startsWith("grid-gap"));
        if (kept.length) {
          el.setAttribute("class", kept.join(" "));
        } else {
          el.removeAttribute("class");
        }
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!Array.isArray(sections) || sections.length < 2) return;
      const document = element.ownerDocument;
      [...sections].reverse().forEach((section, revIndex) => {
        const index = sections.length - 1 - revIndex;
        if (!section || !section.selector) return;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) return;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(metaBlock);
        }
        if (index > 0) {
          sectionEl.before(document.createElement("hr"));
        }
      });
    }
  }

  // tools/importer/import-blog.js
  var parsers = {
    "hero-collage": parse,
    "columns-article": parse2,
    "cards-article": parse3
  };
  var PAGE_TEMPLATE = {
    name: "blog",
    description: "Blog index: hero (heading + CTAs + image), featured article (image + tag/date/heading/desc/CTA), Latest Articles cards grid (6 cards), and a lime accent CTA banner.",
    urls: [
      "https://wknd-trendsetters.site/blog"
    ],
    blocks: [
      { name: "hero-collage", instances: ["#main-content > header.section.secondary-section > div.container > div.grid-layout"] },
      { name: "columns-article", instances: ["#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout"] },
      { name: "cards-article", instances: ["#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.grid-gap-md"] },
      { name: "section-accent", instances: ["#main-content > section.section.accent-section"], section: "accent" }
    ],
    sections: [
      { id: "s1", name: "Hero", selector: "#main-content > header.section.secondary-section", style: "grey", blocks: ["hero-collage"], defaultContent: [] },
      { id: "s2", name: "Featured article", selector: "#main-content > section.section:nth-of-type(1)", style: "light", blocks: ["columns-article"], defaultContent: [] },
      { id: "s3", name: "Latest Articles", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "grey", blocks: ["cards-article"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) h2", "#main-content > section.section.secondary-section:nth-of-type(2) p.paragraph-lg"] },
      { id: "s4", name: "Accent CTA", selector: "#main-content > section.section.accent-section", style: "accent", blocks: [], defaultContent: ["#main-content > section.section.accent-section h2", "#main-content > section.section.accent-section p"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
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
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      if (blockDef.name.startsWith("section-")) return;
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_blog_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_blog_exports);
})();
