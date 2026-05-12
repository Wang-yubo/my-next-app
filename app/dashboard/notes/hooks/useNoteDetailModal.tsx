'use client';

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import dayjs from 'dayjs';

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

interface UseNoteDetailModalReturn {
  detailModalVisible: boolean;
  currentNote: Note | null;
  handleView: (record: Note) => void;
  handleCloseDetail: () => void;
  DetailModal: React.FC;
}

export function useNoteDetailModal(): UseNoteDetailModalReturn {
  const [detailModalVisible, setDetailModalVisible] = React.useState(false);
  const [currentNote, setCurrentNote] = React.useState<Note | null>(null);

  const handleView = (record: Note) => {
    setCurrentNote(record);
    setDetailModalVisible(true);
  };

  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setCurrentNote(null);
  };

  const renderDetailContent = (note: Note) => (
    <div style={{ marginTop: 16 }}>
      <Descriptions column={2} bordered>
        <Descriptions.Item label="标题" span={2}>{note.title}</Descriptions.Item>
        <Descriptions.Item label="主题/学科">{note.topic}</Descriptions.Item>
        <Descriptions.Item label="学生姓名">{note.studentName}</Descriptions.Item>
        <Descriptions.Item label="标签" span={2}>
          {note.tags.map((tag) => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {dayjs(note.createdAt).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {dayjs(note.updatedAt).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="内容" span={2}>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, background: '#fafafa', padding: 16, borderRadius: 4, minHeight: 100 }}>
            {note.content}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  const DetailModal: React.FC = () => (
    <Modal
      title="学习笔记详情"
      open={detailModalVisible}
      onCancel={handleCloseDetail}
      footer={null}
      width={800}
    >
      {currentNote && renderDetailContent(currentNote)}
    </Modal>
  );

  return {
    detailModalVisible,
    currentNote,
    handleView,
    handleCloseDetail,
    DetailModal,
  };
}
