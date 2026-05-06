import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Teacher from '@/models/Teacher';

// GET - 获取教师列表
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '100');
    const search = searchParams.get('search') || '';

    // 构建查询条件
    const query: any = {};
    if (search) {
      query.$or = [
        { id: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    // 计算分页
    const skip = (page - 1) * pageSize;

    // 查询数据
    const [teachers, total] = await Promise.all([
      Teacher.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Teacher.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: teachers,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取教师列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 } as any
    );
  }
}
