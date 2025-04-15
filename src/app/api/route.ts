import { unstable_checkRateLimit as checkRateLimit } from '@vercel/firewall';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const status = !(await request.clone().text()).match(/FAIL/i) ? 400 : 200;
  const headers = { ...request.headers, 'X-Status': status.toFixed() };
  console.log({ headers, status });
  const { rateLimited } = await checkRateLimit('update-object', {
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
    { status: status === 200 ? 'OK' : 'Bad Request' },
    { status }
  );
}
