'use client';

import React from 'react';
import { Modal, Form, Input, Button, Space, Row, Col, App, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { get, post, put } from '@/lib/request';

interface RoleRecord {
  _id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'disabled';
  sort: number;
}

interface RoleFormData {
  name: string;
  code: string;
  description: string;
  sort: number;
}

interface UseRoleFormModalReturn {
  FormModal: React.FC;
  handleAdd: () => void;
  handleEdit: (record: { _id: string }) => void;
}

export function useRoleFormModal(
  pagination: { current: number; pageSize: number; total: number },
  searchText: string,
  fetchRoles: (params?: any) => void
): UseRoleFormModalReturn {
  const { message } = App.useApp();
  const [formModalVisible, setFormModalVisible] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form] = Form.useForm<any>();

  const { run: createRole, loading: createLoading } = useRequest(
    async (data: RoleFormData) => {
      return await post('/api/admin/roles', data);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('创建成功');
        setFormModalVisible(false);
        form.resetFields();
        setEditingId(null);
        fetchRoles({ page: 1, pageSize: pagination.pageSize, search: searchText });
      },
      onError: (error) => {
        message.error(error.message || '创建失败');
      },
    }
  );

  const { run: updateRole, loading: updateLoading } = useRequest(
    async ({ id, data }: { id: string; data: RoleFormData }) => {
      return await put(`/api/admin/roles/${id}`, data);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('编辑成功');
        setFormModalVisible(false);
        form.resetFields();
        setEditingId(null);
        fetchRoles({
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

  const { run: fetchRoleDetail, loading: detailLoading } = useRequest(
    async (id: string) => {
      return await get(`/api/admin/roles/${id}`);
    },
    {
      manual: true,
      onSuccess: (result) => {
        const role = result.data as RoleRecord;
        setEditingId(role._id);
        form.setFieldsValue({
          name: role.name,
          code: role.code,
          description: role.description || '',
          sort: role.sort || 0,
        });
        setFormModalVisible(true);
      },
      onError: (error) => {
        message.error(error.message || '获取角色信息失败');
      },
    }
  );

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setFormModalVisible(true);
  };

  const handleEdit = (record: { _id: string }) => {
    fetchRoleDetail(record._id);
  };

  const handleCloseForm = () => {
    setFormModalVisible(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleSubmit = async (values: RoleFormData) => {
    if (editingId) {
      updateRole({ id: editingId, data: values });
    } else {
      createRole(values);
    }
  };

  const renderFormContent = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ marginTop: 24 }}
      autoComplete="off"
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="角色名称"
            name="name"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="如：超级管理员" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="角色编码"
            name="code"
            rules={[
              { required: true, message: '请输入角色编码' },
              { pattern: /^[a-z_]+$/, message: '只能包含小写字母和下划线' },
            ]}
          >
            <Input placeholder="如：super_admin" disabled={!!editingId} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="角色描述"
        name="description"
      >
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

  const FormModal: React.FC = () => (
    <Modal
      title={editingId ? '编辑角色' : '创建角色'}
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

  return {
    FormModal,
    handleAdd,
    handleEdit,
  };
}
