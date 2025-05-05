import { unstable_checkRateLimit as checkRateLimit } from '@vercel/firewall';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Check rate limit on all requests
  // (Rate limit rule will apply all requests, but be scoped to this path.)
  const { rateLimited } = await checkRateLimit('all-scoped', {
    request
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
  const status = 200;
  return NextResponse.json(
    {
      status: 'OK'
    },
    { status }
  );
}
