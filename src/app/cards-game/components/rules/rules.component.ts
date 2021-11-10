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
  @Input() currentRule!:string;
  public colorInstructionText = new OxTextInfo();
  public shapeInstructionText = new OxTextInfo();
  public instructionText = new OxTextInfo();
  public rulesSvg:string[] = ['colores_igual.svg', 'colores_igual_block.svg', 'formas_igual.svg','formas_igual_block.svg','relleno_igual.svg','relleno_igual_block.svg'];
  

  


  constructor() {
    this.colorRulePath = this.concatRuteSvg(this.rulesSvg[1]) ;
    this.shapeRulePath = this.concatRuteSvg(this.rulesSvg[3]);
    this.fillerRulePath = this.concatRuteSvg(this.rulesSvg[5]);
   }

  


  ngOnInit(): void {
  }

  concatRuteSvg(svg:string):string{
  return 'svg/reglas_cambiantes/formas_sin_cara/'+ svg
  }

}
