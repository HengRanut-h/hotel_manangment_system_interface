// =========================================================
// AVAILABLE ROOM
// =========================================================

export interface AvailabilityRoom {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  roomTypeName: string;
  baseRate: number;
  status: string;
}


// =========================================================
// AVAILABILITY SEARCH QUERY
//
// Backend:
//
// GET /api/v1/availability
//
// ?checkIn=2026-08-20
// &checkOut=2026-08-22
// &roomTypeId=<optional-guid>
// =========================================================

export interface AvailabilityQuery {
  checkIn: string;
  checkOut: string;
  roomTypeId?: string | null;
}


// =========================================================
// ROOM TYPE OPTION
//
// Used by select elements.
//
// name -> displayed to user
// id   -> sent to backend
// =========================================================

export interface AvailabilityRoomTypeOption {
  id: string;
  name: string;
}


// =========================================================
// SEARCH SUMMARY
// =========================================================

export interface AvailabilitySearchSummary {
  roomsFound: number;
  roomTypes: number;
  lowestBaseRate: number | null;
  averageBaseRate: number | null;
}
