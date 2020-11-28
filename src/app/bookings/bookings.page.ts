import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { BookingModel } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookins: BookingModel[];
  bookingSub: Subscription;
  isLoading = false;
  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private router: Router,
  ) { }

  ngOnInit() {
 this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
    this.loadedBookins = bookings;
    console.log(bookings)
  });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCancel(bookingId, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loadingCtrl.create({message: 'Canceling...'}).then(loadingEl => {
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      });
    });
  }
  ngOnDestroy() {
    if (this.bookingSub) {
    this.bookingSub.unsubscribe();
    }
  }
}
