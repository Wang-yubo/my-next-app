import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Role from '@/models/Role';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const role = await Role.findById(id).lean();

    if (!role) {
      return NextResponse.json(
        { success: false, message: '角色不存在' },
        { status: 404 } as any
      );
    }

    return NextResponse.json({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error('获取角色详情失败:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 } as any
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.code !== undefined) updateData.code = body.code;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.permissions !== undefined) updateData.permissions = body.permissions;
    if (body.sort !== undefined) updateData.sort = body.sort;

    const role = await Role.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!role) {
      return NextResponse.json(
        { success: false, message: '角色不存在' },
        { status: 404 } as any
      );
    }

    return NextResponse.json({
      success: true,
      data: role,
      message: '更新成功',
    });
  } catch (error: any) {
    console.error('更新角色失败:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: '角色编码已存在' },
        { status: 400 } as any
      );
    }
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 } as any
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const role = await Role.findById(id);

    if (!role) {
      return NextResponse.json(
        { success: false, message: '角色不存在' },
        { status: 404 } as any
      );
    }

    if (role.code === 'super_admin') {
      return NextResponse.json(
        { success: false, message: '超级管理员角色不能被禁用' },
        { status: 400 } as any
      );
    }

    role.status = 'disabled';
    await role.save();

    return NextResponse.json({
      success: true,
      message: '已停用该角色',
    });
  } catch (error) {
    console.error('停用角色失败:', error);
    return NextResponse.json(
      { success: false, message: '操作失败' },
      { status: 500 } as any
    );
  }
}
