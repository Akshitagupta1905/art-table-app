export interface Artwork {
  id: number;
  title: string;
  place_of_origin: string | null;
  artist_display: string | null;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
}

export interface ApiPagination {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
}

export interface ApiResponse {
  data: Artwork[];
  pagination: ApiPagination;
}

/**
 * Selection Strategy:
 * 
 * We track selection using two Sets of IDs:
 * - selectedIds: IDs explicitly selected
 * - pendingCount: how many rows from start of dataset should be selected
 *   (used for custom N-row selection without prefetching)
 * 
 * When pendingCount > 0, rows whose global index (across all pages) falls
 * within [0, pendingCount) are considered selected unless they're in deselectedIds.
 * 
 * This avoids any prefetching of other pages.
 */
export interface SelectionState {
  // Explicitly selected individual IDs (page-by-page manual selection)
  selectedIds: Set<number>;
  // IDs explicitly deselected (used when pendingCount is active)
  deselectedIds: Set<number>;
  // Custom N-row selection: select first N rows across all pages
  // 0 means not active
  pendingCount: number;
}
