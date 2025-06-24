import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControl as FC } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/products.model';
import { ApiService } from 'src/app/services/api.services';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
  standalone: false
})
export class AddUpdateProductComponent implements OnInit {

  @Input() product: Product | undefined; // Propiedad para recibir el producto a editar
  isLoading: boolean = false;
  // Tipamos el FormGroup usando genéricos para que cada control sea un FormControl del tipo indicado.
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    unitPrice: new FormControl(0, [Validators.required, Validators.min(1)]),
    description: new FormControl('', [Validators.required]),
    stock: new FormControl(0, [Validators.required, Validators.min(1)]),
    image: new FormControl<File | null>(null, []),
    category: new FormControl('', [Validators.required]),
  });
  categories: string[] = ['Electrónica', 'Ropa', 'Hogar', 'Juguetes', 'Deportes'];
  selectedImage: any = null;
  utilsSvc = inject(UtilsService);
  apiSvc = inject(ApiService);

  constructor(private router: Router) {
  }

  ngOnInit() {
    if (this.product) {
      this.form.patchValue({
        name: this.product.name,
        unitPrice: this.product.unitPrice,
        description: this.product.description,
        stock: this.product.stock,
        category: this.product.categoryName,
      });
      this.selectedImage = this.product.imageUrl; // Asignar la imagen del producto existente
    }
  }


  onImageChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = URL.createObjectURL(file);
      this.form.patchValue({ image: file });
    }
  }

  // ======Update product======
  async updatedProduct() {
  if (!this.product) return;

  this.isLoading = true;
  const loading = await this.utilsSvc.loading();
  await loading.present();

  const formValue = this.form.value;

  const updatedProduct: Product = {
    name: formValue.name!,
    unitPrice: formValue.unitPrice!,
    description: formValue.description!,
    quantity: formValue.stock!, // <- mismo campo que en `saveProduct`
    categoryId: 1,              // <- pon aquí el ID correcto de la categoría
  };

  const formData = new FormData();
  const productBlob = new Blob(
    [JSON.stringify(updatedProduct)],
    { type: 'application/json' }
  );
  formData.append('product', productBlob);

  if (formValue.image instanceof File) {
    formData.append('file', formValue.image);
  }

  this.apiSvc.updateProduct(this.product.code!, formData).subscribe({
    next: (response) => {
      console.log("Respuesta del servidor:", response);
      this.utilsSvc.presentToast({
        message: 'Producto actualizado correctamente',
        duration: 2000,
        color: 'success',
        position: 'middle'
      });
      this.router.navigate(['/main']);
      this.isLoading = false;
      loading.dismiss();
      this.utilsSvc.dismissModal();
    },
    error: (err) => {
      console.error("Error en la petición:", err);
      this.utilsSvc.presentToast({
        message: 'Error al actualizar el producto',
        duration: 2000,
        color: 'danger',
        position: 'middle'
      });
      this.isLoading = false;
      loading.dismiss();
    },
  });
}


  // ======Add product======
  async saveProduct() {
  console.log('Estado del formulario:', this.form.status);
  console.log('Errores globales del formulario:', this.form.errors);
  Object.keys(this.form.controls).forEach(key => {
    const controlErrors = this.form.get(key)?.errors;
    if (controlErrors) {
      console.log(`Errores en ${key}:`, controlErrors);
    }
  });

  this.isLoading = true;
  const loading = await this.utilsSvc.loading();
  await loading.present();

  const formValue = this.form.value;

  const newProduct: Product = {
    name: formValue.name!,
    unitPrice: formValue.unitPrice!,
    description: formValue.description!,
    quantity: formValue.stock!,
    categoryId: 1,
  };

  // ✅ Crear FormData con el objeto como BLOB (application/json)
  const formData = new FormData();
  const productBlob = new Blob(
    [JSON.stringify(newProduct)],
    { type: 'application/json' }
  );
  formData.append('product', productBlob);

  // ✅ Adjuntar la imagen si fue seleccionada
  if (formValue.image instanceof File) {
    console.log('Imagen seleccionada:', formValue.image);
    formData.append('file', formValue.image);
  }

  // ✅ Llamada al backend
  this.apiSvc.createProductFormData(formData).subscribe({
    next: (response) => {
      console.log("Respuesta del servidor:", response);
      this.utilsSvc.presentToast({
        message: 'Producto creado correctamente',
        duration: 2000,
        color: 'success',
        position: 'middle'
      });
      this.isLoading = false;
      loading.dismiss();
      this.utilsSvc.dismissModal();
    },
    error: (err) => {
      console.error("Error en la petición:", err);
      this.utilsSvc.presentToast({
        message: 'Error al crear el producto',
        duration: 2000,
        color: 'danger',
        position: 'middle'
      });
      this.isLoading = false;
      loading.dismiss();
    }
  });
}

  submit() {
    if (this.form.valid) {
      if (this.product) {
        this.updatedProduct();
      } else {
        this.saveProduct();
      }

    }
  }
}
