import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth,
  ) {}

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth
          .signInWithPopup(provider)
          .then(res => {
            resolve(res);
          }, err => {
            console.log(err);
            reject(err);
          });
    });
  }

  doTwitterLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.TwitterAuthProvider();
      this.afAuth
          .signInWithPopup(provider)
          .then(res => {
            resolve(res);
          }, err => {
            console.log(err);
            reject(err);
          });
    });
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth
          .signInWithPopup(provider)
          .then(res => {
            resolve(res);
          }, err => {
            console.log(err);
            reject(err);
          });
    });
  }

  doGithubLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GithubAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth
          .signInWithPopup(provider)
          .then(res => {
            resolve(res);
          }, err => {
            console.log(err);
            reject(err);
          });
    });
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
              .then(res => {
                resolve(res);
              }, err => reject(err));
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
              .then(res => {
                resolve(res);
              }, err => reject(err));
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.signOut();
        resolve();
      } else {
        reject();
      }
    });
  }
}
