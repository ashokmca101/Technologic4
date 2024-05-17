import { LightningElement,api,track } from 'lwc';
export default class BRC extends LightningElement 
{
    @track showWindow=true;
    @track mainwindow=true;
    @track showAdvanced=false;
    @track showParent = true;
    @track showChild = false; 
    @api jsonString;

closeModal(event)
{
    this.showWindow = false;
}
    connectedCallback() 
    {
        this.getJsonStrig();
        this.jsonString = this.jsonString.replace('{"objects":', '');
        var lastIndex =this.jsonString.lastIndexOf('}');
            if (lastIndex !== -1) {
                this.jsonString = this.jsonString.substring(0, lastIndex) + this.jsonString.substring(lastIndex + 1);
            } else {
                this.jsonString = this.jsonString;
            }

    }

    getJsonStrig()
    {
        this.jsonString  ='{"objects": [{"objectLabel": "Account","objectAPIName": "1","objectType": "Main",';
        console.log('JS :'+this.jsonString);
        this.jsonString+='"Fields": [{"label": "Industry","apiName": "Industry","isFilterable": "","isReadOnly": "","dataType": "text","order": 1},';
        console.log('line 2JS :'+this.jsonString);
        this.jsonString+='{"label": "Revenue","apiName": "Revenue","isFilterable": "","isReadOnly": "","dataType": "number","order": 2},';
        
        this.jsonString+='{"label": "isActive","apiName": "isActive","isFilterable": "","isReadOnly": "","dataType": "checkbox","order": 2}]},';

        this.jsonString+='{"objectLabel": "Contact","objectAPIName": "Contact","objectType": "Related_Child",';
        this.jsonString+='"Fields": [{"label": "FirstName","apiName": "FirstName","isFilterable": "","isReadOnly": "","dataType": "text","order": 1},';
        this.jsonString+='{"label": "birthday","apiName": "birthday","isFilterable": "","isReadOnly": "","dataType": "date","order": 2},';

        this.jsonString+='{"label": "LastName","apiName": "LastName","isFilterable": "","isReadOnly": "","dataType": "text","order": 3';

        this.jsonString+='}]}]}';     
        console.log('line LAST 2JS :'+this.jsonString);
        console.log('<====== setoptions1 accessed ===========>')  ;  
    }

    get parentClass() 
    {
            return this.showParent ? 'rowsectiontitle active' : 'rowsectiontitle';
    }

    get childClass() 
    {
            return this.showChild ? 'rowsectiontitle active' : 'rowsectiontitle';
    }
    showParentContent() 
    {
            this.showParent = true;
            this.showChild = false;
            this.mainwindow=true;
            this.showAdvanced=false;        
    }
    showChildContent() 
    {
            this.showParent = false;
            this.showChild = true;
            this.mainwindow=false;
            this.showAdvanced=true;        
    }

}