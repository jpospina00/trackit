import { inject, Injectable } from "@angular/core";
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from "@ionic/angular";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class UtilsService {
    loadingCtrl = inject(LoadingController);
    toastCtrl = inject(ToastController);
    router = inject(Router);
    modalCtrl = inject(ModalController);

    // ========= Loading =========
    loading() {
        return this.loadingCtrl.create({ spinner: 'crescent', message: 'Cargando...' });
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

    // ========= send recovery email =========
    sendRecoveryEmail(email: string) {
        console.log('Enviando correo de recuperación a:', email);
    }

    // ========= validated auth =========
    validateAuth() {
        return localStorage.getItem('user') ? true : false;
    }

    // ========= logout =========
    logout() {
        localStorage.removeItem('user');
        this.routerLink('/auth');
    }

    // ========= Modal =========
    async presentModal(opts: ModalOptions) {
        const modal = await this.modalCtrl.create(opts);

        await modal.present();
        const { data } = await modal.onWillDismiss();
        if (data) {
            return data;
        }
    }

    dismissModal(data?: any) {
        return this.modalCtrl.dismiss(data);
    }
}
