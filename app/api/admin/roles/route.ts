import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Role from '@/models/Role';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * pageSize;

    const [roles, total] = await Promise.all([
      Role.find(query)
        .sort({ sort: 1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Role.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: roles,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取角色列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 } as any
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const role = await Role.create({
      name: body.name,
      code: body.code,
      description: body.description || '',
      status: body.status || 'active',
      permissions: body.permissions || [],
      sort: body.sort || 0,
    });

    return NextResponse.json({
      success: true,
      data: role,
      message: '创建成功',
    });
  } catch (error: any) {
    console.error('创建角色失败:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: '角色编码已存在' },
        { status: 400 } as any
      );
    }
    return NextResponse.json(
      { success: false, message: '创建失败' },
      { status: 500 } as any
    );
  }
}
