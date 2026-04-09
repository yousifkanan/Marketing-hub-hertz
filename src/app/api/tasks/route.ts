import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Task } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  const tasks = await Task.find({});
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  const task = await Task.create(data);
  return NextResponse.json(task);
}

export async function PUT(request: Request) {
  await dbConnect();
  const data = await request.json();
  const { _id, id, ...updateData } = data;
  const targetId = _id || id;
  await Task.findByIdAndUpdate(targetId, updateData);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  await Task.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
