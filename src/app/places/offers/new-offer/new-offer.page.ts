import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.model';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(180)]],
      price: [, [Validators.required, Validators.min(1)]],
      dateFrom: [, Validators.required],
      dateTo: [, Validators.required],
      location: [, Validators.required],
      image: [, Validators.required]
    });
  }
  onSubmit() {
   const formValue = this.form.value;
   const newOffer = {
     title: formValue.title,
     description: formValue.description,
     price: formValue.price,
     dateFrom: formValue.dateFrom,
     dateTo: formValue.dateTo,
   };

   console.log(newOffer);
  }
  onLocationPicked(location: PlaceLocation) {
    console.log(location);
    this.form.patchValue({ location });
    console.log(this.form);
  }
  onCreateOffer() {
    if (this.form.invalid || !this.form.get('image').value) {
      return;
    }
    console.log(this.form.value)
    const formValue = this.form.value;
    const newOffer = {
      title: formValue.title,
      description: formValue.description,
      price: formValue.price,
      dateFrom: formValue.dateFrom,
      dateTo: formValue.dateTo
    };
    this.loadingCtrl.create(
      {
        message: 'Creating place.... '
      }
    ).then(loadingEl => {
      loadingEl.present();
      this.placesService.addPlace(
      formValue.title,
      formValue.description,
      formValue.price,
      new Date(formValue.dateFrom),
      new Date(formValue.dateTo),
      this.form.value.location,
      ).subscribe(() => {
    loadingEl.dismiss();
    this.form.reset();
    this.router.navigateByUrl('/places/tabs/offers');
    console.log(newOffer);
      });
    });
  }
  onImagePicket(image: string | File) {
    console.log(image)
    let imageFile;
    if (typeof image === 'string') {
      try {
       imageFile = base64toBlob(
          image.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = image;
    }
    this.form.patchValue({image: imageFile});
    console.log(this.form.get('image').value);
  }
}
