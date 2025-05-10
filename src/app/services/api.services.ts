import { inject, Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    api:String = 'http://localhost:3000';

    http = inject(HttpClient);

    signIn(email: string, password: string): Observable<any>  {
        return this.http.post(`${this.api}/auth/login`, { email, password });
    }

    signUp(user: User): Observable<any>  {
        return this.http.post(`${this.api}/register`, user);
    }

    forgotPassword(email: string): Observable<any>  {
        return this.http.post(`${this.api}/forgot-password`, { email });
    }

    getProducts(): Observable<any> {
        return this.http.get(`${this.api}/products`);
    }
    
}
