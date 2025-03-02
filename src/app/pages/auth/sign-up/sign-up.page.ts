import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: false
})
export class SignUpPage implements OnInit {
  isLoading: boolean = false;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async openConfirmationModal() {
    const modal = await this.modalCtrl.create({
      component: ConfirmDialogComponent,
      componentProps: {
        title: 'Confirmar Registro',
        message: '¿Estás seguro de que quieres registrarte con esta información?'
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.confirmed) {
      this.register();
    }
  }

  register() {
    if (this.form.invalid) return;

    console.log(this.form.value);
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      console.log('Registro exitoso');
       // Redirigir al login
    }, 2000);
  }



}
