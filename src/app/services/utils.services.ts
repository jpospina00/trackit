import { inject, Injectable } from "@angular/core";
import { LoadingController, ToastController, ToastOptions } from "@ionic/angular";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class UtilsService {
    loadingCtrl = inject(LoadingController);
    toastCtrl = inject(ToastController);
    router = inject(Router);

    // ========= Loading =========
    loading() {
        return this.loadingCtrl.create({spinner: 'crescent', message: 'Cargando...'});
    }

    // ========= Toast =========
    async presentToast(opts?: ToastOptions) {
        const toast = await this.toastCtrl.create(opts);
        toast.present();
    }

    // ========= Router =========
    routerLink(url: string) {
        return this.router.navigateByUrl(url);
    }

    // ========= save localStorage =========
    saveLocalStorage(key: string, value: any) {
       return localStorage
            .setItem(key, JSON.stringify(value));
    }

    // ========= get localStorage =========
    getLocalStorage(key: string) {
        return JSON.parse(localStorage.getItem(key) || '{}');
    }
}
