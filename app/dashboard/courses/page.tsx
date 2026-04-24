'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Popconfirm,
  theme,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRequest } from 'ahooks';
import { useCourseDetailModal } from './hooks/useCourseDetailModal';
import { useCourseFormModal } from './hooks/useCourseFormModal';

interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  description: string;
  credit: number;
  hours: number;
  semester: string;
  textbook: {
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    price: number;
  };
  teacher: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  classroom: {
    building: string;
    roomNumber: string;
    capacity: number;
    location: string;
  };
  tuition: number;
  maxStudents: number;
  enrolledStudents: number;
  status: '开设中' | '已结课' | '待审核';
  schedule: string;
  prerequisite: string[];
  key: string;
}

// 状态标签颜色映射
const statusColorMap: Record<string, string> = {
  开设中: 'blue',
  已结课: 'green',
  待审核: 'orange',
};

export default function CoursesPage() {
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const {
    token: { colorText },
  } = theme.useToken();

  // 获取课程列表
  const {
    data: coursesData,
    loading: coursesLoading,
    run: fetchCourses,
  } = useRequest(
    async (params: { page?: number; pageSize?: number; search?: string } = {}) => {
      const { page = 1, pageSize = 10, search = '' } = params as any;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
      });

      const response = await fetch(`/api/courses?${queryParams}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || '获取数据失败');
      }

      return result;
    },
    {
      manual: false,
      onSuccess: (result) => {
        const courses = result.data.map((item: any) => ({
          ...item,
          key: item._id,
        }));

        setPagination({
          current: result.page,
          pageSize: result.pageSize,
          total: result.total,
        });

        return courses;
      },
      defaultParams: [{ page: 1, pageSize: 10, search: '' }],
    }
  );

  // 删除课程
  const { run: deleteCourse, loading: deleteLoading } = useRequest(
    async (id: string) => {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || '删除失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        fetchCourses({
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
    }
  );

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchCourses({ page: 1, pageSize: pagination.pageSize, search: value });
  };

  // 分页变化
  const handleTableChange = (newPagination: any) => {
    fetchCourses({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      search: searchText,
    });
  };

  // 使用详情弹窗 Hook
  const { handleView, DetailModal } = useCourseDetailModal();

  // 使用表单弹窗 Hook
  const { handleAdd, handleEdit, FormModal } = useCourseFormModal(
    pagination,
    searchText,
    fetchCourses
  );

  // 表格列定义
  const columns: ColumnsType<Course> = [
    {
      title: '课程编号',
      dataIndex: 'courseCode',
      key: 'courseCode',
      width: 120,
      fixed: 'left',
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
      width: 200,
    },
    {
      title: '学分',
      dataIndex: 'credit',
      key: 'credit',
      width: 80,
    },
    {
      title: '学时',
      dataIndex: 'hours',
      key: 'hours',
      width: 80,
    },
    {
      title: '学期',
      dataIndex: 'semester',
      key: 'semester',
      width: 100,
    },
    {
      title: '授课教师',
      dataIndex: ['teacher', 'name'],
      key: 'teacherName',
      width: 120,
    },
    {
      title: '教师职称',
      dataIndex: ['teacher', 'title'],
      key: 'teacherTitle',
      width: 100,
    },
    {
      title: '教室',
      render: (_, record) =>
        `${record.classroom.building}${record.classroom.roomNumber}`,
      key: 'classroom',
      width: 120,
    },
    {
      title: '学费',
      dataIndex: 'tuition',
      key: 'tuition',
      width: 100,
      render: (value: number) => `¥${value}`,
    },
    {
      title: '已选/最大',
      key: 'students',
      width: 100,
      render: (_, record) =>
        `${record.enrolledStudents}/${record.maxStudents}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该课程吗？"
            description="删除后无法恢复"
            onConfirm={() => deleteCourse(record._id)}
            okText="确定"
            cancelText="取消"
            okButtonProps={{ loading: deleteLoading }}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={deleteLoading}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 页面标题和操作按钮 */}
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: colorText }}>
          课程信息管理
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增课程
        </Button>
      </div>

      {/* 搜索框 */}
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="搜索课程编号、课程名称或教师姓名"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ maxWidth: 500 }}
        />
      </div>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={coursesData?.data || []}
        loading={coursesLoading}
        scroll={{ x: 1800 }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        onChange={handleTableChange}
      />

      {/* 详情弹窗 */}
      <DetailModal />

      {/* 新增/编辑弹窗 */}
      <FormModal />
    </div>
  );
}
