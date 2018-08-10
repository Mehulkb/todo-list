import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';

import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Data } from '../../providers/data/data';
import { HomePage } from '../home/home';
declare var SMS: any;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  smsSent: boolean = false;
  windowRef: any;

  constructor(public navCtrl: NavController, public androidPermissions: AndroidPermissions, public alertCtrl: AlertController, public toastCtrl: ToastController, public dat: Data, public platform: Platform) {}

  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  ionViewWillEnter()
{

this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
  success => console.log('Permission granted'),
err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
);

this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
}

  ionViewDidEnter() {

    this.platform.ready().then((readySource) => {

      if(SMS) SMS.startWatch(()=>{
                 console.log('watching started');
              }, Error=>{
             console.log('failed to start watching');
         });
        
        document.addEventListener('onSMSArrive', (e:any)=>{
             var sms = e.data;
             alert(sms.body);
      
             });
          
           
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


