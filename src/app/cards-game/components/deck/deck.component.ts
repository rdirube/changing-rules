import { Component, OnInit, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit {

  @Input() deckClass!:string;

  constructor(private elementRef:ElementRef) {
    
   }

  ngOnInit(): void {
    const deckposition = this.elementRef.nativeElement.getBoundingClientRect()
    console.log(deckposition);
  }

}
