import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'weekofstay-sf-poc',
    feedz: true,
    timestamp: new Date().toISOString(),
  })
}
