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
  };

  return spec;
};
