import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading:boolean = false;
  title = 'app works!';

  toggleLoading(_event){
    this.loading = _event;
  }
}
