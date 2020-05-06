import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit, OnDestroy {

  authForm: FormGroup;
  loginMode = false;
  authStatusSub: Subscription;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.route.url.subscribe(urlData => {
      if(urlData[0].path == 'login') {
        this.loginMode = true;
      } else {
        this.loginMode = false;
      }
    });
    this.authForm = new FormGroup({
      'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'password': new FormControl(null, {validators: [Validators.required]})
    });
    this.authStatusSub = this.authService.getAuthStatus().subscribe(status => {
      if(!status) {
        this.authForm.reset();
      }
    });
  }

  onSubmit() {
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;
    if(this.loginMode) {
      this.authService.loginUser(email, password);
    } else {
      this.authService.signUpUser(email, password);
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
