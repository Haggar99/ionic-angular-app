import { SharedModule } from './../../../shared/shared.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailPageRoutingModule } from './place-detail-routing.module';

import { PlaceDetailPage } from './place-detail.page';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceDetailPageRoutingModule,
    LeafletModule,
    SharedModule
  ],
  declarations: [PlaceDetailPage, CreateBookingComponent],
  entryComponents: [CreateBookingComponent]
})
export class PlaceDetailPageModule {}
