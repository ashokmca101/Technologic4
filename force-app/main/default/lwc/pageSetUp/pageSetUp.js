import { LightningElement,track,api } from 'lwc';
export default class PageSetUp extends LightningElement {
    activeSectionsMessage = '';
    @track primaryColor='#5679CD';
    @track secondaryColor='#5679CD';
    @track teritaryColor='#5679CD';
    @track lightTextColor;
    @track darkTextColor;
    @track fontSizeText;
    @track fontSizeHeading;
    @track colorId;


    @track FontSizeStyle = 'color: blue; font-size: 18px;'; 
    @track FontLineTextColorStyle; 
    @track FontHeaddingSizeStyle;
    @track FontDarkTextColorStyle;
connectedCallback() {
    this.ResetChanges();
    console.log('this.lightTextColor :'+this.lightTextColor);
    console.log('this.fontSizeText :'+this.fontSizeText);
    console.log('this.fontSizeHeading :'+this.fontSizeHeading);
    this.FontSizeStyle=`font-size:${this.fontSizeText}px;`;
    this.FontHeaddingSizeStyle = `font-size:${this.fontSizeHeading}px;`;
    this.FontLineTextColorStyle = `color: ${this.lightTextColor};`;
    this.FontDarkTextColorStyle = `color: ${this.darkTextColor};`;

}

changeInput(event)
{
    const inputName = event.target.name;
    console.log('Input name:', inputName);
    const changedValue = event.target.value;
    console.log('changed changedValue :'+changedValue); 
    switch(inputName)
    {
        case 'input-primaryColor-color': this.primaryColor=event.target.value; console.log('primaryColor :'+this.primaryColor);
               // this.FontSizeStyle=`color: ${this.primaryColor}; font-size:${this.fontSizeText};`;
        break;
        case 'input-secondaryColor-color': this.secondaryColor=event.target.value;console.log('secondaryColor :'+this.secondaryColor);
        break;
        case 'input-teritaryColor-color': this.teritaryColor=event.target.value;console.log('teritaryColor :'+this.teritaryColor);
        break;
        case 'input-lightTextColor-color': this.lightTextColor=event.target.value;console.log('lightTextColor :'+this.lightTextColor);
            this.FontLineTextColorStyle = `color : ${this.lightTextColor}`;
        break;
        case 'input-darkTextColor-color': this.darkTextColor=event.target.value;console.log('darkTextColor :'+this.darkTextColor);
            this.FontDarkTextColorStyle = `color: ${this.darkTextColor};`;
        break;  
        case 'input-fontSizeText': this.fontSizeText=event.target.value;console.log('fontSizeText :'+this.fontSizeText);
                this.FontSizeStyle=`font-size:${this.fontSizeText}px;`;                
                //this.FontSizeStyle=`color: ${this.primaryColor}; font-size:${this.fontSizeText}px;`;
        break;
        case 'input-fontSizeHeading': this.fontSizeHeading=event.target.value;console.log('fontSizeHeading :'+this.fontSizeHeading);
              this.FontHeaddingSizeStyle = `font-size:${this.fontSizeHeading}px;`;
        break;                                       
    }
}
handleSave(event)
{
    console.log('this.fontSizeText :'+this.fontSizeText);
    console.log('this.fontSizeHeading :'+this.fontSizeHeading);
    var fontsizeText = this.fontSizeText+'px';
    var fontsizeHeadding = this.fontSizeHeading+'px';
    console.log('fontsizeText :'+fontsizeText);
    console.log('fontsizeHeadding :'+fontsizeHeadding);    
        let colorWrapper = {
            Id: this.colorId,
            primaryColor: this.primaryColor,
            secondaryColor: this.secondaryColor,
            tertiaryColor: this.teritaryColor,
            lightTextColor: this.lightTextColor,
            darkTextColor: this.darkTextColor,
            fontSizeText: fontsizeText,                           //this.fontSizeText,
            fontSizeHeading: fontsizeHeadding                       //this.fontSizeHeading
        };
        console.log('Color settings updated successfully. ' + JSON.stringify(colorWrapper));
        /*
        updateColorSettings({ colorWrapper: colorWrapper })
            .then((result) => {
                    const event = new ShowToastEvent({
                            title: 'Success',
                            message: 'Record Updated Successfully',
                            variant: 'success'
                        });
                        this.dispatchEvent(event);
                console.log('Color settings updated successfully. ' + JSON.stringify(result));
            })
            .catch(error => {
                        const event = new ShowToastEvent({
                            title: 'error',
                            message: 'Record not Updated. Error :'+error,
                            variant: 'error'
                        });
                        this.dispatchEvent(event);
                console.error('Error updating color settings:', error);
            }); 
            */
} 
ResetChanges(event)
{
        this.primaryColor = '#ed7d31';
        this.secondaryColor = '#f8cbad';
        this.teritaryColor = '#000000';
        this.lightTextColor = '#ffffff';
        this.darkTextColor = '#000000';
        this.fontSizeText = '14';
        this.fontSizeHeading = '12';    
}
}