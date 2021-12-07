import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})


export class ClockComponent implements OnInit {
  @Input() currentTime = 0;
  @Input() totalTime = 0;
  @Input() color = 'rgb(0,255,0)';
  @Input() timeFormatted: string = '';
  constructor() { 
    
  }



  ngOnInit(): void {
  }



}
