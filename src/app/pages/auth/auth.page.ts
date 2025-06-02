import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}

  ngOnInit() {
    // Espera que el objeto google esté listo
    this.loadGoogleSignIn();
  }

  loadGoogleSignIn() {
    // Esperar que google esté definido
    const tryInitialize = () => {
      const google = (window as any).google;
      if (google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: '729312734460-pokqn20utdv646j7e953m0cra5m4om7c.apps.googleusercontent.com',
          callback: (response: any) => this.handleCredentialResponse(response),
        });
        google.accounts.id.renderButton(
          document.getElementById('google-button'),
          { theme: 'outline', size: 'large' }
        );
      } else {
        // Si no está listo, reintenta después de 100ms
        setTimeout(tryInitialize, 100);
      }
    };

    tryInitialize();
  }

  handleCredentialResponse(response: any) {
    const idToken = response.credential;
    console.log('ID TOKEN de Google:', idToken);

    // Enviar token al backend
    this.apiSvc.signInWithGoogle(idToken).subscribe({
      next: (res: any) => {
        console.log('Respuesta del servidor:', res);
        this.utilsSvc.saveLocalStorage('user', res.user);
        this.utilsSvc.saveLocalStorage('token', res.token);
        this.utilsSvc.routerLink('/main/home');
      },
      error: (err: any) => {
        console.error(err);
        this.utilsSvc.presentToast({
          message: err.error?.message || 'Error con Google',
          color: 'danger',
          duration: 2000,
        });
      },
    });
  }

  async login() {
    console.log(this.form.value);
    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.apiSvc.signIn(this.form.value.email!, this.form.value.password!).subscribe({
      next: (response) => {
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
    this.router.navigate(['/forgot-password']);
  }

  register() {
    this.router.navigate(['/sign-up']);
  }
}
