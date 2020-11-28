import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading = false;
  isLogin = true;
  constructor(
    private autService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }
  onLogin(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl.create({keyboardClose: true, message: 'Logging in...'})
    .then(loadingEl => {
      loadingEl.present();
      let authObs: Observable<AuthResponseData>;
      if (this.isLogin) {
        authObs = this.autService.login(email, password);
      } else {
        console.log(this.isLogin)
        authObs = this.autService.signup(email, password);
      }
      authObs.subscribe(responseData => {
        console.log(responseData);
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
        }, error => {
          loadingEl.dismiss();
          const code = error.error.error.message;
          let message = 'Could not sign you up, please try again. ' + code;
          if (code === 'EMAIL_EXISTS') {
              message = 'this email address already exists!';
          } else if (code === 'EMAIL_NOT_FOUND') {
            message = 'E-Mail address could not be found. ';
          } else if (code === 'INVALID_PASSWORD') {
            message = 'This password is not correct.';
          }
          this.showAlert(message);
        });
    });
  }
  onSwitchAuthModel() {
    this.isLogin = !this.isLogin;
  }
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.onLogin(email, password);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed', 
      message,
      buttons: ['Okay']
    }).then(ctrlEl => {
      ctrlEl.present();
      this.isLoading = false;
    });
  }
}
