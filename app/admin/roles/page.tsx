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
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRequest } from 'ahooks';
import { get, put, del } from '@/lib/request';
import { useRoleFormModal } from './hooks/useRoleFormModal';

const { Search } = Input;

interface RoleRecord {
  _id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'disabled';
  sort: number;
  createdAt: string;
}

export default function RolesPage() {
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const {
    token: { colorText },
  } = theme.useToken();

  const {
    data: rolesData,
    loading: rolesLoading,
    run: fetchRoles,
  } = useRequest(
    async (params: { page?: number; pageSize?: number; search?: string } = {}) => {
      const { page = 1, pageSize = 10, search = '' } = params as any;

      const result = await get('/api/admin/roles', {
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

  const { run: toggleRoleStatus } = useRequest(
    async (record: RoleRecord) => {
      setTogglingId(record._id);
      if (record.status === 'active') {
        return await del(`/api/admin/roles/${record._id}`);
      }
      return await put(`/api/admin/roles/${record._id}`, { status: 'active' });
    },
    {
      manual: true,
      onSuccess: () => {
        setTogglingId(null);
        fetchRoles({
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
      onError: () => {
        setTogglingId(null);
      },
    }
  );

  const { handleAdd, handleEdit, FormModal } = useRoleFormModal(pagination, searchText, fetchRoles);

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchRoles({ page: 1, pageSize: pagination.pageSize, search: value });
  };

  const handleTableChange = (newPagination: any) => {
    fetchRoles({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      search: searchText,
    });
  };

  const columns: ColumnsType<RoleRecord> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      width: 160,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (text: string) => text || '-',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '启用' : '停用'}
        </Tag>
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
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            编辑
          </Button>
          {record.status === 'active' ? (
            <Popconfirm
              title="确定要停用该角色吗？"
              description="停用后拥有该角色的用户将失去对应权限"
              onConfirm={() => toggleRoleStatus(record)}
              okText="确定"
              cancelText="取消"
              okButtonProps={{ loading: togglingId === record._id }}
            >
              <Button
                type="link"
                danger
                size="small"
                loading={togglingId === record._id}
              >
                停用
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="确定要启用该角色吗？"
              onConfirm={() => toggleRoleStatus(record)}
              okText="确定"
              cancelText="取消"
              okButtonProps={{ loading: togglingId === record._id }}
            >
              <Button
                type="link"
                size="small"
                loading={togglingId === record._id}
              >
                启用
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
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
          角色管理
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          创建角色
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索角色名称或编码"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ maxWidth: 400 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={rolesData?.data || []}
        rowKey="_id"
        loading={rolesLoading}
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

      <FormModal />
    </div>
  );
}
