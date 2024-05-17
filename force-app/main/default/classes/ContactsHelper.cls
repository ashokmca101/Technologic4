public class ContactsHelper 
{
    @AuraEnabled
    public static List<Contact> getContactsList()
    {
        List<Contact> conList = [select Id,FirstName,LastName,Email from Contact];
        return conList;
    }
}