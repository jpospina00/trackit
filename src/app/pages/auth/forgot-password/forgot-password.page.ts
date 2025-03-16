import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage implements OnInit {

  isLoading: boolean = false;
    utilsSvc = inject(UtilsService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor() { }

  ngOnInit() {
  }

  async resetPassword() {
    console.log('Enviando correo de recuperación...');
    if(this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      try {
        // throw new Error('Error al enviar correo de recuperación'); // Simula un error al enviar el correo
        this.utilsSvc.sendRecoveryEmail(this.form.value.email!); // Llama a la función de envío de correo
        setTimeout(() => {
          this.utilsSvc.presentToast({
            message: 'Correo de recuperación enviado', 
            duration: 2000, 
            color: 'success', 
            position: 'middle', 
            icon: 'alert-circle-outline'}); // Muestra un mensaje de éxito
          console.log('Correo de recuperación enviado'); // Aquí va la lógica real de envío de correo
          this.utilsSvc.routerLink('/auth'); // Navega a la pantalla de autenticación
          this.form.reset(); // Limpia el formulario

        }, 2000);
      } catch (error) {
        this.utilsSvc.presentToast({message: 'Error al enviar correo de recuperación', duration: 2000, color: 'danger', position: 'middle', 
          icon: 'alert-circle-outline'}); // Muestra un mensaje de error
        console.error('Error al enviar correo de recuperación', error);
      }
      finally {
        loading.dismiss();
      }
    }
    console.log(this.form.value);
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      console.log('Correo de recuperación enviado');
    }, 2000);
  }

}
