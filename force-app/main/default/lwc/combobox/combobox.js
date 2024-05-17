// combobox.js
import { LightningElement, api } from 'lwc';

export default class Combobox extends LightningElement {
    @api options = [];
    @api value;
    @api bordercolor='green';
    @api selectlabel;
    @api isdisabled=false;

    handleChange(event) {
        console.log('child comp Value :'+event.target.value);
        this.dispatchEvent(new CustomEvent('change', { detail: event.target.value }));
    }
    connectedCallback() {
        console.log('Child Connected callback isdisabled:'+this.isdisabled);
    }
get labeltitle()
{
    return this.selectlabel ? this.selectlabel:'Select '
}
    get getcombocolor()
    {
        
       return this.bordercolor ? 'combobox' + ' '+this.bordercolor : 'combobox green';
    }
}