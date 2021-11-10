import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() cardPath!:string;

  constructor() { 
    this.cardPath = "svg/reglas_cambiantes/elementos/dorso.svg";
  }

  ngOnInit(): void {
  }

}
