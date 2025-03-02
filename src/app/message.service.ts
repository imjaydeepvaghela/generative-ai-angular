import { inject, Injectable, signal } from '@angular/core';
import { filter, map, Observable, startWith } from 'rxjs';
import {
  HttpClient,
  HttpDownloadProgressEvent,
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';

export interface Message {
  id: string;
  text: string;
  fromUser: boolean;
  generating?: boolean;
  timestamp: Date; // Added timestamp property
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly http = inject(HttpClient);

  private readonly _completeMessages = signal<Message[]>([]);
  private readonly _messages = signal<Message[]>([]);
  private readonly _generatingInProgress = signal<boolean>(false);

  readonly messages = this._messages.asReadonly();
  readonly generatingInProgress = this._generatingInProgress.asReadonly();

  sendMessage(prompt: string): void {
    this._generatingInProgress.set(true);

    this._completeMessages.set([
      ...this._completeMessages(),
      {
        id: window.crypto.randomUUID(),
        text: prompt,
        fromUser: true,
        timestamp: new Date(), // Add current time
      },
    ]);

    this.getChatResponseStream(prompt).subscribe({
      next: (message) =>
        this._messages.set([...this._completeMessages(), message]),

      complete: () => {
        this._completeMessages.set(this._messages());
        this._generatingInProgress.set(false);
      },

      error: (error) => {
        this._generatingInProgress.set(false)
        console.log('fff', error)
      },
    });
  }

  private getChatResponseStream(prompt: string): Observable<Message> {
    const id = window.crypto.randomUUID();
    const timestamp = new Date(); // Create timestamp for AI message

    return this.http
      .post('http://localhost:3000/message', prompt, {
        responseType: 'text',
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        filter(
          (event: HttpEvent<string>): boolean =>
            event.type === HttpEventType.DownloadProgress ||
            event.type === HttpEventType.Response,
        ),
        map(
          (event: HttpEvent<string>): Message =>
            event.type === HttpEventType.DownloadProgress
              ? {
                  id,
                  text: (event as HttpDownloadProgressEvent).partialText!,
                  fromUser: false,
                  generating: true,
                  timestamp, // Add timestamp
                }
              : {
                  id,
                  text: (event as HttpResponse<string>).body!,
                  fromUser: false,
                  generating: false,
                  timestamp, // Add timestamp
                },
        ),
        startWith<Message>({
          id,
          text: '',
          fromUser: false,
          generating: true,
          timestamp, // Add timestamp
        }),
      );
  }
}