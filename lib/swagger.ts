import { createSwaggerSpec } from 'next-swagger-doc';
import 'server-only';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: '学生信息管理系统 API',
        description: '提供学生信息、课程信息的增删改查功能',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [],
      tags: [
        {
          name: '学生管理',
          description: '学生信息的增删改查接口',
        },
        {
          name: '课程管理',
          description: '课程信息的增删改查接口',
        },
        {
          name: '教师管理',
          description: '教师信息查询接口',
        },
        {
          name: '选课管理',
          description: '学生选课相关接口',
        },
        {
          name: '认证授权',
          description: '用户登录、注册、登出接口',
        },
        {
          name: '仪表盘',
          description: '首页仪表盘统计数据',
        },
        {
          name: '系统管理',
          description: '后台用户管理、角色管理、监控管理等系统级接口',
        },
        {
          name: '个人中心',
          description: '当前登录用户的个人资料、学习笔记、项目经历等',
        },
      ],
    },
  });

  // 手动补充接口文档（因为 next-swagger-doc 无法自动识别 Next.js 路由）
  (spec as any).paths = {
    // ==================== 学生管理接口 ====================
    '/api/students': {
      get: {
        tags: ['学生管理'],
        summary: '获取学生列表',
        description: '分页获取学生列表，支持搜索功能',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码，从 1 开始',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: '每页条数',
            required: false,
            schema: { type: 'integer', default: 10 },
          },
          {
            name: 'search',
            in: 'query',
            description: '搜索关键字（学号/姓名/专业）',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '成功获取学生列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Student' },
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                  },
                },
              },
            },
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      post: {
        tags: ['学生管理'],
        summary: '创建学生',
        description: '新增一个学生信息',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateStudentRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: '创建成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Student' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: '请求参数错误',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    '/api/students/{id}': {
      get: {
        tags: ['学生管理'],
        summary: '获取学生详情',
        description: '根据学号获取学生详细信息',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '学生学号',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '成功获取学生详情',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Student' },
                  },
                },
              },
            },
          },
          404: {
            description: '学生不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      put: {
        tags: ['学生管理'],
        summary: '更新学生信息',
        description: '根据学号更新学生信息',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '学生学号',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateStudentRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: '更新成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Student' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          404: {
            description: '学生不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      delete: {
        tags: ['学生管理'],
        summary: '删除学生',
        description: '根据学号删除学生信息',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '学生学号',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '删除成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          404: {
            description: '学生不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    // ==================== 课程管理接口 ====================
    '/api/courses': {
      get: {
        tags: ['课程管理'],
        summary: '获取课程列表',
        description: '分页获取课程列表，支持搜索功能',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码，从 1 开始',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: '每页条数',
            required: false,
            schema: { type: 'integer', default: 10 },
          },
          {
            name: 'search',
            in: 'query',
            description: '搜索关键字（课程编号/课程名称/教师姓名）',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '成功获取课程列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Course' },
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                  },
                },
              },
            },
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      post: {
        tags: ['课程管理'],
        summary: '创建课程',
        description: '新增一个课程信息，系统自动生成课程编号',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateCourseRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: '创建成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Course' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: '请求参数错误',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    '/api/courses/{id}': {
      get: {
        tags: ['课程管理'],
        summary: '获取课程详情',
        description: '根据课程ID获取课程详细信息',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '课程ID（MongoDB ObjectId）',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '成功获取课程详情',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Course' },
                  },
                },
              },
            },
          },
          404: {
            description: '课程不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      put: {
        tags: ['课程管理'],
        summary: '更新课程信息',
        description: '根据课程ID更新课程信息',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '课程ID（MongoDB ObjectId）',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateCourseRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: '更新成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Course' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          404: {
            description: '课程不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      delete: {
        tags: ['课程管理'],
        summary: '删除课程',
        description: '根据课程ID删除课程信息',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '课程ID（MongoDB ObjectId）',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '删除成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          404: {
            description: '课程不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    '/api/enrollments/check-duplicate': {
      get: {
        tags: ['选课管理'],
        summary: '检查重复选课',
        description: '检查当前学生是否已选某门课程（需要登录）',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'courseId',
            in: 'query',
            required: true,
            description: '课程ID（MongoDB ObjectId）',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '检查成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    isDuplicate: { type: 'boolean', description: '是否重复选课' },
                  },
                },
              },
            },
          },
          400: {
            description: '缺少课程ID参数',
          },
          401: {
            description: '未登录或登录已过期',
          },
          403: {
            description: '只有学生可以选课',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    // ==================== 认证授权接口 ====================
    '/api/login': {
      post: {
        tags: ['认证授权'],
        summary: '用户登录',
        description: '学生或教师登录系统，支持学号/工号或邮箱登录',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: '登录成功',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse',
                },
              },
            },
          },
          400: {
            description: '请求参数错误',
          },
          401: {
            description: '用户名或密码错误',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    '/api/register': {
      post: {
        tags: ['认证授权'],
        summary: '用户注册',
        description: '学生或教师注册新账户',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  { $ref: '#/components/schemas/StudentRegisterRequest' },
                  { $ref: '#/components/schemas/TeacherRegisterRequest' },
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: '注册成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { type: 'object' },
                  },
                },
              },
            },
          },
          400: {
            description: '请求参数错误',
          },
          409: {
            description: '邮箱或身份证号已被注册',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    '/api/logout': {
      post: {
        tags: ['认证授权'],
        summary: '退出登录',
        description: '清除登录状态和 Cookie',
        responses: {
          200: {
            description: '退出成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    // ==================== 教师管理接口 ====================
    '/api/teachers': {
      get: {
        tags: ['教师管理'],
        summary: '获取教师列表',
        description: '分页获取教师列表，支持搜索功能',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码，从 1 开始',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: '每页条数',
            required: false,
            schema: { type: 'integer', default: 100 },
          },
          {
            name: 'search',
            in: 'query',
            description: '搜索关键字（工号/姓名/院系）',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '成功获取教师列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Teacher' },
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                  },
                },
              },
            },
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    '/api/teachers/{id}': {
      put: {
        tags: ['教师管理'],
        summary: '更新教师信息',
        description: '根据工号更新教师状态或密码',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '教师工号',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateTeacherRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: '更新成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Teacher' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          404: {
            description: '教师不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    // ==================== 选课管理接口 ====================
    '/api/enrollments': {
      get: {
        tags: ['选课管理'],
        summary: '获取选课列表',
        description: '根据当前登录用户身份获取选课列表（需要登录）',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码，从 1 开始',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: '每页条数',
            required: false,
            schema: { type: 'integer', default: 10 },
          },
          {
            name: 'search',
            in: 'query',
            description: '搜索关键字（课程编号/课程名称/教师姓名）',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'studentId',
            in: 'query',
            description: '学生ID（用于检查重复选课）',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'courseId',
            in: 'query',
            description: '课程ID（用于检查重复选课）',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '成功获取选课列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Enrollment' },
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                  },
                },
              },
            },
          },
          401: {
            description: '未登录或登录已过期',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      post: {
        tags: ['选课管理'],
        summary: '创建选课',
        description: '学生选择课程（需要登录，自动从 Token 获取学生信息）',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateEnrollmentRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: '选课成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Enrollment' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: '课程已满员或已选过该课程',
          },
          401: {
            description: '未登录或登录已过期',
          },
          403: {
            description: '只有学生可以选课',
          },
          404: {
            description: '课程不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    '/api/enrollments/{id}': {
      put: {
        tags: ['选课管理'],
        summary: '更新选课',
        description: '修改选课记录（更换课程）',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '选课记录ID（MongoDB ObjectId）',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateEnrollmentRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: '更新成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Enrollment' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: '课程已满员或已选过该课程',
          },
          404: {
            description: '选课记录或课程不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      delete: {
        tags: ['选课管理'],
        summary: '删除选课（退课）',
        description: '删除选课记录并减少课程已选人数',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '选课记录ID（MongoDB ObjectId）',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '退课成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          404: {
            description: '选课记录不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    // ==================== 仪表盘接口 ====================
    '/api/dashboard/stats': {
      get: {
        tags: ['仪表盘'],
        summary: '获取仪表盘统计数据',
        description: '获取首页仪表盘展示的各项统计数据，包括学生/教师/课程/选课总数、年级性别分布、最近选课记录',
        responses: {
          200: {
            description: '成功获取统计数据',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/DashboardStats' },
                  },
                },
              },
            },
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    // ==================== 后台用户管理接口 ====================
    '/api/admin/users': {
      get: {
        tags: ['系统管理'],
        summary: '获取用户列表',
        description: '分页获取后台用户列表，支持搜索功能，数据来源包括管理员、教师和学生',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码，从 1 开始',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: '每页条数',
            required: false,
            schema: { type: 'integer', default: 10 },
          },
          {
            name: 'search',
            in: 'query',
            description: '搜索关键字（用户名/昵称/邮箱）',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '成功获取用户列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/AdminUser' },
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                  },
                },
              },
            },
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      post: {
        tags: ['系统管理'],
        summary: '创建用户',
        description: '新增一个后台管理用户',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateAdminUserRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: '创建成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/AdminUser' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: '请求参数错误（如用户名已存在）',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    '/api/admin/users/{id}': {
      get: {
        tags: ['系统管理'],
        summary: '获取用户详情',
        description: '根据ID获取后台用户详细信息',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '用户MongoDB ID',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '成功获取用户详情',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/AdminUser' },
                  },
                },
              },
            },
          },
          404: {
            description: '用户不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      put: {
        tags: ['系统管理'],
        summary: '更新用户信息',
        description: '根据ID更新后台用户信息，支持修改邮箱、昵称、状态、角色和密码',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '用户MongoDB ID',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateAdminUserRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: '更新成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/AdminUser' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          404: {
            description: '用户不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      delete: {
        tags: ['系统管理'],
        summary: '禁用用户',
        description: '根据ID禁用后台用户（软删除，将状态设置为 disabled）',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '用户MongoDB ID',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '禁用成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          404: {
            description: '用户不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    // ==================== 角色管理接口 ====================
    '/api/admin/roles': {
      get: {
        tags: ['系统管理'],
        summary: '获取角色列表',
        description: '分页获取角色列表，支持搜索功能',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码，从 1 开始',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: '每页条数',
            required: false,
            schema: { type: 'integer', default: 10 },
          },
          {
            name: 'search',
            in: 'query',
            description: '搜索关键字（角色名称/角色编码）',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '成功获取角色列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Role' },
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                  },
                },
              },
            },
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      post: {
        tags: ['系统管理'],
        summary: '创建角色',
        description: '新增一个系统角色',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateRoleRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: '创建成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Role' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: '请求参数错误（如角色编码已存在）',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    '/api/admin/roles/{id}': {
      get: {
        tags: ['系统管理'],
        summary: '获取角色详情',
        description: '根据ID获取角色详细信息',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '角色MongoDB ID',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '成功获取角色详情',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Role' },
                  },
                },
              },
            },
          },
          404: {
            description: '角色不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      put: {
        tags: ['系统管理'],
        summary: '更新角色信息',
        description: '根据ID更新角色信息',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '角色MongoDB ID',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateRoleRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: '更新成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Role' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: '请求参数错误（如角色编码已存在）',
          },
          404: {
            description: '角色不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
      delete: {
        tags: ['系统管理'],
        summary: '停用角色',
        description: '根据ID停用角色（超级管理员角色不能被停用）',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '角色MongoDB ID',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '停用成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: '超级管理员角色不能被停用',
          },
          404: {
            description: '角色不存在',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    // ==================== 监控管理接口 ====================
    '/api/admin/monitor/stats': {
      get: {
        tags: ['系统管理'],
        summary: '获取监控统计数据',
        description: '获取系统监控面板的统计数据，包括今日登录/登出次数、总日志数、最近登录信息',
        responses: {
          200: {
            description: '成功获取监控统计',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/MonitorStats' },
                  },
                },
              },
            },
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    '/api/admin/monitor/logs': {
      get: {
        tags: ['系统管理'],
        summary: '获取活动日志列表',
        description: '分页获取系统活动日志，支持按操作类型和关键字搜索',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码，从 1 开始',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: '每页条数',
            required: false,
            schema: { type: 'integer', default: 20 },
          },
          {
            name: 'action',
            in: 'query',
            description: '操作类型筛选（login/logout）',
            required: false,
            schema: { type: 'string', enum: ['login', 'logout'] },
          },
          {
            name: 'search',
            in: 'query',
            description: '搜索关键字（用户名/姓名）',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '成功获取活动日志',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ActivityLog' },
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                  },
                },
              },
            },
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
    // ==================== 个人中心接口 ====================
    '/api/user/profile': {
      get: {
        tags: ['个人中心'],
        summary: '获取个人资料',
        description: '获取当前登录用户的个人资料、学习笔记、项目经历、心得体会及学习统计（需要登录）',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: '成功获取个人资料',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/UserProfile' },
                  },
                },
              },
            },
          },
          401: {
            description: '未登录或登录已过期',
          },
          500: {
            description: '服务器错误',
          },
        },
      },
    },
  };

  // 定义数据模型
  (spec as any).components = (spec as any).components || {};
  (spec as any).components.schemas = {
    // ==================== 认证授权数据模型 ====================
    LoginRequest: {
      type: 'object',
      required: ['username', 'password', 'role'],
      properties: {
        username: { type: 'string', description: '用户名（学号/工号或邮箱）' },
        password: { type: 'string', format: 'password', description: '密码' },
        role: { type: 'string', enum: ['student', 'teacher'], description: '角色类型' },
      },
    },
    LoginResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', description: '用户ID（学号/工号）' },
                name: { type: 'string', description: '姓名' },
                email: { type: 'string', format: 'email', description: '邮箱' },
                role: { type: 'string', enum: ['student', 'teacher'], description: '角色' },
              },
            },
          },
        },
      },
    },
    RegisterRequest: {
      type: 'object',
      required: ['role', 'name', 'email', 'phone', 'password'],
      properties: {
        role: { type: 'string', enum: ['student', 'teacher'], description: '角色类型' },
        name: { type: 'string', description: '姓名' },
        email: { type: 'string', format: 'email', description: '邮箱' },
        phone: { type: 'string', description: '手机号' },
        password: { type: 'string', format: 'password', description: '密码（至少6位）' },
        gender: { type: 'string', enum: ['男', '女'], description: '性别' },
        age: { type: 'integer', minimum: 1, maximum: 100, description: '年龄' },
      },
    },
    StudentRegisterRequest: {
      allOf: [
        { $ref: '#/components/schemas/RegisterRequest' },
        {
          type: 'object',
          required: ['idCard', 'major', 'className', 'grade', 'enrollDate'],
          properties: {
            idCard: { type: 'string', description: '身份证号' },
            major: { type: 'string', description: '专业' },
            className: { type: 'string', description: '班级' },
            grade: { type: 'string', description: '年级' },
            enrollDate: { type: 'string', format: 'date', description: '入学日期' },
          },
        },
      ],
    },
    TeacherRegisterRequest: {
      allOf: [
        { $ref: '#/components/schemas/RegisterRequest' },
        {
          type: 'object',
          required: ['department', 'researchArea', 'officeLocation', 'title', 'education', 'hireDate'],
          properties: {
            department: { type: 'string', description: '所属院系' },
            researchArea: { type: 'string', description: '研究方向' },
            officeLocation: { type: 'string', description: '办公地点' },
            title: { type: 'string', enum: ['教授', '副教授', '讲师', '助教'], description: '职称' },
            education: { type: 'string', enum: ['博士', '硕士', '本科'], description: '学历' },
            hireDate: { type: 'string', format: 'date', description: '入职日期' },
          },
        },
      ],
    },
    // ==================== 教师管理数据模型 ====================
    Teacher: {
      type: 'object',
      properties: {
        _id: { type: 'string', description: 'MongoDB ID' },
        id: { type: 'string', description: '工号' },
        name: { type: 'string', description: '姓名' },
        gender: { type: 'string', enum: ['男', '女'], description: '性别' },
        age: { type: 'integer', description: '年龄' },
        department: { type: 'string', description: '所属院系' },
        researchArea: { type: 'string', description: '研究方向' },
        officeLocation: { type: 'string', description: '办公地点' },
        title: { type: 'string', enum: ['教授', '副教授', '讲师', '助教'], description: '职称' },
        phone: { type: 'string', description: '联系电话' },
        email: { type: 'string', format: 'email', description: '邮箱' },
        education: { type: 'string', enum: ['博士', '硕士', '本科'], description: '学历' },
        hireDate: { type: 'string', format: 'date', description: '入职日期' },
        status: { type: 'string', enum: ['在职', '离职', '休假'], description: '工作状态' },
        createdAt: { type: 'string', format: 'date-time', description: '创建时间' },
        updatedAt: { type: 'string', format: 'date-time', description: '更新时间' },
      },
    },
    UpdateTeacherRequest: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['在职', '离职', '休假'], description: '工作状态' },
        password: { type: 'string', format: 'password', description: '新密码（可选，不填则不修改）' },
      },
    },
    // ==================== 选课管理数据模型 ====================
    Enrollment: {
      type: 'object',
      properties: {
        _id: { type: 'string', description: 'MongoDB ID' },
        studentId: { type: 'string', description: '学生学号' },
        courseId: { type: 'string', description: '课程ID' },
        courseCode: { type: 'string', description: '课程编号' },
        courseName: { type: 'string', description: '课程名称' },
        credit: { type: 'integer', description: '学分' },
        teacher: { type: 'string', description: '授课教师' },
        schedule: { type: 'string', description: '上课时间' },
        classroom: { type: 'string', description: '上课教室' },
        enrollDate: { type: 'string', format: 'date-time', description: '选课日期' },
        status: { type: 'string', enum: ['已选课', '已退课'], description: '选课状态' },
        createdAt: { type: 'string', format: 'date-time', description: '创建时间' },
        updatedAt: { type: 'string', format: 'date-time', description: '更新时间' },
      },
    },
    CreateEnrollmentRequest: {
      type: 'object',
      required: ['courseId'],
      properties: {
        courseId: { type: 'string', description: '课程ID（MongoDB ObjectId）' },
      },
    },
    UpdateEnrollmentRequest: {
      type: 'object',
      properties: {
        courseId: { type: 'string', description: '新课程ID（用于更换课程）' },
      },
    },
    // ==================== 学生管理数据模型 ====================
    Student: {
      type: 'object',
      properties: {
        _id: { type: 'string', description: 'MongoDB ID' },
        id: { type: 'string', description: '学号' },
        name: { type: 'string', description: '姓名' },
        gender: { type: 'string', enum: ['男', '女'], description: '性别' },
        age: { type: 'integer', description: '年龄' },
        major: { type: 'string', description: '专业' },
        grade: { type: 'string', description: '年级' },
        phone: { type: 'string', description: '联系电话' },
        email: { type: 'string', format: 'email', description: '邮箱' },
        status: {
          type: 'string',
          enum: ['在读', '休学', '毕业'],
          description: '状态',
        },
        enrollDate: { type: 'string', format: 'date', description: '入学日期' },
        createdAt: { type: 'string', format: 'date-time', description: '创建时间' },
        updatedAt: { type: 'string', format: 'date-time', description: '更新时间' },
      },
    },
    CreateStudentRequest: {
      type: 'object',
      required: ['name', 'gender', 'age', 'major', 'grade', 'phone', 'email'],
      properties: {
        name: { type: 'string', description: '姓名' },
        gender: { type: 'string', enum: ['男', '女'], description: '性别' },
        age: { type: 'integer', minimum: 1, maximum: 100, description: '年龄' },
        major: { type: 'string', description: '专业' },
        grade: { type: 'string', description: '年级' },
        phone: { type: 'string', description: '联系电话' },
        email: { type: 'string', format: 'email', description: '邮箱' },
        status: {
          type: 'string',
          enum: ['在读', '休学', '毕业'],
          default: '在读',
          description: '状态',
        },
        enrollDate: { type: 'string', format: 'date', description: '入学日期' },
      },
    },
    UpdateStudentRequest: {
      type: 'object',
      properties: {
        name: { type: 'string', description: '姓名' },
        gender: { type: 'string', enum: ['男', '女'], description: '性别' },
        age: { type: 'integer', minimum: 1, maximum: 100, description: '年龄' },
        major: { type: 'string', description: '专业' },
        grade: { type: 'string', description: '年级' },
        phone: { type: 'string', description: '联系电话' },
        email: { type: 'string', format: 'email', description: '邮箱' },
        status: {
          type: 'string',
          enum: ['在读', '休学', '毕业'],
          description: '状态',
        },
        enrollDate: { type: 'string', format: 'date', description: '入学日期' },
      },
    },
    // ==================== 课程管理数据模型 ====================
    Course: {
      type: 'object',
      properties: {
        _id: { type: 'string', description: 'MongoDB ID' },
        courseCode: { type: 'string', description: '课程编号' },
        courseName: { type: 'string', description: '课程名称' },
        description: { type: 'string', description: '课程简介' },
        credit: { type: 'integer', minimum: 1, maximum: 6, description: '学分' },
        hours: { type: 'integer', description: '学时' },
        semester: { type: 'string', description: '学期' },
        textbook: {
          type: 'object',
          description: '教材信息',
          properties: {
            title: { type: 'string', description: '教材名称' },
            author: { type: 'string', description: '作者' },
            publisher: { type: 'string', description: '出版社' },
            isbn: { type: 'string', description: 'ISBN' },
            price: { type: 'number', description: '价格' },
          },
        },
        teacher: {
          type: 'object',
          description: '教师信息',
          properties: {
            name: { type: 'string', description: '教师姓名' },
            title: { type: 'string', description: '职称' },
            email: { type: 'string', format: 'email', description: '邮箱' },
            phone: { type: 'string', description: '电话' },
          },
        },
        classroom: {
          type: 'object',
          description: '教室信息',
          properties: {
            building: { type: 'string', description: '教学楼' },
            roomNumber: { type: 'string', description: '教室号' },
            capacity: { type: 'integer', description: '容量' },
            location: { type: 'string', description: '位置' },
          },
        },
        tuition: { type: 'number', description: '学费' },
        maxStudents: { type: 'integer', description: '最大人数' },
        enrolledStudents: { type: 'integer', description: '已选人数' },
        status: {
          type: 'string',
          enum: ['开设中', '已结课', '待审核'],
          description: '课程状态',
        },
        schedule: { type: 'string', description: '上课时间' },
        prerequisite: {
          type: 'array',
          items: { type: 'string' },
          description: '先修课程',
        },
        createdAt: { type: 'string', format: 'date-time', description: '创建时间' },
        updatedAt: { type: 'string', format: 'date-time', description: '更新时间' },
      },
    },
    CreateCourseRequest: {
      type: 'object',
      required: [
        'courseName',
        'description',
        'credit',
        'hours',
        'semester',
        'textbook',
        'teacher',
        'classroom',
        'tuition',
        'maxStudents',
        'schedule',
      ],
      properties: {
        courseName: { type: 'string', description: '课程名称' },
        description: { type: 'string', description: '课程简介' },
        credit: { type: 'integer', minimum: 1, maximum: 6, description: '学分' },
        hours: { type: 'integer', description: '学时' },
        semester: { type: 'string', description: '学期' },
        textbook: {
          type: 'object',
          description: '教材信息',
          required: ['title', 'author', 'publisher', 'isbn', 'price'],
          properties: {
            title: { type: 'string', description: '教材名称' },
            author: { type: 'string', description: '作者' },
            publisher: { type: 'string', description: '出版社' },
            isbn: { type: 'string', description: 'ISBN' },
            price: { type: 'number', minimum: 0, description: '价格' },
          },
        },
        teacher: {
          type: 'object',
          description: '教师信息',
          required: ['name', 'title', 'email', 'phone'],
          properties: {
            name: { type: 'string', description: '教师姓名' },
            title: { type: 'string', description: '职称' },
            email: { type: 'string', format: 'email', description: '邮箱' },
            phone: { type: 'string', description: '电话' },
          },
        },
        classroom: {
          type: 'object',
          description: '教室信息',
          required: ['building', 'roomNumber', 'capacity', 'location'],
          properties: {
            building: { type: 'string', description: '教学楼' },
            roomNumber: { type: 'string', description: '教室号' },
            capacity: { type: 'integer', minimum: 1, description: '容量' },
            location: { type: 'string', description: '位置' },
          },
        },
        tuition: { type: 'number', minimum: 0, description: '学费' },
        maxStudents: { type: 'integer', minimum: 1, description: '最大人数' },
        enrolledStudents: {
          type: 'integer',
          minimum: 0,
          default: 0,
          description: '已选人数',
        },
        status: {
          type: 'string',
          enum: ['开设中', '已结课', '待审核'],
          default: '开设中',
          description: '课程状态',
        },
        schedule: { type: 'string', description: '上课时间' },
        prerequisite: {
          type: 'array',
          items: { type: 'string' },
          description: '先修课程',
        },
      },
    },
    UpdateCourseRequest: {
      type: 'object',
      properties: {
        courseName: { type: 'string', description: '课程名称' },
        description: { type: 'string', description: '课程简介' },
        credit: { type: 'integer', minimum: 1, maximum: 6, description: '学分' },
        hours: { type: 'integer', description: '学时' },
        semester: { type: 'string', description: '学期' },
        textbook: {
          type: 'object',
          description: '教材信息',
          properties: {
            title: { type: 'string', description: '教材名称' },
            author: { type: 'string', description: '作者' },
            publisher: { type: 'string', description: '出版社' },
            isbn: { type: 'string', description: 'ISBN' },
            price: { type: 'number', minimum: 0, description: '价格' },
          },
        },
        teacher: {
          type: 'object',
          description: '教师信息',
          properties: {
            name: { type: 'string', description: '教师姓名' },
            title: { type: 'string', description: '职称' },
            email: { type: 'string', format: 'email', description: '邮箱' },
            phone: { type: 'string', description: '电话' },
          },
        },
        classroom: {
          type: 'object',
          description: '教室信息',
          properties: {
            building: { type: 'string', description: '教学楼' },
            roomNumber: { type: 'string', description: '教室号' },
            capacity: { type: 'integer', minimum: 1, description: '容量' },
            location: { type: 'string', description: '位置' },
          },
        },
        tuition: { type: 'number', minimum: 0, description: '学费' },
        maxStudents: { type: 'integer', minimum: 1, description: '最大人数' },
        enrolledStudents: {
          type: 'integer',
          minimum: 0,
          description: '已选人数',
        },
        status: {
          type: 'string',
          enum: ['开设中', '已结课', '待审核'],
          description: '课程状态',
        },
        schedule: { type: 'string', description: '上课时间' },
        prerequisite: {
          type: 'array',
          items: { type: 'string' },
          description: '先修课程',
        },
      },
    },
    // ==================== 仪表盘数据模型 ====================
    DashboardStats: {
      type: 'object',
      properties: {
        studentTotal: { type: 'integer', description: '学生总数' },
        teacherTotal: { type: 'integer', description: '教师总数' },
        courseTotal: { type: 'integer', description: '课程总数' },
        enrollmentTotal: { type: 'integer', description: '选课总数（已选课）' },
        studentsByGrade: {
          type: 'array',
          description: '各年级学生分布',
          items: {
            type: 'object',
            properties: {
              grade: { type: 'string', description: '年级' },
              count: { type: 'integer', description: '人数' },
            },
          },
        },
        studentsByGender: {
          type: 'array',
          description: '各性别学生分布',
          items: {
            type: 'object',
            properties: {
              gender: { type: 'string', enum: ['男', '女'], description: '性别' },
              count: { type: 'integer', description: '人数' },
            },
          },
        },
        recentEnrollments: {
          type: 'array',
          description: '最近选课记录（8条）',
          items: { $ref: '#/components/schemas/Enrollment' },
        },
      },
    },
    // ==================== 系统管理数据模型 ====================
    Role: {
      type: 'object',
      properties: {
        _id: { type: 'string', description: 'MongoDB ID' },
        name: { type: 'string', description: '角色名称' },
        code: { type: 'string', description: '角色编码' },
        description: { type: 'string', description: '角色描述' },
        status: { type: 'string', enum: ['active', 'disabled'], description: '状态' },
        permissions: {
          type: 'array',
          items: { type: 'string' },
          description: '权限编码列表',
        },
        sort: { type: 'integer', description: '排序值' },
        createdAt: { type: 'string', format: 'date-time', description: '创建时间' },
        updatedAt: { type: 'string', format: 'date-time', description: '更新时间' },
      },
    },
    CreateRoleRequest: {
      type: 'object',
      required: ['name', 'code'],
      properties: {
        name: { type: 'string', description: '角色名称' },
        code: { type: 'string', description: '角色编码（唯一）' },
        description: { type: 'string', description: '角色描述' },
        status: { type: 'string', enum: ['active', 'disabled'], default: 'active', description: '状态' },
        permissions: {
          type: 'array',
          items: { type: 'string' },
          description: '权限编码列表',
        },
        sort: { type: 'integer', default: 0, description: '排序值' },
      },
    },
    UpdateRoleRequest: {
      type: 'object',
      properties: {
        name: { type: 'string', description: '角色名称' },
        code: { type: 'string', description: '角色编码（唯一）' },
        description: { type: 'string', description: '角色描述' },
        status: { type: 'string', enum: ['active', 'disabled'], description: '状态' },
        permissions: {
          type: 'array',
          items: { type: 'string' },
          description: '权限编码列表',
        },
        sort: { type: 'integer', description: '排序值' },
      },
    },
    AdminUser: {
      type: 'object',
      properties: {
        _id: { type: 'string', description: 'MongoDB ID' },
        displayName: { type: 'string', description: '显示名称（昵称或用户名）' },
        username: { type: 'string', description: '用户名' },
        nickname: { type: 'string', description: '昵称' },
        email: { type: 'string', format: 'email', description: '邮箱' },
        roleName: { type: 'string', description: '角色名称' },
        roleCode: { type: 'string', description: '角色编码' },
        source: { type: 'string', enum: ['admin', 'teacher', 'student'], description: '用户来源' },
        status: { type: 'string', enum: ['active', 'disabled'], description: '状态' },
        createdAt: { type: 'string', format: 'date-time', description: '创建时间' },
        updatedAt: { type: 'string', format: 'date-time', description: '更新时间' },
      },
    },
    CreateAdminUserRequest: {
      type: 'object',
      required: ['username', 'password', 'email', 'role'],
      properties: {
        username: { type: 'string', description: '用户名' },
        password: { type: 'string', format: 'password', description: '密码' },
        email: { type: 'string', format: 'email', description: '邮箱' },
        nickname: { type: 'string', description: '昵称（可选）' },
        role: { type: 'string', description: '角色MongoDB ID' },
        status: { type: 'string', enum: ['active', 'disabled'], default: 'active', description: '状态' },
      },
    },
    UpdateAdminUserRequest: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', description: '邮箱' },
        nickname: { type: 'string', description: '昵称' },
        status: { type: 'string', enum: ['active', 'disabled'], description: '状态' },
        role: { type: 'string', description: '角色MongoDB ID' },
        password: { type: 'string', format: 'password', description: '新密码（可选，不填则不修改）' },
      },
    },
    ActivityLog: {
      type: 'object',
      properties: {
        _id: { type: 'string', description: 'MongoDB ID' },
        userId: { type: 'string', description: '用户ID' },
        username: { type: 'string', description: '用户名' },
        name: { type: 'string', description: '姓名' },
        role: { type: 'string', enum: ['student', 'teacher', 'admin'], description: '角色' },
        action: { type: 'string', enum: ['login', 'logout'], description: '操作类型' },
        ip: { type: 'string', description: 'IP地址' },
        userAgent: { type: 'string', description: '用户代理信息' },
        createdAt: { type: 'string', format: 'date-time', description: '创建时间' },
      },
    },
    MonitorStats: {
      type: 'object',
      properties: {
        todayLogin: { type: 'integer', description: '今日登录次数' },
        todayLogout: { type: 'integer', description: '今日登出次数' },
        totalLogs: { type: 'integer', description: '日志总记录数' },
        lastLoginAt: { type: 'string', format: 'date-time', nullable: true, description: '最近登录时间' },
        lastLoginUser: {
          type: 'object',
          nullable: true,
          description: '最近登录用户信息',
          properties: {
            name: { type: 'string', description: '用户姓名' },
            role: { type: 'string', description: '用户角色' },
          },
        },
      },
    },
    // ==================== 个人中心数据模型 ====================
    StudentNote: {
      type: 'object',
      properties: {
        _id: { type: 'string', description: 'MongoDB ID' },
        studentId: { type: 'string', description: '学生学号' },
        title: { type: 'string', description: '笔记标题' },
        content: { type: 'string', description: '笔记内容' },
        courseName: { type: 'string', description: '关联课程名称' },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: '标签列表',
        },
        createdAt: { type: 'string', format: 'date-time', description: '创建时间' },
        updatedAt: { type: 'string', format: 'date-time', description: '更新时间' },
      },
    },
    ProjectExperience: {
      type: 'object',
      properties: {
        _id: { type: 'string', description: 'MongoDB ID' },
        studentId: { type: 'string', description: '学生学号' },
        projectName: { type: 'string', description: '项目名称' },
        description: { type: 'string', description: '项目描述' },
        role: { type: 'string', description: '担任角色' },
        technologies: {
          type: 'array',
          items: { type: 'string' },
          description: '技术栈列表',
        },
        startDate: { type: 'string', format: 'date', description: '开始时间' },
        endDate: { type: 'string', format: 'date', nullable: true, description: '结束时间' },
        isOngoing: { type: 'boolean', description: '是否进行中' },
        achievements: { type: 'string', description: '项目成果' },
        githubUrl: { type: 'string', format: 'uri', description: 'GitHub链接' },
        demoUrl: { type: 'string', format: 'uri', nullable: true, description: '演示链接' },
        createdAt: { type: 'string', format: 'date-time', description: '创建时间' },
        updatedAt: { type: 'string', format: 'date-time', description: '更新时间' },
      },
    },
    Reflection: {
      type: 'object',
      properties: {
        _id: { type: 'string', description: 'MongoDB ID' },
        studentId: { type: 'string', description: '学生学号' },
        title: { type: 'string', description: '心得标题' },
        content: { type: 'string', description: '心得内容' },
        category: {
          type: 'string',
          enum: ['学习感悟', '生活随笔', '职业规划', '其他'],
          description: '分类',
        },
        mood: {
          type: 'string',
          enum: ['开心', '平静', '思考', '困惑', '兴奋'],
          description: '心情标签',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: '标签列表',
        },
        coverImage: { type: 'string', nullable: true, description: '封面图片' },
        isPublished: { type: 'boolean', description: '是否公开' },
        viewCount: { type: 'integer', description: '浏览次数' },
        createdAt: { type: 'string', format: 'date-time', description: '创建时间' },
        updatedAt: { type: 'string', format: 'date-time', description: '更新时间' },
      },
    },
    LearningStats: {
      type: 'object',
      properties: {
        totalCourses: { type: 'integer', description: '已修课程数' },
        averageScore: { type: 'number', description: '平均成绩' },
        totalCredits: { type: 'integer', description: '总学分' },
        noteCount: { type: 'integer', description: '笔记数量' },
        projectCount: { type: 'integer', description: '项目数量' },
        reflectionCount: { type: 'integer', description: '心得体会数量' },
      },
    },
    UserProfile: {
      type: 'object',
      properties: {
        student: { $ref: '#/components/schemas/Student' },
        notes: {
          type: 'array',
          description: '学习笔记列表',
          items: { $ref: '#/components/schemas/StudentNote' },
        },
        projects: {
          type: 'array',
          description: '项目经历列表',
          items: { $ref: '#/components/schemas/ProjectExperience' },
        },
        reflections: {
          type: 'array',
          description: '心得体会列表',
          items: { $ref: '#/components/schemas/Reflection' },
        },
        stats: { $ref: '#/components/schemas/LearningStats' },
      },
    },
  };

  return spec;
};
