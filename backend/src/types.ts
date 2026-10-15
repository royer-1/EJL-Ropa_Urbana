export interface ColorRow {
  id: number;
  name: string;
  hex_code: string;
}

export interface ImageRow {
  id: number;
  color_id: number;
  url: string;
}

export interface SizeRow {
  color_id: number;
  size: string;
  is_sold_out: number;
}  