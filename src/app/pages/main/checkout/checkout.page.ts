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
    this.stripePromise = loadStripe('pk_test_51RVdu1QutFM5UkttsygmnHy7sVp6ouLAmPCkeJwEc3noyCa2gpdFdOeRlkYiTVCF7VbJbi8O9YS8VugqR7fgW5yj00vUCZ2g8F'); // Reemplaza por tu clave pública Stripe real
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
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      id: item.id,
      userId: this.user().id!,
      address: this.shippingAddress
    }));

    try {
      // Uso ApiService en lugar de fetch
      this.apiSvc.createCheckoutSession(items).subscribe({
        next: async (session: any) => {
          if (session.id) {
            const stripe = await this.stripePromise;
            const { error } = await stripe!.redirectToCheckout({ sessionId: session.id });
            if (error) {
              console.error(error);
              this.utilsSvc.presentToast({ message: error.message, color: 'danger' });
            }
          } else {
            this.utilsSvc.presentToast({ message: 'Error al crear sesión de pago', color: 'danger' });
          }
        },
        error: (err) => {
          this.utilsSvc.presentToast({ message: err.message || 'Error en la petición', color: 'danger', duration: 2000, });
        }
      });
    } catch (error: any) {
      this.utilsSvc.presentToast({ message: error.message, color: 'danger' });
    }
  }
}
