import { LightningElement,api } from 'lwc';
export default class Combbox extends LightningElement {
    @api options;
    @api value;
    @api bordercolor='green';
    @api selectlabel;
    @api isdisabled=false;
    @api colr='custom-combobox';

    handleChange(event) {
       console.log('FROM child this.value :'+this.value);     
        console.log('11 FROM child comp Value :'+event.target.value);
        this.dispatchEvent(new CustomEvent('changee', { detail: event.target.value }));
        console.log('CC Options :'+this.options.length);
    }
    connectedCallback() {
        console.log('colr :'+this.colr);
        console.log('Child Connected callback isdisabled:'+this.isdisabled);
        this.colr = 'combobox '+this.bordercolor;
        console.log('colr :'+this.colr);
        console.log('Options :'+this.options.length);        
    }
onfoc(event)
{
    console.log('<===== onfoc ====>'+this.bordercolor);
    this.colr = 'combobox '+this.bordercolor;
    console.log('<===== onfoc ====>');
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