'use client';

import React from 'react';
import { Modal, Form, Select, Button, Space, message, Descriptions, Tag, Spin } from 'antd';
import { useRequest } from 'ahooks';

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

interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  credit: number;
  teacher: {
    name: string;
    title: string;
  };
  schedule: string;
  classroom: {
    building: string;
    roomNumber: string;
  };
  maxStudents: number;
  enrolledStudents: number;
  status: string;
}

interface Student {
  _id: string;
  id: string;
  name: string;
  major: string;
  grade: string;
  status: string;
}

interface EnrollmentFormData {
  studentId: string;
  courseId: string;
}

interface UseEnrollmentFormModalReturn {
  formModalVisible: boolean;
  editingEnrollment: Enrollment | null;
  form: any;
  createLoading: boolean;
  updateLoading: boolean;
  selectedCourse: Course | null;
  handleAdd: () => void;
  handleEdit: (record: Enrollment) => void;
  handleCloseForm: () => void;
  handleSubmit: (values: EnrollmentFormData) => void;
  handleCourseChange: (courseId: string) => void;
  FormModal: React.FC;
}

export function useEnrollmentFormModal(
  pagination: { current: number; pageSize: number; total: number },
  searchText: string,
  fetchEnrollments: (params?: any) => void
): UseEnrollmentFormModalReturn {
  const [formModalVisible, setFormModalVisible] = React.useState(false);
  const [editingEnrollment, setEditingEnrollment] = React.useState<Enrollment | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form] = Form.useForm<any>();
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [availableCourses, setAvailableCourses] = React.useState<Course[]>([]);
  const [availableStudents, setAvailableStudents] = React.useState<Student[]>([]);
  const [loadingData, setLoadingData] = React.useState(false);

  // 获取可选课程列表（状态为开设中且未满员）
  const { run: fetchAvailableCourses } = useRequest(
    async () => {
      const response = await fetch('/api/courses?pageSize=100');
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || '获取课程列表失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: (result) => {
        const filtered = result.data.filter((course: Course) => 
          course.status === '开设中' && course.enrolledStudents < course.maxStudents
        );
        setAvailableCourses(filtered);
      },
      onError: (error) => {
        message.error(error.message || '获取课程列表失败');
      },
    }
  );
  
  // 获取可选学生列表（状态为在读）
  const { run: fetchAvailableStudents } = useRequest(
    async () => {
      const response = await fetch('/api/students?pageSize=100');
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || '获取学生列表失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: (result) => {
        const filtered = result.data.filter((student: Student) => 
          student.status === '在读'
        );
        setAvailableStudents(filtered);
      },
      onError: (error) => {
        message.error(error.message || '获取学生列表失败');
      },
    }
  );

  // 创建选课
  const { run: createEnrollment, loading: createLoading } = useRequest(
    async (data: EnrollmentFormData) => {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || '选课失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('选课成功');
        setFormModalVisible(false);
        form.resetFields();
        setEditingEnrollment(null);
        setSelectedCourse(null);
        fetchEnrollments({
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
      onError: (error) => {
        message.error(error.message || '选课失败');
      },
    }
  );

  // 更新选课
  const { run: updateEnrollment, loading: updateLoading } = useRequest(
    async ({ id, data }: { id: string; data: EnrollmentFormData }) => {
      const response = await fetch(`/api/enrollments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || '修改失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('修改成功');
        setFormModalVisible(false);
        form.resetFields();
        setEditingEnrollment(null);
        setSelectedCourse(null);
        fetchEnrollments({
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
      onError: (error) => {
        message.error(error.message || '修改失败');
      },
    }
  );

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingEnrollment(null);
    setSelectedCourse(null);
    form.resetFields();
    setLoadingData(true);
    setFormModalVisible(true);
    Promise.all([
      fetchAvailableCourses(),
      fetchAvailableStudents(),
    ]).finally(() => {
      setLoadingData(false);
    });
  };

  // 打开编辑弹窗
  const handleEdit = (record: Enrollment) => {
    setEditingEnrollment(record);
    form.setFieldsValue({
      studentId: record.studentId,
      courseId: record.courseId,
    });
    
    setLoadingData(true);
    setFormModalVisible(true);
    
    Promise.all([
      fetchAvailableCourses(),
      fetchAvailableStudents(),
    ]).then(() => {
      const course = availableCourses.find(c => c._id === record.courseId);
      if (course) {
        setSelectedCourse(course);
      }
    }).finally(() => {
      setLoadingData(false);
    });
  };

  // 关闭表单弹窗
  const handleCloseForm = () => {
    setFormModalVisible(false);
    form.resetFields();
    setEditingEnrollment(null);
    setSelectedCourse(null);
  };

  // 表单提交
  const handleSubmit = async (values: EnrollmentFormData) => {
    if (editingEnrollment) {
      updateEnrollment({ id: editingEnrollment._id, data: values });
    } else {
      createEnrollment(values);
    }
  };

  // 课程选择变化
  const handleCourseChange = (courseId: string) => {
    const course = availableCourses.find(c => c._id === courseId);
    setSelectedCourse(course || null);
  };

  // 渲染课程信息骨架屏
  const renderCourseInfoSkeleton = () => (
    <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
      <Spin tip="加载课程信息...">
        <div style={{ minHeight: 120 }} />
      </Spin>
    </div>
  );

  // 渲染课程信息
  const renderCourseInfo = (course: Course) => (
    <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
      <Descriptions column={2} size="small">
        <Descriptions.Item label="课程编号">{course.courseCode}</Descriptions.Item>
        <Descriptions.Item label="课程名称">{course.courseName}</Descriptions.Item>
        <Descriptions.Item label="学分">{course.credit}</Descriptions.Item>
        <Descriptions.Item label="授课教师">{course.teacher.name}</Descriptions.Item>
        <Descriptions.Item label="上课时间" span={2}>{course.schedule}</Descriptions.Item>
        <Descriptions.Item label="上课地点" span={2}>
          {course.classroom.building} {course.classroom.roomNumber}
        </Descriptions.Item>
        <Descriptions.Item label="选课人数" span={2}>
          <Tag color={course.enrolledStudents >= course.maxStudents ? 'red' : 'green'}>
            {course.enrolledStudents} / {course.maxStudents}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  // 渲染表单内容
  const renderFormContent = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ marginTop: 24 }}
      autoComplete="off"
    >
      {!editingEnrollment && (
        <Form.Item
          label="选择学生"
          name="studentId"
          rules={[{ required: true, message: '请选择学生' }]}
        >
          <Select
            placeholder="请选择要选课的学生"
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={availableStudents.map(student => ({
              value: student.id,
              label: `${student.id} - ${student.name} (${student.major})`,
            }))}
          />
        </Form.Item>
      )}

      <Form.Item
        label="选择课程"
        name="courseId"
        rules={[{ required: true, message: '请选择课程' }]}
      >
        <Select
          placeholder="请选择要选的课程"
          showSearch
          optionFilterProp="label"
          filterOption={(input, option) =>
            String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          onChange={handleCourseChange}
          options={availableCourses.map(course => ({
            value: course._id,
            label: `${course.courseCode} - ${course.courseName}`,
            disabled: course.enrolledStudents >= course.maxStudents,
          }))}
        />
      </Form.Item>

      {loadingData ? renderCourseInfoSkeleton() : selectedCourse ? renderCourseInfo(selectedCourse) : null}

      <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
        <Space>
          <Button onClick={handleCloseForm}>取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createLoading || updateLoading}
            disabled={!selectedCourse}
          >
            {editingEnrollment ? '保存' : '添加'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  // 渲染表单弹窗
  const FormModal: React.FC = () => (
    <Modal
      title={editingEnrollment ? '修改选课' : '新增选课'}
      open={formModalVisible}
      onCancel={handleCloseForm}
      footer={null}
      width={700}
      destroyOnClose
    >
      {renderFormContent()}
    </Modal>
  );

  return {
    formModalVisible,
    editingEnrollment,
    form,
    createLoading,
    updateLoading,
    selectedCourse,
    handleAdd,
    handleEdit,
    handleCloseForm,
    handleSubmit,
    handleCourseChange,
    FormModal,
  };
}
