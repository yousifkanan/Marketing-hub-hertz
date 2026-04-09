import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  const users = await User.find({});
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  const user = await User.create(data);
  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  await dbConnect();
  const data = await request.json();
  const { _id, id, ...updateData } = data;
  const targetId = _id || id;
  await User.findByIdAndUpdate(targetId, updateData);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  await User.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
