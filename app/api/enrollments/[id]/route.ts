import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';

// PUT - 更新选课
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { courseId } = body;

    // 查找原选课记录
    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: '选课记录不存在' },
        { status: 404 }
      );
    }

    // 如果更换课程，需要检查新课程
    if (courseId && courseId !== enrollment.courseId) {
      // 检查新课程是否存在且状态为开设中
      const course: any = await Course.findById(courseId).lean();
      if (!course) {
        return NextResponse.json(
          { success: false, message: '课程不存在' },
          { status: 404 }
        );
      }

      if (course.status !== '开设中') {
        return NextResponse.json(
          { success: false, message: '该课程当前不可选' },
          { status: 400 }
        );
      }

      // 检查是否已达到最大选课人数
      if (course.enrolledStudents >= course.maxStudents) {
        return NextResponse.json(
          { success: false, message: '该课程已满员，无法选课' },
          { status: 400 }
        );
      }

      // 检查学生是否已经选过这门课
      const existingEnrollment = await Enrollment.findOne({
        studentId: enrollment.studentId,
        courseId,
        status: '已选课',
        _id: { $ne: id },
      });

      if (existingEnrollment) {
        return NextResponse.json(
          { success: false, message: '您已经选过这门课程' },
          { status: 400 }
        );
      }

      // 减少原课程的选课人数
      await Course.findByIdAndUpdate(enrollment.courseId, {
        $inc: { enrolledStudents: -1 },
      });

      // 增加新课程的选课人数
      await Course.findByIdAndUpdate(courseId, {
        $inc: { enrolledStudents: 1 },
      });

      // 更新选课记录
      const updatedEnrollment = await Enrollment.findByIdAndUpdate(
        id,
        {
          courseId,
          courseCode: course.courseCode,
          courseName: course.courseName,
          credit: course.credit,
          teacher: course.teacher.name,
          schedule: course.schedule,
          classroom: `${course.classroom.building} ${course.classroom.roomNumber}`,
        },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        data: updatedEnrollment,
        message: '修改成功',
      });
    }

    return NextResponse.json({
      success: false,
      message: '没有需要更新的字段',
    });
  } catch (error) {
    console.error('更新选课失败:', error);
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除选课（退课）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // 查找选课记录
    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: '选课记录不存在' },
        { status: 404 }
      );
    }

    // 减少课程的选课人数
    await Course.findByIdAndUpdate(enrollment.courseId, {
      $inc: { enrolledStudents: -1 },
    });

    // 删除选课记录
    await Enrollment.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: '退课成功',
    });
  } catch (error) {
    console.error('删除选课失败:', error);
    return NextResponse.json(
      { success: false, message: '删除失败' },
      { status: 500 }
    );
  }
}
