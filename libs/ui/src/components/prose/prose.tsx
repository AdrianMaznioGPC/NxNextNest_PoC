import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface ProseProps extends HTMLAttributes<HTMLDivElement> {
  /** Raw HTML string to render inside the prose container. */
  html: string;
}

/**
 * Typography container for rich-text / CMS HTML content.
 * Applies consistent heading, link, list, and paragraph styles.
 *
 * @example
 * ```tsx
 * <Prose html={product.descriptionHtml} className="mt-6" />
 * ```
 */
export const Prose = forwardRef<HTMLDivElement, ProseProps>(
  ({ html, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "prose mx-auto max-w-6xl text-base leading-7",
          "text-foreground",
          "prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-foreground",
          "prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg",
          "prose-a:text-foreground prose-a:underline hover:prose-a:text-muted-foreground",
          "prose-strong:text-foreground",
          "prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6",
          "prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
        {...props}
      />
    );
  },
);
Prose.displayName = "Prose";
