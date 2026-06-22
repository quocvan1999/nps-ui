import { useEffect } from "react";
import type { SEOProps } from "./types";

export function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    const baseTitle = "NPS UI";
    const fullTitle = title
      ? `${title} | ${baseTitle}`
      : `${baseTitle} — Thư viện React Component`;
    document.title = fullTitle;

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", description);
      }

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute("content", description);
      }
    }
  }, [title, description]);

  return null;
}
