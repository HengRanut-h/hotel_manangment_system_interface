export interface RevenueByMethod {
  method: string;
  amount: number;
  count: number;
}

export interface RevenueReport {
  from: string;
  to: string;
  total: number;
  count: number;
  byMethod: RevenueByMethod[];
}

export interface OccupancyReport {
  date: string;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
}

export interface RevenueReportQuery {
  from: string;
  to: string;
}

export interface OccupancyReportQuery {
  date: string;
}
