import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: false
})
export class ConfirmDialogComponent  implements OnInit {

  @Input() title: string = 'Confirmar acción';
  @Input() message: string = '¿Estás seguro?';
  @Input() isOpen: boolean = false;
  @Output() confirmed = new EventEmitter<boolean>();



  confirm() {
    this.modalCtrl.dismiss({ confirmed: true });
  }

  cancel() {
    this.modalCtrl.dismiss({ confirmed: false });
  }
  

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

}
