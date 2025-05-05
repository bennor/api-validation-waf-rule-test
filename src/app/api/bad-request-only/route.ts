import { unstable_checkRateLimit as checkRateLimit } from '@vercel/firewall';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const status = (await request.clone().text()).match(/FAIL/i) ? 400 : 200;
  // Only check rate limiting if response status will be 400
  // (Rate limit rule will apply to every request, but we're pre-filtering here.)
  if (status === 400) {
    const { rateLimited } = await checkRateLimit('bad-request-only', {
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
  }
  // Otherwise, continue with other tasks
  return NextResponse.json(
    {
      status: status === 200 ? 'OK' : 'Bad Request'
    },
    { status }
  );
}
