import { inject, Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, switchMap } from "rxjs";
import { Order } from "../models/orders.model";
import { Product } from "../models/products.model";
import { UtilsService } from "./utils.services";
import { Notification } from "../models/notification.model";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    api: String = 'http://34.71.84.140:8080'; // Uncomment this line and comment the next line to use the real API
    // api: String = 'http://localhost:3000'; // Change this to your API Fake URL 

    http = inject(HttpClient);
    utilsSvc = inject(UtilsService);
    get token(): string {
  return this.utilsSvc.getLocalStorage('token') || '';
}

    signIn(email: string, password: string): Observable<any> {
        return this.http.post(`${this.api}/auth/login`, { email, password }, { responseType: 'text' });
    }

    signUp(user: User): Observable<any> {
        const newUser = {
            user: user,
            auth: {
                email: user.email,
                password: user.password
            }
        };
        console.log('User data:', user);
        return this.http.post(`${this.api}/auth/register`, newUser);
    }


    getUserByEmail(email: string, token: string): Observable<any> {
        return this.http.post(`${this.api}/users/get-users`, { email }, { headers: { Authorization: `Bearer ${token}` } });
    }

    updateUser(user: User): Observable<any> {
        return this.http.put(`${this.api}/users/${user.id}`, user, { headers: { Authorization: `Bearer ${this.token}` } });
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.api}/forgot-password`, { email });
    }

    getProducts(): Observable<any> {
        return this.http.get(`${this.api}/products`, { headers: { Authorization: `Bearer ${this.token}` } });
    }

    createProductFormData(formData: FormData): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`
    // No pongas Content-Type aquí ❌
  });

  return this.http.post(`${this.api}/products`, formData, { headers });
}

    deleteProduct(id: string): Observable<any> {
        return this.http.delete(`${this.api}/products/${id}`, { headers: { Authorization: `Bearer ${this.token}` } });
    }

    updateProduct(productCode: string, formData: FormData): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`
  });

  return this.http.put(`${this.api}/products/${productCode}`, formData, { headers });
}

    getProductById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.api}/products/${id}`, { headers: { Authorization: `Bearer ${this.token}` } });
    }

    getNotifications(id: String): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.api}/notifications/${id}`, { headers: { Authorization: `Bearer ${this.token}` } });
    }

    markAsRead(id: number): Observable<any> {
        return this.http.put(`${this.api}/notifications/${id}`, {}, { headers: { Authorization: `Bearer ${this.token}` } });
    }

    getNotificationById(id: number): Observable<Notification> {
        return this.http.get<Notification>(`${this.api}/notifications/${id}`, { headers: { Authorization: `Bearer ${this.token}` } });
    }

    assignOrderToCarrier(orderId: string, carrierId: string): Observable<any> {
        return this.http.patch(`${this.api}/orders/${orderId}/assign`, { carrierId });
    }

    getAvaliableOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.api}/orders/purchases`, { headers: { Authorization: `Bearer ${this.token}` } });
    }

    createOrder(order: any): Observable<any> {
        return this.http.post(`${this.api}/orders/purchases`, order, { headers: { Authorization: `Bearer ${this.token}` } });
    }

    getOrdersByUser(userId: string): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.api}/orders/purchases/${userId}`, { headers: { Authorization: `Bearer ${this.token}` } });
    }

    getOrdersByCarrier(userId: string, status: string): Observable<Order[]> {
        return this.http.post<Order[]>(`${this.api}/orders/carrier/${userId}`, { status });
    }

    getOrderById(orderId: string): Observable<any> {
        return this.http.get<any>(`${this.api}/orders/purchases/${orderId}/products`, { headers: { Authorization: `Bearer ${this.token}` } });
    }

    advanceOrderStatus(orderId: string, status: string): Observable<any> {
        return this.http.patch(`${this.api}/orders/${orderId}/status`, { status });
    }

    signInWithGoogle(idToken: string): Observable<any> {
        return this.http.post(`${this.api}/auth/google-login`, { idToken });
    }

    createTestPayment(amount: number, currency: string): Observable<any> {
  const params = new HttpParams()
    .set('amount', amount.toString())
    .set('currency', currency);

  return this.http.post(`${this.api}/payments/create-test-payment`, null, { params, headers: { Authorization: `Bearer ${this.token}` } },);
}

}
