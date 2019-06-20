import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

export default class AccountMap extends NavigationMixin(LightningElement) {
  @track
  mapMarkers = [];
  @wire(CurrentPageReference) pageRef;
  connectedCallback() {
    registerListener('accountsMap', this.handleAcountsMap, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }
  handleAcountsMap(markers) {
    this.mapMarkers = markers;
  }
}