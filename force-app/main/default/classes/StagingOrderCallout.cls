global class StagingOrderCallout implements Queueable, Database.AllowsCallouts
{
   
    public void execute(QueueableContext context) {

		String Request_Payload_URL='https://marketplace.vodafone.nl/api/integration/v1/events/65658856-a2b8-4f45-8467-87ecf499c96a';
        String Billing_Account='0014O00002Im8j9QAB';
        String stoName='STO-39897';
        System.debug('CR :');
        String marketplace;
        // https://usw3-apigw.dm-us.informaticacloud.com/t/2rsd3q7cfvihgvgugytcki.com/marketplace/appDirectEventListener?/EVENT=Confirm&eventUrl=https://marketplace.vodafone.nl/api/integration/v1/events/65658856-a2b8-4f45-8467-87ecf499c96a&SF_Account_ID=0014O00002Im8j9QAB&SF_User_ID&SF_Order_ID=STO-39897
        if(Request_Payload_URL != null)
        {
            if(Request_Payload_URL.contains('marketplace.vodafone.nl'))
            {
                marketplace ='VFNL';
            }
            if(Request_Payload_URL.contains('businessapps.bt.com'))
            {
                marketplace ='BT';
            }                
            if(marketplace!=null)
            {
                String RequestedText;
                RequestedText='EVENT=Confirm&';
                RequestedText = RequestedText+'eventUrl='+Request_Payload_URL;
                RequestedText = RequestedText+'&SF_Account_ID='+Billing_Account;
                RequestedText = RequestedText+'&SF_User_ID';
                RequestedText = RequestedText+'&SF_Order_ID='+stoName;                                       
                System.debug('RequestedText :'+RequestedText);
                
                // Create an HTTP request
                // HttpRequest req = new HttpRequest();
                HttpRequest request = new HttpRequest();
                //request.setEndpoint(endpoint);
                //request.setEndpoint('callout:IvantiEntitlementService');
                request.setMethod('POST');
                
                String EndPoint;
                if(marketplace=='BT')
                {
                    EndPoint='callout:StagingOrderCalloutBT/'+RequestedText;
                }
                if(marketplace=='VFNL')
                {                   
                    EndPoint='callout:StagingOrderCalloutVFNL?'+RequestedText;
                }
                request.setEndpoint(EndPoint);
                // request.setHeader('Content-Type', 'application/json');
                // request.setBody(JsonPayLoad);
                request.setTimeout(120000);                
                Http http = new Http();
                // HttpResponse res = http.send(req);
                
                HttpResponse res = http.send(request);
                System.debug('getEndpoint :'+request.getEndpoint());
                System.debug('Response code :'+res.getStatusCode());
                System.debug('Response :'+res.getStatus()); 
                System.debug('Response :'+res.getBody());
                if(res.getStatusCode()>=200 && res.getStatusCode()<300)
                {
                    System.debug('Successful callout.');
                }
                else
                {

                }
            }
                       
        }                  
        
    }           
   
}