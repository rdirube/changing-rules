import { Component, Input, OnInit } from '@angular/core';
import { OxTextInfo, ScreenTypeOx} from 'ox-types';


@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  @Input() colorRulePath!:string;
  @Input() shapeRulePath!:string;
  @Input() fillerRulePath!:string;
  public colorInstructionText = new OxTextInfo();
  public shapeInstructionText = new OxTextInfo();
  public InstructionText = new OxTextInfo();


  constructor() {
    this.colorRulePath = "svg/reglas_cambiantes/indicación/colores_igual_block.svg";
    this.shapeRulePath = "svg/reglas_cambiantes/indicación/formas_igual_block.svg";
    this.fillerRulePath = "svg/reglas_cambiantes/indicación/relleno_igual_block.svg"
   }

  


  ngOnInit(): void {
  }

}
