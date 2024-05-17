@isTest
public class MyUtilityTest 
{
    public static testmethod void getPicklistValuesTest(){
        test.startTest();
        MyUtility.getPicklistValues('Opportunity', 'StageName');
        MyUtility.getPicklistValues('Opportunity', 'Type');
        test.stopTest();
    }
}