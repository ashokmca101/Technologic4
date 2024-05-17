import { LightningElement,track, api } from 'lwc';
import { getLocationService } from 'lightning/mobileCapabilities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveRecord from '@salesforce/apex/MS_Helper.saveRecord';

export default class MeetingSchedule extends LightningElement {
 @track Name;
 @track customer;
 @track usr;
 @track Notes;

valuechange(event)
{
    console.log('Event');
    var x = event.detail.value;
    console.log('x :'+x);
    this.Name=x;
}
customerchange(event)
{
    console.log('Event');
    var x = JSON.stringify(event.detail.value);
    x = x.replace('["', '');
    x = x.replace('"]', '');
    console.log('x :'+x);
    console.log('x :'+x.length);
    this.customer=x;
}
usrchange(event)
{
    console.log('Event');
    var x = event.detail.value;
    console.log('x :'+x);
    this.usr=x;
}
Noteschange(event)
{
    console.log('Event');
    var x = event.detail.value;
    console.log('x :'+x);
    this.Notes=x;   
}
saveRecordfinal(event)
{
    var name= this.Name;
    console.log('name :'+name);
    
    var customer= this.customer;
    let cus = this.customer;
    console.log('cus :'+cus);
    console.log('name :'+customer);    
    saveRecord({
        temp:name,
        val:customer
    }).then(res=>{

    }).catch(err=>{

    });
}
}