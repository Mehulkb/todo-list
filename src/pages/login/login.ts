import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { Data } from '../../providers/data/data';
import { HomePage } from '../home/home';
import { AndroidPermissions } from '../../../node_modules/@ionic-native/android-permissions';
declare var SMS: any;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  smsSent: boolean = false;
  messages:any=[];
  platform: any;

  constructor(public navCtrl: NavController, public androidPermissions: AndroidPermissions, public alertCtrl: AlertController, public toastCtrl: ToastController, public dat: Data) {}

  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  checkPermission()
  {
        this.androidPermissions.checkPermission
        (this.androidPermissions.PERMISSION.READ_SMS).then(
        success => {
                  
            //if permission granted
            this.ReadSMSList();
        },
        err =>{
                
            this.androidPermissions.requestPermission
            (this.androidPermissions.PERMISSION.READ_SMS).
            then(success=>{
                this.ReadSMSList();
            },
            err=>{
                alert("cancelled")
            });
        });

        this.androidPermissions.requestPermissions
        ([this.androidPermissions.PERMISSION.READ_SMS]);
              
        }
        ReadSMSList()
        {
            
            this.platform.ready().then((readySource) => {
                
            let filter = {
            box : 'inbox', // 'inbox' (default), 'sent', 'draft'
            indexFrom : 0, // start from index 0
            maxCount : 3, // count of SMS to return each time
            };
                
            if(SMS) SMS.listSMS(filter, (ListSms)=>{               
            this.messages=ListSms
            },
            Error=>{
              alert(JSON.stringify(Error))
              });
                  
          });
    }


  signIn(phoneNumber: number){
   const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then(confirmationResult=> {

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


