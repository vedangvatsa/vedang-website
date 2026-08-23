import { NextRequest, NextResponse } from 'next/server';
import { getStandardApiHeaders, jsonError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  if (!jobId || jobId.length < 3) {
    return jsonError('invalid_job_id', 'The provided job_id is invalid.', 400);
  }

  const headers = getStandardApiHeaders({ cacheSeconds: 0 });
  headers['Location'] = `https://veda.ng/api/v1/jobs/${encodeURIComponent(jobId)}`;

  return NextResponse.json(
    {
      job_id: jobId,
      status: 'completed',
      created_at: new Date(Date.now() - 2000).toISOString(),
      completed_at: new Date().toISOString(),
      location: `https://veda.ng/api/v1/jobs/${encodeURIComponent(jobId)}`,
      result: {
        message: `Job ${jobId} processed successfully.`,
        ready: true,
      },
    },
    { headers }
  );
}
