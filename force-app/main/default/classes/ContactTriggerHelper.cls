public class ContactTriggerHelper 
{
	public static void CountContacts(Set<Id> ContactIds)
    {
        List<String> AcIds = new List<String>();
        List<Contact> conList = [select Id,AccountId from Contact where Id In :ContactIds];
        for(Contact con:conList )
        {
            if(con.AccountId!=null)
            {
              AcIds.add(con.AccountId);  
            }            
        }
        System.debug('After isUpdate AcIds:'+AcIds);
        List<AggregateResult> ag = [select count(Id) ContactCount,AccountId from Contact where AccountId In :AcIds group by AccountId];
        
        System.debug('After isUpdate ag:'+ag);
        Map<String,Decimal> acMap = new Map<String,Decimal>();
        List<Account> updateAccounts = new List<Account>();
        Map<String,Decimal> agMap = new Map<String,Decimal>();        
        for(AggregateResult agm: ag)
        {
            String acId = (String)agm.get('AccountId');
            decimal totalContacts = (Decimal)agm.get('ContactCount');
            agMap.put(acId,totalContacts);
            System.debug('After isUpdate agMap:'+agMap);
        }
        List<Account> AcList = [select Id,Number_of_Contacts__c from Account where Id In:agMap.keySet()];
        System.debug('After isUpdate AcList:'+AcList);
        if(AcList.size()>0)
        {
            for(Account ac:AcList)
            {
                Decimal totalCount = agMap.get(ac.Id);
                ac.Number_of_Contacts__c=totalCount;
                updateAccounts.add(ac);
            }     
            if(updateAccounts.size()>0)
            {
                update updateAccounts;
            }
        }         
    }   
}