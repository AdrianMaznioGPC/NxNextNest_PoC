export interface LoadShedScopeConfig {
  maxInflight: number;
  retryAfterSeconds: number;
}

export interface LoadSheddingConfig {
  globalMaxInflight: number;
  scopes: Record<string, LoadShedScopeConfig>;
}

export const LOAD_SHEDDING_CONFIG: LoadSheddingConfig = {
  globalMaxInflight: 500,
  scopes: {
    "page-data": { maxInflight: 200, retryAfterSeconds: 2 },
    search: { maxInflight: 100, retryAfterSeconds: 3 },
    cart: { maxInflight: 150, retryAfterSeconds: 1 },
    checkout: { maxInflight: 50, retryAfterSeconds: 1 },
    customers: { maxInflight: 50, retryAfterSeconds: 1 },
    sitemap: { maxInflight: 5, retryAfterSeconds: 10 },
  },
};

export const LOAD_SHED_SCOPE_KEY = "loadShedScope";
