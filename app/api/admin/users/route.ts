import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import Teacher from '@/models/Teacher';
import Student from '@/models/Student';
import Role from '@/models/Role';
import bcrypt from 'bcryptjs';

const roleOrder: Record<string, number> = {
  super_admin: 1,
  edu_admin: 2,
  teacher: 3,
  student: 4,
};

async function resolveRoleInfoFromDb(roleId: string): Promise<{ name: string; code: string }> {
  if (!roleId) return { name: '未知', code: '' };
  try {
    const role = await Role.findById(roleId).lean();
    if (role) return { name: role.name, code: role.code };
  } catch {}
  return { name: '未知', code: '' };
}

async function queryAdminUsers(search: string) {
  const query: any = {};
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { nickname: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  const users = await AdminUser.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return Promise.all(users.map(async (u: any) => {
    let roleName = u.roleName;
    let roleCode = u.roleCode;

    if (!roleName || !roleCode) {
      const roleId = u.roles?.[0]?.toString?.() || u.roles?.[0] || '';
      const resolved = await resolveRoleInfoFromDb(roleId);
      roleName = resolved.name;
      roleCode = resolved.code;
    }

    return {
      _id: u._id.toString(),
      displayName: u.nickname || u.username,
      email: u.email,
      username: u.username,
      nickname: u.nickname,
      roleName,
      roleCode,
      sortOrder: roleOrder[roleCode] || 4,
      source: 'admin',
      status: u.status,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }));
}

async function queryTeachers(search: string) {
  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  const teachers = await Teacher.find(query).sort({ createdAt: -1 }).lean();
  return teachers.map((t: any) => ({
    _id: t._id.toString(),
    businessId: t.id,
    displayName: t.name,
    email: t.email,
    roleName: '教师',
    roleCode: 'teacher',
    sortOrder: 3,
    source: 'teacher',
    status: t.status,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));
}

async function queryStudents(search: string) {
  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  const students = await Student.find(query).sort({ createdAt: -1 }).lean();
  return students.map((s: any) => ({
    _id: s._id.toString(),
    businessId: s.id,
    displayName: s.name,
    email: s.email,
    roleName: '学生',
    roleCode: 'student',
    sortOrder: 4,
    source: 'student',
    status: s.status,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';

    const [adminUsers, teachers, students] = await Promise.all([
      queryAdminUsers(search),
      queryTeachers(search),
      queryStudents(search),
    ]);

    const allUsers = [...adminUsers, ...teachers, ...students].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = allUsers.length;
    const skip = (page - 1) * pageSize;
    const data = allUsers.slice(skip, skip + pageSize);

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
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

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const roleId = body.role || '';
    const { name: roleName, code: roleCode } = await resolveRoleInfoFromDb(roleId);

    const user = await AdminUser.create({
      username: body.username,
      password: hashedPassword,
      email: body.email,
      nickname: body.nickname || '',
      status: body.status || 'active',
      roles: roleId ? [roleId] : [],
      roleName,
      roleCode,
    });

    return NextResponse.json({
      success: true,
      data: user,
      message: '创建成功',
    });
  } catch (error: any) {
    console.error('创建用户失败:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: '用户名已存在' },
        { status: 400 } as any
      );
    }
    return NextResponse.json(
      { success: false, message: '创建失败' },
      { status: 500 } as any
    );
  }
}
