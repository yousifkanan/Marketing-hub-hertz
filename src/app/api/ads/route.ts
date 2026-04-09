import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Ad } from '@/lib/models';

export async function GET() {
  await dbConnect();
  const ads = await Ad.find({});
  return NextResponse.json(ads);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  const ad = await Ad.create(data);
  return NextResponse.json(ad);
}

export async function PUT(request: Request) {
  await dbConnect();
  const { id, field, value } = await request.json();
  await Ad.findByIdAndUpdate(id, { [field]: value });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  await Ad.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
