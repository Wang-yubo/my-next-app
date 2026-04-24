'use client';

import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Space, Row, Col, message } from 'antd';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { post, put } from '@/lib/request';

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
  className: string;
  grade: string;
  idCard: string;
  phone: string;
  email: string;
  password: string;
  status: '在读' | '休学' | '毕业';
  enrollDate: dayjs.Dayjs | null;
}

interface UseStudentFormModalReturn {
  formModalVisible: boolean;
  editingStudent: Student | null;
  form: any;
  createLoading: boolean;
  updateLoading: boolean;
  handleAdd: () => void;
  handleEdit: (record: Student) => void;
  handleCloseForm: () => void;
  handleSubmit: (values: StudentFormData) => void;
  FormModal: React.FC;
}

export function useStudentFormModal(
  pagination: { current: number; pageSize: number; total: number },
  searchText: string,
  fetchStudents: (params?: any) => void
): UseStudentFormModalReturn {
  const [formModalVisible, setFormModalVisible] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form] = Form.useForm<any>();

  // 创建学生
  const { run: createStudent, loading: createLoading } = useRequest(
    async (data: StudentFormData) => {
      const result = await post('/api/students', {
        ...data,
        age: parseInt(String(data.age)),
        enrollDate: data.enrollDate?.toISOString() || new Date().toISOString(),
      });
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('添加成功');
        setFormModalVisible(false);
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
      const result = await put(`/api/students/${id}`, {
        ...data,
        age: parseInt(String(data.age)),
        enrollDate: data.enrollDate?.toISOString() || new Date().toISOString(),
      });
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('编辑成功');
        setFormModalVisible(false);
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

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setFormModalVisible(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record: Student) => {
    setEditingStudent(record);
    form.setFieldsValue({
      name: record.name,
      gender: record.gender,
      age: record.age,
      major: record.major,
      className: record.className,
      grade: record.grade,
      idCard: record.idCard,
      phone: record.phone,
      email: record.email,
      password: '', // 编辑时不显示密码
      status: record.status,
      enrollDate: record.enrollDate ? dayjs(record.enrollDate) : null,
    });
    setFormModalVisible(true);
  };

  // 关闭表单弹窗
  const handleCloseForm = () => {
    setFormModalVisible(false);
    form.resetFields();
    setEditingStudent(null);
  };

  // 表单提交
  const handleSubmit = async (values: StudentFormData) => {
    if (editingStudent) {
      updateStudent({ id: editingStudent.id, data: values });
    } else {
      createStudent(values);
    }
  };

  // 渲染表单内容
  const renderFormContent = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ marginTop: 24 }}
      autoComplete="off"
      initialValues={{
        status: '在读',
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
        </Col>
        <Col span={12}>
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
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="年龄"
            name="age"
            rules={[{ required: true, message: '请输入年龄' }]}
          >
            <Input type="number" placeholder="请输入年龄" min={1} max={100} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="年级"
            name="grade"
            rules={[{ required: true, message: '请输入年级' }]}
          >
            <Input placeholder="如：2024级" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="在读">在读</Select.Option>
              <Select.Option value="休学">休学</Select.Option>
              <Select.Option value="毕业">毕业</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="专业"
        name="major"
        rules={[{ required: true, message: '请输入专业' }]}
      >
        <Input placeholder="请输入专业" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="班级"
            name="className"
            rules={[{ required: true, message: '请输入班级' }]}
          >
            <Input placeholder="如：电子商务1班" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="身份证号"
            name="idCard"
            rules={[
              { required: true, message: '请输入身份证号' },
              { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号' },
            ]}
          >
            <Input placeholder="请输入身份证号" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
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
        </Col>
        <Col span={12}>
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
        </Col>
      </Row>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          { required: !editingStudent, message: '请输入密码' },
          { min: 6, message: '密码长度不能少于6位' },
        ]}
        extra={editingStudent ? '留空则不修改密码' : undefined}
      >
        <Input.Password placeholder="请输入密码" />
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
          <Button onClick={handleCloseForm}>取消</Button>
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
  );

  // 渲染表单弹窗
  const FormModal: React.FC = () => (
    <Modal
      title={editingStudent ? '编辑学生' : '新增学生'}
      open={formModalVisible}
      onCancel={handleCloseForm}
      footer={null}
      width={700}
      destroyOnClose
    >
      {renderFormContent()}
    </Modal>
  );

  return {
    formModalVisible,
    editingStudent,
    form,
    createLoading,
    updateLoading,
    handleAdd,
    handleEdit,
    handleCloseForm,
    handleSubmit,
    FormModal,
  };
}
