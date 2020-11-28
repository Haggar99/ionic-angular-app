import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Place } from '../../place.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  place: Place;
  form: FormGroup;
  private placesSub: Subscription;
  isLoading = false;
  placeId: string;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }


  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      const param = paramMap.getAll('placeId');
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placesSub = this.placesService
      .getPlace(paramMap.get('placeId'))
      .subscribe(place => {
        this.place = place;
        this.form = this.formBuilder.group({
        title: [this.place.title, Validators.required],
        description: [this.place.description, Validators.required]
      });
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
        header: 'An error occurred!',
        message: 'Place could be fetched. please try again later.',
        buttons: [{text: 'Okay', handler: () => {
          this.router.navigate(['/places/tabs/offers']);
        }}]
      }).then(alerEl => {
        alerEl.present();
      });
      });
      console.log(paramMap.get('placeId'));
      console.log(this.place);
    });
    // this.route.params.subscribe(param => {
    //   this.isLoading = true;
    //   this.placeId = param.placeId;
    //   this.placesSub = this.placesService.getPlace(param.placeId).subscribe(place => {
    //   this.place = place;
    //   console.log(this.place, param.placeId);
    //   this.form = this.formBuilder.group({
    //     title: [this.place.title, Validators.required],
    //     description: [this.place.description, Validators.required]
    //   });
    // });
    //   this.isLoading = false;
    // });
  }

  onUpdateForm() {
    if (this.form.invalid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(
      this.place.id,
      this.form.value.title,
      this.form.value.description).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigateByUrl('/places/tabs/offers');
      });
    });

  }
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
