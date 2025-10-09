export interface LayoutItem {
  id: string;
  title: string;
  slug: string;
  type: "layout";
  section: {
    paddingY: { sm: number; md: number; lg: number };
    background: "surface" | "alt" | "none";
    container: {
      maxWidth: "sm" | "md" | "lg" | "xl";
      rows: LayoutRow[];
    };
  };
  meta: { tags: string[]; previewHint?: string };
}

export interface LayoutRow {
  id: string;
  gap: { sm: number; md: number };
  align: "start" | "center" | "end" | "stretch";
  columns: LayoutColumn[];
}

export interface LayoutColumn {
  id: string;
  width: { lg?: string; md?: string; sm?: "1fr" };
  minHeight?: number;
  placeholders?: string[];
}
