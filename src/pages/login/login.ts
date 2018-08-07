import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import firebase from 'firebase';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  signIn(phoneNumber: number){
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        let prompt = this.alertCtrl.create({
        title: 'Enter the Confirmation code',
        inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
        buttons: [
          { text: 'Cancel',
            handler: data => { console.log('Cancel clicked'); }
          },
          { text: 'Send',
            handler: data => {
              confirmationResult.confirm(data.confirmationCode)
                .then(function (result) {
                  console.log('ok');
                  
                }).catch(function (error) {
                  // User couldn't sign in (bad verification code?)
                  // ...
                });
                this.navCtrl.setRoot( HomePage );
            }
          }
        ]
      });
      prompt.present();
    })
    .catch(function (error) {
      console.error("SMS not sent", error);
    });
    
  }

}