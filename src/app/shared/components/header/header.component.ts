import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;

  constructor() { }

  ngOnInit() {}

  openSettings() {
    console.log('Abrir ajustes');
    // Aquí podrías redirigir a una página de configuración
  }
  

}
