import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false
})
export class AuthPage implements OnInit {

  isLoading: boolean = false;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
    
  });  
  async login() {
    console.log(this.form.value);
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      console.log('Inicio de sesión exitoso'); // Aquí va la lógica real de autenticación
    }, 2000);
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
