/*
  OPTIONAL REAL-TIME SERVICE

  This file is NOT imported by the feature pages by default.

  Enable it only if your Angular project already has:

    npm install @microsoft/signalr

  and your ASP.NET backend maps NotificationHub.

  Adjust hubUrl if your real route is different.
*/

import {
  Injectable,
  signal
} from '@angular/core';

// Uncomment only when @microsoft/signalr is installed.
//
// import {
//   HubConnection,
//   HubConnectionBuilder,
//   LogLevel
// } from '@microsoft/signalr';

import {
  NotificationItem
} from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsLiveService {

  readonly latest =
    signal<NotificationItem | null>(
      null
    );

  readonly connected =
    signal(false);

  /*
  private connection?: HubConnection;

  async start(
    accessTokenFactory:
      () => string
  ): Promise<void> {

    if (
      this.connection
    ) {
      return;
    }

    this.connection =
      new HubConnectionBuilder()
        .withUrl(
          '/notification-hub',
          {
            accessTokenFactory
          }
        )
        .withAutomaticReconnect()
        .configureLogging(
          LogLevel.Warning
        )
        .build();

    this.connection.on(
      'NotificationCreated',
      (
        notification:
          NotificationItem
      ) => {
        this.latest.set(
          notification
        );
      }
    );

    await this.connection.start();

    this.connected.set(
      true
    );
  }

  async stop(): Promise<void> {

    if (
      !this.connection
    ) {
      return;
    }

    await this.connection.stop();

    this.connection =
      undefined;

    this.connected.set(
      false
    );
  }
  */
}
