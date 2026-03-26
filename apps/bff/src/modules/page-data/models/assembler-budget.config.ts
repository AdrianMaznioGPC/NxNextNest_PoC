import { Injectable } from "@nestjs/common";

/**
 * Configuration for assembler timeout budgets.
 * Maps route kinds to maximum allowed execution time in milliseconds.
 */
export interface AssemblerBudgetConfig {
  /**
   * Get the timeout budget for a given route kind.
   * @param routeKind - The route kind identifier
   * @returns Timeout in milliseconds
   */
  getBudgetMs(routeKind: string): number;
}

/**
 * Default assembler budget configuration.
 * Maps common route kinds to sensible timeout values.
 */
@Injectable()
export class DefaultAssemblerBudgetConfig implements AssemblerBudgetConfig {
  private readonly budgetMap: Record<string, number> = {
    home: 200,
    "category-list": 300,
    "category-detail": 300,
    "product-detail": 350,
    search: 300,
    cart: 150,
    checkout: 250,
    "content-page": 200,
  };

  private readonly defaultBudget = 300;

  getBudgetMs(routeKind: string): number {
    return this.budgetMap[routeKind] ?? this.defaultBudget;
  }
}
