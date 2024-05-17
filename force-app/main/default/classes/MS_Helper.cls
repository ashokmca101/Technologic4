global class MS_Helper 
{

    @AuraEnabled(cacheable=false)
    global static void saveRecord(String temp,String val)
    {
        System.debug('Save Record Started');
        System.debug('Save Record Started varId:'+temp);
        System.debug('Save Record Started val:'+val);
    }
}