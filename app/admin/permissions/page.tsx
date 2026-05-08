'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Tree,
  Button,
  Tag,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Popconfirm,
  Spin,
  Empty,
  message,
  theme,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  StopOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import { useRequest } from 'ahooks';
import { get, put, del, post } from '@/lib/request';

const { Text, Title } = Typography;

interface RoleRecord {
  _id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'disabled';
  permissions: string[];
  sort: number;
}

interface MenuNode {
  key: string;
  title: string;
  permission: string;
  children?: MenuNode[];
}

const mockMenus: MenuNode[] = [
  {
    key: 'admin',
    title: '系统管理',
    permission: 'admin',
    children: [
      { key: 'admin:dashboard', title: '系统总览', permission: 'admin:dashboard' },
      { key: 'admin:users', title: '用户管理', permission: 'admin:users' },
      { key: 'admin:permissions', title: '权限管理', permission: 'admin:permissions' },
      { key: 'admin:monitor', title: '系统监控', permission: 'admin:monitor' },
    ],
  },
  {
    key: 'dashboard',
    title: '仪表盘',
    permission: 'dashboard',
    children: [
      { key: 'student:list', title: '学生管理', permission: 'student:list' },
      { key: 'course:list', title: '课程管理', permission: 'course:list' },
      { key: 'enrollment:list', title: '选课管理', permission: 'enrollment:list' },
    ],
  },
  {
    key: 'profile',
    title: '个人资料',
    permission: 'profile',
  },
  {
    key: 'api:doc',
    title: 'API 文档',
    permission: 'api:doc',
  },
];

function menusToTreeData(nodes: MenuNode[]): DataNode[] {
  return nodes.map((node) => ({
    key: node.permission,
    title: node.title,
    children: node.children ? menusToTreeData(node.children) : undefined,
  }));
}

export default function PermissionsPage() {
  const { token } = theme.useToken();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const { data: rolesData, loading: rolesLoading, run: fetchRoles } = useRequest(
    async () => {
      const result = await get('/api/admin/roles', { params: { page: 1, pageSize: 100 } });
      return result;
    },
    { manual: false, defaultParams: [] }
  );

  const roles: RoleRecord[] = rolesData?.data || [];

  const selectedRole = useMemo(
    () => roles.find((r) => r._id === selectedRoleId) || null,
    [roles, selectedRoleId]
  );

  const handleSelectRole = (role: RoleRecord) => {
    setSelectedRoleId(role._id);
    setCheckedKeys(role.permissions || []);
  };

  const handleCheck = (newCheckedKeys: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    const keys = Array.isArray(newCheckedKeys) ? newCheckedKeys : newCheckedKeys.checked;
    setCheckedKeys(keys as string[]);
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      await put(`/api/admin/roles/${selectedRole._id}`, {
        permissions: checkedKeys,
      });
      message.success('权限保存成功');
      fetchRoles();
    } catch (error: any) {
      message.error(error.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  // --- Role CRUD ---
  const handleCreateRole = () => {
    setEditingRole(null);
    form.resetFields();
    setFormModalVisible(true);
  };

  const handleEditRole = (role: RoleRecord) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      code: role.code,
      description: role.description || '',
      sort: role.sort || 0,
    });
    setFormModalVisible(true);
  };

  const handleCloseForm = () => {
    setFormModalVisible(false);
    form.resetFields();
    setEditingRole(null);
  };

  const handleSubmitRole = async (values: any) => {
    try {
      if (editingRole) {
        await put(`/api/admin/roles/${editingRole._id}`, values);
        message.success('更新成功');
      } else {
        await post('/api/admin/roles', values);
        message.success('创建成功');
      }
      setFormModalVisible(false);
      form.resetFields();
      setEditingRole(null);
      fetchRoles();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    }
  };

  const handleDisableRole = async (role: RoleRecord) => {
    try {
      if (role.status === 'active') {
        await del(`/api/admin/roles/${role._id}`);
      } else {
        await put(`/api/admin/roles/${role._id}`, { status: 'active' });
      }
      if (selectedRoleId === role._id) {
        setSelectedRoleId(null);
        setCheckedKeys([]);
      }
      fetchRoles();
      message.success(role.status === 'active' ? '已停用' : '已启用');
    } catch (error: any) {
      message.error(error.message || '操作失败');
    }
  };

  const renderLeftPanel = () => (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <div
        style={{
          padding: '16px 16px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text strong style={{ fontSize: 15 }}>角色列表</Text>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={handleCreateRole}
        >
          创建
        </Button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
        <Spin spinning={rolesLoading}>
          {roles.length === 0 && !rolesLoading && (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <Text type="secondary">暂无角色</Text>
            </div>
          )}
          {roles.map((role) => {
            const isSelected = selectedRoleId === role._id;
            const isDisabled = role.status !== 'active';
            return (
              <div
                key={role._id}
                onClick={() => !isDisabled && handleSelectRole(role)}
                style={{
                  padding: '10px 12px',
                  marginBottom: 4,
                  borderRadius: 8,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  backgroundColor: isSelected ? token.colorPrimaryBg : undefined,
                  border: isSelected ? `1px solid ${token.colorPrimary}` : '1px solid transparent',
                  opacity: isDisabled ? 0.45 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && !isDisabled) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = token.colorBgTextHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? token.colorPrimary : token.colorText,
                      marginBottom: 2,
                    }}
                  >
                    {role.name}
                  </div>
                  <Tag
                    style={{ fontSize: 11, lineHeight: '18px', margin: 0 }}
                    color={isSelected ? 'blue' : 'default'}
                  >
                    {role.code}
                  </Tag>
                </div>

                <Space size={0} style={{ flexShrink: 0 }}>
                  {isDisabled ? (
                    role.code !== 'super_admin' ? (
                      <Popconfirm
                        title="确定要启用该角色吗？"
                        onConfirm={(e) => { e?.stopPropagation(); handleDisableRole(role); }}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button
                          type="text"
                          size="small"
                          icon={<CheckCircleOutlined />}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>
                    ) : null
                  ) : (
                    <>
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditRole(role);
                        }}
                      />
                      {role.code !== 'super_admin' && (
                        <Popconfirm
                          title="确定要停用该角色吗？"
                          onConfirm={(e) => { e?.stopPropagation(); handleDisableRole(role); }}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<StopOutlined />}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Popconfirm>
                      )}
                    </>
                  )}
                </Space>
              </div>
            );
          })}
        </Spin>
      </div>
    </div>
  );

  const renderRightPanel = () => (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        minWidth: 0,
      }}
    >
      {!selectedRole ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Empty description="请从左侧选择一个角色来配置权限" />
        </div>
      ) : (
        <>
          <div
            style={{
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Space>
              <SafetyCertificateOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
              <Title level={5} style={{ margin: 0 }}>
                {selectedRole.name} — 权限配置
              </Title>
              <Tag color="blue">{selectedRole.code}</Tag>
            </Space>
            <Button
              type="primary"
              onClick={handleSavePermissions}
              loading={saving}
            >
              保存权限
            </Button>
          </div>

          <div
            style={{
              flex: 1,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: 8,
              padding: 24,
              overflow: 'auto',
            }}
          >
            <Tree
              checkable
              defaultExpandAll
              treeData={menusToTreeData(mockMenus)}
              checkedKeys={checkedKeys}
              onCheck={handleCheck}
              style={{ fontSize: 14 }}
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        权限管理
      </h1>

      <Card
        styles={{
          body: {
            padding: 0,
            display: 'flex',
            minHeight: 560,
          },
        }}
      >
        {renderLeftPanel()}
        {renderRightPanel()}
      </Card>

      <Modal
        title={editingRole ? '编辑角色' : '创建角色'}
        open={formModalVisible}
        onCancel={handleCloseForm}
        footer={null}
        width={520}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitRole}
          style={{ marginTop: 24 }}
          autoComplete="off"
        >
          <Form.Item
            label="角色名称"
            name="name"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="如：超级管理员" />
          </Form.Item>

          <Form.Item
            label="角色编码"
            name="code"
            rules={[
              { required: true, message: '请输入角色编码' },
              { pattern: /^[a-z_]+$/, message: '只能包含小写字母和下划线' },
            ]}
          >
            <Input placeholder="如：super_admin" disabled={!!editingRole} />
          </Form.Item>

          <Form.Item label="角色描述" name="description">
            <Input.TextArea rows={3} placeholder="描述该角色的权限范围和用途" />
          </Form.Item>

          <Form.Item
            label="排序"
            name="sort"
            rules={[{ required: true, message: '请输入排序序号' }]}
          >
            <Input type="number" placeholder="数字越小越靠前" min={0} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCloseForm}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingRole ? '保存' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
