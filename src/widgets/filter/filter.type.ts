export interface TCategory {
  id: number;
  name: string;
}

export interface TCity {
  id: number;
  name: string;
}

export interface TFilterState {
  purpose: string;
  skills: number[];
  gender: string;
  citys: number[];
}

export interface TPropsFilter {
  purpose: string[];
  skills: TCategory[];
  gender: string[];
  citys: TCity[];
}

export const FILTER_CONFIG = {
  SKILLS_VISIBLE_COUNT: 6,
  CITIES_VISIBLE_COUNT: 5,
} as const;
