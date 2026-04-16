'use client';

import React from 'react';
import { Modal, Form, Input, Select, Button, Space, Row, Col, message } from 'antd';
import { useRequest } from 'ahooks';

const { TextArea } = Input;

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

interface CourseFormData {
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
}

interface UseCourseFormModalReturn {
  formModalVisible: boolean;
  editingCourse: Course | null;
  form: any;
  createLoading: boolean;
  updateLoading: boolean;
  handleAdd: () => void;
  handleEdit: (record: Course) => void;
  handleCloseForm: () => void;
  handleSubmit: (values: CourseFormData) => void;
  FormModal: React.FC;
}

export function useCourseFormModal(
  pagination: { current: number; pageSize: number; total: number },
  searchText: string,
  fetchCourses: (params?: any) => void
): UseCourseFormModalReturn {
  const [formModalVisible, setFormModalVisible] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form] = Form.useForm<any>();

  // 创建课程
  const { run: createCourse, loading: createLoading } = useRequest(
    async (data: CourseFormData) => {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          credit: parseInt(String(data.credit)),
          hours: parseInt(String(data.hours)),
          tuition: parseFloat(String(data.tuition)),
          maxStudents: parseInt(String(data.maxStudents)),
          enrolledStudents: parseInt(String(data.enrolledStudents)),
        }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || '创建失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('添加成功');
        setFormModalVisible(false);
        form.resetFields();
        setEditingCourse(null);
        fetchCourses({
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
      onError: (error) => {
        message.error(error.message || '创建失败');
      },
    }
  );

  // 更新课程
  const { run: updateCourse, loading: updateLoading } = useRequest(
    async ({ id, data }: { id: string; data: CourseFormData }) => {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          credit: parseInt(String(data.credit)),
          hours: parseInt(String(data.hours)),
          tuition: parseFloat(String(data.tuition)),
          maxStudents: parseInt(String(data.maxStudents)),
          enrolledStudents: parseInt(String(data.enrolledStudents)),
        }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || '更新失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('编辑成功');
        setFormModalVisible(false);
        form.resetFields();
        setEditingCourse(null);
        fetchCourses({
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

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setFormModalVisible(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record: Course) => {
    setEditingCourse(record);
    form.setFieldsValue({
      courseName: record.courseName,
      description: record.description,
      credit: record.credit,
      hours: record.hours,
      semester: record.semester,
      textbook: record.textbook,
      teacher: record.teacher,
      classroom: record.classroom,
      tuition: record.tuition,
      maxStudents: record.maxStudents,
      enrolledStudents: record.enrolledStudents,
      status: record.status,
      schedule: record.schedule,
      prerequisite: record.prerequisite,
    });
    setFormModalVisible(true);
  };

  // 关闭表单弹窗
  const handleCloseForm = () => {
    setFormModalVisible(false);
    form.resetFields();
    setEditingCourse(null);
  };

  // 表单提交
  const handleSubmit = async (values: CourseFormData) => {
    if (editingCourse) {
      updateCourse({ id: editingCourse._id, data: values });
    } else {
      createCourse(values);
    }
  };

  // 渲染表单内容
  const renderFormContent = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ marginTop: 24 }}
      autoComplete="off"
      initialValues={{
        status: '开设中',
        enrolledStudents: 0,
        prerequisite: [],
      }}
    >
      <h3 style={{ marginBottom: 16 }}>基本信息</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="课程名称"
            name="courseName"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="请输入课程名称" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="学分"
            name="credit"
            rules={[{ required: true, message: '请输入学分' }]}
          >
            <Input type="number" placeholder="1-6" min={1} max={6} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="学时"
            name="hours"
            rules={[{ required: true, message: '请输入学时' }]}
          >
            <Input type="number" placeholder="请输入学时" min={1} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="学期"
            name="semester"
            rules={[{ required: true, message: '请输入学期' }]}
          >
            <Input placeholder="如：2024春季学期" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="上课时间"
            name="schedule"
            rules={[{ required: true, message: '请输入上课时间' }]}
          >
            <Input placeholder="如：周一第1-2节" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="开设中">开设中</Select.Option>
              <Select.Option value="已结课">已结课</Select.Option>
              <Select.Option value="待审核">待审核</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="课程简介"
        name="description"
        rules={[{ required: true, message: '请输入课程简介' }]}
      >
        <TextArea rows={3} placeholder="请输入课程简介" />
      </Form.Item>

      <h3 style={{ margin: '24px 0 16px' }}>教材信息</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="教材名称"
            name={['textbook', 'title'] as any}
            rules={[{ required: true, message: '请输入教材名称' }]}
          >
            <Input placeholder="请输入教材名称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="作者"
            name={['textbook', 'author'] as any}
            rules={[{ required: true, message: '请输入作者' }]}
          >
            <Input placeholder="请输入作者" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="出版社"
            name={['textbook', 'publisher'] as any}
            rules={[{ required: true, message: '请输入出版社' }]}
          >
            <Input placeholder="请输入出版社" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="ISBN"
            name={['textbook', 'isbn'] as any}
            rules={[{ required: true, message: '请输入ISBN' }]}
          >
            <Input placeholder="请输入ISBN" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="价格"
            name={['textbook', 'price'] as any}
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <Input type="number" placeholder="请输入价格" min={0} />
          </Form.Item>
        </Col>
      </Row>

      <h3 style={{ margin: '24px 0 16px' }}>教师信息</h3>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="教师姓名"
            name={['teacher', 'name'] as any}
            rules={[{ required: true, message: '请输入教师姓名' }]}
          >
            <Input placeholder="请输入教师姓名" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="职称"
            name={['teacher', 'title'] as any}
            rules={[{ required: true, message: '请输入职称' }]}
          >
            <Input placeholder="如：教授、副教授" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="电话"
            name={['teacher', 'phone'] as any}
            rules={[
              { required: true, message: '请输入电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
            ]}
          >
            <Input placeholder="请输入电话" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="邮箱"
            name={['teacher', 'email'] as any}
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
        </Col>
      </Row>

      <h3 style={{ margin: '24px 0 16px' }}>教室信息</h3>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="教学楼"
            name={['classroom', 'building'] as any}
            rules={[{ required: true, message: '请输入教学楼' }]}
          >
            <Input placeholder="如：第一教学楼" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="教室号"
            name={['classroom', 'roomNumber'] as any}
            rules={[{ required: true, message: '请输入教室号' }]}
          >
            <Input placeholder="如：A301" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="容量"
            name={['classroom', 'capacity'] as any}
            rules={[{ required: true, message: '请输入容量' }]}
          >
            <Input type="number" placeholder="请输入容量" min={1} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="位置"
            name={['classroom', 'location'] as any}
            rules={[{ required: true, message: '请输入位置' }]}
          >
            <Input placeholder="如：东区3楼" />
          </Form.Item>
        </Col>
      </Row>

      <h3 style={{ margin: '24px 0 16px' }}>其他信息</h3>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="学费"
            name="tuition"
            rules={[{ required: true, message: '请输入学费' }]}
          >
            <Input type="number" placeholder="请输入学费" min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="最大人数"
            name="maxStudents"
            rules={[{ required: true, message: '请输入最大人数' }]}
          >
            <Input type="number" placeholder="请输入最大人数" min={1} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="已选人数"
            name="enrolledStudents"
            rules={[{ required: true, message: '请输入已选人数' }]}
          >
            <Input type="number" placeholder="请输入已选人数" min={0} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="先修课程" name="prerequisite">
        <Select
          mode="tags"
          placeholder="输入先修课程名称，回车确认"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button onClick={handleCloseForm}>取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createLoading || updateLoading}
          >
            {editingCourse ? '保存' : '添加'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  // 渲染表单弹窗
  const FormModal: React.FC = () => (
    <Modal
      title={editingCourse ? '编辑课程' : '新增课程'}
      open={formModalVisible}
      onCancel={handleCloseForm}
      footer={null}
      width={900}
      destroyOnClose
    >
      {renderFormContent()}
    </Modal>
  );

  return {
    formModalVisible,
    editingCourse,
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
