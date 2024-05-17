import { LightningElement,api,track } from 'lwc';
import getConList from '@salesforce/apex/ContactsHelper.getContactsList';
const columns = [
    { label: 'id', fieldName: 'id' },
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website'},
    { label: 'Phone', fieldName: 'phone'},
    { label: 'Balance', fieldName: 'amount'},
    { label: 'CloseAt', fieldName: 'closeAt'},
];
export default class AdjustableRowWidth extends LightningElement 
{
@track dataList=[];
@track columnsList=[];
@track mouseStart;
@track oldWidth;
@track primaryColor='orange';
@track secondaryColor='pink';

tableScrolled(event) {
    if (this.enableInfiniteScrolling) {
        if ((event.target.scrollTop + event.target.offsetHeight) >= event.target.scrollHeight) {
            this.dispatchEvent(new CustomEvent('showmorerecords', {
                bubbles: true
            }));
        }
    }
    if (this.enableBatchLoading) {
        if ((event.target.scrollTop + event.target.offsetHeight) >= event.target.scrollHeight) {
            this.dispatchEvent(new CustomEvent('shownextbatch', {
                bubbles: true
            }));
        }
    }
}
handleScroll(event){

        
        console.log('etner');

        this._tableViewInnerDiv = this.template.querySelector(".tableViewInnerDiv");
        if (this._tableViewInnerDiv) {
            if (!this._tableViewInnerDivOffsetWidth || this._tableViewInnerDivOffsetWidth === 0) {
                this._tableViewInnerDivOffsetWidth = this._tableViewInnerDiv.offsetWidth;
            }
            this._tableViewInnerDiv.style = 'width:' + (event.currentTarget.scrollLeft + this._tableViewInnerDivOffsetWidth) + "px;" + this.tableBodyStyle;
            console.log('1352 '+  this._tableViewInnerDiv.style);
        }
        this.tableScrolled(event);


        const target = event.target;
        console.log(target.scrollHeight - target.scrollTop , 'final ',target.clientHeight+0.5);
        if ( target.scrollHeight - target.scrollTop <= (target.clientHeight + 0.5)) {
            //console.log('enter');
        
         // this.loadMoreData();
        }
    }
get tabStyle(){
    //background-color: #E88543; padding-top: 8px;padding-bottom: 8px;padding-left: 8px;
    return this.primaryColor ? `background-color: ${this.primaryColor} !important; padding-top: 8px;padding-bottom: 8px;padding-left: 8px;` : '';

}
get filterIconStyle() {
        return this.secondaryColor ? `--sds-c-icon-color-foreground-default: ${this.secondaryColor} !important;width:10px;` : '';

    }
connectedCallback() 
{
    this.defaultTable();
    //code
}
defaultTable()
{
this.columnsList=columns;
    var temp=[];
  for(var i=0;i<100;i++)
  {
      console.log('i :'+i);
      temp.push({
          id:i,
          name:'Name'+i,
          website:'website'+i,
          phone:'phone'+i,
          amount:'amount'+i,
          closeAt:'closeAt'+i
      });
  }  
  this.dataList = temp;
  console.log('this.dataList :'+this.dataList.length);
}
handleRowAction(event)
{

}
setNewWidth(event)
{
    console.log('=========Start ondrag setNewWidth======');
            var childObj = event.target;
            console.log(' CHILD OBJECT :'+childObj);
            var parObj = childObj.parentNode;
            var count = 1;
            while(parObj.tagName != 'TH') {
                parObj = parObj.parentNode;
                count++;
            }
            console.log(' countABC :'+count);
            
          //  var mouseStart = component.get("v.mouseStart");
            var mouseStart = this.mouseStart;
           // var oldWidth = component.get("v.oldWidth");
            var oldWidth = this.oldWidth;

            var newWidth = event.clientX- parseFloat(mouseStart)+parseFloat(oldWidth);
            parObj.style.width = newWidth+'px';
            console.log(' 11 this.mouseStart :'+this.mouseStart);
            console.log(' 11 this.oldWidth :'+this.oldWidth);  
            console.log(' 11 parObj.style.width :'+parObj.style.width);  
            console.log('=========END setNewWidth======');         
}
calculateWidth(event)
{
    console.log('=========Start calculateWidth======');
            var childObj = event.target;
            console.log(' child Obj :'+childObj);
            var parObj = childObj.parentNode;
            var count = 1;
            while(parObj.tagName != 'TH') {
                parObj = parObj.parentNode;
                count++;
            }
            console.log(' count123 :'+count);
            console.log('final tag Name'+parObj.tagName);
            var mouseStart=event.clientX;
           // component.set("v.mouseStart",mouseStart);
            this.mouseStart = mouseStart;
           // component.set("v.oldWidth",parObj.offsetWidth);
            this.oldWidth = parObj.offsetWidth;

            console.log(' this.mouseStart :'+this.mouseStart);
            console.log(' this.oldWidth :'+this.oldWidth);
            console.log(' count123 :'+count);

            console.log('=========END calculateWidth======');            
}
mouseOverEvent(event)
{
        var childObj = event.target;
            console.log(' child Obj :'+childObj);
            var parObj = childObj.parentNode;
            var count = 1;
            while(parObj.tagName != 'TH') {
                parObj = parObj.parentNode;
                count++;
            }
        var mouseStart=event.clientX;
           // component.set("v.mouseStart",mouseStart);
            this.mouseStart = mouseStart;
           // component.set("v.oldWidth",parObj.offsetWidth);
            this.oldWidth = parObj.offsetWidth;

            console.log(' 22 this.mouseStart :'+this.mouseStart);
            console.log(' 22 this.oldWidth :'+this.oldWidth);    
}
}