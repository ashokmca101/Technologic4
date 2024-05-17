import { LightningElement,track,api } from 'lwc';
export default class EditConfigurator extends LightningElement 
{
@api configName;
@api configRecord;
closeEditConfig()
{
   const event = new CustomEvent('afteredit', { detail: false });
   this.dispatchEvent(event);
}
connectedCallback() 
{
    console.log('Config Name :'+this.configName);
    console.log('Config configRecord :'+this.configRecord.Json_String_Level_1__c);
}
}