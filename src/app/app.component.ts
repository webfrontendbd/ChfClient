import { Component, OnInit, isDevMode } from '@angular/core';
import { User } from './_models/user';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'acWebClient';

  constructor(private authService:AuthService){}

  ngOnInit(): void {

    if (isDevMode()) {
      console.log('Development!');
    } else {
      console.log('Production!');
    }

    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.authService.setCurrentUser(user);
  }
  
}
