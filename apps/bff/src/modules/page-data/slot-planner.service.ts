import type {
  LocaleContext,
  PageContentNode,
  ResolvedPageModel,
  ResolvedPageSlot,
  SlotManifest,
} from "@commerce/shared-types";
import { Injectable, Logger } from "@nestjs/common";
import { rendererKeyForNode } from "./renderer-key.map";
import type { ResolvedRouteDescriptor } from "./routing/route-rule.types";

type QueryMap = Record<string, string | undefined>;
const MAX_CRITICAL_INLINE_BYTES = Number(
  process.env.MAX_CRITICAL_INLINE_BYTES ?? "24576",
);

@Injectable()
export class SlotPlannerService {
  private readonly logger = new Logger(SlotPlannerService.name);

  plan(params: {
    resolved: ResolvedPageModel;
    path: string;
    query: QueryMap;
    localeContext: LocaleContext;
    route?: ResolvedRouteDescriptor;
  }): SlotManifest[] {
    const { resolved, path, query, localeContext, route } = params;
    const node = resolved.content?.[0];

    if (node?.type === "product-detail") {
      return this.planProductDetail(
        node,
        path,
        query,
        localeContext,
        resolved,
        route,
      );
    }

    if (node?.type === "search-results") {
      return this.planSearch(node, path, query, localeContext, resolved);
    }

    if (node?.type === "checkout-page") {
      return this.planCheckout(node, resolved);
    }

    const defaultSlots =
      resolved.slots ?? toSlotsFromContent(resolved.content ?? []);
    const manifests = defaultSlots.map((slot) =>
      toInlineManifest(slot, resolved.revalidateTags, 300),
    );
    this.enforceCriticalInlineBudget(manifests);
    return manifests;
  }

  private planProductDetail(
    node: Extract<PageContentNode, { type: "product-detail" }>,
    path: string,
    query: QueryMap,
    localeContext: LocaleContext,
    resolved: ResolvedPageModel,
    route?: ResolvedRouteDescriptor,
  ): SlotManifest[] {
    const canonicalProductHandle =
      route?.refs.productHandle ?? node.product.handle;
    const baseQuery = withLocaleContext(
      { path, productHandle: canonicalProductHandle, ...query },
      localeContext,
    );

    const manifests: SlotManifest[] = [
      {
        id: "slot:pdp-main",
        rendererKey: "page.pdp-main",
        priority: "critical",
        stream: "blocking",
        dataMode: "inline",
        presentation: {
          variantKey: "default",
        },
        inlineProps: {
          product: node.product,
          breadcrumbs: node.breadcrumbs,
          containerClassName: node.containerClassName,
        },
        revalidateTags: resolved.revalidateTags,
        staleAfterSeconds: 300,
      },
      {
        id: "slot:pdp-recommendations",
        rendererKey: "page.pdp-recommendations",
        priority: "deferred",
        stream: "deferred",
        dataMode: "reference",
        presentation: {
          variantKey: "default",
        },
        slotRef: {
          endpoint: "/page-data/slot",
          query: {
            slotId: "slot:pdp-recommendations",
            ...baseQuery,
          },
          ttlSeconds: 120,
        },
        revalidateTags: [`products:${canonicalProductHandle}:recs`, "products"],
        staleAfterSeconds: 120,
        fallbackKey: "slot.fallback.recommendations",
      },
      {
        id: "slot:pdp-reviews",
        rendererKey: "page.pdp-reviews",
        priority: "deferred",
        stream: "deferred",
        dataMode: "reference",
        presentation: {
          variantKey: "default",
        },
        slotRef: {
          endpoint: "/page-data/slot",
          query: {
            slotId: "slot:pdp-reviews",
            ...baseQuery,
          },
          ttlSeconds: 60,
        },
        revalidateTags: [`reviews:${node.product.id}`],
        staleAfterSeconds: 60,
        fallbackKey: "slot.fallback.reviews",
      },
      {
        id: "slot:pdp-faq",
        rendererKey: "page.pdp-faq",
        priority: "deferred",
        stream: "deferred",
        dataMode: "reference",
        presentation: {
          variantKey: "default",
        },
        slotRef: {
          endpoint: "/page-data/slot",
          query: {
            slotId: "slot:pdp-faq",
            ...baseQuery,
          },
          ttlSeconds: 300,
        },
        revalidateTags: [`faq:${canonicalProductHandle}`],
        staleAfterSeconds: 300,
        fallbackKey: "slot.fallback.faq",
      },
    ];
    this.enforceCriticalInlineBudget(manifests);
    return manifests;
  }

  private planCheckout(
    node: Extract<PageContentNode, { type: "checkout-page" }>,
    resolved: ResolvedPageModel,
  ): SlotManifest[] {
    const manifests: SlotManifest[] = [
      {
        id: "slot:checkout-header",
        rendererKey: "page.checkout-header",
        priority: "critical",
        stream: "blocking",
        dataMode: "inline",
        presentation: {
          variantKey: "default",
        },
        inlineProps: {
          title: node.title,
          subtitle: node.subtitle,
        },
        revalidateTags: resolved.revalidateTags,
        staleAfterSeconds: 0,
      },
      {
        id: "slot:checkout-main",
        rendererKey: "page.checkout-main",
        priority: "critical",
        stream: "blocking",
        dataMode: "inline",
        presentation: {
          variantKey: node.config.flowType,
        },
        inlineProps: {
          cart: node.cart,
          config: node.config,
        },
        revalidateTags: resolved.revalidateTags,
        staleAfterSeconds: 0,
      },
      {
        id: "slot:checkout-summary",
        rendererKey: "page.checkout-summary",
        priority: "critical",
        stream: "blocking",
        dataMode: "inline",
        presentation: {
          variantKey: "default",
        },
        inlineProps: {
          cart: node.cart,
          initialShippingCost: node.initialShippingCost,
        },
        revalidateTags: resolved.revalidateTags,
        staleAfterSeconds: 0,
      },
    ];
    this.enforceCriticalInlineBudget(manifests);
    return manifests;
  }

  private planSearch(
    node: Extract<PageContentNode, { type: "search-results" }>,
    path: string,
    query: QueryMap,
    localeContext: LocaleContext,
    resolved: ResolvedPageModel,
  ): SlotManifest[] {
    const baseQuery = withLocaleContext({ path, ...query }, localeContext);

    const manifests: SlotManifest[] = [
      {
        id: "slot:search-summary",
        rendererKey: "page.search-summary",
        priority: "critical",
        stream: "blocking",
        dataMode: "inline",
        presentation: {
          variantKey: "default",
        },
        inlineProps: {
          breadcrumbs: node.breadcrumbs,
          title: node.title,
          query: node.query,
          summaryText: node.summaryText,
          sortOptions: node.sortOptions,
          containerClassName: node.containerClassName,
        },
        revalidateTags: resolved.revalidateTags,
        staleAfterSeconds: 60,
      },
      {
        id: "slot:search-products",
        rendererKey: "page.search-products",
        priority: "deferred",
        stream: "deferred",
        dataMode: "reference",
        presentation: {
          variantKey: "default",
        },
        slotRef: {
          endpoint: "/page-data/slot",
          query: {
            slotId: "slot:search-products",
            ...baseQuery,
          },
          ttlSeconds: 60,
        },
        revalidateTags: ["products"],
        staleAfterSeconds: 60,
        fallbackKey: "slot.fallback.searchProducts",
      },
    ];
    this.enforceCriticalInlineBudget(manifests);
    return manifests;
  }

  private enforceCriticalInlineBudget(slots: SlotManifest[]) {
    const totalInlineBytes = slots
      .filter(
        (slot) =>
          slot.priority === "critical" &&
          slot.stream === "blocking" &&
          slot.dataMode === "inline",
      )
      .reduce((sum, slot) => sum + byteSize(slot.inlineProps ?? {}), 0);

    if (totalInlineBytes > MAX_CRITICAL_INLINE_BYTES) {
      this.logger.warn(
        `Critical inline payload budget exceeded: ${totalInlineBytes} bytes (max=${MAX_CRITICAL_INLINE_BYTES})`,
      );
    }
  }
}

function toInlineManifest(
  slot: ResolvedPageSlot,
  fallbackTags: string[],
  staleAfterSeconds: number,
): SlotManifest {
  return {
    id: slot.id,
    rendererKey: slot.rendererKey,
    priority: slot.priority ?? "critical",
    stream: "blocking",
    dataMode: "inline",
    presentation: {
      variantKey: "default",
    },
    inlineProps: slot.props,
    revalidateTags: slot.cacheTags ?? fallbackTags,
    staleAfterSeconds,
  };
}

function toSlotsFromContent(content: PageContentNode[]): ResolvedPageSlot[] {
  return content.map((node, index) => {
    const rendererKey = rendererKeyForNode(node.type);
    const { type: _type, ...props } = node;
    return {
      id: `${rendererKey}-${index}`,
      rendererKey,
      props,
      priority: node.type === "search-results" ? "deferred" : "critical",
    };
  });
}

function withLocaleContext(
  base: Record<string, string | undefined>,
  localeContext: LocaleContext,
): Record<string, string> {
  const entries: Array<[string, string | undefined]> = [
    ...Object.entries(base),
    ["locale", localeContext.locale],
    ["language", localeContext.language],
    ["region", localeContext.region],
    ["currency", localeContext.currency],
    ["market", localeContext.market],
    ["domain", localeContext.domain],
  ];

  const result: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

function byteSize(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value));
}
