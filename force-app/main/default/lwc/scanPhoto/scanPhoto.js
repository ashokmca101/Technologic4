import { LightningElement } from 'lwc';

export default class ScanPhoto extends LightningElement {
    scannedImage;

    handleScan() {
        // Make a request to backend service to initiate scan
        fetch('/api/scan', {
            method: 'POST'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to initiate scan');
            }
            return response.blob();
        })
        .then(blob => {
            // Convert blob to data URL and set as scannedImage
            const reader = new FileReader();
            reader.onload = () => {
                this.scannedImage = reader.result;
            };
            reader.readAsDataURL(blob);
        })
        .catch(error => {
            console.log('ERROR:');
            console.error(error);
            // Handle error
        });
    }
}