public without sharing class BusinessRuleConfiguratorHelper {
    @AuraEnabled
    public static List<String> getFields(String objName)
    {
        List<String> fieldNames = new List<String>();
        
        // Get the object describe result
        Schema.DescribeSObjectResult describeResult = Schema.getGlobalDescribe().get(objName).getDescribe();
        
        // Get the fields map and iterate over it
        Map<String, Schema.SObjectField> fieldsMap = describeResult.fields.getMap();
        for (String fieldName : fieldsMap.keySet()) {
            // Add field name to the list
            fieldNames.add(fieldName);
        }
        
        return fieldNames;
    }

    
    @AuraEnabled
    public static Business_Rule__c saveBusinessRule(String br_config,String br_logic,String configId)
    {
        System.debug('Got Rule');
        System.debug('Object br_config :'+br_config);
        System.debug('br_logic :'+br_logic);
        System.debug('configId :'+configId);
		System.debug('Selected Object :');
        Business_Rule__c br = new Business_Rule__c();
        Business_Rule__c b = new Business_Rule__c();
        if(br_config!=null && br_logic!=null)
        {
            br.Business_Rule_Condition__c=br_config;
            br.Business_Rule_Logic__c=br_logic;
             br.Configurator__c=configId;
            insert br;
            System.debug('Name :'+br.Name);
            System.debug('Id :'+br.Id);
            b = [select Id,Name from Business_Rule__c where Id=:br.Id  limit 1];
        }
        return b; 
    }
    @AuraEnabled
    public static String updateBusinessRule(String br_config,String br_logic,String configId,String brId)
    {
        String res;
        System.debug('Inside Update Business Rule');
        System.debug('br_config :'+br_config);
        System.debug('br_logic :'+br_logic);
        Business_Rule__c SingleBR = new Business_Rule__c(); 
        SingleBR = [select Id,Name,
                   Configurator__c,
                   Business_Rule_Condition__c,Business_Rule_Logic__c
                   from Business_Rule__c where Id=:brId limit 1];
        if(SingleBR!=null && br_config!=null && br_logic!=null)
        {
            
            SingleBR.Business_Rule_Condition__c=br_config;
            SingleBR.Business_Rule_Logic__c=br_logic;
		    update SingleBR;
            res = 'ok';
        }
        
        return res;
    }    
    @AuraEnabled
    public static List<Business_Rule__c> getBusinessRules(List<String> idList)
    {
        List<String> fieldNames = new List<String>();
        List<Business_Rule__c> BR_List = new List<Business_Rule__c>(); 
        BR_List = [select Id,Name,
                   Configurator__c,
                   Business_Rule_Condition__c,Business_Rule_Logic__c
                   from Business_Rule__c order by Createddate desc];
        return BR_List;
    } 
    @AuraEnabled
    public static String DeleteBusinessRule(String RuleId)
    {
        String RuleName;
        if(RuleId!=null)
        {
            Business_Rule__c  BR_Record = [select Id,Name,
                                           Configurator__c,
                                           Business_Rule_Condition__c,Business_Rule_Logic__c
                                           from Business_Rule__c where Id=:RuleId limit 1];
            RuleName = BR_Record!=null?BR_Record.Name:null;
            if(BR_Record!=null)
            {
                delete BR_Record;
            }                        
        }
        return RuleName;
    }     
}