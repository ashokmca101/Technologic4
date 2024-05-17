import { LightningElement,track,api } from 'lwc';
export default class CustomButtons extends LightningElement 
{
@track primaryColor='orange';
@track disableButton=false;

@track varianttype='brand-outline';

changeBrand(event)
{
 this.disableButton=true;
 console.log('Brand Changed');
  this.varianttype='brand';  
  this.disableButton=true;
}

get buttonStyle() {
        return this.primaryColor ? `background-color: ${this.primaryColor} !important;border-color: ${this.primaryColor} !important; color:yellow !important;` : '';

    }
   

}