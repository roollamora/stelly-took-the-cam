import { NextResponse } from 'next/server';
import { updateImage } from '@/lib/database';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const image = updateImage(parseInt(params.id), data);
    return NextResponse.json(image);
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}
