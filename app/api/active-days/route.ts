import { NextResponse } from 'next/server';
import { getAllActiveDays } from '@/features/task/services';

export async function GET() {
  try {
    const days = await getAllActiveDays();
    return NextResponse.json({ days: Array.from(days) });
  } catch (error) {
    console.error('Error fetching active days:', error);
    return NextResponse.json({ days: [] });
  }
}
