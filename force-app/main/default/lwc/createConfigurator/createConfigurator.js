import { LightningElement,track,api } from 'lwc';
import getObjectsList from '@salesforce/apex/ConfiguratorHelper.getObjectsList';
import getFields from '@salesforce/apex/ConfiguratorHelper.getFields';
import saveConfig from '@salesforce/apex/ConfiguratorHelper.saveConfig';
export default class CreateConfigurator extends LightningElement 
{
@track ObjectList=[];
@track fieldList=[];
@track haveFields=false;
@track showf=false;
@track showfv=false;
@track objvalue=null;
@track titleofObject;
@track fieldValue;
@track fieldrows=[];
@track level=1;
@track configVal=[];

@track levelObject1;
@track Level1=[];
@track Level2=[];
@track Level3=[];
@track Level4=[];
@track Level5=[];

@track levelJson;
@track levelJsonString=[];
@track templateName;
changeName(event)
{
    this.templateName = event.target.value;
    console.log('Template Name :'+this.templateName);
}
handleSave(event)
{
    console.log('save Method');
    if(this.levelJsonString!=null && this.objvalue!=null && this.templateName!=null)
    {
        console.log('save Method True');
        if(this.levelJson!=null)
        {
            console.log('save Method  not null');
            this.levelJsonString.push({
                level:this.level,
                jsonText : this.levelJson
            });
            this.levelJson=null;
        }
        console.log('save Method 1');
    var JsonStringList=[];
    console.log('save Method 2');
    for(var k=0;k<this.levelJsonString.length;k++)
    {
        console.log('save Method 3');
        JsonStringList.push(this.levelJsonString[k].jsonText);
        console.log('jsonText :'+this.levelJsonString[k].jsonText);
    }

        

        saveConfig({
            JsonStringList:JsonStringList,
            TemplateName:this.templateName
        }).then(res=>{
            alert('Saved '+res);
            this.refreshAll();

            const event = new CustomEvent('aftercreate', { detail: false });
            this.dispatchEvent(event);


        }).catch(err=>{
            alert('Error '+err);
        });
    }
    else{
        alert('Enter Missing Vallue ');
    }
}
levelUp(event)
{
 if(this.objvalue!=null && this.fieldList!=null && this.fieldValue.length>0)
  {
        this.levelJsonString.push({
            level:this.level,
            jsonText : this.levelJson
        });
        this.levelJson=null;
    for(var k=0;k<this.levelJsonString.length;k++)
    {
        console.log('Level :'+this.levelJsonString[k].level);
        console.log('jsonText :'+this.levelJsonString[k].jsonText);
    }        
    
    this.level+=1;
    console.log('this.objvalue :'+this.objvalue);
    this.ObjectList=[];
    this.fieldList=[];
    
    this.collectObjectsList();
  }   
}
refreshAll()
{
    this.level=1;
    this.objvalue=null;
    this.fieldValue=null;
    this.ObjectList=[];
    this.fieldList=[];
    this.fieldrows=[];
    this.showf=false;
    this.showfv=false;
    this.templateName=null;
    this.Level1=this.Level2=this.Level3=this.Level4=this.Level5=[];
    this.Level1=this.Level2=this.Level3=this.Level4=this.Level5=null;
    this.collectObjectsList();
}
handleChangeFields(event)
{
    var fv = event.target.value;
    console.log('changed Field :'+fv);
    this.fieldValue=fv;
    console.log('Length :'+this.fieldValue.length);
    for(var i=0;i<this.fieldValue.length;i++)
    {
        console.log('Value :'+this.fieldValue[i]);
    }

    switch(this.level)
    {
        case 1: this.Level1=this.fieldValue; break;
        case 2: this.Level2=this.fieldValue; break;
        case 3: this.Level3=this.fieldValue; break;
        case 4: this.Level4=this.fieldValue; break;
        case 5: this.Level5=this.fieldValue; break;
    }

let JsonString='{"ObjectName":"'+this.objvalue+'",';
JsonString+='"Level":"'+this.level+'",';
JsonString=JsonString+'"Fields":[';
        this.fieldrows.forEach(eObject => { 
            if(this.fieldValue.indexOf(eObject.FieldName)!== -1)
            {
                var row='{';
                row=row+'"FieldLabel":"'+eObject.FieldName+'",';
                row=row+'"FieldApiName":"'+eObject.FieldApiName+'",';
                row=row+'"FieldDataType":"'+eObject.FieldDataType+'"';
                row=row+'},';
             console.log('3 FieldName:'+ eObject.FieldName+' <=> FieldApiName:'+ eObject.FieldApiName+' <=> FieldDataType:'+ eObject.FieldDataType);
            JsonString=JsonString+row;
            }            
        });
        JsonString=JsonString.slice(0, -1);
        JsonString=JsonString+']}';
        console.log('JsonString :'+JsonString);
        this.levelJson=JsonString;       
}
handleChangeMainObject(event)
{
    const obj = event.target.value;
    console.log('changed Object :'+obj);
    this.objvalue=obj;
    var fieldList=[];
    if(this.objvalue!=null)
    {

       // this.haveFields=true;
        
        getFields({
            objName:obj
        }).then(res=>{
            // console.log('res :'+res);
        let temp = JSON.parse(res);
        var rows=[];
        temp.forEach(eObject => {
            // Loop through the contacts array of each account
            rows.push({
                    key: this.fieldrows.length,
                    ObjectName: this.objvalue,
                    FieldName: eObject.FieldName,
                    FieldApiName: eObject.FieldApiName,
                    FieldDataType: eObject.FieldDataType
            });

            fieldList.push({
                label:eObject.FieldName,
                value:eObject.FieldName
            });
            
        });
        console.log('fieldList :'+fieldList.length);
        console.log('rows :'+rows.length);
        for(var i=0;i<fieldList.length;i++)
        {
          //  console.log(' FieldName:', fieldList[i].label);
          //  console.log(' FieldApiName:', fieldList[i].value);
          //  console.log(' FieldDataType:', fieldList[i].FieldDataType);            
        }

        this.fieldrows = rows;

        this.fieldList = fieldList;
        this.showf=true;
        this.showfv=true;
        }).catch(err=>{
            console.log('err :'+err);
        });
        console.log('Level :'+this.level);
    switch(this.level)
    {
        case 1: this.levelObject1=this.objvalue; break;
        case 2: this.levelObject2=this.objvalue; break;
        case 3: this.levelObject3=this.objvalue; break;
        case 4: this.levelObject4=this.objvalue; break;
        case 5: this.levelObject5=this.objvalue; break;
    }

    }
    
}

connectedCallback() {
this.collectObjectsList();
}

collectObjectsList()
{
    getObjectsList({
        ObjName:this.objvalue
    }).then(result=>{
        if(result)
        {
            console.log('Result :'+result);
            let temp=[];
            this.fieldList.push({
                label:'none',value:'none'
            })
            for(var objName in result)
            {
               // console.log('Label :'+objName+' API Name :'+result[objName]);
                temp.push({
                    label: objName,
                    value:result[objName]
                });
            }
            this.ObjectList = temp;
            this.titleofObject = 'Select Level-'+this.level+' Object';
        }
    }).catch(error=>{
        console.log('Main Error :'+error);
    });
}
}