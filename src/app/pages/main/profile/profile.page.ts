import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  constructor() { }
  
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required]),
      id: new FormControl('', [Validators.required]),
    });
    user: User | null = null;

  ngOnInit() {
    this.user = this.utilsSvc.getLocalStorage('user') ?? null;

    if (this.user) {
      // Si el usuario existe, prellenamos el formulario con su información
      this.form.patchValue({
        name: this.user.name,
        role : this.user.role,
        email: this.user.email,
        id: this.user.id,
      });
    }
  }
    submit() {
      if (this.form.valid) {
        console.log('Formulario válido:', this.form.value);
        // Aquí puedes realizar la lógica para enviar los datos del formulario al servidor o realizar otras acciones.
  
      }
    }

}
