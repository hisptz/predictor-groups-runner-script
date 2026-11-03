export interface Pager {
  page: number;
  total: number;
  pageSize: number;
  nextPage?: string;
  pageCount: number;
}

export interface OrgUnit {
  id: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  displayName: string;
}

export interface Predictor {
  id: string;
  name: string;
}

export interface PredictorGroup {
  id: string;
  name: string;
  predictors: Predictor[];
}

export interface DateIntervals {
  startDate: string;
  endDate: string;
}
