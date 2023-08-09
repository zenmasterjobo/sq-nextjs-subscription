// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSubscription } from '@/lib/square'
import { NextRequest, NextResponse } from 'next/server'

type Data = {
  name: string
}

export async function GET(
  req: NextRequest,
  res: NextResponse<Data>
) {
  const locationId = req.nextUrl.searchParams.get('locationId')
  const customerId = req.nextUrl.searchParams.get('customerId')
  const subscriptionPlanId = req.nextUrl.searchParams.get('subscriptionPlanId')
  if (!locationId || !customerId || !subscriptionPlanId ) {
    return NextResponse.json({status: 400, error: "Missing Parameters"})
  }
  return getSubscription({locationId, customerId, subscriptionPlanId})
}
