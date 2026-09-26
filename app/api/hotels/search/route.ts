import { NextRequest, NextResponse } from 'next/server'

interface HotelSearchParams {
  q?: string
  query?: string
  check_in?: string
  check_out?: string
  place_id?: string
  adults?: number
  rooms?: number
}

interface Hotel {
  hotel_id: string
  name: string
  address: string
  city: string
  stars: number
  rating: number
  review_count: number
  lat: number | null
  lon: number | null
  main_photo: string | null
  thumbnail: string | null
  nightly: number | null
  stay_total: number | null
  nights: number | null
  currency: string
  board: string
  rate_name: string | null
  cancel_tag: string
  refundable: boolean
  cancel_fee: number | null
  cancel_at: string | null
  cancel_windows: any[]
  mi_to_landmark: number | null
  landmark_name: string | null
  facilityIds: string[]
}

const FEEDZ_SEARCH = 'https://api-prod.getfeedz.com/hotel/liteapi/search'
const PARTNER_ID = 'RyMeReasos'
const MR_ORIGIN = 'https://www.myreservations.com'
const SF_PLACE_ID = 'ChIJW5D3LYmAhYARb92CmHj1bOM'
const THANKSGIVING_2026 = '2026-11-26'

function parseQuery(q: string): HotelSearchParams {
  const text = q.trim().toLowerCase()
  
  let nights = 2
  const nightsMatch = text.match(/(\d+)\s*-?\s*nights?/)
  if (nightsMatch) {
    nights = Math.max(1, Math.min(14, parseInt(nightsMatch[1])))
  } else if (text.includes('weekend')) {
    nights = 2
  }

  let checkIn = THANKSGIVING_2026
  let checkOut = new Date(new Date(THANKSGIVING_2026).getTime() + nights * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const dateRangeMatch = text.match(/(20\d{2}-\d{2}-\d{2})\s*(?:to|through|→|->|–|-)\s*(20\d{2}-\d{2}-\d{2})/)
  if (dateRangeMatch) {
    checkIn = dateRangeMatch[1]
    checkOut = dateRangeMatch[2]
  } else if (text.includes('thanksgiving')) {
    checkIn = THANKSGIVING_2026
    checkOut = new Date(new Date(THANKSGIVING_2026).getTime() + nights * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }

  return {
    query: q.trim(),
    check_in: checkIn,
    check_out: checkOut,
    place_id: SF_PLACE_ID,
    adults: 2,
    rooms: 1,
  }
}

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  return 2 * R * Math.asin(Math.sqrt(a))
}

function extractHotel(h: any, landmarkLat?: number, landmarkLon?: number): Hotel {
  const pricing = h.pricing || {}
  let nightly = pricing.allInPerNight || pricing.ppnNightlyRaw || pricing.nightlyRateShown
  const stayTotal = pricing.allInTotal || pricing.ppnAllInDiscounted || pricing.ppnAllInRaw || pricing.liteapiGrandTotal
  const nights = parseInt(pricing.nights || 0)
  
  if (!nightly && stayTotal && nights) {
    nightly = Math.round((stayTotal / nights) * 100) / 100
  }

  const roomTypes = h.roomTypes || []
  const rate = (roomTypes[0]?.rates?.[0]) || {}
  const pol = rate.cancellationPolicies || {}
  const tag = (pol.refundableTag || 'NRFN').toUpperCase()
  const infos = pol.cancelPolicyInfos || []
  const refundable = ['RFN', 'RFND', 'REFUNDABLE'].includes(tag)

  let distToLandmark: number | null = null
  const landmarkName = 'Union Square'
  if (landmarkLat !== undefined && landmarkLon !== undefined && h.latitude && h.longitude) {
    distToLandmark = Math.round(haversineMiles(landmarkLat, landmarkLon, h.latitude, h.longitude) * 100) / 100
  }

  return {
    hotel_id: h.hotelId || h.id,
    name: h.name || 'Hotel',
    address: h.address || '',
    city: h.city || '',
    stars: h.stars || 0,
    rating: parseFloat(h.rating || 0),
    review_count: h.reviewCount || h.review_count || 0,
    lat: h.latitude || null,
    lon: h.longitude || null,
    main_photo: h.main_photo,
    thumbnail: h.thumbnail || h.main_photo,
    nightly,
    stay_total: stayTotal,
    nights: nights || null,
    currency: pricing.currency || 'USD',
    board: rate.boardName || 'Room Only',
    rate_name: rate.name,
    cancel_tag: tag,
    refundable,
    cancel_fee: infos[0]?.amount || null,
    cancel_at: infos[0]?.cancelTime || null,
    cancel_windows: infos,
    mi_to_landmark: distToLandmark,
    landmark_name: distToLandmark !== null ? landmarkName : null,
    facilityIds: h.facilityIds || [],
  }
}

async function searchLive(params: HotelSearchParams) {
  const placeId = params.place_id || SF_PLACE_ID
  const checkIn = params.check_in || THANKSGIVING_2026
  const checkOut = params.check_out || new Date(new Date(checkIn).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const searchParams = new URLSearchParams({
    place_id: placeId,
    check_in: checkIn,
    check_out: checkOut,
    currency: 'USD',
    guest_nationality: 'US',
    adults: String(params.adults || 2),
    rooms: String(params.rooms || 1),
    occupancies: String(params.adults || 2),
    sort: 'rating_descending',
    include_hotel_data: 'true',
    include_facets: 'false',
    max_rates_per_hotel: '1',
    hitsPerPage: '40',
  })

  const url = `${FEEDZ_SEARCH}?${searchParams}`
  const headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'origin': MR_ORIGIN,
    'referer': `${MR_ORIGIN}/`,
    'partnerid': PARTNER_ID,
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  }

  try {
    const response = await fetch(url, { headers })
    
    if (!response.ok) {
      return {
        ok: false,
        error: `feedz_http_${response.status}`,
        message: `Feedz API returned ${response.status}`,
        hotels: [],
      }
    }

    const data = await response.json()
    const items = data.data || []
    
    const sfDowntown = { lat: 37.7879, lon: -122.4075 }
    const hotels = items.map((h: any) => extractHotel(h, sfDowntown.lat, sfDowntown.lon))

    const near = hotels.filter((h: Hotel) => h.mi_to_landmark !== null && h.mi_to_landmark <= 2.5)
    const pool = near.length >= 5 ? near : hotels

    const sorted = pool.sort((a: Hotel, b: Hotel) => {
      const ringA = (a.mi_to_landmark !== null && a.mi_to_landmark <= 1.5) ? 0 : (a.mi_to_landmark !== null && a.mi_to_landmark <= 2.5) ? 1 : 2
      const ringB = (b.mi_to_landmark !== null && b.mi_to_landmark <= 1.5) ? 0 : (b.mi_to_landmark !== null && b.mi_to_landmark <= 2.5) ? 1 : 2
      if (ringA !== ringB) return ringA - ringB
      if (b.rating !== a.rating) return b.rating - a.rating
      const priceA = a.nightly || 1e18
      const priceB = b.nightly || 1e18
      return priceA - priceB
    }).slice(0, 12)

    let recommendation = null
    if (sorted.length > 0) {
      const top = sorted[0]
      const why = [
        `Highest guest rating (${top.rating}) in this set`,
        top.mi_to_landmark !== null ? `${top.mi_to_landmark} mi to ${top.landmark_name}` : null,
        top.nightly !== null ? `$${top.nightly.toFixed(2)}/night` : null,
        top.refundable ? 'Refundable' : 'Non-refundable',
      ].filter(Boolean).join(' · ')

      recommendation = {
        hotel_id: top.hotel_id,
        name: top.name,
        nightly: top.nightly,
        stay_total: top.stay_total,
        cancel_tag: top.cancel_tag,
        cancel_fee: top.cancel_fee,
        cancel_at: top.cancel_at,
        why,
      }
    }

    const nightsCount = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (24 * 60 * 60 * 1000))

    return {
      ok: true,
      endpoint: 'feedz',
      place_id: placeId,
      place_label: 'Downtown SF / Union Square',
      dates: {
        check_in: checkIn,
        check_out: checkOut,
        fallback: false,
      },
      nights: nightsCount,
      hotel_count: sorted.length,
      hotels: sorted,
      recommendation,
      ran_at: new Date().toISOString(),
    }
  } catch (error: any) {
    return {
      ok: false,
      error: 'search_failed',
      message: error.message || 'Unknown error',
      hotels: [],
    }
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get('q') || searchParams.get('query') || ''
  
  const parsed = parseQuery(q)
  if (searchParams.get('check_in')) parsed.check_in = searchParams.get('check_in')!
  if (searchParams.get('check_out')) parsed.check_out = searchParams.get('check_out')!
  if (searchParams.get('place_id')) parsed.place_id = searchParams.get('place_id')!

  const result = await searchLive(parsed)
  return NextResponse.json(result, { status: result.ok ? 200 : 502 })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const q = body.q || body.query || body.text || ''
  
  const parsed = parseQuery(q)
  if (body.check_in) parsed.check_in = body.check_in
  if (body.check_out) parsed.check_out = body.check_out
  if (body.place_id) parsed.place_id = body.place_id
  if (body.adults) parsed.adults = body.adults
  if (body.rooms) parsed.rooms = body.rooms

  const result = await searchLive(parsed)
  return NextResponse.json(result, { status: result.ok ? 200 : 502 })
}
