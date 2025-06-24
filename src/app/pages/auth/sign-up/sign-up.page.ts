import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.services';
import { UtilsService } from 'src/app/services/utils.services';
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

  roles: string[] = ['Customer', 'repartidor'];
  apiSvc = inject(ApiService);
  utilsSvc = inject(UtilsService);

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
    const user: User = {
      name: this.form.value.name ?? '',
      email: this.form.value.email ?? '',
      // role: this.form.value.role ?? '',
      lastName: 'ospina', // Puedes agregarlo si lo tienes en el formulario
      address: 'calle ce', // Puedes agregarlo si lo tienes en el formulario
      enabled: true,
      roleId: this.form.value.role === 'Customer' ? 3 : 2, // Asignar ID de rol según el tipo
      password: this.form.value.password ?? '' // Asegúrate de manejar la contraseña
    };
    this.apiSvc.signUp(user).subscribe({
      next: (res: any) => {
        console.log('Respuesta del servidor:', res);
        this.isLoading = false;
        this.utilsSvc.presentToast({
          message: 'Usuario registrado correctamente',
          color: 'success',
          duration: 2000,
        });
        // Aquí puedes redirigir al login o mostrar un mensaje de éxito
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
        this.utilsSvc.presentToast({
          message: err.error?.message || 'Error al registrar el usuario',
          color: 'danger',
          duration: 2000,
        });
        // Aquí puedes mostrar un mensaje de error
      }
    });
    setTimeout(() => {
      this.isLoading = false;
      console.log('Registro exitoso');
       // Redirigir al login
    }, 2000);
  }



}
