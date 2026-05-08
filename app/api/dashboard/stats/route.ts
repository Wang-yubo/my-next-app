import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const [
      studentTotal,
      teacherTotal,
      courseTotal,
      enrollmentTotal,
      studentsByGrade,
      studentsByGender,
      recentEnrollments,
    ] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments({ status: '已选课' }),
      Student.aggregate([
        {
          $group: {
            _id: '$grade',
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Student.aggregate([
        {
          $group: {
            _id: '$gender',
            count: { $sum: 1 },
          },
        },
      ]),
      Enrollment.find({ status: '已选课' })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        studentTotal,
        teacherTotal,
        courseTotal,
        enrollmentTotal,
        studentsByGrade: studentsByGrade.map((item: any) => ({
          grade: item._id,
          count: item.count,
        })),
        studentsByGender: studentsByGender.map((item: any) => ({
          gender: item._id,
          count: item.count,
        })),
        recentEnrollments,
      },
    });
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 }
    );
  }
}
