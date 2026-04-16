'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  theme,
  Card,
  Descriptions,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
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

// 状态标签颜色映射
const statusColorMap: Record<string, string> = {
  开设中: 'blue',
  已结课: 'green',
  待审核: 'orange',
};

export default function CoursesPage() {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form] = Form.useForm<any>();

  const {
    token: { colorText },
  } = theme.useToken();

  // 获取课程列表
  const {
    data: coursesData,
    loading: coursesLoading,
    run: fetchCourses,
  } = useRequest(
    async (params = {}) => {
      const { page = 1, pageSize = 10, search = '' } = params as any;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
      });

      const response = await fetch(`/api/courses?${queryParams}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || '获取数据失败');
      }

      return result;
    },
    {
      manual: false,
      onSuccess: (result) => {
        const courses = result.data.map((item: any) => ({
          ...item,
          key: item._id,
        }));

        setPagination({
          current: result.page,
          pageSize: result.pageSize,
          total: result.total,
        });

        return courses;
      },
      defaultParams: [{ page: 1, pageSize: 10, search: '' }],
    }
  );

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
        setIsModalVisible(false);
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
        setIsModalVisible(false);
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

  // 删除课程
  const { run: deleteCourse, loading: deleteLoading } = useRequest(
    async (id: string) => {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || '删除失败');
      }
      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('删除成功');
        fetchCourses({
          page: pagination.current,
          pageSize: pagination.pageSize,
          search: searchText,
        });
      },
      onError: (error) => {
        message.error(error.message || '删除失败');
      },
    }
  );

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchCourses({ page: 1, pageSize: pagination.pageSize, search: value });
  };

  // 分页变化
  const handleTableChange = (newPagination: any) => {
    fetchCourses({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      search: searchText,
    });
  };

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalVisible(true);
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
    setIsModalVisible(true);
  };

  // 查看课程详情
  const handleView = (record: Course) => {
    Modal.info({
      title: '课程详情',
      width: 900,
      content: (
        <div style={{ marginTop: 16 }}>
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="课程编号">{record.courseCode}</Descriptions.Item>
              <Descriptions.Item label="课程名称">{record.courseName}</Descriptions.Item>
              <Descriptions.Item label="学分">{record.credit}</Descriptions.Item>
              <Descriptions.Item label="学时">{record.hours}</Descriptions.Item>
              <Descriptions.Item label="学期">{record.semester}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusColorMap[record.status]}>{record.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="上课时间" span={2}>{record.schedule}</Descriptions.Item>
              <Descriptions.Item label="学费">¥{record.tuition}</Descriptions.Item>
              <Descriptions.Item label="课程简介" span={2}>{record.description}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="教材信息" size="small" style={{ marginBottom: 16 }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="教材名称">{record.textbook.title}</Descriptions.Item>
              <Descriptions.Item label="作者">{record.textbook.author}</Descriptions.Item>
              <Descriptions.Item label="出版社">{record.textbook.publisher}</Descriptions.Item>
              <Descriptions.Item label="ISBN">{record.textbook.isbn}</Descriptions.Item>
              <Descriptions.Item label="价格">¥{record.textbook.price}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="教师信息" size="small" style={{ marginBottom: 16 }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="教师姓名">{record.teacher.name}</Descriptions.Item>
              <Descriptions.Item label="职称">{record.teacher.title}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{record.teacher.email}</Descriptions.Item>
              <Descriptions.Item label="电话">{record.teacher.phone}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="教室信息" size="small" style={{ marginBottom: 16 }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="教学楼">{record.classroom.building}</Descriptions.Item>
              <Descriptions.Item label="教室号">{record.classroom.roomNumber}</Descriptions.Item>
              <Descriptions.Item label="容量">{record.classroom.capacity}人</Descriptions.Item>
              <Descriptions.Item label="位置">{record.classroom.location}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="其他信息" size="small">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="最大人数">{record.maxStudents}人</Descriptions.Item>
              <Descriptions.Item label="已选人数">{record.enrolledStudents}人</Descriptions.Item>
              <Descriptions.Item label="先修课程" span={2}>
                {record.prerequisite.length > 0
                  ? record.prerequisite.join('、')
                  : '无'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      ),
      okText: '关闭',
    });
  };

  // 表单提交
  const handleSubmit = async (values: CourseFormData) => {
    if (editingCourse) {
      updateCourse({ id: editingCourse._id, data: values });
    } else {
      createCourse(values);
    }
  };

  // 表格列定义
  const columns: ColumnsType<Course> = [
    {
      title: '课程编号',
      dataIndex: 'courseCode',
      key: 'courseCode',
      width: 120,
      fixed: 'left',
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
      width: 200,
    },
    {
      title: '学分',
      dataIndex: 'credit',
      key: 'credit',
      width: 80,
    },
    {
      title: '学时',
      dataIndex: 'hours',
      key: 'hours',
      width: 80,
    },
    {
      title: '学期',
      dataIndex: 'semester',
      key: 'semester',
      width: 100,
    },
    {
      title: '授课教师',
      dataIndex: ['teacher', 'name'],
      key: 'teacherName',
      width: 120,
    },
    {
      title: '教师职称',
      dataIndex: ['teacher', 'title'],
      key: 'teacherTitle',
      width: 100,
    },
    {
      title: '教室',
      render: (_, record) =>
        `${record.classroom.building}${record.classroom.roomNumber}`,
      key: 'classroom',
      width: 120,
    },
    {
      title: '学费',
      dataIndex: 'tuition',
      key: 'tuition',
      width: 100,
      render: (value: number) => `¥${value}`,
    },
    {
      title: '已选/最大',
      key: 'students',
      width: 100,
      render: (_, record) =>
        `${record.enrolledStudents}/${record.maxStudents}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该课程吗？"
            description="删除后无法恢复"
            onConfirm={() => deleteCourse(record._id)}
            okText="确定"
            cancelText="取消"
            okButtonProps={{ loading: deleteLoading }}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={deleteLoading}
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
      {/* 页面标题和操作按钮 */}
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: colorText }}>
          课程信息管理
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增课程
        </Button>
      </div>

      {/* 搜索框 */}
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="搜索课程编号、课程名称或教师姓名"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ maxWidth: 500 }}
        />
      </div>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={coursesData?.data || []}
        loading={coursesLoading}
        scroll={{ x: 1800 }}
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

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingCourse ? '编辑课程' : '新增课程'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCourse(null);
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
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

          <Form.Item
            label="先修课程"
            name="prerequisite"
          >
            <Select
              mode="tags"
              placeholder="输入先修课程名称，回车确认"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setEditingCourse(null);
                }}
              >
                取消
              </Button>
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
      </Modal>
    </div>
  );
}
