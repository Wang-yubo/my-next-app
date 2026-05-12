'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  Tag,
  Timeline,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Space,
  Statistic,
  Progress,
  Badge,
  Spin,
  message,
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  ProjectOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  GithubOutlined,
  LinkOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  StarOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const JAVA_API_BASE = process.env.NEXT_PUBLIC_JAVA_API_BASE || 'http://localhost:8080';

interface Student {
  id: string;
  name: string;
  gender: string;
  age: number;
  major: string;
  className: string;
  grade: string;
  phone: string;
  email: string;
  status: string;
  enrollDate: Date;
  avatar: string | null;
  bio: string;
}

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

interface Project {
  _id: string;
  projectName: string;
  description: string;
  role: string;
  technologies: string[];
  startDate: Date;
  endDate?: Date;
  isOngoing: boolean;
  achievements?: string;
  githubUrl?: string;
  demoUrl?: string;
}

interface Reflection {
  _id: string;
  title: string;
  content: string;
  category: string;
  mood?: string;
  tags: string[];
  viewCount?: number;
  createdAt: Date;
}

interface ProfileData {
  student: Student;
  notes: Note[];
  projects: Project[];
  reflections: Reflection[];
  stats: {
    totalCourses: number;
    averageScore: number;
    totalCredits: number;
    noteCount: number;
    projectCount: number;
    reflectionCount: number;
  };
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');
      const result = await response.json();

      if (result.success) {
        const profileData = result.data;

        const notesResponse = await fetch(`${JAVA_API_BASE}/api/notes?page=0&size=3`, {
          credentials: 'include',
        });
        const notesResult = await notesResponse.json();
        const javaNotes: Note[] = notesResult.code === 200 ? (notesResult.data?.content || []) : [];

        setData({
          ...profileData,
          notes: javaNotes,
        });
      } else {
        message.error('获取个人资料失败');
        router.push('/');
      }
    } catch (error) {
      console.error('获取个人资料错误:', error);
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" description="加载中..." />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { student, notes, projects, reflections, stats } = data;

  // 格式化日期为 YYYY-MM-DD HH:mm
  const formatDate = (date: string | Date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  };

  // 心情颜色映射
  const moodColors: Record<string, string> = {
    开心: '#52c41a',
    平静: '#1890ff',
    思考: '#722ed1',
    困惑: '#faad14',
    兴奋: '#eb2f96',
  };

  // 分类颜色映射
  const categoryColors: Record<string, string> = {
    学习感悟: '#1890ff',
    生活随笔: '#52c41a',
    职业规划: '#722ed1',
    其他: '#8c8c8c',
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      {/* 返回按钮 */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/dashboard')}
        style={{ marginBottom: 24 }}
      >
        返回仪表盘
      </Button>

      {/* 顶部封面区域 */}
      <Card
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 16,
          border: 'none',
        }}
        styles={{ body: { padding: '48px 32px' } }}
      >
        <Row align="middle" gutter={24}>
          <Col xs={24} sm={8} md={6} style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={student.avatar || undefined}
              style={{
                border: '4px solid white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            />
          </Col>
          <Col xs={24} sm={16} md={18}>
            <div style={{ color: 'white' }}>
              <Title level={2} style={{ color: 'white', margin: '0 0 8px 0' }}>
                {student.name}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                {student.grade} · {student.major}
              </Text>
              <div style={{ marginTop: 12 }}>
                <Tag color="blue">{student.className}</Tag>
                <Tag color="green">{student.status}</Tag>
              </div>
              {student.bio && (
                <Paragraph
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    marginTop: 16,
                    fontSize: 15,
                    fontStyle: 'italic',
                  }}
                >
                  "{student.bio}"
                </Paragraph>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="已修课程"
              value={stats.totalCourses}
              prefix={<BookOutlined />}
              styles={{ content: { color: '#1890ff' } }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="平均成绩"
              value={stats.averageScore}
              precision={1}
              suffix="分"
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="总学分"
              value={stats.totalCredits}
              prefix={<TrophyOutlined />}
              styles={{ content: { color: '#faad14' } }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="学习笔记"
              value={stats.noteCount}
              prefix={<FileTextOutlined />}
              styles={{ content: { color: '#722ed1' } }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="项目经历"
              value={stats.projectCount}
              prefix={<ProjectOutlined />}
              styles={{ content: { color: '#eb2f96' } }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="心得体会"
              value={stats.reflectionCount}
              prefix={<StarOutlined />}
              styles={{ content: { color: '#13c2c2' } }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主体内容区 */}
      <Row gutter={[24, 24]}>
        {/* 左侧栏 */}
        <Col xs={24} lg={8}>
          {/* 基本信息卡片 */}
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>基本信息</span>
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 16 }}
          >
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">学号：</Text>
                <Text strong>{student.id}</Text>
              </div>
              <div>
                <Text type="secondary">性别：</Text>
                <Text>{student.gender}</Text>
              </div>
              <div>
                <Text type="secondary">年龄：</Text>
                <Text>{student.age}岁</Text>
              </div>
              <div>
                <Text type="secondary">专业：</Text>
                <Text>{student.major}</Text>
              </div>
              <div>
                <Text type="secondary">班级：</Text>
                <Text>{student.className}</Text>
              </div>
              <div>
                <Text type="secondary">年级：</Text>
                <Text>{student.grade}</Text>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div>
                <Space>
                  <PhoneOutlined style={{ color: '#52c41a' }} />
                  <Text>{student.phone}</Text>
                </Space>
              </div>
              <div>
                <Space>
                  <MailOutlined style={{ color: '#1890ff' }} />
                  <Text>{student.email}</Text>
                </Space>
              </div>
              <div>
                <Space>
                  <CalendarOutlined style={{ color: '#722ed1' }} />
                  <Text>入学：{formatDate(student.enrollDate)}</Text>
                </Space>
              </div>
            </Space>
          </Card>

          {/* 技能标签云 */}
          <Card
            title={
              <Space>
                <StarOutlined />
                <span>技能标签</span>
              </Space>
            }
            style={{ borderRadius: 16 }}
          >
            <Space wrap size={[8, 8]}>
              <Tag color="blue">React</Tag>
              <Tag color="cyan">Next.js</Tag>
              <Tag color="purple">TypeScript</Tag>
              <Tag color="orange">Node.js</Tag>
              <Tag color="green">MongoDB</Tag>
              <Tag color="red">JavaScript</Tag>
              <Tag color="volcano">HTML/CSS</Tag>
              <Tag color="geekblue">Git</Tag>
              <Tag color="magenta">Ant Design</Tag>
              <Tag color="gold">RESTful API</Tag>
            </Space>
          </Card>
        </Col>

        {/* 右侧内容区 */}
        <Col xs={24} lg={16}>
          {/* 学习笔记 */}
          <Card
            title={
              <Space>
                <BookOutlined />
                <span>学习笔记</span>
                <Badge count={notes.length} showZero style={{ backgroundColor: '#52c41a' }} />
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 16 }}
            extra={
              <Button type="link" size="small">
                查看全部
              </Button>
            }
          >
            <Timeline
              items={notes.map((note) => ({
                color: '#1890ff',
                children: (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <Title level={5} style={{ margin: 0 }}>
                        {note.title}
                      </Title>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {formatDate(note.createdAt)}
                      </Text>
                    </div>
                    {note.topic && (
                      <Tag color="purple" style={{ marginBottom: 8 }}>
                        {note.topic}
                      </Tag>
                    )}
                    <Paragraph
                      ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
                      style={{ marginBottom: 8 }}
                    >
                      {note.content}
                    </Paragraph>
                    <Space wrap size={[4, 4]}>
                      {note.tags.map((tag) => (
                        <Tag key={tag} color="default" style={{ fontSize: 12 }}>
                          #{tag}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                ),
              }))}
            />
          </Card>

          {/* 项目经历 */}
          <Card
            title={
              <Space>
                <ProjectOutlined />
                <span>项目经历</span>
                <Badge count={projects.length} showZero style={{ backgroundColor: '#eb2f96' }} />
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 16 }}
            extra={
              <Button type="link" size="small">
                查看全部
              </Button>
            }
          >
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
              {projects.map((project) => (
                <Card
                  key={project._id}
                  size="small"
                  style={{ borderRadius: 12 }}
                  title={
                    <Space>
                      <span>{project.projectName}</span>
                      {project.isOngoing && (
                        <Tag color="processing">进行中</Tag>
                      )}
                    </Space>
                  }
                  extra={
                    <Space>
                      {project.githubUrl && (
                        <Button
                          type="text"
                          icon={<GithubOutlined />}
                          href={project.githubUrl}
                          target="_blank"
                          size="small"
                        />
                      )}
                      {project.demoUrl && (
                        <Button
                          type="text"
                          icon={<LinkOutlined />}
                          href={project.demoUrl}
                          target="_blank"
                          size="small"
                        />
                      )}
                    </Space>
                  }
                >
                  <Space orientation="vertical" size="small" style={{ width: '100%' }}>
                    <div>
                      <Text type="secondary">角色：</Text>
                      <Text strong>{project.role}</Text>
                    </div>
                    <Paragraph ellipsis={{ rows: 2 }}>{project.description}</Paragraph>
                    <div>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                        技术栈：
                      </Text>
                      <Space wrap size={[4, 4]}>
                        {project.technologies.map((tech) => (
                          <Tag key={tech} color="cyan" style={{ fontSize: 12 }}>
                            {tech}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                    {project.achievements && (
                      <div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                          成果：
                        </Text>
                        <Text>{project.achievements}</Text>
                      </div>
                    )}
                    <div>
                      <ClockCircleOutlined style={{ marginRight: 4, color: '#8c8c8c' }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {formatDate(project.startDate)} -{' '}
                        {project.endDate ? formatDate(project.endDate) : '至今'}
                      </Text>
                    </div>
                  </Space>
                </Card>
              ))}
            </Space>
          </Card>

          {/* 心得体会 */}
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>心得体会</span>
                <Badge count={reflections.length} showZero style={{ backgroundColor: '#13c2c2' }} />
              </Space>
            }
            style={{ borderRadius: 16 }}
            extra={
              <Button type="link" size="small">
                查看全部
              </Button>
            }
          >
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
              {reflections.map((reflection) => (
                <Card
                  key={reflection._id}
                  size="small"
                  style={{ borderRadius: 12 }}
                  hoverable
                >
                  <Space orientation="vertical" size="small" style={{ width: '100%' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Title level={5} style={{ margin: 0, flex: 1 }}>
                        {reflection.title}
                      </Title>
                      {reflection.mood && (
                        <Tag
                          color={moodColors[reflection.mood] || 'default'}
                          style={{ marginLeft: 8 }}
                        >
                          {reflection.mood}
                        </Tag>
                      )}
                    </div>
                    <div>
                      <Tag color={categoryColors[reflection.category] || 'default'}>
                        {reflection.category}
                      </Tag>
                      <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                        {formatDate(reflection.createdAt)}
                      </Text>
                      {reflection.viewCount !== undefined && (
                        <Text type="secondary" style={{ fontSize: 12, marginLeft: 12 }}>
                          👁 {reflection.viewCount}
                        </Text>
                      )}
                    </div>
                    <Paragraph
                      ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {reflection.content}
                    </Paragraph>
                    <Space wrap size={[4, 4]}>
                      {reflection.tags.map((tag) => (
                        <Tag key={tag} color="default" style={{ fontSize: 12 }}>
                          #{tag}
                        </Tag>
                      ))}
                    </Space>
                  </Space>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 底部装饰 */}
      <div
        style={{
          textAlign: 'center',
          padding: '48px 0 24px',
          color: '#8c8c8c',
        }}
      >
        <Text type="secondary">
          📚 持续学习，不断进步 | Made with ❤️ by {student.name}
        </Text>
      </div>
    </div>
  );
}
