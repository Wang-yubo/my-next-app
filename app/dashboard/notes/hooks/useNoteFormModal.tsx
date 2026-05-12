'use client';

import React from 'react';
import { Modal, Form, Input, Select, Button, Space, message } from 'antd';
import { useRequest } from 'ahooks';

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
}

interface NoteFormData {
  title: string;
  topic: string;
  content: string;
  tags: string[];
}

interface UseNoteFormModalReturn {
  formModalVisible: boolean;
  editingNote: Note | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  createLoading: boolean;
  updateLoading: boolean;
  handleAdd: () => void;
  handleEdit: (record: Note) => void;
  handleCloseForm: () => void;
  handleSubmit: (values: NoteFormData) => void;
  FormModal: React.FC;
}

export function useNoteFormModal(
  fetchNotes: (params?: Record<string, string | number>) => void
): UseNoteFormModalReturn {
  const [formModalVisible, setFormModalVisible] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<Note | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingNote(null);
    form.resetFields();
    setFormModalVisible(true);
  };

  const handleEdit = (record: Note) => {
    setEditingNote(record);
    form.setFieldsValue({
      title: record.title,
      topic: record.topic,
      content: record.content,
      tags: record.tags,
    });
    setFormModalVisible(true);
  };

  const handleCloseForm = () => {
    setFormModalVisible(false);
    setEditingNote(null);
    form.resetFields();
  };

  const { run: createNote, loading: createLoading } = useRequest(
    async (data: NoteFormData) => {
      const response = await fetch(`${JAVA_API_BASE}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.code !== 200) {
        throw new Error(result.message || '创建失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('创建成功');
        setFormModalVisible(false);
        form.resetFields();
        setEditingNote(null);
        fetchNotes();
      },
      onError: (error) => {
        message.error(error.message || '创建失败');
      },
    }
  );

  const { run: updateNote, loading: updateLoading } = useRequest(
    async (data: NoteFormData) => {
      const response = await fetch(`${JAVA_API_BASE}/api/notes/${editingNote!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.code !== 200) {
        throw new Error(result.message || '更新失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('更新成功');
        setFormModalVisible(false);
        form.resetFields();
        setEditingNote(null);
        fetchNotes();
      },
      onError: (error) => {
        message.error(error.message || '更新失败');
      },
    }
  );

  const handleSubmit = (values: NoteFormData) => {
    if (editingNote) {
      updateNote(values);
    } else {
      createNote(values);
    }
  };

  const FormModal: React.FC = () => (
    <Modal
      title={editingNote ? '编辑学习笔记' : '新建学习笔记'}
      open={formModalVisible}
      onCancel={handleCloseForm}
      footer={null}
      width={700}
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
          label="标题"
          name="title"
          rules={[
            { required: true, message: '请输入笔记标题' },
            { max: 50, message: '标题最多50个字符' },
          ]}
        >
          <Input placeholder="请输入笔记标题" maxLength={50} showCount />
        </Form.Item>

        <Form.Item
          label="主题/学科"
          name="topic"
          rules={[
            { required: true, message: '请输入主题或学科分类' },
            { max: 50, message: '主题最多50个字符' },
          ]}
        >
          <Input placeholder="例如：数学、英语、计算机" maxLength={50} showCount />
        </Form.Item>

        <Form.Item
          label="内容"
          name="content"
          rules={[
            { required: true, message: '请输入笔记内容' },
            { max: 5000, message: '内容最多5000个字符' },
          ]}
        >
          <Input.TextArea
            placeholder="请输入笔记内容"
            maxLength={5000}
            showCount
            rows={6}
          />
        </Form.Item>

        <Form.Item
          label="标签"
          name="tags"
        >
          <Select
            mode="tags"
            placeholder="输入标签后回车添加"
            maxCount={10}
            tokenSeparators={[',']}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={handleCloseForm}>取消</Button>
            <Button type="primary" htmlType="submit" loading={createLoading || updateLoading}>
              {editingNote ? '保存' : '创建'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  return {
    formModalVisible,
    editingNote,
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
