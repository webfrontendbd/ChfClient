import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-asidenav',
  templateUrl: './asidenav.component.html',
  styleUrls: ['./asidenav.component.css']
})
export class AsidenavComponent implements OnInit {
  constructor(public authService:AuthService, private router: Router){}

  ngOnInit(): void {
    
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
