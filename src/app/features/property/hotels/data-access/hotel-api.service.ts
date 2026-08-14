import {
  inject,
  Injectable
} from '@angular/core';

import {
  map,
  Observable
} from 'rxjs';

import {
  ApiClientService
} from '../../../../core/http/api-client.service';

import {
  ApiResponse,
  CreateHotelRequest,
  Hotel,
  HotelQuery,
  PagedResult,
  UpdateHotelRequest
} from '../models/hotel.model';


// =========================================================
// RESPONSE TYPES
//
// Supports both:
//
// 1.
// {
//   data: Hotel[],
//   meta: { pagination: ... }
// }
//
// 2.
// Hotel[]
//
// This protects the feature if ApiClientService already
// unwraps the response.
// =========================================================

type HotelListApiResponse =
  | ApiResponse<Hotel[]>
  | Hotel[];

type HotelApiResponse =
  | ApiResponse<Hotel>
  | Hotel;


@Injectable({
  providedIn: 'root'
})
export class HotelApiService {

  private readonly api =
    inject(
      ApiClientService
    );


  // =========================================================
  // GET ALL
  //
  // GET /api/v1/hotels
  //
  // Backend:
  //
  // pageNumber
  // pageSize
  // search
  // =========================================================

  getPage(
    query: HotelQuery = {}
  ): Observable<PagedResult<Hotel>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;


    const params =
      new URLSearchParams();


    // =====================================================
    // PAGINATION
    // =====================================================

    params.set(
      'pageNumber',
      String(pageNumber)
    );

    params.set(
      'pageSize',
      String(pageSize)
    );


    // =====================================================
    // SEARCH
    // =====================================================

    const search =
      query.search?.trim();

    if (search) {

      params.set(
        'search',
        search
      );

    }


    const url =
      `hotels?${params.toString()}`;


    return this.api
      .get<HotelListApiResponse>(
        url
      )
      .pipe(

        map(response => {

          // =================================================
          // CASE 1
          //
          // ApiClientService already returned Hotel[]
          // =================================================

          if (
            Array.isArray(response)
          ) {

            const items =
              response;

            return {
              items,

              pageNumber,

              pageSize,

              totalItems:
                items.length,

              totalPages:
                Math.max(
                  1,
                  Math.ceil(
                    items.length /
                    pageSize
                  )
                ),

              hasPreviousPage:
                pageNumber > 1,

              hasNextPage:
                false
            };
          }


          // =================================================
          // CASE 2
          //
          // Normal backend ApiResponse<Hotel[]>
          // =================================================

          const items =
            Array.isArray(
              response.data
            )
              ? response.data
              : [];


          const pagination =
            response.meta
              ?.pagination;


          const totalItems =
            pagination?.totalItems
            ??
            items.length;


          const totalPages =
            pagination?.totalPages
            ??
            Math.max(
              1,
              Math.ceil(
                totalItems /
                pageSize
              )
            );


          return {
            items,

            pageNumber:
              pagination?.pageNumber
              ??
              pageNumber,

            pageSize:
              pagination?.pageSize
              ??
              pageSize,

            totalItems,

            totalPages,

            hasPreviousPage:
              pagination?.hasPreviousPage
              ??
              pageNumber > 1,

            hasNextPage:
              pagination?.hasNextPage
              ??
              pageNumber < totalPages
          };
        })

      );
  }


  // =========================================================
  // GET BY ID
  //
  // GET /api/v1/hotels/{id}
  // =========================================================

  getById(
    id: string
  ): Observable<Hotel> {

    return this.api
      .get<HotelApiResponse>(
        `hotels/${id}`
      )
      .pipe(

        map(response => {

          if (
            this.isHotel(response)
          ) {
            return response;
          }

          return response.data;
        })

      );
  }


  // =========================================================
  // CREATE
  //
  // POST /api/v1/hotels
  // =========================================================

  create(
    request: CreateHotelRequest
  ): Observable<Hotel> {

    return this.api
      .post<HotelApiResponse>(
        'hotels',
        {
          name:
            request.name,

          code:
            request.code,

          currency:
            request.currency,

          isActive:
            request.isActive
            ??
            true
        }
      )
      .pipe(

        map(response => {

          if (
            this.isHotel(response)
          ) {
            return response;
          }

          return response.data;
        })

      );
  }


  // =========================================================
  // UPDATE
  //
  // PUT /api/v1/hotels/{id}
  // =========================================================

  update(
    id: string,
    request: UpdateHotelRequest
  ): Observable<Hotel> {

    return this.api
      .put<HotelApiResponse>(
        `hotels/${id}`,
        request
      )
      .pipe(

        map(response => {

          if (
            this.isHotel(response)
          ) {
            return response;
          }

          return response.data;
        })

      );
  }


  // =========================================================
  // SET ACTIVE
  //
  // PATCH /api/v1/hotels/{id}/active
  //
  // {
  //   "isActive": true
  // }
  // =========================================================

  setActive(
    id: string,
    isActive: boolean
  ): Observable<Hotel> {

    return this.api
      .patch<HotelApiResponse>(
        `hotels/${id}/active`,
        {
          isActive
        }
      )
      .pipe(

        map(response => {

          if (
            this.isHotel(response)
          ) {
            return response;
          }

          return response.data;
        })

      );
  }


  // =========================================================
  // DELETE
  //
  // DELETE /api/v1/hotels/{id}
  // =========================================================

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `hotels/${id}`
      );
  }


  // =========================================================
  // HOTEL TYPE GUARD
  // =========================================================

  private isHotel(
    value: HotelApiResponse
  ): value is Hotel {

    return (
      value !== null
      &&
      typeof value === 'object'
      &&
      'id' in value
      &&
      'name' in value
      &&
      'code' in value
    );
  }

}
