// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextRequest, NextResponse } from 'next/server'
import { listSubscriptions } from '@/lib/square/index'
type Data = {
  name: string
}

export async function GET(
  req: NextRequest,
  res: NextResponse<Data>
) {

  return listSubscriptions()
}