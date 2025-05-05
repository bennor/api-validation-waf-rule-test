import { unstable_checkRateLimit as checkRateLimit } from '@vercel/firewall';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const status = (await request.clone().text()).match(/FAIL/i) ? 400 : 200;
  const headers = {
    ...Object.fromEntries(request.headers),
    // Send through response status as header
    'x-response-status': status.toFixed()
  };
  // Apply rate limiting to all requests
  // (Rate limit rule will apply only when `x-response-status` header equals `400`.)
  const { rateLimited } = await checkRateLimit('status-code', {
    request,
    headers
  });
  if (rateLimited) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded'
      },
      { status: 429 }
    );
  }
  // Otherwise, continue with other tasks
  return NextResponse.json(
    {
      status: status === 200 ? 'OK' : 'Bad Request'
    },
    { status }
  );
}
