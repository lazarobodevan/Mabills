import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  showSidebar: boolean = false;

  constructor(private authService: AuthService){

  }

  ngOnInit(){
    this.authService.showSideBarEmitter.subscribe(
      show => this.showSidebar = show
    )
  }
}
