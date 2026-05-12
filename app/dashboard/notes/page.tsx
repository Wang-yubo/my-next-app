'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Popconfirm,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TablePaginationConfig } from 'antd';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { useNoteDetailModal } from './hooks/useNoteDetailModal';
import { useNoteFormModal } from './hooks/useNoteFormModal';

const { Search } = Input;
const JAVA_API_BASE = process.env.NEXT_PUBLIC_JAVA_API_BASE || 'http://localhost:8080';

interface Note {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  topic: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  key: string;
}

interface PageNote {
  content: Note[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export default function NotesPage() {
  const [searchTopic, setSearchTopic] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: notesData,
    loading: notesLoading,
    run: fetchNotes,
  } = useRequest(
    async (params: { page?: number; size?: number; topic?: string; tag?: string } = {}) => {
      const { page = 0, size = 10, topic = '', tag = '' } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      if (topic) queryParams.set('topic', topic);
      if (tag) queryParams.set('tag', tag);

      const response = await fetch(`${JAVA_API_BASE}/api/notes?${queryParams}`, {
        credentials: 'include',
      });
      const result = await response.json();

      if (result.code !== 200) {
        throw new Error(result.message || '获取数据失败');
      }
      return result;
    },
    {
      manual: false,
      defaultParams: [{ page: 0, size: 10 }],
    }
  );

  const pageData: PageNote = notesData?.data || { content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 };
  const notes: Note[] = (pageData.content || []).map((item: Note) => ({
    ...item,
    key: item.id,
  }));

  const { run: deleteNote } = useRequest(
    async (id: string) => {
      const response = await fetch(`${JAVA_API_BASE}/api/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await response.json();
      if (result.code !== 200) {
        throw new Error(result.message || '删除失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('删除成功');
        fetchNotes({ page: currentPage - 1, size: pageSize, topic: searchTopic, tag: searchTag });
      },
      onError: (error) => {
        message.error(error.message || '删除失败');
      },
    }
  );

  const {
    handleView,
    DetailModal,
  } = useNoteDetailModal();

  const {
    handleAdd,
    handleEdit,
    FormModal,
  } = useNoteFormModal(
    () => fetchNotes({ page: currentPage - 1, size: pageSize, topic: searchTopic, tag: searchTag })
  );

  const handleSearch = (value: string) => {
    setSearchTopic(value);
    setCurrentPage(1);
    fetchNotes({ page: 0, size: pageSize, topic: value, tag: searchTag });
  };

  const handleTagSearch = (value: string) => {
    setSearchTag(value);
    setCurrentPage(1);
    fetchNotes({ page: 0, size: pageSize, topic: searchTopic, tag: value });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current = 1, pageSize: newPageSize = 10 } = pagination;
    setCurrentPage(current);
    setPageSize(newPageSize);
    fetchNotes({ page: current - 1, size: newPageSize, topic: searchTopic, tag: searchTag });
  };

  const columns: ColumnsType<Note> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: '主题/学科',
      dataIndex: 'topic',
      key: 'topic',
      width: 120,
      render: (topic: string) => (
        <Tag color="purple">{topic}</Tag>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <Space size={4} wrap>
          {tags.map((tag) => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
          {tags.length === 0 && <span style={{ color: '#999' }}>-</span>}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 170,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_: unknown, record: Note) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这条学习笔记吗？"
            onConfirm={() => deleteNote(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
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
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>学习笔记</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建笔记
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Search
          placeholder="搜索主题/学科"
          allowClear
          onSearch={handleSearch}
          style={{ width: 240 }}
          prefix={<SearchOutlined />}
        />
        <Search
          placeholder="搜索标签"
          allowClear
          onSearch={handleTagSearch}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
      </div>

      <Table
        columns={columns}
        dataSource={notes}
        loading={notesLoading}
        scroll={{ x: 1100 }}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: pageData.totalElements,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <DetailModal />
      <FormModal />
    </div>
  );
}
