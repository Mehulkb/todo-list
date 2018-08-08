import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { Data } from '../../providers/data/data';
import { HomePage } from '../home/home';
var SMS;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  smsSent: boolean = false;
  windowRef: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController, public dat: Data) {}

  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  signIn(phoneNumber: number){
   const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then(confirmationResult=> {

      });
      
        if(SMS) SMS.startWatch(function(){
          console.log('watching', 'watching started');
        }, function(){
          console.log('failed to start watching');
        });
      
        document.addEventListener('onSMSArrive', function(e:any){
          var sms = e.data;
          alert(sms);
          console.log(sms);
        });
      
            
  }

  otpVerification(otp: string, phoneNumber: number) {
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then(confirmationResult=> {
              confirmationResult.confirm(otp)
              .then( (result) => {
                this.navCtrl.setRoot( HomePage )
                
              }).catch(function (error) {
                // User couldn't sign in (bad verification code?)
                // ...
              });
      });
  }

  resendOtp(phone) {
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phone;
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( confirmationResult => {
        if(confirmationResult)
        {
          this.smsSent=true;
          const toast = this.toastCtrl.create({
            message: 'OTP was sent successfully',
            duration: 2000
          });
          toast.present();
        }
      })
      .catch(function (error) {
        // User couldn't sign in (bad verification code?)
        // ...
    });
  }

  
}


