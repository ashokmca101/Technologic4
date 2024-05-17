import { LightningElement, track } from 'lwc';

export default class GetCoordinates extends LightningElement {
    @track zipCode = '';
    @track latitude;
    @track longitude;
    @track loading = false;

    handleZipCodeChange(event) {
        this.zipCode = event.target.value;
    }

    async getCoordinates() {
        if (!this.zipCode) {
            // Handle error: Zip code is required
            return;
        }

        this.loading = true;

        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(this.zipCode));
            const data = await response.json();
            console.log('data :'+data);
            if (data.status === 'OK' && data.results && data.results.length > 0) {
                const location = data.results[0].geometry.location;
                this.latitude = location.lat;
                this.longitude = location.lng;
            } else {
                // Handle error: Unable to retrieve coordinates
                this.latitude = null;
                this.longitude = null;
            }
        } catch (error) {
            // Handle error: Fetch request failed
            this.latitude = null;
            this.longitude = null;
            console.log('Error found :'+error);
        }

        this.loading = false;
    }
}