import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false
})
export class MainPage implements OnInit {

  constructor() { }

  // Propiedades del componente
  pages = [
    { title: 'Home', url: '/main/home', icon: 'home' },
    { title: 'Profile', url: '/main/profile', icon: 'person' },
    { title: 'Orders', url: '/main/orders', icon: 'list' },
  ]
  utilsSvc = inject(UtilsService);
  router = inject(Router);
  currentPath = '';

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      // Aquí puedes manejar los eventos de navegación si es necesario
      console.log('Navegación:', event);
      if(event?.url) {
        this.currentPath = event.url;
      }
    }
  );
  }

  user(): User {
      return this.utilsSvc.getLocalStorage('user');
    }
    

  logout() {
    this.utilsSvc.logout();
  }
}
