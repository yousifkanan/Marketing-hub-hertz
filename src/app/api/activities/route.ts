import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Activity } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  const activities = await Activity.find({}).sort({ timestamp: -1 }).limit(50);
  return NextResponse.json(activities);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  const newActivity = await Activity.create({
    ...data,
    timestamp: Date.now()
  });
  return NextResponse.json(newActivity);
}
