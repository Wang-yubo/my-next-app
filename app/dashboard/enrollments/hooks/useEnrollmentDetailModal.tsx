'use client';

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';

interface Enrollment {
  _id: string;
  studentId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  credit: number;
  teacher: string;
  schedule: string;
  classroom: string;
  enrollDate: string;
  status: '已选课' | '已退课';
  key: string;
}

interface UseEnrollmentDetailModalReturn {
  detailModalVisible: boolean;
  currentEnrollment: Enrollment | null;
  handleView: (record: Enrollment) => void;
  handleCloseDetail: () => void;
  DetailModal: React.FC;
}

// 状态标签颜色映射
const statusColorMap: Record<string, string> = {
  已选课: 'green',
  已退课: 'default',
};

export function useEnrollmentDetailModal(): UseEnrollmentDetailModalReturn {
  const [detailModalVisible, setDetailModalVisible] = React.useState(false);
  const [currentEnrollment, setCurrentEnrollment] = React.useState<Enrollment | null>(null);

  // 查看选课详情
  const handleView = (record: Enrollment) => {
    setCurrentEnrollment(record);
    setDetailModalVisible(true);
  };

  // 关闭详情弹窗
  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setCurrentEnrollment(null);
  };

  // 渲染详情内容
  const renderDetailContent = (enrollment: Enrollment) => (
    <div style={{ marginTop: 16 }}>
      <Descriptions column={2} bordered>
        <Descriptions.Item label="课程编号">{enrollment.courseCode}</Descriptions.Item>
        <Descriptions.Item label="课程名称">{enrollment.courseName}</Descriptions.Item>
        <Descriptions.Item label="学分">{enrollment.credit}</Descriptions.Item>
        <Descriptions.Item label="授课教师">{enrollment.teacher}</Descriptions.Item>
        <Descriptions.Item label="上课时间" span={2}>{enrollment.schedule}</Descriptions.Item>
        <Descriptions.Item label="上课地点" span={2}>{enrollment.classroom}</Descriptions.Item>
        <Descriptions.Item label="选课状态">
          <Tag color={statusColorMap[enrollment.status]}>{enrollment.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="选课日期" span={2}>
          {new Date(enrollment.enrollDate).toLocaleDateString('zh-CN')}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  // 渲染详情弹窗
  const DetailModal: React.FC = () => (
    <Modal
      title="选课详情"
      open={detailModalVisible}
      onCancel={handleCloseDetail}
      footer={null}
      width={700}
    >
      {currentEnrollment && renderDetailContent(currentEnrollment)}
    </Modal>
  );

  return {
    detailModalVisible,
    currentEnrollment,
    handleView,
    handleCloseDetail,
    DetailModal,
  };
}
