import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.services';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false
})
export class AuthPage implements OnInit {

  isLoading: boolean = false;
  utilsSvc = inject(UtilsService);
  apiSvc = inject(ApiService);
  
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
    
  });  
  async login() {
    console.log(this.form.value);
    const loading = await this.utilsSvc.loading();
    await loading.present();
      // throw new Error('Error de autenticación'); // Simula un error de autenticación
      this.apiSvc.signIn(this.form.value.email!, this.form.value.password!)
    .subscribe({
      next: (response) => {
        // Manejar respuesta exitosa
        console.log("Respuesta del servidor:", response);
        this.utilsSvc.saveLocalStorage('user', response.user);
        this.utilsSvc.saveLocalStorage('token', response.token);
        this.utilsSvc.routerLink('/main/home');
        loading.dismiss();
        this.form.reset();
      },
      error: (err) => {
        console.error("Error en la petición:", err);
        this.utilsSvc.presentToast({
          message: err.error?.message || 'Error al iniciar sesión',
          color: 'danger',
          duration: 2000,
        });
        loading.dismiss();
        this.form.reset();
      },
    });
  

  }
  forgotPassword() {
    console.log('Olvidé mi contraseña');
    this.router.navigate(['/forgot-password']); // Navega a la pantalla de recuperación de contraseña
  }

  register() {
    this.router.navigate(['/sign-up']); // Navega a la pantalla de registro
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
