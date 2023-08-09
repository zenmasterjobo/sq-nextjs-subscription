import { NextResponse } from 'next/server';
import {subscriptionsApi, customersApi, catalogApi, locationsApi} from './square-client'


(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

export async function listLocations() {
    try {
        const { result: {locations}} = await locationsApi.listLocations();
        return NextResponse.json({status: 200, locations})
    } catch {
        return NextResponse.json({status: 500, error: "something went wrong"})
    }    
}

export async function listCustomers() {
    try {
        const { result: {customers}} = await customersApi.listCustomers();
        return NextResponse.json({status: 200, customers})
    } catch(e) {
        console.log('the error: ', e)
        return NextResponse.json({status: 500, error: "something went wrong"})
    }    
}

export async function listSubscriptions() {
    try {
        const {result: {objects}} = await catalogApi.searchCatalogObjects({
            objectTypes: [
              'SUBSCRIPTION_PLAN'
            ]
          });
        return NextResponse.json({status: 200, objects})
    } catch {
        return NextResponse.json({status: 500, error: "something went wrong"})
    }    
}


export async function getSubscription(
    {
        locationId, 
        customerId, 
        subscriptionPlanId
    }: {
        locationId: string;
        customerId: string;
        subscriptionPlanId: string;
    })  {
      try {
        const { result: { customer } } = await customersApi.retrieveCustomer(customerId);
        const { result: { object } } = await catalogApi.retrieveCatalogObject(subscriptionPlanId);
        const subscriptionPlan = object?.subscriptionPlanData;
        const { result: { subscriptions } } = await subscriptionsApi.searchSubscriptions({
          query: {
            filter: {
              customerIds: [
                customerId
              ],
              locationIds: [
                locationId
              ]
            }
          }
        });
    
        // find the first active subscription for the current plan
        // In the current workflow of the example, we don't allow more than one active subscription for each customer
        // so we'll assume we can rely on the first active subscription if there are multiple
        const activeSubscription = subscriptions ?
          Object.values(subscriptions).find((subscription) => {
            return subscription.planVariationId === subscriptionPlanId
              && (subscription.status === "ACTIVE" || subscription.status === "PENDING");
          }) : null;
    
        // create a SubscriptionDetailsInfo object which translate the subscription plan and active subscription
        // information for the subscription page to render

        // Did not include the SubscriptionDetailsInfo class in this example
        //const subscriptionPlanInfo = new SubscriptionDetailsInfo(subscriptionPlan, activeSubscription);
    
        // render the subscription plan information and its subscription status 
        console.log('some information: ', subscriptionPlanId, customer, locationId, subscriptionPlan, activeSubscription)  
        return NextResponse.json({ status: 200, body: {subscriptionPlanId, customer, locationId, subscriptionPlan, activeSubscription}})
      } catch (error) {
        console.error(error)
        // Something went wrong
        return NextResponse.json({status: 500})
      }
    }