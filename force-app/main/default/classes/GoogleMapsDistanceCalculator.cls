/* 
* @aauthor : lakshman
* @Created Date : 04-13-2024
* @Last Modified Date : 04-15-2024
* @Last Modified By : Lakshman
* @version : 1.0
* Description : getting the Staging Order and its Related  all Automation Artifacts and Automation Artifact records
*               order by Created Date. The Latest Automation Artificat Record was in first Position.
*               making the callout based on VFNL , BT
*/
public class GoogleMapsDistanceCalculator { 
    /*
    public static void calculateDistance(Decimal lat1, Decimal lon1, Decimal lat2, Decimal lon2) {
        Decimal R = 6371; // Radius of the earth in kilometers
        Decimal dLat = toRadians(lat2 - lat1);
        Decimal dLon = toRadians(lon2 - lon1);
        Decimal a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                   Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                   Math.sin(dLon/2) * Math.sin(dLon/2);
        Decimal c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        Decimal distance = R * c; // Distance in kilometers
        System.debug('distance :'+distance);
    }
    
    private static Decimal toRadians(Decimal degree) {
        return degree * Math.PI / 180;
    }
*/
    @future(callout=true)
    public static void calculateDistance(String origin, String destination) {
        String apiKey = 'AIzaSyDLUgN5smNf8vAhbHWsW_UkQtm0MM9naX8';
        String url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+origin +'&destinations='+destination+'&key='+apiKey;
		//String url1 = 'https://www.google.com/maps/place/682311'; //+ '&key=' + apiKey;
        String url1 = 'https://www.google.co.in/maps/dir/Elure/Jangareddygudem';
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url1);
        request.setMethod('GET');

        Http http = new Http();
        try
        {
        HttpResponse response = http.send(request);
        System.debug('response1 :'+response);
        //System.debug('response :'+response.getBody());
		Decimal distanceValue;
        if (response.getStatusCode() == 200) {
			String listJson= response.getBody();
            System.debug('listJson length :'+listJson.length());
            Integer postion = listJson.indexOf('km');
            System.debug('postion :'+postion);
            System.debug('listJson :'+listJson);
            
        } else {
			System.debug('Error');
        }
            
        }
        catch(Exception e)
        {
            
        }
    }

}