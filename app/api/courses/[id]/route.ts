import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Course from '@/models/Course';

// GET - 获取单个课程
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const course = await Course.findById(id).lean();

    if (!course) {
      return NextResponse.json(
        { success: false, message: '课程不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('获取课程详情失败:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新课程
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const course = await Course.findByIdAndUpdate(
      id,
      {
        courseName: body.courseName,
        description: body.description,
        credit: body.credit,
        hours: body.hours,
        semester: body.semester,
        textbook: body.textbook,
        teacher: body.teacher,
        classroom: body.classroom,
        tuition: body.tuition,
        maxStudents: body.maxStudents,
        enrolledStudents: body.enrolledStudents,
        status: body.status,
        schedule: body.schedule,
        prerequisite: body.prerequisite,
      },
      { new: true, runValidators: true }
    );

    if (!course) {
      return NextResponse.json(
        { success: false, message: '课程不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: course,
      message: '更新成功',
    });
  } catch (error: any) {
    console.error('更新课程失败:', error);
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除课程
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json(
        { success: false, message: '课程不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除课程失败:', error);
    return NextResponse.json(
      { success: false, message: '删除失败' },
      { status: 500 }
    );
  }
}
