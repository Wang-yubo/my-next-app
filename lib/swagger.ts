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
  };

  // 定义数据模型
  (spec as any).components = (spec as any).components || {};
  (spec as any).components.schemas = {
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
