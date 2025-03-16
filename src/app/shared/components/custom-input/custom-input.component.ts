import { Component, Input, OnInit } from '@angular/core';
import { Form, FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  standalone: false
})
export class CustomInputComponent  implements OnInit {

  @Input() label!: string;
  @Input() type = 'text';
  @Input() icon!: string;
  @Input() name!: string;
  @Input() control!: FormControl;
  @Input() autocomplete!: string;
  @Input() multiline: boolean = false;
  
  isPassword!: boolean;
  hide: boolean = true;
  constructor() { }

  ngOnInit() {
    if(this.type === 'password') {
      this.isPassword = true;
    }
  }

  showOrHidePassword() {
    this.hide = !this.hide;
    if(this.hide) {
    this.type = 'password';
    } else {
    this.type = 'text';
    }
  }

}
