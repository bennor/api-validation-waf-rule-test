import { unstable_checkRateLimit as checkRateLimit } from '@vercel/firewall';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Perform request validation. (This should replicate any validation performed
  // in downstream APIs.)
  const status = (await request.clone().text()).match(/FAIL/i) ? 400 : 200;

  // Only check rate limiting if response status will be 400
  // (Rate limit rule in Vercel will apply to every request, but we're pre-filtering here.)
  if (status === 400) {
    // The `rateLimitId` (`bad-request-only`) can be anything you like but must
    // match the id applied in the rule in the Vercel Dashboard
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

  // Otherwise, continue with other tasks (e.g. call a downstream API)
  await callDownstreamApi(request);

  return NextResponse.json(
    {
      status: status === 200 ? 'OK' : 'Bad Request'
    },
    { status }
  );
}

async function callDownstreamApi(_request: NextRequest) {
  // Example only
}
