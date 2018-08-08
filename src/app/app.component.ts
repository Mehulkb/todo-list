import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import firebase from 'firebase';
import { AndroidPermissions } from '@ionic-native/android-permissions'


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public androidPermissions: AndroidPermissions) {

    const firebaseConfig = {
      apiKey: "AIzaSyDdHskMr-LytQeXEAXeUswf0dOgfvJQ3jw",
    authDomain: "todo-9c84f.firebaseapp.com",
    databaseURL: "https://todo-9c84f.firebaseio.com",
    projectId: "todo-9c84f",
    storageBucket: "todo-9c84f.appspot.com",
    messagingSenderId: "984281961030"
    };
    firebase.initializeApp(firebaseConfig);

    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS, 
      this.androidPermissions.PERMISSION.RECEIVE_SMS,this.androidPermissions.PERMISSION.SMS]).then(status => {
        console.log('All Has permission?=>',status.hasPermission);
    },err => {
      console.log('All Has permission Failed=>',status);
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

