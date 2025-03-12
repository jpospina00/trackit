import { Injectable } from "@angular/core";
import { User } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    api:String = 'https://api.example.com';

    signIn(user: User) {
    }

    signUp(user: User) {
    }

    forgotPassword(email: string) {
    }
    
}
