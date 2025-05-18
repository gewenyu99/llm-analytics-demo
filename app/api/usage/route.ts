import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// This is a mock implementation - you'll need to replace this with your actual data source
async function getUsageData(userId: string) {

  const posthogUrl = process.env.POSTHOG_HOST
  const projectId = process.env.POSTHOG_PROJECT_ID
  const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY

  const url = `${posthogUrl}/api/projects/${projectId}/query/`;

  const cookieStore = await cookies()
  const nickname = cookieStore.get('nickname');
  
  if (!nickname) {
    return {
      usage: 0,
      estimatedCost: 0
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${personalApiKey}`
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query: `
          SELECT 
              COUNT(*) as usage,
              COALESCE(SUM(properties.$ai_total_cost_usd), 0) as estimatedCost
          FROM events 
          WHERE event = '$ai_generation' 
          AND distinct_id = '${nickname}'
          `
      }
    }),
  });

  const data = await response.json();
  console.log(data);
  return {
    usage: data.results[0][0],
    estimatedCost: data.results[0][1]
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    const usageData = await getUsageData(userId);
    console.log(usageData);
    return NextResponse.json(usageData);
  } catch (error) {
    console.error('Error fetching usage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
} 