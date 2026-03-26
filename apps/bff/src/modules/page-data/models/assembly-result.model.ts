import type { PageContentNode, PageSeo } from "@commerce/shared-types";

/**
 * Result returned by page assemblers.
 * Contains the assembled page content and metadata.
 */
export type AssemblyResult = {
  /** HTTP status code (typically 200) */
  status: 200 | 301 | 404;
  /** SEO metadata for the page */
  seo: PageSeo;
  /** Page content nodes to be rendered */
  content: PageContentNode[];
  /** Cache revalidation tags */
  revalidateTags: string[];
  /** Identifier for the assembler that produced this result */
  assemblerKey: string;
  /** Assembly schema version */
  assemblyVersion: string;
  /** Translation version (if assembler provides it) */
  translationVersion?: string;
};
