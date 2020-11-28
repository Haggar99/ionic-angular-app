import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from './location.model';


// new Place(
//   'p1',
//   'Manatan Mansion',
//   'In the heard of new york city',
//   'https://upload.wikimedia.org/wikipedia/commons/3/3c/Vue_de_nuit_de_la_Place_Stanislas_%C3%A0_Nancy.jpg',
//   23,
//   new Date('2020-01-01'),
//   new Date('2020-12-01'),
//   'abc'
//   ),
// new Place(
//   'p2',
//   'Tanger Maroc',
//   'In the heard of new york city',
//   'https://viago.ca/wp-content/uploads/2017/09/9-stanislas.jpg',
//   23,
//   new Date('2020-01-01'),
//   new Date('2020-11-01'),
//   'abc'
//   ),
// new Place(
//   'p3',
//   'Iriba Tchad',
//   'In the heard of new york city',
// tslint:disable-next-line: max-line-length
//   'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/France-Nancy-Place_Stanislas_1_2007-03.jpg/1200px-France-Nancy-Place_Stanislas_1_2007-03.jpg',
//   23,
//   new Date('2020-01-01'),
//   new Date('2020-10-01'),
//   'abc'
//   )


interface  PlaceData {
availableFrom: Date;
availableTo: Date;
description: string;
imageUrl: string;
price: number;
title: string;
userId: string;
location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  // tslint:disable-next-line: variable-name
  private _places = new BehaviorSubject<Place[]>([]) ;
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService) { }

  get places() {
    return this._places.asObservable();
  }
  fetchinPlaces() {
    return  this.httpClient.get<{[key: string]: PlaceData}>('https://ionic-angular-8ad14.firebaseio.com/offered-places.json')
    .pipe(map(resData => {
      const places = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          places.push(
            new Place(key,
            resData[key].title,
            resData[key].description,
            resData[key].imageUrl,
            resData[key].price,
            resData[key].availableFrom,
            resData[key].availableTo,
            resData[key].userId,
            resData[key].location
            ), );
        }
      }
      return places;
    }),
    tap(places => {
      this._places.next(places);
    })
    );
  }
  getPlace(id: string) {
   return this.httpClient
   .get<PlaceData>(`https://ionic-angular-8ad14.firebaseio.com/offered-places/${id}.json`)
   .pipe(map(placeData => {
     return new Place(
       id,
       placeData.title,
       placeData.description,
       placeData.imageUrl,
       placeData.price,
       new Date(placeData.availableFrom),
       new Date(placeData.availableTo),
       placeData.userId,
       placeData.location
       );
   }));
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation
    ) {
    let generateId: string;
    let newPlace;
    return this.authService.userId.pipe(take(1), switchMap(userId => {
      if (!userId) {
        throw new Error('found no userId');
      }
      newPlace = new Place(
      Math.random().toString(),
      title, description,
      'https://viago.ca/wp-content/uploads/2017/09/9-stanislas.jpg',
      price,
      dateFrom,
      dateTo,
      userId,
      location);
      return this.httpClient
    .post<{name: string}>('https://ionic-angular-8ad14.firebaseio.com/offered-places.json',
    {
      ...newPlace,
      id: null
    });
    }),
      switchMap(resData => {
        generateId = resData.name;
        return this.places;
    }), take(1),
        tap(places => {
          newPlace.id = generateId;
          this._places.next(places.concat(newPlace));
        }));
    // return this.places.pipe(take(1), delay(1000), tap(places => {
    //     this._places.next(places.concat(newPlace));
    // })
    //   );
  }
  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1), switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchinPlaces();
        } else {
          return of(places);
        } }),
            switchMap(places => {
              const updatePlaceIndex = places.findIndex(pl => pl.id === placeId);
              updatedPlaces = [...places];
              const old = updatedPlaces[updatePlaceIndex];
              updatedPlaces[updatePlaceIndex] = new Place(
                placeId,
                title,
                description,
                old.imageUrl,
                old.price,
                old.availableFrom,
                old.availableTo,
                old.userId,
                old.location);
              return this.httpClient
                  .put(
                  `https://ionic-angular-8ad14.firebaseio.com/offered-places/${placeId}.json`,
                    {...updatedPlaces[updatePlaceIndex], id: null}
                 ); })
            , tap(() => {
            this._places.next(updatedPlaces);
            }));

    // return this.places.pipe(take(1), delay(1000), tap(places => {
    //   const updatePlaceIndex = places.findIndex(pl => pl.id === placeId);
    //   const updatedPlaces = [...places];
    //   const old = updatedPlaces[updatePlaceIndex];
    //   updatedPlaces[updatePlaceIndex] = new Place(
    //     placeId,
    //     title,
    //     description,
    //     old.imageUrl,
    //     old.price,
    //     old.availableFrom,
    //     old.availableTo,
    //     old.userId);
    //   this._places.next(updatedPlaces);
    // }));
  }
}
