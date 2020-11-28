import { map, take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listLoadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSub: Subscription;
  isLoading = false;
  constructor(
    private placesService: PlacesService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listLoadedPlaces = this.relevantPlaces.slice(1);
      console.log(this.loadedPlaces);
    });
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchinPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }
  onFilterUpdate(event: CustomEvent) {
    this.authService.userId.pipe(take(1)).subscribe(userId => {
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedPlaces;
      this.listLoadedPlaces = this.relevantPlaces.slice(1);
    }else {
      this.relevantPlaces = this.loadedPlaces.filter(
        place => place.userId !== userId
      );
      this.listLoadedPlaces = this.relevantPlaces.slice(1);
    }
    });
  }
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
