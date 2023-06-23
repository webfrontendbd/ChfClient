import { Component, HostBinding, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @HostBinding('class') class = 'login-box';
  loginForm: FormGroup;
  constructor(
    private renderer: Renderer2,
    public fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.renderer.removeClass(document.querySelector('body'), 'sidebar-mini');
    this.renderer.addClass(document.querySelector('body'), 'login-page');
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        //this.toastr.success('Login Successful!', 'Success');
        this.router.navigateByUrl('/dashboard');
      },
      error: (errorObj) => {
        //this.toastr.error(errorObj.error, 'Something Went Wrong!');
      },
    });
  }
}
