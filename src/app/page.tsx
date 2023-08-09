'use client'

import { useState, useEffect } from "react"

interface SelectBoxData {
  locations: {
    id: string;
    name: string;
  }[],
  customers: {
    id: string;
    givenName: string;
    familyName: string;
  }[],
  objects: {
    id: string;
    subscriptionPlanData: {
      name: string
    }
  }[]
}

export default function Home() {
  const [selectBoxData, setSelectBoxData] = useState<SelectBoxData>()
  const [locationId, setLocationId] = useState<string>()
  const [customerId, setCustomerId] = useState<string>()
  const [planId, setPlanId] = useState<string>()

  const [subscriptionInfo, setSubscriptionInfo] = useState()

  useEffect(() => {
    const loadData = async () => {
      let result = await fetch('/api/locations')
      const {locations} = await result.json()
      setLocationId(locations[0].id)
      
      result = await fetch('/api/customers')
      const {customers} = await result.json()
      setCustomerId(customers[0].id)

      result = await fetch('/api/list-subscriptions')
      const {objects} = await result.json()
      setPlanId(objects[0].id)
      setSelectBoxData({
        locations,
        customers,
        objects
      })
    }

    loadData()
  }, [])

  const getSubscriptionInfo = async () => {
    const result = await fetch(`/api/subscriptions?locationId=${locationId}&customerId=${customerId}&subscriptionPlanId=${planId}`)
    const {body} = await result.json()

    setSubscriptionInfo(body)

  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      </div>
      <div>
      
      <div className="mb-4">
        <label className="mr-4" htmlFor="locationSelect">Select a Location:</label>
        <select id="locationSelect" value={locationId} onChange={(event) => { console.log(event.target.value); setLocationId(event.target.value)}}>
          {selectBoxData?.locations.map((location, i) => {
            return <option key={i} value={location.id}> {location.name}</option>
          })}
        </select>
      </div>

      <div className="mb-4">
        <label className="mr-4" htmlFor="customerSelect">Select a Customer:</label>
        <select id="customerSelect" value={customerId} onChange={(event) => { console.log(event.target.value); setCustomerId(event.target.value)}}>
          {selectBoxData?.customers.map((customer, i) => {
            return <option key={i} value={customer.id}> {`${customer.givenName} ${customer.familyName}`}</option>
          })}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="mr-4" htmlFor="subscriptionPlanSelect">Select a Plan:</label>
        <select id="subscriptionPlanSelect" value={planId} onChange={(event) => setPlanId(event.target.value)}>
          {selectBoxData?.objects.map((subscription, i) => {
            return <option key={i} value={subscription.id}> {subscription.subscriptionPlanData.name}</option>
          })}
        </select>
      </div>
      

      <div>
        <button onClick={getSubscriptionInfo} className="bg-green-400 p-4 rounded">Run location Seach</button>
      </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
      <div>
        {subscriptionInfo &&  Object.keys(subscriptionInfo).map((key) => (
          <p key={key}>
            <strong>{key}:</strong> {subscriptionInfo[key]}
          </p>
        ))}
      </div>
      </div>
    </main>
  )
}
