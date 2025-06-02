import { inject, Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Order } from "../models/orders.model";
import { Product } from "../models/products.model";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    api: String = 'http://localhost:3000';

    http = inject(HttpClient);

    signIn(email: string, password: string): Observable<any> {
        return this.http.post(`${this.api}/auth/login`, { email, password });
    }

    signUp(user: User): Observable<any> {
        return this.http.post(`${this.api}/register`, user);
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.api}/forgot-password`, { email });
    }

    getProducts(): Observable<any> {
        return this.http.get(`${this.api}/products`);
    }

    createProduct(product: Product): Observable<any> {
        return this.http.post(`${this.api}/products`, product);
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete(`${this.api}/products/${id}`);
    }

    updateProduct(id: string, product: Product): Observable<any> {
        return this.http.put(`${this.api}/products/${id}`, product);
    }

    getNotifications(id: String): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.api}/notifications/user/${id}`);
    }

    markAsRead(id: number): Observable<any> {
        return this.http.patch(`${this.api}/notifications/${id}/read`, {});
    }

    getNotificationById(id: number): Observable<Notification> {
        return this.http.get<Notification>(`${this.api}/notifications/${id}`);
    }

    assignOrderToCarrier(orderId: string, carrierId: string): Observable<any> {
        return this.http.patch(`${this.api}/orders/${orderId}/assign`, { carrierId });
    }

    getAvaliableOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.api}/orders/avaliable`);
    }

    getOrdersByUser(userId: string): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.api}/orders/user/${userId}`);
    }

    getOrdersByCarrier(userId: string, status: string): Observable<Order[]> {
        return this.http.post<Order[]>(`${this.api}/orders/carrier/${userId}`, { status });
    }

    getOrderById(orderId: string): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.api}/orders/${orderId}`);
    }

    advanceOrderStatus(orderId: string, status: string): Observable<any> {
        return this.http.patch(`${this.api}/orders/${orderId}/status`, { status });
    }

    signInWithGoogle(idToken: string): Observable<any> {
    return this.http.post(`${this.api}/auth/google-login`, { idToken });
}

    createCheckoutSession(items: any[]): Observable<any> {
        return this.http.post(`${this.api}/checkout/create-checkout-session`, { items });
    }

}
