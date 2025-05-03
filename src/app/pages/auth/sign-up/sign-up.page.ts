import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
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
    role: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  },  { validators: this.validatePasswordMatch } );

  roles: string[] = ['cliente', 'repartidor'];

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  validatePasswordMatch(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async openConfirmationModal() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: '¿Estás seguro de continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Acción cancelada');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Acción confirmada');
            this.register(); // Aquí llamas la función que se ejecutará al confirmar
          }
        }
      ]
    });
  
    await alert.present();
  }

  register() {
    console.log('Registrando...');
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
