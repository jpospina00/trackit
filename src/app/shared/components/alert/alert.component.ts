import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: false
})
export class AlertComponent  implements OnInit {

  @Input() message: string = '';
  @Input() type: 'success' | 'warning' | 'danger' = 'success';
  @Input() duration: number = 2000;
  @Input() isOpen: boolean = false;

  onDismiss() {
    this.isOpen = false;
  }


  constructor() { }

  ngOnInit() {}

}
