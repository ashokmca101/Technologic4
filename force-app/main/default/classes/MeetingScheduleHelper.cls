public class MeetingScheduleHelper 
{
    @AuraEnabled(cacheable=true)
    public static String saveMS(String customerId) {
     System.debug('Inside saveMS');
     System.debug('Inside saveMS accountId:');
     return '123';  
    }
    
    @AuraEnabled
    public static String SaveRecord(String CustomerId)
    {
        System.debug('Inside Save record');
        System.debug('Inside Save CustomerId'+CustomerId);
        /*
        Meeting_Schedule__c ms = new Meeting_Schedule__c();
        ms.Customer__c=customerId;
        ms.Duration__c=Duration;
        ms.Notes__c=Notes;
        ms.Time__c=visitTime;
        ms.User__c=UserID;
        ms.Visit_Date__c=Visitdate;
        ms.Location__Latitude__s=lat;
        ms.Location__Longitude__s=lon;
        insert ms;
        System.debug('Inside Saved record');
        System.debug('Inside Saved record :'+ms.Id);
        return ms;  */ 
		return CustomerId;
    }    
    
    @AuraEnabled
    public static String uploadFile(String base64, String filename, String recordId) {
        ContentVersion cv = createContentVersion(base64, filename);
        ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
        if (cv == null || cdl == null) { return null; }
        return cdl.Id;
    }
    private static ContentVersion createContentVersion(String base64, String filename) {
        ContentVersion cv = new ContentVersion();
        cv.VersionData = EncodingUtil.base64Decode(base64);
        cv.Title = filename;
        cv.PathOnClient = filename;
        try {
            insert cv;
            return cv;
        } catch(DMLException e) {
            System.debug(e);
            return null;
        }
    }
    
    private static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
        if (contentVersionId == null || recordId == null) { return null; }
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [
            SELECT ContentDocumentId 
            FROM ContentVersion 
            WHERE Id =: contentVersionId
        ].ContentDocumentId;
        cdl.LinkedEntityId = recordId;
        // ShareType is either 'V', 'C', or 'I'
        // V = Viewer, C = Collaborator, I = Inferred
        cdl.ShareType = 'V';
        try {
            insert cdl;
            return cdl;
        } catch(DMLException e) {
            System.debug(e);
            return null;
        }
    }        
}