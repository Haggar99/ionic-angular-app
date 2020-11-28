import { HttpClient } from '@angular/common/http';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BookingModel } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

interface BookingData {
    bookedFrom: string;
bookedTo: string;
firstName: string;
guestNumber: number;
lastName: string;
placeId: string;
placeImage: string;
placeTitle: string;
userId: string;
}

@Injectable({providedIn: 'root'})
export class BookingService {

    private _bookings = new BehaviorSubject<BookingModel[]>([]) ;

    constructor(
        private authService: AuthService,
        private httpClient: HttpClient
    ){}


    get bookings() {
        return this._bookings.asObservable();
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date
        ) {
            let generateId: string;
            let newBooking: BookingModel;
            return this.authService.userId.pipe(take(1), switchMap(userId => {
                if (!userId) {
                    throw new Error('No user id found');
                }
                newBooking = new BookingModel(
            Math.random().toString(),
            placeId,
            userId,
            placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo);
                return this.httpClient
            .post<{name: string}>('https://ionic-angular-8ad14.firebaseio.com/bookings.json', {
            ...newBooking, id: null});
            }), switchMap(resData => {
                generateId = resData.name;
                return this.bookings;
            }), take(1), tap(booking => {
                newBooking.id = generateId;
                this._bookings.next(booking.concat(newBooking));
            }));

        //     return this.bookings.pipe(take(1), delay(1000), tap(bookings => {
        //     this._bookings.next(bookings.concat(newBooking));
        // }));
    }
    cancelBooking(bookingId: string) {
        return this.httpClient.delete(`https://ionic-angular-8ad14.firebaseio.com/bookings/${bookingId}.json`)
        .pipe(switchMap(() => {
            return this.bookings;
        }), take(1), tap(bookings => {
            this._bookings.next(bookings.filter(b => b.id !== bookingId));
        }));
        // return this.bookings.pipe(take(1), delay(1000), tap(bookings => {
        //     this._bookings.next(bookings.filter(b => b.id !== bookingId));
        // }));
    }

    fetchBookings() {
       return this.authService.userId.pipe(switchMap(userId => {
            if (!userId) {
                throw new Error('found no userId');
            }
            return this.httpClient.get<{[key: string]: BookingData}>(`https://ionic-angular-8ad14.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${
        userId}"`);
        }), map(bookingData => {
            const bookings = [];
            for (const key in bookingData) {
                if (bookingData.hasOwnProperty(key)) {
                    bookings.push(new BookingModel(
                        key,
                        bookingData[key].placeId,
                        bookingData[key].userId,
                        bookingData[key].placeTitle,
                        bookingData[key].placeImage,
                        bookingData[key].firstName,
                        bookingData[key].lastName,
                        bookingData[key].guestNumber,
                        new Date(bookingData[key].bookedFrom),
                        new Date(bookingData[key].bookedTo),
                        ));
                }
            }
            return bookings;
        }), tap(bookings => {
            this._bookings.next(bookings);
        }));
    }

}
