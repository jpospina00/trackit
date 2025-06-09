import { Component, inject, OnInit } from '@angular/core';
import { Notification } from 'src/app/models/notification.model';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.services';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: false
})
export class NotificationsComponent  implements OnInit {

  notifications: Notification[] = [];
  user: User | null = null;
  apiSvc = inject(ApiService);
  utilsSvc = inject(UtilsService);
  constructor() { }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.user = this.utilsSvc.getLocalStorage('user') ?? null;

    if (this.user) {
    this.apiSvc.getNotifications(this.user!.id!).subscribe({
      next: (notis) => {
        this.notifications = notis.map((n: any) => ({
          id: n.id,
          message: n.message,
          // add other Notification properties as needed
          ...n
        }));
        console.log('Notificaciones:', notis);
      },
      error: (err) => {
        console.error('Error al cargar notificaciones:', err);
      }
    });
  }
  }

  viewNotification(notification: Notification) {
    // Puedes marcarla como leída o redirigir al detalle
    
    this.apiSvc.markAsRead(notification.id).subscribe({
      next: () => {
        console.log('Notificación marcada como leída:', notification.id);
        this.utilsSvc.dismissModal({reload: true});
        this.utilsSvc.routerLink('/main/orders');
      }
    });
        // this.utilsSvc.dismissModal();
  }

}
