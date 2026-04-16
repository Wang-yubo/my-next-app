'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  DatePicker,
  Select,
  message,
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
import dayjs from 'dayjs';

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

interface StudentFormData {
  name: string;
  gender: string;
  age: number;
  major: string;
  grade: string;
  phone: string;
  email: string;
  status: '在读' | '休学' | '毕业';
  enrollDate: dayjs.Dayjs | null;
}

// 状态标签颜色映射
const statusColorMap: Record<string, string> = {
  在读: 'blue',
  休学: 'orange',
  毕业: 'green',
};

export default function StudentsPage() {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm<StudentFormData>();
  
  const {
    token: { colorText, colorTextSecondary },
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

  // 创建学生
  const { run: createStudent, loading: createLoading } = useRequest(
    async (data: StudentFormData) => {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          age: parseInt(String(data.age)),
          enrollDate: data.enrollDate?.toISOString() || new Date().toISOString(),
        }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || '创建失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('添加成功');
        setIsModalVisible(false);
        form.resetFields();
        setEditingStudent(null);
        fetchStudents({
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
      onError: (error) => {
        message.error(error.message || '创建失败');
      },
    }
  );

  // 更新学生
  const { run: updateStudent, loading: updateLoading } = useRequest(
    async ({ id, data }: { id: string; data: StudentFormData }) => {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          age: parseInt(String(data.age)),
          enrollDate: data.enrollDate?.toISOString() || new Date().toISOString(),
        }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || '更新失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('编辑成功');
        setIsModalVisible(false);
        form.resetFields();
        setEditingStudent(null);
        fetchStudents({
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
      onError: (error) => {
        message.error(error.message || '更新失败');
      },
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
        message.success('删除成功');
        fetchStudents({
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
      onError: (error) => {
        message.error(error.message || '删除失败');
      },
    }
  );

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

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record: Student) => {
    setEditingStudent(record);
    form.setFieldsValue({
      name: record.name,
      gender: record.gender,
      age: record.age,
      major: record.major,
      grade: record.grade,
      phone: record.phone,
      email: record.email,
      status: record.status,
      enrollDate: record.enrollDate ? dayjs(record.enrollDate) : null,
    });
    setIsModalVisible(true);
  };

  // 查看学生详情
  const handleView = (record: Student) => {
    Modal.info({
      title: '学生详情',
      width: 600,
      content: (
        <div style={{ marginTop: 16, lineHeight: 2 }}>
          <p>
            <strong>学号：</strong>
            {record.id}
          </p>
          <p>
            <strong>姓名：</strong>
            {record.name}
          </p>
          <p>
            <strong>性别：</strong>
            {record.gender}
          </p>
          <p>
            <strong>年龄：</strong>
            {record.age}
          </p>
          <p>
            <strong>专业：</strong>
            {record.major}
          </p>
          <p>
            <strong>年级：</strong>
            {record.grade}
          </p>
          <p>
            <strong>联系电话：</strong>
            {record.phone}
          </p>
          <p>
            <strong>邮箱：</strong>
            {record.email}
          </p>
          <p>
            <strong>状态：</strong>
            <Tag color={statusColorMap[record.status]}>{record.status}</Tag>
          </p>
          <p>
            <strong>入学日期：</strong>
            {record.enrollDate}
          </p>
        </div>
      ),
      okText: '关闭',
    });
  };

  // 表单提交
  const handleSubmit = async (values: StudentFormData) => {
    if (editingStudent) {
      updateStudent({ id: editingStudent.id, data: values });
    } else {
      createStudent(values);
    }
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
      width: 200,
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
      width: 120,
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

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingStudent ? '编辑学生' : '新增学生'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingStudent(null);
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
          autoComplete="off"
        >
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            label="性别"
            name="gender"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select placeholder="请选择性别">
              <Select.Option value="男">男</Select.Option>
              <Select.Option value="女">女</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="年龄"
            name="age"
            rules={[
              { required: true, message: '请输入年龄' },
            ]}
          >
            <Input type="number" placeholder="请输入年龄" min={1} max={100} />
          </Form.Item>

          <Form.Item
            label="专业"
            name="major"
            rules={[{ required: true, message: '请输入专业' }]}
          >
            <Input placeholder="请输入专业" />
          </Form.Item>

          <Form.Item
            label="年级"
            name="grade"
            rules={[{ required: true, message: '请输入年级' }]}
          >
            <Input placeholder="如：2024级" />
          </Form.Item>

          <Form.Item
            label="联系电话"
            name="phone"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
            ]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            initialValue="在读"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="在读">在读</Select.Option>
              <Select.Option value="休学">休学</Select.Option>
              <Select.Option value="毕业">毕业</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="入学日期"
            name="enrollDate"
            rules={[{ required: true, message: '请选择入学日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setEditingStudent(null);
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createLoading || updateLoading}
              >
                {editingStudent ? '保存' : '添加'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
