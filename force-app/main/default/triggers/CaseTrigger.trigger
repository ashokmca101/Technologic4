trigger CaseTrigger on Case (before insert,before update) 
{
	if(trigger.isInsert && trigger.isBefore)
    {
        List<String> ConIds = new List<String>();
        for(Case c:trigger.new)
        {
            if(c.ContactId!=null)
            {
                ConIds.add(c.ContactId);
            }
        }
        if(ConIds.size()>0)
        {
            List<Contact> conList = [select Id,(select Id,Is_Parent__c,Parent_Case__c from Cases where Is_Parent__c=true and Status!='Closed') from Contact where Id in : ConIds ];
            Map<String,Case> ContactsWithParentOpendCases = new Map<String,Case>();
            for(Contact con : conList)
            {
                if(con.Cases.size()>0)
                {
                   ContactsWithParentOpendCases.put(con.Id,con.Cases); 
                }
            }
            for(Case newCase : trigger.new)
            {
                if(newCase.ContactId!=null)
                {
                    Case ParentCase = ContactsWithParentOpendCases.get(newCase.ContactId);
                    if(ParentCase!=null)
                    {
                        newCase.Parent_Case__c = ParentCase.Id;
                    }
                    else
                    {
                        newCase.Is_Parent__c=true;
                    }
                }
            }
        }
    }
    // before update Case Closed 
    if(trigger.isUpdate && trigger.isBefore)
    {
        List<Case> CasesWithNotClosedChildList = [select Id,Status,Parent_Case__c
                                                  from Case where Parent_Case__c In: trigger.newMap.keyset() 
                                                  and  Status!='Closed'];
        Map<String,Case> CasesWithNotClosedChildListMap = new Map<String,Case>();
        for(Case c:CasesWithNotClosedChildList)
        {
                CasesWithNotClosedChildListMap.put(c.Parent_Case__c,c);
        }
         for(Case c: trigger.new)
        {
            Case childCaseWithoutClosed = CasesWithNotClosedChildListMap.get(c.Id); // getting current case with child Cases
            if(c.Status=='Closed' && childCaseWithoutClosed!=null)
            {
                c.addError('Before Close this Case, you Should Close all Child Cases');
            }
        }       
    }
}