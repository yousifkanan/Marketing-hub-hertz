import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Inventory } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  const items = await Inventory.find({});
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  const item = await Inventory.create(data);
  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  await dbConnect();
  const data = await request.json();
  const { _id, id, ...updateData } = data;
  const targetId = _id || id;
  await Inventory.findByIdAndUpdate(targetId, updateData);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  await Inventory.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
