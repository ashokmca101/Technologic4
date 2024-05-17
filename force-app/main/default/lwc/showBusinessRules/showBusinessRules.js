import { LightningElement,api,track } from 'lwc';
import getBusinessRules from '@salesforce/apex/BusinessRuleConfiguratorHelper.getBusinessRules';  
import DeleteBusinessRule from '@salesforce/apex/BusinessRuleConfiguratorHelper.DeleteBusinessRule';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ShowBusinessRules extends LightningElement 
{
    @api showWindow;

    @track showRules=true;
    @track businessRuleRecords;
    @track idList;
    @track customRecords=[];
    @track splitString;
    @track editRecordwindow=false;
    @track editRecord;
    @track objectName;

    @track objOptions=[];
    @track fieldOptions=[];
    @track fieldOptionFromConfg=[];
    @track operatorsList=[];
    @track colorCode;
    @track highlightedFieldLabel;
    @track conditionalLogic;
    @track hfield='';
    @track completeRow=[];
    @track delicon;
    @track addicon;
    @track rows = [];
    @api jsonString;
    @track editedObject;

    @api showBusinessRule;

    @track createRule;
    @track editRule;
    @track Total_Records_Count=0;
    @track primaryColor = 'orange';
    get iconStyle() {
        return this.primaryColor ? `--sds-c-icon-color-foreground-default: ${this.primaryColor} !important;width:65px;` : '';

    }
        get buttonStyle() {
        return this.primaryColor ? `background-color: ${this.primaryColor} !important;border-color: ${this.primaryColor} !important;` : '';

    }
createeditchange(event)
{
    console.log('inside createeditchange EVENT');
    this.getBusinessRuleRecords();
    let v = event.detail;
    console.log('createeditchange EVENT :'+v);
    this.editRecordwindow = v;
    this.showRules=v==true?false:true;
    this.showWindow = this.showRules;
    console.log('showWindow :'+this.showWindow);
    console.log('showRules :'+this.showRules);
    console.log('customRecords length :'+this.customRecords.length);
}


getFieldsListFgromConfigurator(selectedObject)
{
    console.log('inside conifg');
    console.log('this.completeRow.selectedObject :'+selectedObject);
    console.log('Final JSON String 2 :'+this.jsonString);
    var temp = JSON.parse(this.jsonString);
    console.log('inside conifg temp :'+temp);
    console.log('inside conifg temp length :'+temp.length);
     var tempFieldOptions=[];
        temp.forEach(eObject => {
            console.log('eObject Name:', eObject.objectLabel);
            // Loop through the contacts array of each account
            eObject.Fields.forEach(field => {
                if(selectedObject==eObject.objectLabel)
                {
                    console.log('Field :'+field.label);
                   // console.log('Field Type :'+field.dataType);                    
                    tempFieldOptions.push({ label: field.label, value: field.label });                                       
                }
            });
        });
        console.log('11. Field selectedField :'+this.selectedField);
         console.log('11. Field selectedDataType :'+this.selectedDataType);
        console.log('123');
        for(var i=0;i<tempFieldOptions.length;i++)
        {
            console.log('V :'+tempFieldOptions[i].value);
        }
    this.fieldOptionFromConfg = tempFieldOptions;
    console.log('IJK');
       for(var i=0;i<this.fieldOptionFromConfg.length;i++)
        {
            console.log('V1 :'+this.fieldOptionFromConfg[i].value);
        }    
   // this.setOperators(this.selectedDataType);
    console.log('ABC');
}



changeconditionalLogic(event)
{
this.conditionalLogic = event.detail.value;
}
changehfield(event)
{
    this.highlightedFieldLabel = event.detail.value;
    console.log('changed Value is hfield:'+this.highlightedFieldLabel);
}
handleChangeColor(event)
{
    console.log('color changed :'+event.detail.value);
    this.colorCode = event.detail.value;
}


connectedCallback() {
    console.log('tested 123');
    this.getBusinessRuleRecords();
}
deleteRule(event)
{
    const rowId = event.target.dataset.id;
    console.log('Deleted Rule Event delrowId :'+rowId); 

    var delRecord = this.businessRuleRecords.find(record => record.Id === rowId);    
    console.log('Deleted Record Id :'+delRecord.Id);
    console.log('Deleted Record Business_Rule_Logic__c :'+delRecord.Business_Rule_Logic__c);
    DeleteBusinessRule({
        RuleId:delRecord.Id
    }).then(result=>{
        if(result!=null)
        {
            this.getBusinessRuleRecords();
            window.alert('Record  Deleted Successfully');
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: 'Record '+delRecord.Name+' Deleted Successfully',
                    variant: 'success'
                });    
                this.dispatchEvent(event);
        }
        else{
            window.alert('No Records Found To Delete');
        }
    }).catch(error=>{
            window.alert('Error while Deleting The Business Rule');
    });
}
handleEdit(event)
{
    const custevt = new CustomEvent('addbusinessrule', { detail: false });
    this.dispatchEvent(custevt); 

    this.createRule=false;
    this.editRule = true;	

    const rowId = event.target.dataset.id;
    console.log('delrowId :'+rowId); 
    this.editRecordwindow = true;  
    var tempRows=[];
    this.editRecord = this.businessRuleRecords.find(record => record.Id === rowId); 
    
    try{
        let temp = JSON.parse(this.editRecord.Business_Rule_Logic__c);        
        console.log('JSON String converteed');
        console.log('JSON String temp :'+temp);
        console.log('JSON String temp :'+temp.selectedObject);
        this.objectName=temp.selectedObject;
        this.colorCode =temp.colorCode;
        this.highlightedFieldLabel=temp.highlightedFieldLabel;
        this.conditionalLogic=temp.conditionalLogic;
        this.objOptions.push(
            { label: temp.selectedObject, value: temp.selectedObject }
        );

        var businessRuleConditions = temp.businessRuleConditions;
        console.log('Sizse of Fields :'+businessRuleConditions.length);
        console.log('Fields fieldLabel :'+businessRuleConditions[0].fieldLabel);
        var tempFieldList=[];
        for(var i=0;i<businessRuleConditions.length;i++)
        {
            tempFieldList.push( 
                { label: businessRuleConditions[i].fieldLabel, value: businessRuleConditions[i].fieldLabel}
            );
            var opl = this.setOperators(businessRuleConditions[i].datatype);
            
            console.log('GOT datatype :'+opl);
            if(businessRuleConditions[i].condition.type=='In Range')
            {
                console.log('<==========  got zero ===========> :'+businessRuleConditions[i].datatype);
                businessRuleConditions[i].condition.range=true;
            }
            else
            {
                businessRuleConditions[i].condition.range=false;
            }

        }
        console.log('GOT tempRows siz :'+tempRows.length);
        this.delicon=  tempRows.length>1?true:false;
        this.addicon = tempRows.length<3?true:false;
        this.rows = tempRows;
        this.completeRow = temp;
        this.editedObject = temp.selectedObject;
        this.fieldOptions = tempFieldList;

    try{
        this.getFieldsListFgromConfigurator(temp.selectedObject);
    }
    catch(error)
    {

    }


    } catch(Error){

    }
    this.getBusinessRuleRecords();
    this.showWindow=false;

}


getBusinessRuleRecords()
{
    getBusinessRules({
        idList:this.idList
    }).then(result=>{
        if(result)
        {
            var temp=[];
            var rules=[];
            console.log('Got Records Successfully');
            this.businessRuleRecords=result;
            
            console.log('Records Size :'+this.businessRuleRecords.length);
            this.Total_Records_Count=this.businessRuleRecords.length;
            for(let x=0;x<result.length;x++)
            {
                console.log('<====   Record :'+x);
                rules=[];
               // temp=JSON.parse(temp[x].Business_Rule_Condition__c);
               // console.log('this.splitString stringify :'+result[x].Business_Rule_Condition__c.split(';'));
               var bl = result[x].Business_Rule_Condition__c;
               bl = bl.replace('where','where;');
                rules = bl.split(';');
               temp.push({
                    key:result[x].Id,
                    brc:rules
                    
               });
            }
            this.customRecords=temp;
            console.log('customRecords length :'+temp.length);
        }
        else
        {
            console.log('No Records Found');
        }
        
    }).catch(error=>{
        console.log('Got Error to Fetch BR Records :'+error);
    });
}


addNewRule(event)
{
    console.log('inside Add Rule window');
    this.editRecordwindow = true;
    this.showRules=false;
    this.createRule=true;
    this.editRule = false;
}

/*  
valuefromchildone(event)
{
    var v = event.detail;
    console.log('From Child Value :'+v);
    this.addrule=v;
}
*/

cancelWindow(event)
{
    this.showWindow=true;
    this.showRules=true;
    const custevt = new CustomEvent('addbusinessrule', { detail: true });
    this.dispatchEvent(custevt); 

}   

}