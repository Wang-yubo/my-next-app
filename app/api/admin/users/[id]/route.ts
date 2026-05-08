import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import Role from '@/models/Role';
import bcrypt from 'bcryptjs';

async function resolveRoleInfoFromDb(roleId: string): Promise<{ name: string; code: string }> {
  if (!roleId) return { name: '学生', code: 'student' };
  try {
    const role = await Role.findById(roleId).lean();
    if (role) return { name: role.name, code: role.code };
  } catch {}
  return { name: '学生', code: 'student' };
}

async function findRoleByCode(code: string): Promise<{ _id: string; name: string; code: string } | null> {
  if (!code) return null;
  try {
    const role = await Role.findOne({ code }).lean();
    if (role) return { _id: role._id.toString(), name: role.name, code: role.code };
  } catch {}
  return null;
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

    // 用真实角色 ID 替换角色信息
    let resolvedRoles: { _id: string; name: string; code: string }[] = [];
    if (user.roleName) {
      const found = await findRoleByCode(user.roleCode);
      if (found) {
        resolvedRoles = [found];
      } else {
        resolvedRoles = [{ _id: '', name: user.roleName, code: user.roleCode }];
      }
    } else {
      resolvedRoles = [];
      for (const r of (user.roles || [])) {
        const id = r?.toString?.() || r;
        const found = await Role.findById(id).lean().catch(() => null);
        if (found) {
          resolvedRoles.push({ _id: found._id.toString(), name: found.name, code: found.code });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        roles: resolvedRoles,
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
      const { name: roleName, code: roleCode } = await resolveRoleInfoFromDb(body.role);
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
