import { LightningElement,track,api } from 'lwc';
import getObjectsList from '@salesforce/apex/ConfiguratorHelper.getObjectsList';
import getFields from '@salesforce/apex/ConfiguratorHelper.getFields';
import saveConfig from '@salesforce/apex/ConfiguratorHelper.saveConfig';
import getConfigurators from '@salesforce/apex/ConfiguratorHelper.getConfigurators'; 
export default class Configurator extends LightningElement 
{
@track shwoModal=false;
@track Total_Records_Count;
@track showConfigs=false;
@track customRecords;
@track configList;
@track confvalue;
@track mainwindow=true;
@track configRecord;
@track configName;

handleafteredit(event)
{
    console.log('handleafteredit :'+event.detail);
    var v = event.detail;
    if(v==false)
    {
        console.log('false');
        this.editconfigwindow=false;
        this.showConfigs=true;
        this.mainwindow=true;
    }
    else
    {
        console.log('true');
    }
}
handleEditConfig(event)
{
    console.log('handleEditConfig this.configRecord :'+this.configRecord);
    if(this.configRecord!=null)
    {
    this.editconfigwindow=true;
    this.showConfigs=false;
    this.mainwindow=false;        
    }
    else
    {
        alert('Choose Configurator and Edit');
    }
 
}
handleEditCancel(event)
{
    this.showConfigs=false;
    this.mainwindow=true;  
}
handleEdit(event)
{
    this.showConfigs=true;
    this.mainwindow=false;
}
handleChangeConfig(event)
{
    console.log('Handle change Config');
    this.configName=event.target.value;
    console.log('Handle change Config this.configName:'+this.configName);
    for(var i=0;i<this.customRecords.length;i++)
    {
        console.log('Handle change this.customRecords[i].Configurator_Name__c:'+this.customRecords[i].Configurator_Name__c);
        if(this.customRecords[i].Configurator_Name__c == this.configName)
        {
            console.log('Handle change this.customRecords[i].Configurator_Name__c :'+this.customRecords[i].Configurator_Name__c);
            this.configRecord=this.customRecords[i];
        }
    }    
    console.log('Handle change this.configRecord :'+this.configRecord);
}
handleNew(event)
{
    this.shwoModal=true;
}
closeModal(event)
{
   this.shwoModal=false; 
}
handleCreateChild(event)
{
    console.log('Created Succeesully');
    console.log('Created Succeesully event.detail.value:'+event.detail.value);
    this.shwoModal=event.detail.value;
}
connectedCallback() 
{
    console.log('inside connected callback');
    this.getConfigurators();
}

getConfigurators()
{
    getConfigurators().then(res=>{
        console.log('Got Configurators');
        console.log('Toal Found :'+res.length);
        this.customRecords= res;        
        var temp = [];
        for(var i=0;i<res.length;i++)
        {
            temp.push({
                label: res[i].Configurator_Name__c,
                value:res[i].Configurator_Name__c
            })
        }
        this.configList = temp;
    }).catch(err=>{

    });
}


}