import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Plugins, Capacitor } from '@capacitor/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  authSubcription: Subscription;
  private previousAuthState = false;
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private navCtrl: NavController,
    private authService: AuthService
  ) {
    this.initializeApp();
  }
  ngOnInit(): void {
    this.authSubcription = this.authService.userIsauth.subscribe(isAuth => {
      if (!isAuth && this.previousAuthState !== isAuth) {
      this.navCtrl.navigateRoot('/auth');
      }
      this.previousAuthState = isAuth;
    });
  }

  initializeApp() {
    console.log(this.platform.is('android'));
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
  }

  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    if (this.authSubcription) {
      this.authSubcription.unsubscribe();
    }
  }
}
