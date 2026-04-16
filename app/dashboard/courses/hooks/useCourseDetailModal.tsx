'use client';

import React from 'react';
import { Modal, Card, Space, Tag, Descriptions, Alert } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  description: string;
  credit: number;
  hours: number;
  semester: string;
  textbook: {
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    price: number;
  };
  teacher: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  classroom: {
    building: string;
    roomNumber: string;
    capacity: number;
    location: string;
  };
  tuition: number;
  maxStudents: number;
  enrolledStudents: number;
  status: '开设中' | '已结课' | '待审核';
  schedule: string;
  prerequisite: string[];
  key: string;
}

interface UseCourseDetailModalReturn {
  detailModalVisible: boolean;
  currentCourse: Course | null;
  handleView: (record: Course) => void;
  handleCloseDetail: () => void;
  DetailModal: React.FC;
}

// 状态标签颜色映射
const statusColorMap: Record<string, string> = {
  开设中: 'blue',
  已结课: 'green',
  待审核: 'orange',
};

export function useCourseDetailModal(): UseCourseDetailModalReturn {
  const [detailModalVisible, setDetailModalVisible] = React.useState(false);
  const [currentCourse, setCurrentCourse] = React.useState<Course | null>(null);

  // 查看课程详情
  const handleView = (record: Course) => {
    setCurrentCourse(record);
    setDetailModalVisible(true);
  };

  // 关闭详情弹窗
  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setCurrentCourse(null);
  };

  // 渲染详情内容
  const renderDetailContent = (course: Course) => (
    <div style={{ marginTop: 16 }}>
      <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="课程编号">{course.courseCode}</Descriptions.Item>
          <Descriptions.Item label="课程名称">{course.courseName}</Descriptions.Item>
          <Descriptions.Item label="学分">{course.credit}</Descriptions.Item>
          <Descriptions.Item label="学时">{course.hours}</Descriptions.Item>
          <Descriptions.Item label="学期">{course.semester}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusColorMap[course.status]}>{course.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="上课时间" span={2}>{course.schedule}</Descriptions.Item>
          <Descriptions.Item label="学费">¥{course.tuition}</Descriptions.Item>
          <Descriptions.Item label="课程简介" span={2}>{course.description}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 课程视频预览 */}
      <Card
        title={
          <Space>
            <PlayCircleOutlined />
            <span>课程视频预览</span>
          </Space>
        }
        size="small"
        style={{ marginBottom: 16 }}
      >
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <video
            controls
            autoPlay={false}
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: 8,
              backgroundColor: '#000',
            }}
          >
            <source
              src="https://vsp21003play.cucloud.cn:8083/SPk2s32g3WaG/GSPk2s32g3WaG-gVoe3sL7pP.flv?sms=ad305697539410c4889a965c1f&codeType=H265&version=20260416142654.180"
              type="video/x-flv"
            />
            <p style={{ textAlign: 'center', padding: '20px', color: '#fff' }}>
              您的浏览器不支持 FLV 视频格式播放。建议使用支持 FLV 格式的现代浏览器，或联系管理员转换视频格式。
            </p>
          </video>
        </div>
        <div style={{ marginTop: 16 }}>
          <Alert
            message="视频格式说明"
            description={
              <div>
                <p style={{ margin: '4px 0' }}>当前视频为 FLV 格式，部分浏览器可能不支持原生播放。</p>
                <p style={{ margin: '4px 0' }}>
                  建议：如需在浏览器中流畅播放，建议将视频转换为 MP4 (H.264) 格式，或使用 flv.js 库实现 FLV 播放。
                </p>
              </div>
            }
            type="info"
            showIcon
          />
        </div>
      </Card>

      <Card title="教材信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="教材名称">{course.textbook.title}</Descriptions.Item>
          <Descriptions.Item label="作者">{course.textbook.author}</Descriptions.Item>
          <Descriptions.Item label="出版社">{course.textbook.publisher}</Descriptions.Item>
          <Descriptions.Item label="ISBN">{course.textbook.isbn}</Descriptions.Item>
          <Descriptions.Item label="价格">¥{course.textbook.price}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="教师信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="教师姓名">{course.teacher.name}</Descriptions.Item>
          <Descriptions.Item label="职称">{course.teacher.title}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{course.teacher.email}</Descriptions.Item>
          <Descriptions.Item label="电话">{course.teacher.phone}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="教室信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="教学楼">{course.classroom.building}</Descriptions.Item>
          <Descriptions.Item label="教室号">{course.classroom.roomNumber}</Descriptions.Item>
          <Descriptions.Item label="容量">{course.classroom.capacity}人</Descriptions.Item>
          <Descriptions.Item label="位置">{course.classroom.location}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="其他信息" size="small">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="最大人数">{course.maxStudents}人</Descriptions.Item>
          <Descriptions.Item label="已选人数">{course.enrolledStudents}人</Descriptions.Item>
          <Descriptions.Item label="先修课程" span={2}>
            {course.prerequisite.length > 0
              ? course.prerequisite.join('、')
              : '无'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );

  // 渲染详情弹窗
  const DetailModal: React.FC = () => (
    <Modal
      title="课程详情"
      open={detailModalVisible}
      onCancel={handleCloseDetail}
      footer={null}
      width={900}
    >
      {currentCourse && renderDetailContent(currentCourse)}
    </Modal>
  );

  return {
    detailModalVisible,
    currentCourse,
    handleView,
    handleCloseDetail,
    DetailModal,
  };
}
