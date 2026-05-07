import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Teacher from '@/models/Teacher';
import bcrypt from 'bcryptjs';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();

    const updateData: any = {};

    if (body.status) {
      updateData.status = body.status;
    }

    if (body.password && body.password.trim() !== '') {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const teacher = await Teacher.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: '教师不存在' },
        { status: 404 } as any
      );
    }

    return NextResponse.json({
      success: true,
      data: teacher,
      message: '更新成功',
    });
  } catch (error) {
    console.error('更新教师失败:', error);
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 } as any
    );
  }
}
