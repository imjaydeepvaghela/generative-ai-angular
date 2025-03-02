import { Component, effect, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { MessageService } from './message.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgClass, FormsModule, CommonModule],
  template: `
    <h1>Angular Meets AI: A Generative Demo with GeminAI 🤖✨</h1>

    <div class="chat-container">
      <div #messagesWrapper class="messages-wrapper">
        <div class="welcome-container" *ngIf="welcomeContent">
          <div class="welcome-card">
            <div class="welcome-icon">
              <svg viewBox="0 0 24 24" width="36" height="36">
                <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M17,11A1,1 0 0,1 18,12A1,1 0 0,1 17,13H7A1,1 0 0,1 6,12A1,1 0 0,1 7,11H17Z" />
              </svg>
            </div>
            <h2>Welcome to GeminAI Chat</h2>
            <p>I'm here to help answer your questions. Type a message below to get started!</p>
          </div>
        </div>
        
        @for (message of messages(); track message.id) {
          <div 
            class="message-bubble"
            [ngClass]="{
              'user-message': message.fromUser,
              'ai-message': !message.fromUser,
              'generating': message.generating
            }"
          >
            <div class="message-avatar" *ngIf="!message.fromUser">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8,0 0,0 20,12A8,8,0 0,0 12,4M17,11A1,1 0 0,1 18,12A1,1 0 0,1 17,13H7A1,1 0 0,1 6,12A1,1 0 0,1 7,11H17Z" />
              </svg>
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.text }}</div>
              <div class="message-time">{{ message.timestamp | date:'shortTime' }}</div>
            </div>
            <div class="message-avatar user-avatar" *ngIf="message.fromUser">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            </div>
          </div>
        }
      </div>
    </div>

    <form #form="ngForm" (ngSubmit)="sendMessage(form, form.value.message)">
      <div class="input-container">
        <button 
          type="button" 
          class="attachment-button"
          [disabled]="generatingInProgress()"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z" />
          </svg>
        </button>
        <input
          name="message"
          placeholder="Type a message"
          ngModel
          required
          autofocus
          [disabled]="generatingInProgress()"
        />
        <button 
          type="submit" 
          class="send-button"
          [disabled]="generatingInProgress() || form.invalid"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
          </svg>
        </button>
      </div>
    </form>
  `,
})
export class AppComponent implements AfterViewInit {
  private readonly messageService = inject(MessageService);
  readonly messages = this.messageService.messages;
  readonly generatingInProgress = this.messageService.generatingInProgress;
  welcomeContent: boolean = true;
  @ViewChild('messagesWrapper') messagesWrapper!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private readonly scrollOnMessageChanges = effect(() => {
    this.messages(); // React to messages update

    setTimeout(() => this.scrollToBottom(), 0);
  });

  private scrollToBottom(): void {
    if (this.messagesWrapper) {
      this.messagesWrapper.nativeElement.scrollTo({
        top: this.messagesWrapper.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  sendMessage(form: NgForm, messageText: string): void {
    this.welcomeContent = false;
    this.messageService.sendMessage(messageText);
    form.resetForm();
  }
}
