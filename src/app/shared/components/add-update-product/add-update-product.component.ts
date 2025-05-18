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
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
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
        price: this.product.price,
        description: this.product.description,
        stock: this.product.stock,
        category: this.product.category,
      });
      this.selectedImage = this.product.urlImage; // Asignar la imagen del producto existente
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

    const updatedData: Product = {
      name: formValue.name!,
      price: formValue.price!,
      description: formValue.description!,
      stock: formValue.stock!,
      category: formValue.category!,
      urlImage: this.selectedImage, // Ojo aquí: deberías subir la imagen si cambió (ver nota abajo)
    };

    // Si hay nueva imagen, debes manejar la subida antes de hacer el update
    if (formValue.image instanceof File) {
      // Suponiendo que tienes un método en apiSvc para subir la imagen y obtener la URL
      // const imageUrl = await this.apiSvc.uploadImage(formValue.image);
      // updatedData.urlImage = imageUrl;
      updatedData.urlImage = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
    }

    this.apiSvc.updateProduct(this.product.id!, updatedData).subscribe({
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
      price: formValue.price!,
      description: formValue.description!,
      stock: formValue.stock!,
      category: formValue.category!,
      urlImage: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    };

    this.apiSvc.createProduct(newProduct).subscribe({
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
