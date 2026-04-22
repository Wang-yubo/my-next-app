'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  theme,
  Popconfirm,
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
import dayjs from 'dayjs';
import { useEnrollmentDetailModal } from './hooks/useEnrollmentDetailModal';
import { useEnrollmentFormModal } from './hooks/useEnrollmentFormModal';

const { Search } = Input;

interface Enrollment {
  _id: string;
  studentId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  credit: number;
  teacher: string;
  schedule: string;
  classroom: string;
  enrollDate: string;
  status: '已选课' | '已退课';
  key: string;
}

// 状态标签颜色映射
const statusColorMap: Record<string, string> = {
  已选课: 'green',
  已退课: 'default',
};

export default function EnrollmentsPage() {
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const {
    token: { colorText },
  } = theme.useToken();

  // 获取选课列表
  const {
    data: enrollmentsData,
    loading: enrollmentsLoading,
    run: fetchEnrollments,
  } = useRequest(
    async (params = {}) => {
      const { page = 1, pageSize = 10, search = '' } = params as any;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
      });

      const response = await fetch(`/api/enrollments?${queryParams}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || '获取数据失败');
      }

      return result;
    },
    {
      manual: false,
      onSuccess: (result) => {
        // 转换数据格式
        const enrollments = result.data.map((item: any) => ({
          ...item,
          key: item._id,
          enrollDate: dayjs(item.enrollDate).format('YYYY-MM-DD'),
        }));

        setPagination({
          current: result.page,
          pageSize: result.pageSize,
          total: result.total,
        });

        return enrollments;
      },
      defaultParams: [{ page: 1, pageSize: 10, search: '' }],
    }
  );

  // 删除选课
  const { run: deleteEnrollment, loading: deleteLoading } = useRequest(
    async (id: string) => {
      const response = await fetch(`/api/enrollments/${id}`, {
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
        fetchEnrollments({
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
    }
  );

  // 使用自定义 Hook - 详情弹窗
  const { handleView, DetailModal } = useEnrollmentDetailModal();

  // 使用自定义 Hook - 表单弹窗
  const {
    handleAdd,
    handleEdit,
    FormModal,
  } = useEnrollmentFormModal(pagination, searchText, fetchEnrollments);

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchEnrollments({ page: 1, pageSize: pagination.pageSize, search: value });
  };

  // 分页变化
  const handleTableChange = (newPagination: any) => {
    fetchEnrollments({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      search: searchText,
    });
  };

  // 表格列定义
  const columns: ColumnsType<Enrollment> = [
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
      title: '授课教师',
      dataIndex: 'teacher',
      key: 'teacher',
      width: 120,
    },
    {
      title: '上课时间',
      dataIndex: 'schedule',
      key: 'schedule',
      width: 200,
    },
    {
      title: '上课地点',
      dataIndex: 'classroom',
      key: 'classroom',
      width: 150,
    },
    {
      title: '选课日期',
      dataIndex: 'enrollDate',
      key: 'enrollDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
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
      width: 240,
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
            title="确定要退选这门课程吗？"
            description="退课后将释放该课程的选课名额"
            onConfirm={() => deleteEnrollment(record._id)}
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
              退课
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
          学生选课管理
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增选课
        </Button>
      </div>

      {/* 搜索框 */}
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索课程编号、课程名称或授课教师"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={enrollmentsData?.data || []}
        loading={enrollmentsLoading}
        scroll={{ x: 1300 }}
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

      {/* 表单弹窗 */}
      <FormModal />
    </div>
  );
}
