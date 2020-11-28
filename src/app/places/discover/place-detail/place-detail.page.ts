import { switchMap, take } from 'rxjs/operators';
import { MapModalComponent } from './../../../shared/map-modal/map-modal.component';
import { async } from '@angular/core/testing';
import { AuthService } from './../../../auth/auth.service';
import { BookingService } from './../../../bookings/booking.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { LocalisationUser } from 'src/app/shared/map-modal/map-modal.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placesSub: Subscription;
  isBookable = false;
  isLoading = false;
  imagePi: string;
  center;
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private placesService: PlacesService,
    private route: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.isLoading = true;
      let fetchedUserId;
      this.authService.userId.pipe(take(1), switchMap(userId => {
        if (!userId) {
          throw new Error('found no userId');
        }
        fetchedUserId = userId;
        return this.placesService.getPlace(paramMap.get('placeId'));
      })).subscribe(async (place: any) => {
      this.place = place;
      this.isBookable = place.id !== fetchedUserId;
      this.center = {lat: place.location.lat, lng: place.location.lon};
      await this.getLocationImage(place.location.lat, place.location.lon);
      this.isLoading = false;
    }, error => {
      this.alertCtrl.create({
        header: 'An error ocurred!',
        message: 'Could not load place.',
      buttons: [{text: 'Okay', handler: () => {
        this.router.navigateByUrl('/places/tabs/discover');
      }}]
      }).then(alertEl => alertEl.present());
    });
  });
}

  onBookPlace() {
    // this.router.navigate(['/places/tabs/discover']);
    // this.navCtrl.navigateBack('/places/tabs/discover');
    // this.navCtrl.pop();
    this.actionSheetCtrl.create({
      header: 'choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel '
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }
  openBookingModal(mode: 'select' | 'random') {
      console.log(mode);
      this.modalCtrl.create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode }
      }).then(modelEl => {
        modelEl.present();
        return modelEl.onDidDismiss();
      }).then(resultData => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {
          this.loadingCtrl.create({message: 'Booking place...'}).then(loadingEl => {
            loadingEl.present();
            console.log('Booked');
            console.log(this.place);
            const data = resultData.data.bookingData;
            this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageUrl,
            data.firstName,
            data.lastName,
            data.guestNumber,
            data.startDate,
            data.endDate).subscribe(() => {
              loadingEl.dismiss();
            });
          });

        }
      });
  }

  private getLocationImage(lat: number, lng: number) {
    this.imagePi = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=400&height=200&center=lonlat:${lng},${lat}&zoom=14&marker=lonlat:${lng},${lat};color:%23ff0000;size:large;text:A&apiKey=f5aa6802425f4079964f1d541b4d943d`;
    console.log(this.imagePi)
 }

 onShowFullMap() {
   this.modalCtrl.create({ 
     component: MapModalComponent,
     componentProps: {
      title: this.place.location.address.city_district,
      selectable: false,
      closeButtonText: 'Close',
      center: this.center
   } }).then(modalEl => {
     modalEl.present();
   })
 }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
