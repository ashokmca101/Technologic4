import { LightningElement,track,api } from 'lwc';
// import getFields from '@salesforce/apex/BusinessRuleConfiguratorHelper.getFields';
import saveBusinessRule from '@salesforce/apex/BusinessRuleConfiguratorHelper.saveBusinessRule';
import updateBusinessRule from '@salesforce/apex/BusinessRuleConfiguratorHelper.updateBusinessRule';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CreateAndEditBusinessRule extends LightningElement 
{
    @track fieldvalue = 'id';
    @track operatorselected = 'Equal To';
    @track val=0;
    @track colorvalue='#A9167D';
    @api obAPIjName ='Account';
    @api htextfields='id';
    @api count=1;
    @api maxrows=3;
    @track fieldsList=[];
    @track ObjectsList=[];
    
    @track rows = [];
    @track editRows = [];

    @track showParent = true;
    @track showChild = false; 
    @track showWindow=true;
    @track objValue='Account';   
    @track mainwindow=true;
    @api businessrulewindow;
    @api fieldDefinitions =[];
    @api currentObject='Account';
    @track hfield='';
    @track delicon = true; 
    @track addicon = true;
    @track jsonString;
    @api jsonText;

    @track objectOptions = [];
    @track selectedObject='';
    @track fieldOptions = [];
    @track selectedField;
    @track operatrsList=[];
    @track selectedField;

    @track conditionvalue='1 AND 2';

    @track fieldAPIName;
    @api configId;

// create and edit functionality
    @api createfunction = false;
    @api editfunction =false;
    @api businessruleRecord; 

    @track edit_objectName;
    @track edit_colorCode;
    @track edit_highlightedFieldLabel;
    @track edit_conditionalLogic;
    @track primaryColor = 'orange';
    @track Save_Update='Save';
    @track isChecked=true;
    @track isunChecked=false;
    // @track valueType='number';
// ADDED FFULL FUNCTINALITY 19-04-2024
    get iconStyle() {
        return this.primaryColor ? `--sds-c-icon-color-foreground-default: ${this.primaryColor} !important;width:65px;` : '';

    }
seteditRow()
{
    try{
        console.log('======= SITE EDIT ROW======')
        console.log(' businessruleRecord :'+this.businessruleRecord.Id);
        console.log(' businessruleRecord :'+this.businessruleRecord.Business_Rule_Logic__c);
        let temp = JSON.parse(this.businessruleRecord.Business_Rule_Logic__c);        
        console.log('JSON String converteed');
        console.log('JSON String temp :'+temp);
        console.log('Editted Object :'+temp.selectedObject);
        this.edit_objectName=temp.selectedObject;
        this.edit_colorCode =temp.colorCode;
        this.edit_highlightedFieldLabel=temp.highlightedFieldLabel;
        this.edit_conditionalLogic=temp.conditionalLogic;

        this.selectedObject = temp.selectedObject;
        var businessRuleConditions = temp.businessRuleConditions;
        console.log('Sizse of Fields :'+businessRuleConditions.length);
        console.log('Fields fieldLabel :'+businessRuleConditions[0].fieldLabel);
        var tempRows =[];
        let show;
        for(var i=0;i<businessRuleConditions.length;i++)
        { 
            var lowv,highv,valv,checkbox;   
            show=true;       
            var opl = this.setOperators(businessRuleConditions[i].datatype);           
            if(businessRuleConditions[i].condition.type=='In Range')
            {
               lowv=businessRuleConditions[i].condition.startValue;
               highv=businessRuleConditions[i].condition.endValue;
               show=false;
               // businessRuleConditions[i].condition.range=true;
            }
            else
            {
                valv = highv=businessRuleConditions[i].condition.endValue;
                highv=0;
            }

            checkbox = businessRuleConditions[i].datatype=='checkbox'?true:false;
        console.log('<-------------------------->');
        console.log('FIELD NAME :'+businessRuleConditions[i].fieldLabel);
        console.log('FIELD ENDVALUE :'+businessRuleConditions[i].condition.endValue);
        console.log('FIELD startValue :'+businessRuleConditions[i].condition.startValue);
        console.log('SHOW :'+show);
        console.log('FIELD DATATYPE :'+businessRuleConditions[i].datatype);
       // console.log('opl :'+opl);
        console.log('FIELD fieldAPIName :'+businessRuleConditions[i].fieldAPIName);
        console.log('FIELD type :'+businessRuleConditions[i].condition.type);
        console.log('valv :'+valv);
        console.log('<--------------------------- >');
        tempRows.push({ 
            key: i,
            fieldvalue:businessRuleConditions[i].fieldLabel,
            operatorselected:businessRuleConditions[i].condition.type,
            val:valv,
            rowvalue:show,
            low:lowv,
            checkbox:checkbox,
            high:highv,
            fieldtype:businessRuleConditions[i].datatype,
            operatorsList:opl,
            fieldAPIName:businessRuleConditions[i].fieldAPIName             
             });                   
        }
        console.log('TEMP ROWS SIZE :'+tempRows.length);
        this.rows = tempRows;
        console.log('this ROWS SIZE :'+this.rows.length);
        for(let m=0;m<this.rows.length;m++)
        {

            console.log('==================');
            console.log('FIELD NAME :'+this.rows[m].fieldvalue);
            console.log('FIELD rowvalue :'+this.rows[m].rowvalue);
            console.log('FIELD operatorselected :'+this.rows[m].operatorselected);
            console.log('FIELD val :'+this.rows[m].val);
            console.log('FIELD low :'+this.rows[m].low);
            console.log('FIELD high :'+this.rows[m].high);
            console.log('FIELD fieldtype :'+this.rows[m].fieldtype);             
            console.log('==================');
        }


        try{
           // this.getFieldsListFgromConfigurator(temp.selectedObject);
        }
        catch(error) {}
    } 
    catch(Error){}
}
// UPTO HERE ADDED NEW FUNCTIONALITY 19-04-2024

// added 17-4-2024
handleChangeColor(event)
{
    console.log('color changed :'+event.detail.value);
    this.colorvalue = event.detail.value;
}
setOperators(typex)
{
    var changedop =[];
    this.operatrsList=[];
    console.log('changed Type :'+typex);
 if(typex=='text')
 {
     changedop =  [
                { label: 'None', value: 'None' },
                { label: 'Equal To', value: 'Equal To' },
                { label: 'Not Equal', value: 'Not Equal' },
                { label: 'Contains', value: 'Contains' },
                { label: 'Does Not Contain', value: 'Does Not Contain' },
                { label: 'Starts With', value: 'Starts With' }
            ];

 }
 else if(typex=='number')
 {
     changedop = [
                { label: 'None', value: 'None' },
                { label: 'Equal To', value: 'Equal To' },
                { label: 'Less Than', value: 'Less Than' },
                { label: 'Greater Than', value: 'Greater Than' },
                { label: 'Less Than or Equal', value: 'Less Than or Equal' },
                { label: 'Greater Than or Equal', value: 'Greater Than or Equal' },
                { label: 'In Range', value: 'In Range' }
            ];
 } else if(typex=='date')
 {
        changedop = [
                { label: 'None', value: 'None' },
                { label: 'Equal To', value: 'Equal To' },
                { label: 'Not Equal', value: 'Not Equal' },
                { label: 'Before', value: 'Before' },
                { label: 'After', value: 'After' }
            ];
 } else if(typex=='checkbox')
 {
    changedop = [
            { label: 'None', value: 'None' },
            { label: 'Equal To', value: 'Equal To' }, 
            { label: 'Not Equal', value: 'Less Than' }                    
        ];
 } 
 else
 {
    changedop = [
            { label: 'None', value: 'None' },
            { label: 'Equal To', value: 'Equal To' },
            { label: 'Less Than', value: 'Less Than' },
            { label: 'Greater Than', value: 'Greater Than' },
            { label: 'Less Than or Equal', value: 'Less Than or Equal' },
            { label: 'Greater Than or Equal', value: 'Greater Than or Equal' }, 
            { label: 'Not Equal', value: 'Less Than' },
            { label: 'In Range', value: 'In Range' }                      
        ];
 }
 console.log('33<==== >>');
this.operatrsList = changedop;
console.log('44<==== >>');
return changedop;
}
setoptions1(event)
{
/*
    this.jsonString  ='{"objects": [{"objectLabel": "Account","objectAPIName": "1","objectType": "Main",';
    console.log('JS :'+this.jsonString);
    this.jsonString+='"Fields": [{"label": "Industry","apiName": "Industry","isFilterable": "","isReadOnly": "","dataType": "text","order": 1},';
    console.log('line 2JS :'+this.jsonString);
    this.jsonString+='{"label": "Revenue","apiName": "Revenue","isFilterable": "","isReadOnly": "","dataType": "number","order": 2}]},';
    
    this.jsonString+='{"objectLabel": "Contact","objectAPIName": "Contact","objectType": "Related_Child",';
    this.jsonString+='"Fields": [{"label": "FirstName","apiName": "FirstName","isFilterable": "","isReadOnly": "","dataType": "text","order": 1},';
    this.jsonString+='{"label": "birthday","apiName": "birthday","isFilterable": "","isReadOnly": "","dataType": "date","order": 2';
    this.jsonString+='}]}]}';     
    console.log('line LAST 2JS :'+this.jsonString);
    console.log('<====== setoptions1 accessed ===========>')   ;
*/
}
connectedCallback()
{

console.log('inside Connected Callback createfunction:'+this.createfunction);
console.log('inside Connected Callback editfunction:'+this.editfunction);


if(this.editfunction==true)
{
    console.log('inside Connected Callback businessruleRecord :'+this.businessruleRecord.Id);
    this.seteditRow();

    console.log('JsonText :'+this.jsonText);
    this.setoptions1();
    console.log('0000 jsonString :'+this.jsonString);

   this.jsonString = this.jsonText;

      console.log('Final JSON String 2 :'+this.jsonString); 
        try {
            var temp = JSON.parse(this.jsonString);
            this.setFinalObject(temp);
            this.setFinalFields(temp);
           // this.addnewrow();           
        } catch (error) {
            console.log('ERROR :'+error);
        }
    this.hfield = this.edit_highlightedFieldLabel; 
    this.colorvalue=this.edit_colorCode;
    this.conditionvalue = this.edit_conditionalLogic;
    this.Save_Update='Update';

    this.addicon=this.rows.length==3?false:true;
    this.delicon = this.rows.length==1?false:true;
}

else
{
    this.Save_Update='Save';
    console.log('JsonText :'+this.jsonText);
    this.setoptions1();
    console.log('0000 jsonString :'+this.jsonString);

   this.jsonString = this.jsonText;

      console.log('Final JSON String 2 :'+this.jsonString); 
        try {
            var temp = JSON.parse(this.jsonString);
            this.setFinalObject(temp);
            this.setFinalFields(temp);
            this.addnewrow();
            this.delicon = false;
            this.addicon = true;
            
        } catch (error) {
            console.log('ERROR :'+error);
        }
    this.hfield = this.selectedField; 
}


}
// set Objects on ObjectsList
setFinalObject(temp)
{
            var tempobjectOptions=[];
             tempobjectOptions.push({ label: 'None', value: 'None' });
            temp.forEach(eObject => {
                    tempobjectOptions.push({ label: eObject.objectLabel, value: eObject.objectLabel });
                    this.selectedObject = eObject.objectLabel;
             });
            this.objectOptions = tempobjectOptions;
}
// setting fields for Object
setFinalFields(temp)
{
    console.log('FIELDS SETUP this.selectedObject:'+this.selectedObject);
        if(this.editfunction==true)
        {
            console.log('EDIT this.edit_objectName :'+this.edit_objectName);
            this.selectedObject = this.edit_objectName;
        }

     var tempFieldOptions=[];
     tempFieldOptions.push({ label: 'None', value: 'None' });
        temp.forEach(eObject => {
            console.log('eObject Name:', eObject.objectLabel);
            // Loop through the contacts array of each account
            eObject.Fields.forEach(field => {
                if(this.selectedObject==eObject.objectLabel)
                {
                    console.log('Field :'+field.label);
                   // console.log('Field Type :'+field.dataType);                    
                    tempFieldOptions.push({ label: field.label, value: field.label });
                       // this.selectedField=field.label;
                       // this.selectedDataType=field.dataType;
                       // this.fieldAPIName=field.apiName;                                                                                 
                }
            });
        });
        this.selectedField='None';
        this.selectedDataType='';
        this.fieldAPIName='';
        console.log('11. Field selectedField :'+this.selectedField);
         console.log('11. Field selectedDataType :'+this.selectedDataType);
        console.log('123');
        for(var i=0;i<tempFieldOptions.length;i++)
        {
            console.log('V :'+tempFieldOptions[i].value);
        }
    this.fieldOptions = tempFieldOptions;
    console.log('IJK');
       for(var i=0;i<this.fieldOptions.length;i++)
        {
            console.log('V1 :'+this.fieldOptions[i].value);
        } 
        if(this.editfunction==false)
        {
            this.rows = [];
            console.log('Rows Cleared'); 
        }  
                
     this.setOperators(this.selectedDataType);
    console.log('ABC');

}

handleObjectChange(event) {
console.log('OBJECT CHANGEEE');
var ob = event.detail.value;
this.selectedObject = ob;
console.log('CHANGED OB:'+ob);
console.log('11 <==== this.selectedObject :'+this.selectedObject);
            var temp = JSON.parse(this.jsonString);
console.log('<====== CHANGED OB =====>:'+ob);            
            this.rows=[];
            this.fieldOptions=[];
            this.setFinalFields(temp);           
            console.log('66<==== >>'); 
            console.log('77<==== >>'); 
            
            console.log('88<==== >>');
            this.addicon=true;
            this.delicon=false;
            this.hfield = this.selectedField;
            this.rows=[];
            this.addnewrow();
            console.log('100<==== >>');
}
/*

*/
// upto here added 12-0402024
    addNewRule(event)
    {
        this.businessrulewindow=true;
        this.mainwindow=false;
    }
addRow()
{
    if(this.rows.length<=2)
    {
         this.addnewrow();
    }
   
}
deleteRow()
{
    console.log('Row Length :'+this.rows.length);
    const delrowId = event.target.dataset.id;
    console.log('delrowId :'+delrowId);
    if(this.rows.length>1)
    {
        var temprow=[];
        var k=0;
        var start=0;
       //  this.rows.pop(delrowId);
        // this.rows = this.rows.filter((item, idx) => idx != delrowId);
        console.log('================================================');
        console.log('After Deletion ROW');
        console.log('1111 Row Length :'+this.rows.length);                   
            for(var x=0;x<this.rows.length;x++)
            {
                console.log('KEY :'+this.rows[x].key);
                if(this.rows[x].key!=delrowId)
                {
                    console.log('FOUND ID');
                    temprow.push({ 
                                        key: k,
                                        fieldvalue:this.rows[x].fieldvalue,
                                        operatorselected:this.rows[x].operatorselected,
                                        val:this.rows[x].val,
                                        rowvalue:this.rows[x].rowvalue,
                                        checkbox:this.rows[x].checkbox,
                                        low:this.rows[x].low,
                                        high:this.rows[x].high,
                                        fieldtype:this.rows[x].fieldtype,
                                        concatstring:this.rows[x].concatstring,
                                        operatorsList:this.rows[x].operatorsList,
                                        fieldAPIName:this.rows[x].fieldAPIName         
                                        });
                                         k=k+1;

                }                                                 
            }
            console.log('temprow length :'+temprow.length);
            this.rows = temprow; 
            console.log('this.rows length :'+this.rows.length);

        // Find the index of the row to delete           
        console.log('================================================');
    }
    if(this.rows.length==1)
    {
        this.delicon=false;
    }  
    else
    {
        this.delicon=true;
    }
    if(this.rows.length<=2)
    {
        this.addicon = true;
    }

   // this.rows.push({ key: this.rows.length, name: '' }); 
}
    handleInputChange(event) {
        const { key } = event.target.dataset;
        const inputValue = event.target.value;

        // Update the corresponding row's name property
        this.rows[key].name = inputValue;
    }    
    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }

    get operator() {
        return [
            { label: 'Equal To', value: 'Equal To' },
            { label: 'Less Than', value: 'Less Than' },
            { label: 'Greater Than', value: 'Greater Than' },
            { label: 'Less Than or Equal', value: 'Less Than or Equal' },
            { label: 'Greater Than or Equal', value: 'Greater Than or Equal' }, 
            { label: 'Not Equal', value: 'Less Than' },
            { label: 'In Range', value: 'In Range' }                      
        ];
    }
    get objlist()
    {
    return [
        { label: 'Account', value: 'Account' },
        { label: 'Contact', value: 'Contact' },
        { label: 'Opportunity', value: 'Opportunity' }
    ];  
    }  

addnewrow()
{
 console.log('ADD NEW ROW STARTS selectedObject :'+this.selectedObject);
 console.log('AA Rows Length :'+this.rows.length);
 console.log('00 Row Added Successfully');
console.log('JSONS STRING :'+this.jsonString);
//
var fieldName,operatorselected,datatype,oprList,fieldApiName,rowval;
    var temp = JSON.parse(this.jsonString);
        temp.forEach(eObject => {
            console.log('eObject Name:', eObject.objectLabel);
            // Loop through the contacts array of each account
            eObject.Fields.forEach(field => {
                if(this.selectedObject==eObject.objectLabel)
                {
                    if(this.selectedObject == eObject.objectLabel)
                    {
                        datatype = field.dataType;
                        fieldApiName = field.apiName;
                        fieldName = field.label;
                    }
                }
            });
        });

    console.log('datatype :'+datatype);
    oprList = this.setOperators(datatype);
    operatorselected = oprList[0].value;
    rowval = oprList[0].value=='In Range'? false: true;
    let dt;
    var checkbox;
    if(datatype=='date')
    {
        dt = new Date().toISOString().slice(0, 10);
        checkbox=false;
    }
    else if(datatype=='number')
    {
        dt=0;
        checkbox=false;
    }
    else if(datatype=='checkbox') 
    {
        dt=true;
        checkbox=true;
        rowval=true;
    }
    else
    { 
        dt='';
        checkbox=false;
    }
    console.log('dt :'+dt);
    console.log('checkbox :'+checkbox);
    console.log('rowval :'+rowval);

//
        this.rows.push({ 
            key: this.rows.length,
            fieldvalue:'None',
            operatorselected:operatorselected,
            val:dt,
            rowvalue:rowval,
            checkbox:checkbox,
            low:dt,
            high:dt,
            fieldtype:datatype,
            operatorsList:oprList,
            fieldAPIName:fieldApiName            
             });
            this.delicon=true;
            console.log('11 Row Added Successfully');
            console.log('BB Rows Length :'+this.rows.length);
             if(this.rows.length>=2)
             {
                 console.log('add row size :'+this.rows.length);
                 this.addicon=false;            
             }

             if(this.rows.length<3)
             {
                  this.addicon=true;
             }
             console.log('22 Row Added Successfully');
             console.log('22 Row Added Successfully this.selectedObject:'+this.selectedObject);
}

handleChangeField(event)
{
    const rowId = event.target.dataset.id;
    console.log('rowId :'+rowId);
    const clickedRow = this.rows[rowId];    
    console.log('Field Change Event');
    const rowfieldvalue = event.detail.value;
    console.log('Selected Field :'+rowfieldvalue); 
    clickedRow.fieldvalue =event.detail.value; 
    console.log('Changed Field :'+clickedRow.fieldvalue);
    console.log('Object Name :'+this.selectedObject);
    var datatype;
    var apiname;
    var temp = JSON.parse(this.jsonString);
        temp.forEach(eObject => {
            console.log('eObject Name:', eObject.objectLabel);
            // Loop through the contacts array of each account
            eObject.Fields.forEach(field => {
                if(this.selectedObject==eObject.objectLabel)
                {
                    if(rowfieldvalue==field.label && this.selectedObject == eObject.objectLabel)
                    {
                        datatype = field.dataType;
                        apiname = field.apiName;
                    }
                }
            });
        });
        console.log('datatype :'+datatype);
        clickedRow.checkbox = datatype=='checkbox'?true:false;
        clickedRow.val='';
        clickedRow.startValue='';
        clickedRow.endValue='';
    clickedRow.fieldtype = datatype;
    this.setOperators(datatype);
    let dt;
    if(datatype=='date')
    {
        dt = new Date().toISOString().slice(0, 10);
    }
    else if(datatype=='number')
    {
        dt=0;
    }
    else { dt='';}
    clickedRow.val = dt;
    clickedRow.fieldAPIName = apiname;
    clickedRow.operatorsList = this.operatrsList;
    clickedRow.operatorselected = this.operatrsList[0].value;    
    clickedRow.rowvalue = clickedRow.operatorselected=='In Range'? false: true;


}
handleChangeHField(event)
{ 
    console.log('H Field Change Event');
    const Hfieldvalue = event.detail.value;
    console.log('Selected Hfieldvalue :'+Hfieldvalue);
    console.log('Selected hfield :'+this.hfield); 
    this.hfield =  event.detail.value;
}
handleChangeOperator(event)
{
    const rowId = event.target.dataset.id;
    console.log('-----------------------------------------------');
    console.log('rowId :'+rowId);
    const clickedRow = this.rows[rowId];    
    console.log('OPERATOR CHANGED');
    const rowoperatorvalue = event.detail.value;
    console.log('CHANGED OPERATOR :'+rowoperatorvalue); 
    console.log('BEFORE clicked rowvalue :'+clickedRow.rowvalue);
    clickedRow.rowvalue = rowoperatorvalue=='In Range'? false: true; 
    clickedRow.operatorselected =rowoperatorvalue; 
    console.log('AFTER clicked rowvalue :'+clickedRow.rowvalue);   
   // console.log('Parent Before clickedRow.rowvalue :'+clickedRow.rowvalue);
    clickedRow.operatorselected =rowoperatorvalue; 
    console.log('After clickedRow.rowvalue :'+clickedRow.rowvalue);
}
changecheckbox(event)
{
    const rowId = event.target.dataset.id;
    console.log('rowId :'+rowId);
    const clickedRow = this.rows[rowId]; 
    console.log('event.target.checked :'+event.target.checked);
    clickedRow.val=event.target.checked; 
    console.log('clickedRow.val :'+clickedRow.val);  
    

}
handleChangeValue(event)
{
    const rowId = event.target.dataset.id;
    console.log('rowId :'+rowId);
    const clickedRow = this.rows[rowId]; 
    clickedRow.val=event.target.value;   
    console.log('Row changed Value :'+event.target.value);
    console.log('Row changed :'+event.target.checkone.value);
   
}
handleChangeLow(event)
{
    const rowId = event.target.dataset.id;
    console.log('rowId :'+rowId);
    const clickedRow = this.rows[rowId]; 
    clickedRow.low=event.target.value;   
    console.log('Row Low Changed :'+event.target.value);

}
handleChangeHigh(event)
{
    const rowId = event.target.dataset.id;
    console.log('rowId :'+rowId);
    const clickedRow = this.rows[rowId];  
    clickedRow.high=event.target.value;  
    console.log('Row High Changed :'+clickedRow.high);

}
handleChange(event)
{
    consoloe.log('Changed Color is :'+this.colorvalue);
}
handleCancel(event)
{
  this.businessrulewindow=false;
 this.mainwindow=true;
 this.showWindow=false;
        const custevt = new CustomEvent('createedit', { detail: false });
        this.dispatchEvent(custevt); 
}
handleSave(event)
{
 var br_config,br_logic;
 br_config='where \n';
 var hfield = this.hfield;
 var colorval = this.colorvalue;
 var conditionvalue = this.conditionvalue;
            console.log('Save Event Final Values on Row');
console.log('hfield :'+hfield);
console.log('colorval :'+colorval);  
console.log('conditionvalue :'+conditionvalue); 
console.log('selectedObject :'+this.selectedObject);
br_logic='{"selectedObject":"'+this.selectedObject+'",';
br_logic =br_logic+ '"businessRuleConditions":['
let temp=0;
let indexval;
var extension='';
            for(var x=0;x<this.rows.length;x++)
            {
                indexval = (this.rows[x].key)+1;
                br_logic=br_logic+'{';
                br_logic=br_logic+'"index":"'+indexval+'",';
                br_logic=br_logic+'"fieldLabel":"'+this.rows[x].fieldvalue+'",';
                br_logic=br_logic+'"fieldAPIName":"'+this.rows[x].fieldAPIName+'",';
                br_logic=br_logic+'"datatype":"'+this.rows[x].fieldtype+'",';
                br_logic=br_logic+'"condition":{';

                br_logic=br_logic+'"type":"'+this.rows[x].operatorselected+'",';
                switch(this.rows[x].operatorselected)
                {
                    case 'Equal To' : br_logic=br_logic+'"operator":" == ",';
                    break;
                    case 'Not Equal' : br_logic=br_logic+'"operator":" != ",';
                    break;
                    case 'Less Than' : br_logic=br_logic+'"operator":" < ",';
                    break;
                    case 'Greater Than' : br_logic=br_logic+'"operator":" > ",';
                    break;   
                    case 'Less Than or Equal' : br_logic=br_logic+'"operator":" <= ",';
                    break;
                    case 'Greater Than or Equal' : br_logic=br_logic+'"operator":" >= ",';
                    break;                                                          
                    default : br_logic=br_logic+'"operator":" ",';
                }
// newly added here
                // br_logic
                if(this.rows[x].operatorselected=='In Range')
                {
                    br_logic=br_logic+'"startValue":"'+this.rows[x].low+'",';
                    br_logic=br_logic+'"endValue":"'+this.rows[x].high+'"';
                }
                else
                {
                    br_logic=br_logic+'"startValue":" ",';
                    br_logic=br_logic+'"endValue":"'+this.rows[x].val+'"';                    
                }

                console.log('Val :'+this.rows[x].val);
                console.log('Low :'+this.rows[x].low);
                console.log('High :'+this.rows[x].high);
                br_logic=br_logic+'}';
                console.log('rows[x].key :'+this.rows[x].key);
                console.log('rows[x].fieldvalue :'+this.rows[x].fieldvalue);
                console.log('rows[x].operatorselected :'+this.rows[x].operatorselected);
                console.log('rows[x].val :'+this.rows[x].val);
                console.log('rows[x].rowvalue :'+this.rows[x].rowvalue);
                console.log('rows[x].fieldtype :'+this.rows[x].fieldtype);
                br_config = br_config +(this.rows[x].key +1)+'.'+ this.selectedObject+'.'+this.rows[x].fieldvalue+' '+this.rows[x].operatorselected+' ';
                extension='';

                console.log('Val :'+this.rows[x].val);
                console.log('Low :'+this.rows[x].low);
                console.log('High :'+this.rows[x].high);

                if((this.rows[x].val!='0' && this.rows[x].val=='')||(this.rows[x].fieldtype=='date' && this.rows[x].val=='0'))
                {                    
                    temp=1;
                    
                }

                if(this.rows[x].high!='0' && this.rows[x].low!='')
                {
                    extension ='Low '+ this.rows[x].low +' and High '+this.rows[x].high;
                }
                else
                {
                    extension=this.rows[x].val;
                }
// upto here


               /*                
                br_logic=br_logic+'"startValue":"'+this.rows[x].low+'",';
             
              if(this.rows[x].high!='0')
              {
                  console.log('High not zero :');
                  br_logic=br_logic+'"endValue":"'+this.rows[x].high+'"';
              }
              else
              {
                  console.log('High is zero :');
                  br_logic=br_logic+'"endValue":"'+this.rows[x].val+'"';
              }                           

                br_logic=br_logic+'}';
                console.log('rows[x].key :'+this.rows[x].key);
                console.log('rows[x].fieldvalue :'+this.rows[x].fieldvalue);
                console.log('rows[x].operatorselected :'+this.rows[x].operatorselected);
                console.log('rows[x].val :'+this.rows[x].val);
                console.log('rows[x].rowvalue :'+this.rows[x].rowvalue);
                console.log('rows[x].fieldtype :'+this.rows[x].fieldtype);
                br_config = br_config +(this.rows[x].key +1)+'.'+ this.selectedObject+'.'+this.rows[x].fieldvalue+' '+this.rows[x].operatorselected+' ';
                extension='';

                console.log('Val :'+this.rows[x].val);
                console.log('Low :'+this.rows[x].low);
                console.log('High :'+this.rows[x].high);

                if((this.rows[x].val!='0' && this.rows[x].val=='')||(this.rows[x].fieldtype=='date' && this.rows[x].val=='0'))
                {                    
                    temp=1;
                    
                }

                if(this.rows[x].high!='0' && this.rows[x].low!='')
                {
                    extension ='Low '+ this.rows[x].low +' and High '+this.rows[x].high;
                }
                else
                {
                    extension=this.rows[x].val;
                }
                */
                br_config=br_config+' '+extension;
                if((this.rows[x].key+1)==this.rows.length)
                {
                    br_config = br_config+','+'then Highlight the '+hfield+' as '+colorval;
                    br_logic=br_logic+'}';
                }
                else
                {
                    br_config = br_config+';'+'\n';
                    br_logic=br_logic+'},';
                }
                
                
            }
             br_logic =br_logic+'],';
             br_logic =br_logic+'"colorCode" :"'+colorval+'",';
             br_logic =br_logic+'"highlightedFieldLabel" :"'+hfield+'",';
             br_logic =br_logic+'"conditionalLogic" :"'+conditionvalue+'"}';
            console.log('br_config :'+br_config);
            console.log('br_logic :'+br_logic);
if(this.rows.length>0 && hfield!=null && colorval!=null && conditionvalue!=null && temp==0)
{

 this.businessrulewindow=false;
 this.mainwindow=true;
 this.showWindow=false;
    if(this.createfunction)
    {
        saveBusinessRule({ br_config: br_config, br_logic: br_logic,configId:this.configId })
            .then(res => {
                // Handle success
                console.log('Name:', res.Name);
                window.alert('Record '+res.Name+' Created Successfully');
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: 'Record '+res.Name+' Created Successfully',
                    variant: 'success'
                });    
                this.dispatchEvent(event);            
                const custevt = new CustomEvent('createedit', { detail: false });
                this.dispatchEvent(custevt); 
            })
            .catch(error => {
                // Handle error
                console.error('Error creating account:', error);
            });        
    }
    else
    {
        console.log('Updated Record ID :'+this.businessruleRecord.Id);
        updateBusinessRule({ 
            br_config: br_config, 
            br_logic: br_logic,
            configId:this.configId,
            brId : this.businessruleRecord.Id
             })
            .then(res => {
                // Handle success
                window.alert('Record '+this.businessruleRecord.Name+' Updated Successfully');
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: 'Record '+this.businessruleRecord.Name+' Updated Successfully',
                    variant: 'success'
                });
                this.dispatchEvent(event);
                const custevt = new CustomEvent('createedit', { detail: false });
                this.dispatchEvent(custevt); 
            })
            .catch(error => {
                // Handle error
                console.error('Error creating account:', error);
            });

    }

}
else
{
    alert('Fill all the fields and Save0');
}

}
    get parentClass() {
        return this.showParent ? 'rowsectiontitle active' : 'rowsectiontitle';
    }
    get childClass() {
        return this.showChild ? 'rowsectiontitle active' : 'rowsectiontitle';
    }
    showParentContent() {
        this.showParent = true;
        this.showChild = false;
    }
    showChildContent() {
        this.showParent = false;
        this.showChild = true;
    }
}