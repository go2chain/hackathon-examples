import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-state',
  templateUrl: './change-state.component.html',
  styleUrls: ['./change-state.component.css']
})
export class ChangeStateComponent implements OnInit {
  data: string = "";
  constructor() { }

  ngOnInit() {
  }
}
