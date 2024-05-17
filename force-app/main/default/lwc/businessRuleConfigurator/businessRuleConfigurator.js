import { LightningElement,track,api } from 'lwc';
// import getFields from '@salesforce/apex/BusinessRuleConfiguratorHelper.getFields';
import getFields from '@salesforce/apex/BusinessRuleConfiguratorHelper.getFields';
export default class BusinessRuleConfigurator extends LightningElement {

    @track fieldvalue = 'id';
    @track operatorselected = 'Equal To';
    @track val=0;
    @track colorvalue='#A9167D';
    @api obAPIjName ='Account';
   // @api ObjectsList=[];
    
    @track fieldsList=[];
    @track ObjectsList=[];
    @track rows = [];
    @track showParent = true;
    @track showChild = false; 
    @track showWindow=true;   
    addRow() {
        this.rows.push({ key: this.rows.length,objectvalue:'Account',fieldvalue:this.fieldvalue,operatorselected:'Equal To',val:0,colorvalue:'#A9167D' });
        console.log('Row Length :'+this.rows.length);
        for(var x=0;x<this.rows.length;x++)
        {
            console.log('This.row :'+this.rows[x].key);
            console.log('This.Object :'+this.rows[x].objectvalue);
            console.log('This.row fieldvalue :'+this.rows[x].fieldvalue);
            console.log('This.row val:'+this.rows[x].val);
            console.log('This.row operatorselected :'+this.rows[x].operatorselected);
            console.log('This.row colorvalue :'+this.rows[x].colorvalue);
        }
    }
deleteRow()
{
    console.log('Row Length :'+this.rows.length);
    const delrowId = event.target.dataset.id;
    console.log('delrowId :'+delrowId);
    if(delrowId>0)
    {
        this.rows.pop(delrowId);/*
            for(var x=0;x<this.rows.length;x++)
            {
                console.log('This.row :'+this.rows[x].key);
                console.log('This.Object :'+this.rows[x].objectvalue);
                console.log('This.row fieldvalue :'+this.rows[x].fieldvalue);
                console.log('This.row val:'+this.rows[x].val);
                console.log('This.row operatorselected :'+this.rows[x].operatorselected);
                console.log('This.row colorvalue :'+this.rows[x].colorvalue);
            } */
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
            { label: 'Not Equal', value: 'Less Than' }                      
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
connectedCallback()
{
    console.log('inside Connected Callback');
    // this.rows.push({ key: this.rows.length, name: '' });
    this.getFieldsUsingObject(); 
        this.rows.push({ 
            key: this.rows.length,
            objectvalue:'Account',
            fieldvalue:this.fieldvalue,
            operatorselected:this.operatorselected,
            val:this.val,
            colorvalue:this.colorvalue });
        console.log('This.row :'+this.rows[0].key);
        console.log('This.row fieldvalue :'+this.rows[0].fieldvalue);
        console.log('This.row val:'+this.rows[0].val);
        console.log('This.row operatorselected :'+this.rows[0].operatorselected);
        console.log('This.row colorvalue :'+this.rows[0].colorvalue);        
      
}
getFieldsUsingObject()
{
    console.log('Object Name :'+this.obAPIjName);
   
    if(this.obAPIjName!=null)
    {
        getFields({
            objName :this.obAPIjName
        }).then(res=>{
            if(res)
            {
                this.fieldsList = res.map(field => ({ label: field, value: field }));
                this.fieldvalue = res[0];
                console.log('FieldValue :'+this.fieldvalue);
               // this.fieldvalue = res[0];
                for(var x=0;x<res.length;x++)
                {                    
                   // console.log('Field :'+res[x]);
                }             
            }
        }).catch(error=>{

        });
    }  

}
handleChange(event)
{

        // const dataList = event.target.dataset.key;
        const rowId = event.target.dataset.id;
        const inputValue = event.target.value;
        const inputField = event.target.label;
        console.log('rowId :'+rowId);
        const clickedRow = this.rows[rowId];
        console.log('inputValue :'+inputValue);
        console.log('inputField :'+inputField);
        console.log('clickedRow :'+clickedRow);
        if(inputField=='Select Object'){ 
            clickedRow.objectvalue =inputValue;
            this.obAPIjName = inputValue;
            }
        if(inputField=='Select Field'){ clickedRow.fieldvalue =inputValue;}
        if(inputField=='Select Operator'){clickedRow.operatorselected =inputValue;}
        if(inputField=='Value'){clickedRow.val =inputValue;}
        if(inputField=='Color'){clickedRow.colorvalue =inputValue;}        
        console.log('clickedRow fieldvalue:'+clickedRow.fieldvalue);
        console.log('clickedRow operatorselected:'+clickedRow.operatorselected);
// getting Fields based on Object Change
    if(inputField=='Select Object' && this.obAPIjName!=null)
    {
        console.log('Changed Object Name :'+this.obAPIjName);
        getFields({
            objName :this.obAPIjName
        }).then(res=>{
            if(res)
            {
                this.fieldsList = res.map(field => ({ label: field, value: field }));
                this.fieldvalue = res[0];
                console.log('FieldValue :'+this.fieldvalue);
               // this.fieldvalue = res[0];
                for(var x=0;x<res.length;x++)
                {                    
                    console.log('Object Name :'+this.obAPIjName+' Field Value :'+res[x]);
                }             
            }
        }).catch(error=>{

        });
    }  



}
handleCancel(event)
{
 this.showWindow=false;
}
handleSave(event)
{
 this.showWindow=false;
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