trigger ContactTrigger on Contact (before insert,after insert,after Update) 
{
    if(trigger.isInsert && trigger.isBefore)
    {
        System.debug('Before Insert');
        List<String> acIds = new List<String>();
            for(Contact c:trigger.new)
            {
                System.debug('Before Insert c:'+c);
                System.debug('Before Insert c AccountID:'+c.AccountId);
                if(c.AccountId!=null)
                {
                    acIds.add(c.AccountId);
                }                
            }   
        if(acIds.size()>0)
        {
            List<Account> acList = [select Id,Number_of_Contacts__c from Account where Id In :acIds];
            Map<String,Account> AcMap = new Map<String,Account>();
            for(Account a:acList)
            {
                AcMap.put(a.Id,a);
            }
            for(Contact c:trigger.new)
            {
                Account act = AcMap.get(c.AccountId);
                System.debug('Before Insert c act.Number_of_Contacts__c:'+act.Number_of_Contacts__c);                
                if(act!=null)
                {  
                    if(act.Number_of_Contacts__c>=5)
                    {
                        c.addError('Contacts Limit Exceed. Max Contacts 5');
                    }                        
                }                
            }
        }
        
    }
    if(trigger.isAfter && (trigger.isInsert || trigger.isUpdate))
    {
        System.debug('After isUpdate');
       ContactTriggerHelper.CountContacts(trigger.newMap.Keyset());
    }
}