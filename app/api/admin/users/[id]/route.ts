import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import bcrypt from 'bcryptjs';

const mockRoleMap: Record<string, { name: string; code: string }> = {
  '000000000000000000000001': { name: '超级管理员', code: 'super_admin' },
  '000000000000000000000002': { name: '教务管理员', code: 'edu_admin' },
  '000000000000000000000003': { name: '教师', code: 'teacher' },
  '000000000000000000000004': { name: '学生', code: 'student' },
};

function resolveRoleInfo(roleId: string): { name: string; code: string } {
  const mapped = mockRoleMap[roleId];
  if (mapped) return mapped;
  return { name: '学生', code: 'student' };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const user = await AdminUser.findById(id).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 } as any
      );
    }

    const roles = user.roleName
      ? [{ _id: (user.roles?.[0]?.toString?.() || user.roles?.[0] || ''), name: user.roleName, code: user.roleCode }]
      : user.roles?.map((r: any) => {
          const id = r?.toString?.() || r;
          const mapped = mockRoleMap[id];
          return mapped ? { _id: id, name: mapped.name, code: mapped.code } : null;
        }).filter(Boolean) || [];

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        roles,
      },
    });
  } catch (error) {
    console.error('获取用户详情失败:', error);
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

    const updateData: any = {
      email: body.email,
      nickname: body.nickname,
      status: body.status,
    };

    if (body.role) {
      const { name: roleName, code: roleCode } = resolveRoleInfo(body.role);
      updateData.roles = [body.role];
      updateData.roleName = roleName;
      updateData.roleCode = roleCode;
    }

    if (body.password && body.password.trim() !== '') {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const user = await AdminUser.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 } as any
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: '更新成功',
    });
  } catch (error) {
    console.error('更新用户失败:', error);
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

    const user = await AdminUser.findByIdAndUpdate(
      id,
      { status: 'disabled' },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 } as any
      );
    }

    return NextResponse.json({
      success: true,
      message: '已禁用该用户',
    });
  } catch (error) {
    console.error('禁用用户失败:', error);
    return NextResponse.json(
      { success: false, message: '操作失败' },
      { status: 500 } as any
    );
  }
}
