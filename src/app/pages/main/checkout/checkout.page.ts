import { Component, OnInit, inject } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.services';
import { CartService } from 'src/app/services/cart.service';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: false,
})
export class CheckoutPage implements OnInit {
  shippingAddress: string = '';
  paymentMethod: string = '';
  total: number = 0;
  stripePromise: Promise<Stripe | null>;

  utilsSvc = inject(UtilsService);
  cartSvc = inject(CartService);
  apiSvc = inject(ApiService);

  constructor() {
    this.stripePromise = loadStripe('pk_test_51RcXwdREGqPUQ6ZPLbyFLe2oMosniP66Hm6mI25Aa0DlPEj8dA1Ea9Lm2fjthbsCWZUSj1DrDE4LragpfiaVzHRS00mEqMmRqO'); // Reemplaza por tu clave pública Stripe real
  }

  ngOnInit() {
    this.total = this.cartSvc.getTotal();
  }

  user(): User {
        return this.utilsSvc.getLocalStorage('user');
      }

  async confirmPurchase() {
    if (!this.shippingAddress || !this.paymentMethod) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const items = this.cartSvc.getCart().map(item => ({
      quantity: item.quantity,
      productId: item.code!,
      total: item.unitPrice * item.quantity
    }));
    const paymentMethodId = this.paymentMethod == 'credit-card' ? 1 : 2; // 1: Tarjeta de crédito, 2: Efectivo
    const data = {
      products: items,
      total: this.total,
      userId: this.user().id!,
      deliveryAddress: this.shippingAddress,
      paymentStatusId: 1,
      paymentTypeId: paymentMethodId,  
    };
    console.log('Items to purchase:', data);
    try {
      this.apiSvc.createOrder(data).subscribe({
        next: async (order: any) => {
          this.utilsSvc.routerLink('/main/success');
        },
        error: (err) => {
          console.error('Error creating order:', err);
          this.utilsSvc.presentToast({ message: err.message || 'Error al crear la orden', color: 'danger', duration: 2000 });
        }
      });
  // //     this.apiSvc.createTestPayment(data.total, 'usd').subscribe({
  // //       next: (res) => console.log('Pago de prueba creado:', res),
  // // error: (err) => console.error('Error al crear pago de prueba:', err)
  // //     });
    } catch (error: any) {
      this.utilsSvc.presentToast({ message: error.message, color: 'danger' });
    }
    // try {
    //   // Uso ApiService en lugar de fetch
    //   this.apiSvc.createCheckoutSession(items).subscribe({
    //     next: async (session: any) => {
    //       if (session.id) {
    //         const stripe = await this.stripePromise;
    //         const { error } = await stripe!.redirectToCheckout({ sessionId: session.id });
    //         if (error) {
    //           console.error(error);
    //           this.utilsSvc.presentToast({ message: error.message, color: 'danger' });
    //         }
    //       } else {
    //         this.utilsSvc.presentToast({ message: 'Error al crear sesión de pago', color: 'danger' });
    //       }
    //     },
    //     error: (err) => {
    //       this.utilsSvc.presentToast({ message: err.message || 'Error en la petición', color: 'danger', duration: 2000, });
    //     }
    //   });
    // } catch (error: any) {
    //   this.utilsSvc.presentToast({ message: error.message, color: 'danger' });
    // }
  }
}
