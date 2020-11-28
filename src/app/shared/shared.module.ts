import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MapModalComponent } from './map-modal/map-modal.component';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
@NgModule({
    declarations: [LocationPickerComponent, MapModalComponent, ImagePickerComponent],
    imports: [
        CommonModule,
        IonicModule,
        LeafletModule
    ],
    exports: [
        LocationPickerComponent,
        MapModalComponent,
        ImagePickerComponent
    ],
    entryComponents: [MapModalComponent]
})

export class SharedModule {}