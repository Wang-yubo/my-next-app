'use client';

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';

interface Student {
  _id: string;
  id: string;
  name: string;
  gender: string;
  age: number;
  idCard: string;
  major: string;
  className: string;
  grade: string;
  phone: string;
  email: string;
  status: '在读' | '休学' | '毕业';
  enrollDate: string;
  key: string;
}

interface UseStudentDetailModalReturn {
  detailModalVisible: boolean;
  currentStudent: Student | null;
  handleView: (record: Student) => void;
  handleCloseDetail: () => void;
  DetailModal: React.FC;
}

// 状态标签颜色映射
const statusColorMap: Record<string, string> = {
  在读: 'blue',
  休学: 'orange',
  毕业: 'green',
};

export function useStudentDetailModal(): UseStudentDetailModalReturn {
  const [detailModalVisible, setDetailModalVisible] = React.useState(false);
  const [currentStudent, setCurrentStudent] = React.useState<Student | null>(null);

  // 查看学生详情
  const handleView = (record: Student) => {
    setCurrentStudent(record);
    setDetailModalVisible(true);
  };

  // 关闭详情弹窗
  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setCurrentStudent(null);
  };

  // 渲染详情内容
  const renderDetailContent = (student: Student) => (
    <div style={{ marginTop: 16 }}>
      <Descriptions column={2} bordered>
        <Descriptions.Item label="学号">{student.id}</Descriptions.Item>
        <Descriptions.Item label="姓名">{student.name}</Descriptions.Item>
        <Descriptions.Item label="性别">{student.gender}</Descriptions.Item>
        <Descriptions.Item label="年龄">{student.age}</Descriptions.Item>
        <Descriptions.Item label="身份证号" span={2}>{student.idCard}</Descriptions.Item>
        <Descriptions.Item label="专业" span={2}>{student.major}</Descriptions.Item>
        <Descriptions.Item label="班级">{student.className}</Descriptions.Item>
        <Descriptions.Item label="年级">{student.grade}</Descriptions.Item>
        <Descriptions.Item label="联系电话">{student.phone}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{student.email}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusColorMap[student.status]}>{student.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="入学日期" span={2}>{student.enrollDate}</Descriptions.Item>
      </Descriptions>
    </div>
  );

  // 渲染详情弹窗
  const DetailModal: React.FC = () => (
    <Modal
      title="学生详情"
      open={detailModalVisible}
      onCancel={handleCloseDetail}
      footer={null}
      width={700}
    >
      {currentStudent && renderDetailContent(currentStudent)}
    </Modal>
  );

  return {
    detailModalVisible,
    currentStudent,
    handleView,
    handleCloseDetail,
    DetailModal,
  };
}
