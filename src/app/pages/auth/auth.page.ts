import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
    
  });  
  async login() {
    console.log(this.form.value);
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      // throw new Error('Error de autenticación'); // Simula un error de autenticación
      setTimeout(() => {
  
        this.utilsSvc.presentToast({
          message: 'Inicio de sesión exitoso', 
          duration: 2000, 
          color: 'success', 
          position: 'middle', 
          icon: 'alert-circle-outline'}); // Muestra un mensaje de éxito
        console.log('Inicio de sesión exitoso'); // Aquí va la lógica real de autenticación
          this.utilsSvc.saveLocalStorage('user', this.form.value); // Guarda el usuario en el localStorage
          this.utilsSvc.routerLink('/main/home'); // Navega a la pantalla principal  
          this.form.reset(); // Limpia el formulario
      }, 2000);
    } catch (error) {
      this.utilsSvc.presentToast({message: 'Error al iniciar sesión', duration: 2000, color: 'danger', position: 'middle', 
        icon: 'alert-circle-outline'}); // Muestra un mensaje de error
      console.error('Error al iniciar sesión', error);
    }
    finally {
      loading.dismiss();
    }
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
