import type { BaseProduct, Breadcrumb } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type { ProductPort } from "../../ports/product.port";
import { StoreContext } from "../../store";

const API_BASE_URL = process.env.SPRING_API_URL ?? "http://localhost:5000";

/**
 * ProductPort adapter that fetches product data from the Spring Boot API
 * backed by PostgreSQL. Forwards store context via HTTP headers.
 */
@Injectable()
export class SpringProductAdapter implements ProductPort {
  constructor(private readonly storeCtx: StoreContext) {}

  private get headers(): Record<string, string> {
    return {
      "X-Store-Code": this.storeCtx.storeCode,
      "X-Locale": this.storeCtx.locale,
    };
  }

  async getProducts(params: { query?: string }): Promise<BaseProduct[]> {
    const url = new URL("/products", API_BASE_URL);
    if (params.query) url.searchParams.set("query", params.query);
    const res = await fetch(url.toString(), { headers: this.headers });
    if (!res.ok) return [];
    return (await res.json()) as BaseProduct[];
  }

  async getProduct(handle: string): Promise<BaseProduct | undefined> {
    const res = await fetch(`${API_BASE_URL}/products/by-handle/${handle}`, {
      headers: this.headers,
    });
    if (res.status === 404) return undefined;
    if (!res.ok) return undefined;
    return (await res.json()) as BaseProduct;
  }

  async getProductById(id: string): Promise<BaseProduct | undefined> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: this.headers,
    });
    if (res.status === 404) return undefined;
    if (!res.ok) return undefined;
    return (await res.json()) as BaseProduct;
  }

  async getProductRecommendations(productId: string): Promise<BaseProduct[]> {
    const res = await fetch(
      `${API_BASE_URL}/products/${productId}/recommendations`,
      { headers: this.headers },
    );
    if (!res.ok) return [];
    return (await res.json()) as BaseProduct[];
  }

  async getProductBreadcrumbs(_productId: string): Promise<Breadcrumb[]> {
    // Breadcrumbs depend on collection hierarchy which is still in mock.
    // Return empty — the mock collection adapter handles breadcrumbs.
    return [];
  }
}
