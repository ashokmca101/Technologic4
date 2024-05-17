public without sharing class ConfiguratorHelper {
    
    public class FieldMapping
    {
        public String FieldName;
        public String FieldApiName;
        public String FieldDataType; 
    }

    @AuraEnabled
    public static List<Configurator__c> getConfigurators()
    {
        List<Configurator__c> configList = [select Id,Configurator_Name__c,Json_String_Level_1__c,Json_String_Level_5__c,
                                            Json_String_Level_2__c,Json_String_Level_3__c,Json_String_Level_4__c from Configurator__c limit 2000];
        return configList;
    }
    @AuraEnabled
    public static String saveConfig(List<String> JsonStringList,String TemplateName)
    {
        System.debug('saveConfig');
        System.debug('JsonStringList Size :'+JsonStringList.size());
        System.debug('JsonStringList :'+JsonStringList);
        System.debug('TemplateName :'+TemplateName);
        Configurator__c newconfigRecord = new Configurator__c();
        newconfigRecord.Configurator_Name__c=TemplateName;
        integer k=1;
        for(String jsonString:JsonStringList)
        {        
            switch on k
            {
                when  1 {newconfigRecord.Json_String_Level_1__c=jsonString;}
                when  2 {newconfigRecord.Json_String_Level_2__c=jsonString;}
                when  3 {newconfigRecord.Json_String_Level_3__c=jsonString;}
                when  4 {newconfigRecord.Json_String_Level_4__c=jsonString;}
                when  5 {newconfigRecord.Json_String_Level_5__c=jsonString;}
            }
            k=k+1;
        }
        insert newconfigRecord;
        return newconfigRecord.Configurator_Name__c;
    }    
    @AuraEnabled
    public static String getFields(String objName)
    {
        List<String> fieldNames = new List<String>();
        String JsonString;
        // Retrieve the SObject describe result for the specified object
        Schema.DescribeSObjectResult objDescribe = Schema.getGlobalDescribe().get(objName).getDescribe();
        
        // Get a map of field names to field describes
        Map<String, Schema.SObjectField> fieldMap = objDescribe.fields.getMap();
        List<FieldMapping> FieldMappingList = new List<FieldMapping>();
        Map<String, FieldMapping> FieldInfoMap = new Map<String, FieldMapping>();
        
        // Iterate over the map and collect field labels and API names
        List<String> fieldInfoList = new List<String>();
        for (String fieldName : fieldMap.keySet()) {
            Schema.DescribeFieldResult fieldDescribe = fieldMap.get(fieldName).getDescribe();
            
            String fieldLabel = fieldDescribe.getLabel();
            String fieldApiName = fieldDescribe.getName();
            String fieldType = fieldDescribe.getType().name();
            System.debug('fieldLabel :'+fieldLabel);
            System.debug('fieldApiName :'+fieldApiName);
            System.debug('fieldType :'+fieldType);
            // Add field label and API name to the list
            fieldInfoList.add('Field Label: ' + fieldLabel + ', API Name: ' + fieldApiName);
            FieldMapping row = new FieldMapping();
            row.FieldName=fieldLabel;
            row.FieldApiName=fieldApiName;
            row.FieldDataType=fieldType;
            System.debug('Row :'+row);
            FieldMappingList.add(row);
            FieldInfoMap.put(fieldLabel,row);
        }
        JsonString = JSON.serialize(FieldMappingList);
        return JsonString;
    }
    @AuraEnabled
    public static Map<String, String> getObjectsList(String ObjName)
    { 
        Map<String, String> objectInfoMap = new Map<String, String>();
        if(ObjName==null)
        {
            for (Schema.SObjectType objType : Schema.getGlobalDescribe().Values()) {
                Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
                System.debug('\n Label :'+objDescribe.getLabel()+' <--> ApiName :'+objDescribe.getName());
                String objectName = objDescribe.getLabel();
                String objectApiName = objDescribe.getName();
                
                // Add the object name and API name to the map
                objectInfoMap.put(objectName, objectApiName);
            }            
        }
        else
        {
            
            List<String> childObjectNames = new List<String>();
            
            // Get the describe result for the parent object
            Schema.DescribeSObjectResult parentDescribe = Schema.getGlobalDescribe().get(ObjName).getDescribe();
            
            // Get the child relationships for the parent object
            List<Schema.ChildRelationship> childRelationships = parentDescribe.getChildRelationships();
            
            // Iterate through the child relationships and add the child object names to the list
            for (Schema.ChildRelationship relationship : childRelationships) {
                childObjectNames.add(relationship.getChildSObject().getDescribe().getName());
                String Name = relationship.getChildSObject().getDescribe().getLabel();
                String ApiName = relationship.getChildSObject().getDescribe().getName();
                System.debug('Name :'+Name);
                System.debug('ApiName :'+ApiName);
                objectInfoMap.put(Name, ApiName);
            }            
                     
        }                
        return objectInfoMap;
    }    
}