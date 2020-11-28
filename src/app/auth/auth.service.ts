import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private _user = new BehaviorSubject<User>(null);
  activeLogoutTimer: any;

  constructor(
    private httpClient: HttpClient
  ) { }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          userId: string;
          email: string;
          token: string;
          tokenExpirationData: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationData);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(parsedData.userId, parsedData.email, parsedData.token, expirationTime);
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
      );
  }

  get userIsauth() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return !!user.token;
      } else {
        return false;
      }
    }));
  }
  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.id;
      } else { return null; }
    }));
  }

  signup(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
      environment.firebaseAPIKey
    }`,
    { email, password, returnSecureToken: true }
  ).pipe(tap(this.setUserData.bind(this)));
  }
  login(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
        environment.firebaseAPIKey
      }`,
      { email, password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));
  }
  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }
  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    },
    duration);
  }
  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime);
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
        userData.localId,
        userData.idToken,
        expirationTime.toISOString(),
        userData.email
      );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
    ) {
      const data = JSON.stringify({userId, token, tokenExpirationDate, email});
      Plugins.Storage.set({ key: 'authData', value: data });
  }
  ngOnDestroy(): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}
