export interface Coordinates {
    lat: number;
    lng: number;
}

export interface PlaceLocation extends Coordinates {
    address?: adressData;
    staticMapImageUrl?: string;
}

interface adressData {
city: string;
city_district: string;
country: string;
country_code: string;
county: string;
postcode: string;
region: string;
road: string;
shop: string;
state_district: string;
}