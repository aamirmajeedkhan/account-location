import { LightningElement, wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class AccountSearch extends NavigationMixin(LightningElement) {
  //@track searchTerm;
  @wire(CurrentPageReference) pageRef;
  handleSearchTermChange(event) {
    // Debouncing this method: do not update the reactive property as
    // long as this function is being called within a delay of 300 ms.
    // This is to avoid a very large number of Apex method calls.
    window.clearTimeout(this.delayTimeout);
    const searchTerm = event.target.value;
    // eslint-disable-next-line @lwc/lwc/no-async-operation 	 
    this.delayTimeout = setTimeout(() => {
      fireEvent(this.pageRef, 'searchAccount', searchTerm);
    }, 300);
  }
}