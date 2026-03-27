import type { SortOption } from "./page-resolved.types";

export type ViewMode = "grid" | "list";

export type FilterGroup = {
  id: string;
  title: string;
  type: "checkbox" | "range" | "toggle";
  options: FilterOption[];
  collapsible?: boolean;
};

export type FilterOption = {
  id: string;
  label: string;
  value: string;
  count?: number;
  selected?: boolean;
};

export type ActiveFilters = Record<string, string | string[]>;

export type ListingToolbarProps = {
  sortOptions: SortOption[];
  layoutKey?: string;
  showViewToggle?: boolean;
  resultsCount?: number;
  onViewChange?: (view: ViewMode) => void;
};
