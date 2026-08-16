
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiClientService } from '../../../../core/http/api-client.service';
import {
  ApiResponse,
  CreateInvoiceRequest,
  Invoice,
  InvoiceCollection,
  InvoiceItem,
  RecordInvoicePaymentRequest,
  ReservationLookup
} from '../models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoicesApiService {
  private readonly api = inject(ApiClientService);
  private readonly http = inject(HttpClient);

  getAll(): Observable<InvoiceCollection> {
    return this.api
      .get<ApiResponse<unknown> | unknown>('invoices')
      .pipe(map(response => this.normalizeCollection(this.unwrap(response))));
  }

  getById(id: string): Observable<Invoice> {
    return this.api
      .get<ApiResponse<unknown> | unknown>(`invoices/${id}`)
      .pipe(map(response => this.normalizeInvoice(this.unwrap(response))));
  }

  create(request: CreateInvoiceRequest): Observable<Invoice> {
    return this.api
      .post<ApiResponse<unknown> | unknown>('invoices', request)
      .pipe(map(response => this.normalizeInvoice(this.unwrap(response))));
  }

  recordPayment(
    invoiceId: string,
    request: RecordInvoicePaymentRequest
  ): Observable<void> {
    return this.api
      .post<ApiResponse<unknown> | unknown>(
        `invoices/${invoiceId}/payments`,
        request
      )
      .pipe(map(() => void 0));
  }

  getPdf(invoiceId: string): Observable<Blob> {
    return this.http.get(
      `/api/v1/invoices/${invoiceId}/pdf`,
      { responseType: 'blob' }
    );
  }

  getReservations(): Observable<ReservationLookup[]> {
    return this.api
      .get<ApiResponse<unknown> | unknown>('reservations')
      .pipe(map(response => this.normalizeReservations(this.unwrap(response))));
  }

  private unwrap(response: ApiResponse<unknown> | unknown): unknown {
    if (
      response !== null &&
      typeof response === 'object' &&
      !Array.isArray(response) &&
      'data' in response
    ) {
      return (response as ApiResponse<unknown>).data;
    }
    return response;
  }

  private normalizeCollection(payload: unknown): InvoiceCollection {
    if (Array.isArray(payload)) {
      const items = payload
        .map(value => this.tryNormalizeInvoice(value))
        .filter((value): value is Invoice => value !== null);
      return { items, totalItems: items.length };
    }

    if (payload === null || typeof payload !== 'object') {
      return { items: [], totalItems: 0 };
    }

    const row = payload as Record<string, unknown>;
    const source =
      row['items'] ??
      row['Items'] ??
      row['invoices'] ??
      row['Invoices'];

    const values = Array.isArray(source) ? source : [];
    const items = values
      .map(value => this.tryNormalizeInvoice(value))
      .filter((value): value is Invoice => value !== null);

    return {
      items,
      totalItems: this.numberValue(
        row['totalItems'] ??
        row['TotalItems'] ??
        row['totalRecords'] ??
        row['TotalRecords'],
        items.length
      )
    };
  }

  private normalizeInvoice(payload: unknown): Invoice {
    const invoice = this.tryNormalizeInvoice(payload);
    if (!invoice) {
      throw new Error('Invalid invoice response.');
    }
    return invoice;
  }

  private tryNormalizeInvoice(payload: unknown): Invoice | null {
    if (
      payload === null ||
      typeof payload !== 'object' ||
      Array.isArray(payload)
    ) {
      return null;
    }

    const row = payload as Record<string, unknown>;
    const id = this.stringValue(row['id'] ?? row['Id']);
    if (!id) return null;

    const totalAmount = this.numberValue(
      row['totalAmount'] ?? row['TotalAmount']
    );
    const paidAmount = this.numberValue(
      row['paidAmount'] ?? row['PaidAmount']
    );
    const balanceRaw = row['balanceAmount'] ?? row['BalanceAmount'];

    return {
      id,
      hotelId: this.nullableString(row['hotelId'] ?? row['HotelId']),
      guestId: this.stringValue(row['guestId'] ?? row['GuestId']),
      reservationId: this.nullableString(
        row['reservationId'] ?? row['ReservationId']
      ),
      invoiceNumber: this.stringValue(
        row['invoiceNumber'] ?? row['InvoiceNumber']
      ),
      invoiceDate: this.stringValue(
        row['invoiceDate'] ?? row['InvoiceDate']
      ),
      dueDate: this.stringValue(row['dueDate'] ?? row['DueDate']),
      subtotal: this.numberValue(row['subtotal'] ?? row['Subtotal']),
      discountAmount: this.numberValue(
        row['discountAmount'] ?? row['DiscountAmount']
      ),
      taxAmount: this.numberValue(row['taxAmount'] ?? row['TaxAmount']),
      totalAmount,
      paidAmount,
      balanceAmount:
        balanceRaw === null || balanceRaw === undefined
          ? Math.max(0, totalAmount - paidAmount)
          : this.numberValue(balanceRaw),
      status: this.stringValue(row['status'] ?? row['Status']),
      guestName: this.stringValue(row['guestName'] ?? row['GuestName']),
      createdAtUtc: this.nullableString(
        row['createdAtUtc'] ?? row['CreatedAtUtc']
      ),
      items: this.normalizeItems(
        row['items'] ??
        row['Items'] ??
        row['invoiceItems'] ??
        row['InvoiceItems']
      )
    };
  }

  private normalizeItems(value: unknown): InvoiceItem[] {
    if (!Array.isArray(value)) return [];
    return value
      .map(item => this.tryNormalizeItem(item))
      .filter((item): item is InvoiceItem => item !== null);
  }

  private tryNormalizeItem(value: unknown): InvoiceItem | null {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    const row = value as Record<string, unknown>;
    const id = this.stringValue(row['id'] ?? row['Id']);
    if (!id) return null;

    return {
      id,
      invoiceId: this.nullableString(row['invoiceId'] ?? row['InvoiceId']),
      description: this.stringValue(row['description'] ?? row['Description']),
      quantity: this.numberValue(row['quantity'] ?? row['Quantity']),
      unit: this.stringValue(row['unit'] ?? row['Unit']),
      unitPrice: this.numberValue(row['unitPrice'] ?? row['UnitPrice'])
    };
  }

  private normalizeReservations(payload: unknown): ReservationLookup[] {
    const values = Array.isArray(payload)
      ? payload
      : (
          payload !== null &&
          typeof payload === 'object' &&
          !Array.isArray(payload)
        )
        ? this.extractArray(payload as Record<string, unknown>)
        : [];

    return values
      .map(value => this.tryNormalizeReservation(value))
      .filter((value): value is ReservationLookup => value !== null);
  }

  private extractArray(row: Record<string, unknown>): unknown[] {
    const source =
      row['items'] ??
      row['Items'] ??
      row['reservations'] ??
      row['Reservations'];
    return Array.isArray(source) ? source : [];
  }

  private tryNormalizeReservation(value: unknown): ReservationLookup | null {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    const row = value as Record<string, unknown>;
    const id = this.stringValue(row['id'] ?? row['Id']);
    if (!id) return null;

    return {
      id,
      reservationNumber: this.stringValue(
        row['reservationNumber'] ?? row['ReservationNumber']
      ),
      guestId: this.stringValue(row['guestId'] ?? row['GuestId']),
      guestName: this.stringValue(row['guestName'] ?? row['GuestName']),
      roomNumber: this.nullableString(row['roomNumber'] ?? row['RoomNumber']),
      roomTypeName: this.stringValue(
        row['roomTypeName'] ?? row['RoomTypeName']
      ),
      checkInDate: this.stringValue(
        row['checkInDate'] ?? row['CheckInDate']
      ),
      checkOutDate: this.stringValue(
        row['checkOutDate'] ?? row['CheckOutDate']
      ),
      nightlyRate: this.numberValue(
        row['nightlyRate'] ?? row['NightlyRate']
      ),
      totalAmount: this.numberValue(
        row['totalAmount'] ?? row['TotalAmount']
      ),
      status: this.stringValue(row['status'] ?? row['Status'])
    };
  }

  private stringValue(value: unknown): string {
    if (value === null || value === undefined) return '';
    return typeof value === 'string' ? value : String(value);
  }

  private nullableString(value: unknown): string | null {
    const result = this.stringValue(value).trim();
    return result ? result : null;
  }

  private numberValue(value: unknown, fallback = 0): number {
    const result = Number(value);
    return Number.isFinite(result) ? result : fallback;
  }
}
