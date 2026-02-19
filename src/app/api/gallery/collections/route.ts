import { NextResponse } from 'next/server';
import { getAllCollections, createCollection } from '@/lib/database/sqlite';

export async function GET() {
  try {
    const collections = getAllCollections();
    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const collection = createCollection(data);
    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
