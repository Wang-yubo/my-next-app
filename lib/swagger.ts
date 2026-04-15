import { createSwaggerSpec } from 'next-swagger-doc';
import 'server-only';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: '学生信息管理系统 API',
        description: '提供学生信息的增删改查功能',
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
      ],
    },
  });

  // 手动补充接口文档(因为 next-swagger-doc 无法自动识别 Next.js 路由)
  spec.paths = {
    '/api/students': {
      get: {
        tags: ['学生管理'],
        summary: '获取学生列表',
        description: '分页获取学生列表,支持搜索功能',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码,从 1 开始',
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
            description: '搜索关键字(学号/姓名/专业)',
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
  };

  // 定义数据模型
  spec.components = spec.components || {};
  spec.components.schemas = {
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
  };

  return spec;
};
