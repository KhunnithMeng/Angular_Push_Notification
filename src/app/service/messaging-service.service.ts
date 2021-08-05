import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {serverKey} from '../core/enum/server-key';
import {userToken} from '../core/enum/user-token';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject<{} | null>(null);
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private http: HttpClient) {
    this.angularFireMessaging.messaging.subscribe(
      (messaging) => {
        messaging.onMessage = messaging.onMessage.bind(messaging);
        messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
      }
    );
  }

  requestPermission(): void {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage(): void {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log('new message received. ', payload);
        this.showNotification(payload);
        this.currentMessage.next(payload);
      });
  }

  showNotification(payload: any): void {
    console.log(payload);
    const {title, icon, body} = payload.notification;
    const notify: Notification = new Notification(title, {body, icon});
    notify.onclick = event => {
      event.preventDefault();
      console.log(window);
      // window.location.href = 'https://stackoverflow.com/questions/63203360/open-deep-link-url-when-click-on-fcm-notification';
      window.open('https://stackoverflow.com/questions/63203360/open-deep-link-url-when-click-on-fcm-notification');
    };
  }

  pushNotification(): void {
    const body = {
      notification: {
        title: 'Khunnith is awesome',
        body: 'Hey There This is Khunnith so send you this wonderful piece of message',
        icon: 'https://zenprospect-production.s3.amazonaws.com/uploads/pictures/60f2ca42372a7a0001334803/picture',
      },
      to: userToken.token
    };
    const headers = {Authorization: serverKey.key};
    this.http.post('https://fcm.googleapis.com/fcm/send', body, {headers}).subscribe();
  }
}
