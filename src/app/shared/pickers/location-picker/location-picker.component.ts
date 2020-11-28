import { Coordinates } from './../../../places/location.model';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { of, Subscription } from 'rxjs';
import { PlaceLocation } from '../../../places/location.model';
import { Plugins, Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
@Output()  locationPick = new EventEmitter<PlaceLocation>();
@Input() showPreview = false;

  addressPicket;
  imagePi: string;
  isLoading: boolean;
  modalSubscription: Subscription;
  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetCtrl.create({header: 'Please Chose', buttons: [
      {text: 'Auto-Location', handler: () => {
        this.locateUser();
      }},
      {text: 'Pick on Map', handler: () => {
            this.openMap();
      }},
      {text: 'Cancel', role: 'cancel', handler: () => {}},
    ]}).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }
  private openMap() {
    this.modalCtrl.create({component: MapModalComponent}).then(el => {
      this.isLoading = true;
      el.onDidDismiss().then(dataMap => {
        this.addressPicket = dataMap.data.display_name;
        const center = {lat: dataMap.data.lat, lng: dataMap.data.lon};
        this.getLocationImage(center.lat, center.lng);
        this.locationPick.emit(dataMap.data);
      });
      el.present();
    });
  }
  private locateUser() {
   if (!Capacitor.isPluginAvailable('Geolocation')) {
    this.showErrorAlert();
    return;
   }
   this.isLoading = true;
   Plugins.Geolocation.getCurrentPosition()
   .then(geoPosition => {
     console.log(geoPosition.coords);
     const coordinates: Coordinates = {lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude};
     this.getLocationImage(coordinates.lat, coordinates.lng);
     this.locationPick.emit(coordinates);
     this.isLoading = false;
   })
   .catch(err => {
    this.isLoading = false;
    this.showErrorAlert();
   });
  }
  private showErrorAlert() {
    this.alertCtrl.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick a location!',
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }
  private getLocationImage(lat: number, lng: number) {
    this.imagePi = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=400&height=200&center=lonlat:${lng},${lat}&zoom=14&marker=lonlat:${lng},${lat};color:%23ff0000;size:large;text:A&apiKey=f5aa6802425f4079964f1d541b4d943d`;
    this.isLoading = false;

 }
}
