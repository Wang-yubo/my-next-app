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
import { useStudentDetailModal } from './hooks/useStudentDetailModal';
import { useStudentFormModal } from './hooks/useStudentFormModal';

const { Search } = Input;

interface Student {
  _id: string;
  id: string;
  name: string;
  gender: string;
  age: number;
  major: string;
  grade: string;
  phone: string;
  email: string;
  status: '在读' | '休学' | '毕业';
  enrollDate: string;
  key: string;
}

// 状态标签颜色映射
const statusColorMap: Record<string, string> = {
  在读: 'blue',
  休学: 'orange',
  毕业: 'green',
};

export default function StudentsPage() {
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const {
    token: { colorText },
  } = theme.useToken();

  // 获取学生列表
  const {
    data: studentsData,
    loading: studentsLoading,
    run: fetchStudents,
  } = useRequest(
    async (params = {}) => {
      const { page = 1, pageSize = 10, search = '' } = params as any;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
      });

      const response = await fetch(`/api/students?${queryParams}`);
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
        const students = result.data.map((item: any) => ({
          ...item,
          key: item._id,
          enrollDate: dayjs(item.enrollDate).format('YYYY-MM-DD'),
        }));

        setPagination({
          current: result.page,
          pageSize: result.pageSize,
          total: result.total,
        });

        return students;
      },
      defaultParams: [{ page: 1, pageSize: 10, search: '' }],
    }
  );

  // 删除学生
  const { run: deleteStudent, loading: deleteLoading } = useRequest(
    async (id: string) => {
      const response = await fetch(`/api/students/${id}`, {
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
        fetchStudents({
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
    }
  );

  // 使用自定义 Hook - 详情弹窗
  const { handleView, DetailModal } = useStudentDetailModal();

  // 使用自定义 Hook - 表单弹窗
  const {
    handleAdd,
    handleEdit,
    FormModal,
  } = useStudentFormModal(pagination, searchText, fetchStudents);

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchStudents({ page: 1, pageSize: pagination.pageSize, search: value });
  };

  // 分页变化
  const handleTableChange = (newPagination: any) => {
    fetchStudents({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      search: searchText,
    });
  };

  // 表格列定义
  const columns: ColumnsType<Student> = [
    {
      title: '学号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
      width: 200,
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 220,
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
      title: '入学日期',
      dataIndex: 'enrollDate',
      key: 'enrollDate',
      width: 180,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
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
            title="确定要删除该学生吗？"
            description="删除后无法恢复"
            onConfirm={() => deleteStudent(record.id)}
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
          学生信息管理
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增学生
        </Button>
      </div>

      {/* 搜索框 */}
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索学号、姓名或专业"
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
        dataSource={studentsData?.data || []}
        loading={studentsLoading}
        scroll={{ x: 1500 }}
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
