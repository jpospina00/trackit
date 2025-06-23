import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.services';
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
  apiSvc = inject(ApiService);

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
        role: this.user.role,
        email: this.user.email,
        id: this.user.id,
      });
    }
  }
  submit() {
    if (this.form.valid) {
      console.log('Formulario válido:', this.form.value);
      const updatedUser: User = {
        ...this.user,
        name: this.form.value.name ?? this.user?.name ?? '',
        email: this.form.value.email ?? this.user?.email ?? '',
        role: this.form.value.role ?? this.user?.role ?? '',
        id: this.form.value.id ?? this.user?.id ?? '',
      };
      this.apiSvc.updateUser(updatedUser).subscribe({
        next: (res: any) => {
          console.log('Usuario actualizado:', res);
          this.utilsSvc.saveLocalStorage('user', updatedUser);
          this.utilsSvc.presentToast({
            message: 'Usuario actualizado correctamente',
            color: 'success',
            duration: 2000,
          });
        },
        error: (err: any) => {
          console.error('Error al actualizar el usuario:', err);
          this.utilsSvc.presentToast({
            message: 'Error al actualizar el usuario',
            color: 'danger',
            duration: 2000,
          });
        }
      });
      // Aquí puedes realizar la lógica para enviar los datos del formulario al servidor o realizar otras acciones.

    }
  }

}
