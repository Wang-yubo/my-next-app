import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Student from '@/models/Student';

// GET - 获取单个学生
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const student = await Student.findOne({ id }).lean();

    if (!student) {
      return NextResponse.json(
        { success: false, message: '学生不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('获取学生详情失败:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新学生
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();

    const student = await Student.findOneAndUpdate(
      { id },
      {
        name: body.name,
        gender: body.gender,
        age: body.age,
        major: body.major,
        grade: body.grade,
        phone: body.phone,
        email: body.email,
        status: body.status,
        enrollDate: body.enrollDate,
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return NextResponse.json(
        { success: false, message: '学生不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
      message: '更新成功',
    });
  } catch (error) {
    console.error('更新学生失败:', error);
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除学生
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const student = await Student.findOneAndDelete({ id });

    if (!student) {
      return NextResponse.json(
        { success: false, message: '学生不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除学生失败:', error);
    return NextResponse.json(
      { success: false, message: '删除失败' },
      { status: 500 }
    );
  }
}
