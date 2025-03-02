import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage implements OnInit {

  isLoading: boolean = false;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor() { }

  ngOnInit() {
  }

  async resetPassword() {
    console.log(this.form.value);
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      console.log('Correo de recuperación enviado');
    }, 2000);
  }

}
