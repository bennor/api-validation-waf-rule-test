import { unstable_checkRateLimit as checkRateLimit } from '@vercel/firewall';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const status = !(await request.clone().text()).match(/FAIL/i) ? 400 : 200;
  const { rateLimited } = await checkRateLimit('update-object', {
    request,
    headers: { 'X-Status': status.toFixed() }
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
