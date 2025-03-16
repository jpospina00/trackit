import { Component, inject, input, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() isModal!: boolean;
  @Input() backButton!: boolean;

  utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {}

  openSettings() {
    console.log('Abrir ajustes');
    // Aquí podrías redirigir a una página de configuración
  }
  
  dismissModal() {
    console.log('Cerrar modal');
    this.utilsSvc.dismissModal();
    // Aquí podrías cerrar el modal
  }
}
