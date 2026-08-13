import { computed, inject, Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthStore } from '../auth/auth.store';

@Injectable({ providedIn: 'root' })
export class HotelHubService {
  private readonly auth = inject(AuthStore);
  private readonly connections = new Map<string, HubConnection>();
  readonly connectedHubs = signal<string[]>([]);
  readonly connected = computed(() => this.connectedHubs().length > 0);

  async connect(name: 'notifications'|'front-desk'|'housekeeping'|'maintenance'): Promise<HubConnection> {
    const existing = this.connections.get(name);
    if (existing?.state === HubConnectionState.Connected) return existing;
    const connection = existing ?? new HubConnectionBuilder()
      .withUrl(`${environment.hubBaseUrl}/${name}`, { accessTokenFactory: () => this.auth.accessToken() ?? '' })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(LogLevel.Warning)
      .build();
    if (!existing) this.connections.set(name, connection);
    if (connection.state === HubConnectionState.Disconnected) await connection.start();
    if (name !== 'notifications' && this.auth.user()?.hotelId) await connection.invoke('JoinHotel', this.auth.user()!.hotelId);
    this.connectedHubs.update(items => [...new Set([...items, name])]);
    return connection;
  }

  on<T>(name: 'notifications'|'front-desk'|'housekeeping'|'maintenance', event: string, handler: (payload:T)=>void): void {
    void this.connect(name).then(connection => connection.on(event, handler));
  }

  async disconnectAll(): Promise<void> {
    await Promise.all([...this.connections.values()].map(connection => connection.stop().catch(() => undefined)));
    this.connections.clear(); this.connectedHubs.set([]);
  }
}
