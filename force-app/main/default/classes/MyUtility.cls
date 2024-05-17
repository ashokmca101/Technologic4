public class MyUtility 
{
    @AuraEnabled
    public static List<PicklistOption> getPicklistValues(String strObjectName, String strPicklistField){
        List<PicklistOption> returnPicklist = new List<PicklistOption>();
        returnPicklist.add(new PicklistOption('-- None --', ''));
        Map<String, String> mapPickListValues = new Map<String, String>();
        Schema.SObjectType objSobjectType = Schema.getGlobalDescribe().get(strObjectName);
        Schema.DescribeSObjectResult objDescribeSobject = objSobjectType.getDescribe();
        Map<String, Schema.SObjectField> mapFields = objDescribeSobject.fields.getMap();
        system.debug('strObjectName is ' + strObjectName + ' strPicklistField is ' + strPicklistField);
        List<Schema.PicklistEntry> lstPickListValues = mapFields.get(strPicklistField).getDescribe().getPickListValues();
        //system.debug('#### mapfields : '+lstPickListValues);
        for (Schema.PicklistEntry objPickList : lstPickListValues) {
            If(strPicklistField == 'CurrencyIsoCode')
                returnPicklist.add(new PicklistOption(objPickList.getValue()+' - ' +objPickList.getLabel(), objPickList.getValue()));
            else
                returnPicklist.add(new PicklistOption(objPickList.getLabel(), objPickList.getValue()));
        }
        return returnPicklist;
    }
    
    public class PicklistOption {
        @AuraEnabled
        public String label;
        @AuraEnabled
        public String value;
        
        public PicklistOption(String label, String value) {
            this.label = label;
            this.value = value;
        }
    }
}