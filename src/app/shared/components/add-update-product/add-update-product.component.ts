import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControl as FC } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
  standalone: false
})
export class AddUpdateProductComponent implements OnInit {

  isLoading: boolean = false;
  // Tipamos el FormGroup usando genéricos para que cada control sea un FormControl del tipo indicado.
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    description: new FormControl('', [Validators.required]),
    stock: new FormControl(0, [Validators.required, Validators.min(1)]),
    image: new FormControl<File | null>(null, []),
    category: new FormControl('', [Validators.required]),
  });
  categories: string[] = ['Electrónica', 'Ropa', 'Hogar', 'Juguetes', 'Deportes'];
  selectedImage: any = null;
  utilsSvc = inject(UtilsService);

  constructor(private router: Router) {
  }

  ngOnInit() {}

  onImageChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = URL.createObjectURL(file);
      this.form.patchValue({ image: file });
    }
  }

  

  async saveProduct() {
    console.log('Estado del formulario:', this.form.status);
console.log('Errores globales del formulario:', this.form.errors);
Object.keys(this.form.controls).forEach(key => {
  const controlErrors = this.form.get(key)?.errors;
  if (controlErrors) {
    console.log(`Errores en ${key}:`, controlErrors);
  }
});
    if (this.form.invalid) return;

    this.isLoading = true;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      console.log('Producto guardado:', this.form.value);
      this.utilsSvc.presentToast({
        message: 'Producto guardado correctamente',
        duration: 2000,
        color: 'success',
        position: 'middle'
      });
      this.form.reset();
      this.selectedImage = null;
      this.router.navigate(['/main/products']);
    } catch (error) {
      this.utilsSvc.presentToast({
        message: 'Error al guardar el producto',
        duration: 2000,
        color: 'danger',
        position: 'middle'
      });
    } finally {
      this.isLoading = false;
      loading.dismiss();
    }
  }
}
