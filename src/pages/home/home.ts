import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { AddItemPage } from '../add-item/add-item'
import { ItemDetailPage } from '../item-detail/item-detail';
import {Data} from '../../providers/data/data'
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public items = [];
  public image = '';
  private options: CameraOptions;

  constructor(public navCtrl: NavController, private camera: Camera, public modalCtrl: ModalController, public dataService: Data) {

    this.dataService.getData().then((todos) => {

      if (todos) {
        this.items = JSON.parse(todos);
      }

    });
    this.options = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

  }

  ionViewDidLoad() {

  }

  getPicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });
  }

  addItem() {

    let addModal = this.modalCtrl.create(AddItemPage);

    addModal.onDidDismiss((item) => {

      if (item) {
        this.saveItem(item);
      }

    });

    addModal.present();

  }

  saveItem(item) {
    this.items.push(item);
    this.dataService.save(this.items);
  }

  removeItem(item){
    let index = this.items.indexOf(item);

    if(index > -1){
      this.items.splice(index, 1);
    }
}

  viewItem(item) {
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }

}