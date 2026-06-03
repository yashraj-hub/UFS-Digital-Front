import { useEffect } from "react";
import { siteMeta } from "../../seo/siteMeta";

function Seo({
  title,
  description = siteMeta.description,
  canonicalPath,
  imagePath = siteMeta.imagePath,
  keywords = siteMeta.keywords,
  type = "website",
  noIndex = false,
  schema = [],
}) {
  useEffect(() => {
    const createdNodes = [];
    const head = document.head;

    const setAttributes = (node, attrs) => {
      Object.entries(attrs).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          node.setAttribute(key, String(value));
        }
      });
    };

    const upsertMeta = (selector, attrs) => {
      const existing = document.head.querySelector(selector);
      if (existing) {
        setAttributes(existing, attrs);
        return existing;
      }

      const node = document.createElement("meta");
      setAttributes(node, attrs);
      node.setAttribute("data-seo-managed", "true");
      head.appendChild(node);
      createdNodes.push(node);
      return node;
    };

    const upsertLink = (selector, attrs) => {
      const existing = document.head.querySelector(selector);
      if (existing) {
        setAttributes(existing, attrs);
        return existing;
      }

      const node = document.createElement("link");
      setAttributes(node, attrs);
      node.setAttribute("data-seo-managed", "true");
      head.appendChild(node);
      createdNodes.push(node);
      return node;
    };

    const addScript = (json) => {
      const node = document.createElement("script");
      node.type = "application/ld+json";
      node.setAttribute("data-seo-managed", "true");
      node.textContent = JSON.stringify(json);
      head.appendChild(node);
      createdNodes.push(node);
      return node;
    };

    const pageTitle = siteMeta.fullTitle(title);
    const canonicalUrl = canonicalPath ? siteMeta.absoluteUrl(canonicalPath) : siteMeta.url;
    const imageUrl = siteMeta.absoluteUrl(imagePath);

    document.title = pageTitle;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex
        ? "noindex,nofollow"
        : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    });
    upsertMeta('meta[name="author"]', { name: "author", content: siteMeta.name });
    upsertMeta('meta[name="application-name"]', { name: "application-name", content: siteMeta.name });
    upsertMeta('meta[name="referrer"]', { name: "referrer", content: "origin-when-cross-origin" });
    upsertMeta('meta[name="theme-color"]', { name: "theme-color", content: "#0f5a6b" });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: siteMeta.name });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: "en_IN" });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: pageTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    upsertMeta('meta[property="og:image:width"]', { property: "og:image:width", content: "1200" });
    upsertMeta('meta[property="og:image:height"]', { property: "og:image:height", content: "630" });
    upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: pageTitle });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: pageTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
    upsertMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt", content: pageTitle });

    upsertLink('link[rel="canonical"]', { rel: "canonical", href: canonicalUrl });

    schema.forEach((entry) => addScript(entry));

    return () => {
      createdNodes.forEach((node) => node.remove());
    };
  }, [title, description, canonicalPath, imagePath, keywords, type, noIndex, schema]);

  return null;
}

export default Seo;
