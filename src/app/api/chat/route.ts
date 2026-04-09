import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Message } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  const messages = await Message.find({}).sort({ timestamp: 1 });
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  const newMessage = await Message.create({
    ...data,
    timestamp: Date.now()
  });
  return NextResponse.json(newMessage);
}
