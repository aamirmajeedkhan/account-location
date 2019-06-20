import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import searchAccount from '@salesforce/apex/AccountSearchController.searchAccounts';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import { LightningElement, track, wire } from 'lwc';
const columns = [
  { label: 'Name', fieldName: 'Name', type: 'text' },
  { label: 'Phone', fieldName: 'Phone', type: 'phone' },
  { label: 'Website', fieldName: 'Website', type: 'url' },
  {
    label: 'Action', type: 'button', typeAttributes: {
      label: 'View details', name: 'view_details'
    }
  }
];

export default class AccountList extends NavigationMixin(LightningElement) {
  @track results = {};
  @track searchTerm = '';
  @wire(searchAccount, { searchTerm: '$searchTerm' })
  searchResult({ error, data }) {

    if (data) {
      this.results = data;
      let mapMarkers = [];
      for (let index = 0; index < data.length; index++) {
        const account = data[index];
        const marker = {
          'location': {
            'Street': account.BillingStreet,
            'City': account.BillingCity,
            'PostalCode': account.BillingPostalCode
          },
          'icon': 'standard:location'
        };
        mapMarkers.push(marker);
      }
      fireEvent(this.pageRef, 'accountsMap', mapMarkers);
    }

  }

  @track columns = columns;

  @wire(CurrentPageReference) pageRef;
  connectedCallback() {
    registerListener('searchAccount', this.handleSearchAccount, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleSearchAccount(searchTerm) {

    this.searchTerm = searchTerm;

  }
  handleRowAction(event) {

    const row = event.detail.row;
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: row.Id,
        objectApiName: 'Account',
        actionName: 'view'
      }
    });

  }
}