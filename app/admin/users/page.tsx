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
  Modal,
  Form,
  App,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRequest } from 'ahooks';
import { get, put, del } from '@/lib/request';
import { useUserDetailModal } from './hooks/useUserDetailModal';
import { useUserFormModal } from './hooks/useUserFormModal';

const { Search } = Input;

interface UnifiedUser {
  _id: string;
  businessId?: string;
  displayName: string;
  email: string;
  username?: string;
  nickname?: string;
  roleName: string;
  roleCode: string;
  sortOrder: number;
  source: 'admin' | 'teacher' | 'student';
  status: string;
  createdAt: string;
  updatedAt: string;
}

const roleColorMap: Record<string, string> = {
  super_admin: 'red',
  edu_admin: 'blue',
  teacher: 'green',
  student: 'default',
};

const statusColorMap: Record<string, string> = {
  active: 'green',
  disabled: 'default',
  在职: 'green',
  离职: 'default',
  休假: 'orange',
  在读: 'blue',
  休学: 'orange',
  毕业: 'green',
};

const sourceLabelMap: Record<string, string> = {
  admin: '系统账号',
  teacher: '教师',
  student: '学生',
};

function isUserDisabled(user: UnifiedUser): boolean {
  if (user.source === 'admin') return user.status === 'disabled';
  if (user.source === 'teacher') return user.status === '离职';
  if (user.source === 'student') return user.status !== '在读';
  return false;
}

function getEnableStatus(user: UnifiedUser): string {
  if (user.source === 'admin') return 'active';
  if (user.source === 'teacher') return '在职';
  if (user.source === 'student') return '在读';
  return 'active';
}

function getDisableStatus(user: UnifiedUser): string {
  if (user.source === 'admin') return 'disabled';
  if (user.source === 'teacher') return '离职';
  if (user.source === 'student') return '休学';
  return 'disabled';
}

function getUpdateApi(user: UnifiedUser): string {
  if (user.source === 'admin') return `/api/admin/users/${user._id}`;
  if (user.source === 'teacher') return `/api/teachers/${user.businessId}`;
  if (user.source === 'student') return `/api/students/${user.businessId}`;
  return `/api/admin/users/${user._id}`;
}

export default function UsersPage() {
  const { message } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [resetPwTarget, setResetPwTarget] = useState<UnifiedUser | null>(null);
  const [resetPwModalVisible, setResetPwModalVisible] = useState(false);
  const [resetPwForm] = Form.useForm();
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  const {
    token: { colorText },
  } = theme.useToken();

  const {
    data: usersData,
    loading: usersLoading,
    run: fetchUsers,
  } = useRequest(
    async (params: { page?: number; pageSize?: number; search?: string } = {}) => {
      const { page = 1, pageSize = 10, search = '' } = params as any;

      const result = await get('/api/admin/users', {
        params: { page, pageSize, search },
      });

      return result;
    },
    {
      manual: false,
      onSuccess: (result) => {
        setPagination({
          current: result.page || 1,
          pageSize: result.pageSize || 10,
          total: result.total || 0,
        });
      },
      defaultParams: [{ page: 1, pageSize: 10, search: '' }],
    }
  );

  const { run: toggleUserStatus } = useRequest(
    async (user: UnifiedUser) => {
      setTogglingUserId(user._id);
      const api = getUpdateApi(user);
      if (user.source === 'admin' && !isUserDisabled(user)) {
        return await del(api);
      }
      const newStatus = isUserDisabled(user) ? getEnableStatus(user) : getDisableStatus(user);
      return await put(api, { status: newStatus });
    },
    {
      manual: true,
      onSuccess: () => {
        setTogglingUserId(null);
        fetchUsers({
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
      onError: (error) => {
        setTogglingUserId(null);
        message.error(error.message || '操作失败');
      },
    }
  );

  const { run: resetUserPassword, loading: resetPwLoading } = useRequest(
    async ({ user, password }: { user: UnifiedUser; password: string }) => {
      const api = getUpdateApi(user);
      return await put(api, { password });
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

  const { handleView, DetailModal } = useUserDetailModal();

  const {
    handleAdd,
    handleEdit,
    FormModal,
    ResetPwModal,
  } = useUserFormModal(pagination, searchText, fetchUsers);

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchUsers({ page: 1, pageSize: pagination.pageSize, search: value });
  };

  const handleTableChange = (newPagination: any) => {
    fetchUsers({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      search: searchText,
    });
  };

  const openResetPw = (record: UnifiedUser) => {
    setResetPwTarget(record);
    resetPwForm.resetFields();
    setResetPwModalVisible(true);
  };

  const handleResetPwSubmit = async (values: { password: string }) => {
    if (resetPwTarget) {
      resetUserPassword({ user: resetPwTarget, password: values.password });
    }
  };

  const columns: ColumnsType<UnifiedUser> = [
    {
      title: '用户名',
      dataIndex: 'displayName',
      key: 'displayName',
      width: 140,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 280,
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 130,
      render: (text: string, record: UnifiedUser) => (
        <Tag color={roleColorMap[record.roleCode] || 'default'}>{text}</Tag>
      ),
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source: string) => (
        <Tag>{sourceLabelMap[source] || source}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 400,
      fixed: 'right',
      render: (_, record) => {
        const disabled = isUserDisabled(record);

        return (
          <Space size="small">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              size="small"
            >
              查看
            </Button>
            {record.source === 'admin' && (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                size="small"
              >
                编辑
              </Button>
            )}
            <Button
              type="link"
              icon={<KeyOutlined />}
              onClick={() => openResetPw(record)}
              size="small"
            >
              重置密码
            </Button>
            {disabled ? (
              <Popconfirm
                title="确定要启用该用户吗？"
                onConfirm={() => toggleUserStatus(record)}
                okText="确定"
                cancelText="取消"
                okButtonProps={{ loading: togglingUserId === record._id }}
              >
                <Button
                  type="link"
                  size="small"
                  loading={togglingUserId === record._id}
                >
                  启用
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="确定要禁用该用户吗？"
                description="禁用后用户将无法登录系统"
                onConfirm={() => toggleUserStatus(record)}
                okText="确定"
                cancelText="取消"
                okButtonProps={{ loading: togglingUserId === record._id }}
              >
                <Button
                  type="link"
                  danger
                  size="small"
                  loading={togglingUserId === record._id}
                >
                  禁用
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: colorText }}>
          用户管理
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          创建用户
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索用户名、昵称、邮箱或姓名"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ maxWidth: 400 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={usersData?.data || []}
        rowKey="_id"
        loading={usersLoading}
        scroll={{ x: 1100 }}
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

      <Modal
        title={`重置密码 - ${resetPwTarget?.displayName || ''}`}
        open={resetPwModalVisible}
        onCancel={() => {
          setResetPwModalVisible(false);
          setResetPwTarget(null);
          resetPwForm.resetFields();
        }}
        footer={null}
        width={480}
        destroyOnHidden
      >
        <p style={{ color: '#666', marginBottom: 0 }}>
          将为用户 <strong>{resetPwTarget?.displayName}</strong> 重置密码，重置后用户将使用新密码登录。
        </p>
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
              <Button onClick={() => {
                setResetPwModalVisible(false);
                setResetPwTarget(null);
                resetPwForm.resetFields();
              }}>取消</Button>
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
      </Modal>

      <DetailModal />
      <FormModal />
      <ResetPwModal />
    </div>
  );
}
