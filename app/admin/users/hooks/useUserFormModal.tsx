'use client';

import React from 'react';
import { Modal, Form, Input, Select, Button, Space, Row, Col, App, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { get, post, put } from '@/lib/request';

interface RoleInfo {
  _id: string;
  name: string;
  code: string;
}

interface AdminUserDetail {
  _id: string;
  username: string;
  nickname: string;
  email: string;
  status: 'active' | 'disabled';
  roles: RoleInfo[];
  createdAt: string;
  updatedAt: string;
}

interface UserFormData {
  username: string;
  password: string;
  email: string;
  nickname: string;
  role: string;
}

interface UseUserFormModalReturn {
  formModalVisible: boolean;
  FormModal: React.FC;
  resetPwModalVisible: boolean;
  ResetPwModal: React.FC;
  handleAdd: () => void;
  handleEdit: (record: { _id: string }) => void;
  handleResetPw: (record: { _id: string; username?: string; displayName?: string }) => void;
}

const mockRoles = [
  { _id: '000000000000000000000001', name: '超级管理员', code: 'super_admin' },
  { _id: '000000000000000000000002', name: '教务管理员', code: 'edu_admin' },
];

export function useUserFormModal(
  pagination: { current: number; pageSize: number; total: number },
  searchText: string,
  fetchUsers: (params?: any) => void
): UseUserFormModalReturn {
  const { message } = App.useApp();
  const [formModalVisible, setFormModalVisible] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [resetPwModalVisible, setResetPwModalVisible] = React.useState(false);
  const [resetPwTarget, setResetPwTarget] = React.useState<{ _id: string; name: string } | null>(null);
  const [form] = Form.useForm<any>();
  const [resetPwForm] = Form.useForm();

  const { run: createUser, loading: createLoading } = useRequest(
    async (data: UserFormData) => {
      return await post('/api/admin/users', data);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('创建成功');
        setFormModalVisible(false);
        form.resetFields();
        setEditingId(null);
        fetchUsers({
          page: 1,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
      onError: (error) => {
        message.error(error.message || '创建失败');
      },
    }
  );

  const { run: updateUser, loading: updateLoading } = useRequest(
    async ({ id, data }: { id: string; data: UserFormData }) => {
      return await put(`/api/admin/users/${id}`, data);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('编辑成功');
        setFormModalVisible(false);
        form.resetFields();
        setEditingId(null);
        fetchUsers({
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

  const { run: fetchUserDetail, loading: detailLoading } = useRequest(
    async (id: string) => {
      return await get(`/api/admin/users/${id}`);
    },
    {
      manual: true,
      onSuccess: (result) => {
        const user = result.data as AdminUserDetail;
        setEditingId(user._id);
        form.setFieldsValue({
          username: user.username,
          email: user.email,
          nickname: user.nickname || '',
          password: '',
          role: user.roles?.[0]?._id || '',
        });
        setFormModalVisible(true);
      },
      onError: (error) => {
        message.error(error.message || '获取用户信息失败');
      },
    }
  );

  const { run: resetPassword, loading: resetPwLoading } = useRequest(
    async ({ id, password }: { id: string; password: string }) => {
      return await put(`/api/admin/users/${id}`, { password });
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('密码重置成功');
        setResetPwModalVisible(false);
        setResetPwTarget(null);
        resetPwForm.resetFields();
      },
      onError: (error) => {
        message.error(error.message || '重置失败');
      },
    }
  );

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setFormModalVisible(true);
  };

  const handleEdit = (record: { _id: string }) => {
    fetchUserDetail(record._id);
  };

  const handleCloseForm = () => {
    setFormModalVisible(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleSubmit = async (values: UserFormData) => {
    if (editingId) {
      updateUser({ id: editingId, data: values });
    } else {
      createUser(values);
    }
  };

  const handleResetPw = (record: { _id: string; username?: string; displayName?: string }) => {
    setResetPwTarget({ _id: record._id, name: record.username || record.displayName || '' });
    resetPwForm.resetFields();
    setResetPwModalVisible(true);
  };

  const handleCloseResetPw = () => {
    setResetPwModalVisible(false);
    setResetPwTarget(null);
    resetPwForm.resetFields();
  };

  const handleResetPwSubmit = async (values: { password: string }) => {
    if (resetPwTarget) {
      resetPassword({ id: resetPwTarget._id, password: values.password });
    }
  };

  const renderFormContent = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ marginTop: 24 }}
      autoComplete="off"
      initialValues={{
        status: 'active',
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="登录时使用的用户名" disabled={!!editingId} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="昵称"
            name="nickname"
          >
            <Input placeholder="显示名称，留空使用用户名" />
          </Form.Item>
        </Col>
      </Row>

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
        label="密码"
        name="password"
        rules={[
          { required: !editingId, message: '请输入密码' },
          { min: 6, message: '密码长度不能少于6位' },
        ]}
        extra={editingId ? '留空则不修改密码' : undefined}
      >
        <Input.Password placeholder={editingId ? '留空则不修改' : '请输入密码'} />
      </Form.Item>

      <Form.Item
        label="角色"
        name="role"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Select
          placeholder="请选择角色"
          options={mockRoles.map((r) => ({
            label: r.name,
            value: r._id,
          }))}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button onClick={handleCloseForm}>取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createLoading || updateLoading}
          >
            {editingId ? '保存' : '创建'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const renderResetPwContent = () => (
    <Form
      form={resetPwForm}
      layout="vertical"
      onFinish={handleResetPwSubmit}
      style={{ marginTop: 24 }}
      autoComplete="off"
    >
      <Form.Item
        label="新密码"
        name="password"
        rules={[
          { required: true, message: '请输入新密码' },
          { min: 6, message: '密码长度不能少于6位' },
        ]}
      >
        <Input.Password placeholder="请输入新密码" />
      </Form.Item>

      <Form.Item
        label="确认密码"
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: '请确认新密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="请再次输入新密码" />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button onClick={handleCloseResetPw}>取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={resetPwLoading}
          >
            确认重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const FormModal: React.FC = () => (
    <Modal
      title={editingId ? '编辑用户' : '创建用户'}
      open={formModalVisible}
      onCancel={handleCloseForm}
      footer={null}
      width={640}
      destroyOnHidden
    >
      <Spin spinning={detailLoading}>
        {renderFormContent()}
      </Spin>
    </Modal>
  );

  const ResetPwModal: React.FC = () => (
    <Modal
      title={`重置密码 - ${resetPwTarget?.name || ''}`}
      open={resetPwModalVisible}
      onCancel={handleCloseResetPw}
      footer={null}
      width={480}
      destroyOnHidden
    >
      <p style={{ color: '#666', marginBottom: 0 }}>
        将为用户 <strong>{resetPwTarget?.name}</strong> 重置密码，重置后用户将使用新密码登录。
      </p>
      {renderResetPwContent()}
    </Modal>
  );

  return {
    formModalVisible,
    FormModal,
    resetPwModalVisible,
    ResetPwModal,
    handleAdd,
    handleEdit,
    handleResetPw,
  };
}
