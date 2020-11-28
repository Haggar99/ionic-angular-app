import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as L from 'leaflet';

export interface LocalisationUser {
  lat: number;
  lng: number;
}
@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {

  @Input() center = {lat: 35.7808, lng: -5.8176};
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Djongol map',
      }),
    ],
    zoom: 12,
    center: this.center,
  };
  marckerImage = '../../../assets/marckers.png';
  layers = [];
  smallIcon = new L.Icon({
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    iconUrl: this.marckerImage,
    shadowUrl: ``,
    shadowSize: [29, 41],
  });
  marker;
  map;
  userPosition;
  addressPicked;
  addressMap;
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}
  onCancel() {
    this.modalCtrl.dismiss();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    setTimeout(() => {
      map.invalidateSize(true);
      if (!this.selectable) {
      this.map.flyTo(this.center);
      this.addMartker(this.center);
      }

    }, 100);
    // this.map.flyTo({ lat: 35.7808, lng: -5.8176 });
    // this.authService.getUserLocalisation().subscribe((data) => {
    //   const center: LocalisationUser = { lat: data.latitude, lng: data.longitude };
    //   this.map.flyTo(center, 14);
    //   this.addMarker(center);
    // }, (error) => {
    //   console.log(error);
    //   this.map.flyTo({ lat: 35.7808, lng: -5.8176 });
    // });
  }


  onClickMap(latlng: LocalisationUser) {
    if (this.selectable) {
      this.addMartker(latlng);
    }
  }


  addMartker(center: LocalisationUser) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    const marker = L.marker([center.lat, center.lng], {icon: this.smallIcon});
    marker.addTo(this.map);
    this.marker = marker;
    if (this.selectable) {
    this.userPosition = {...center };
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${center.lat}&lon=${center.lng}`)
    .then(data => {
      return data.json();
    })
    .then((json) => {
      this.addressPicked = json.display_name;
      this.addressMap = json;
      console.log(this.addressMap);
      this.modalCtrl.dismiss(this.addressMap);
    });
    }
  }
}
