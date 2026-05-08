'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Spin, Tag, Space, theme } from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  UserOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { get } from '@/lib/request';

interface GradeStat {
  grade: string;
  count: number;
}

interface GenderStat {
  gender: string;
  count: number;
}

interface StatsData {
  studentTotal: number;
  teacherTotal: number;
  courseTotal: number;
  enrollmentTotal: number;
  studentsByGrade: GradeStat[];
  studentsByGender: GenderStat[];
  recentEnrollments: any[];
}

const gradeColors = ['#1677ff', '#52c41a', '#faad14', '#722ed1', '#eb2f96', '#13c2c2'];

const genderColors: Record<string, string> = {
  男: '#1677ff',
  女: '#eb2f96',
};

export default function DashboardPage() {
  const { token } = theme.useToken();

  const { data: statsData, loading } = useRequest(
    async () => {
      const result = await get('/api/dashboard/stats');
      return result.data as StatsData;
    },
    { manual: false, defaultParams: [] }
  );

  const stats = statsData || {
    studentTotal: 0,
    teacherTotal: 0,
    courseTotal: 0,
    enrollmentTotal: 0,
    studentsByGrade: [],
    studentsByGender: [],
    recentEnrollments: [],
  };

  const totalGender = stats.studentsByGender.reduce((sum, g) => sum + g.count, 0);
  const totalGrade = stats.studentsByGrade.reduce((sum, g) => sum + g.count, 0);
  const maxGrade = Math.max(...stats.studentsByGrade.map((g) => g.count), 1);

  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        仪表盘
      </h1>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable styles={{ body: { padding: '24px 16px' } }}>
              <Statistic
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TeamOutlined style={{ fontSize: 20, color: '#1677ff' }} />
                    <span>学生总数</span>
                  </div>
                }
                value={stats.studentTotal}
                valueStyle={{ color: '#1677ff', fontSize: 28 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card hoverable styles={{ body: { padding: '24px 16px' } }}>
              <Statistic
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BookOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                    <span>课程总数</span>
                  </div>
                }
                value={stats.courseTotal}
                valueStyle={{ color: '#52c41a', fontSize: 28 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card hoverable styles={{ body: { padding: '24px 16px' } }}>
              <Statistic
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserOutlined style={{ fontSize: 20, color: '#722ed1' }} />
                    <span>教师总数</span>
                  </div>
                }
                value={stats.teacherTotal}
                valueStyle={{ color: '#722ed1', fontSize: 28 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card hoverable styles={{ body: { padding: '24px 16px' } }}>
              <Statistic
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ScheduleOutlined style={{ fontSize: 20, color: '#faad14' }} />
                    <span>选课总数</span>
                  </div>
                }
                value={stats.enrollmentTotal}
                valueStyle={{ color: '#faad14', fontSize: 28 }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={14}>
            <Card title="各年级学生分布">
              {stats.studentsByGrade.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>
                  暂无数据
                </div>
              ) : (
                <div style={{ padding: '8px 0' }}>
                  {stats.studentsByGrade.map((item, index) => (
                    <div key={item.grade} style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 6,
                          fontSize: 14,
                        }}
                      >
                        <span style={{ color: token.colorText }}>{item.grade}</span>
                        <span style={{ color: token.colorTextSecondary }}>
                          {item.count} 人
                          {totalGrade > 0 && (
                            <span style={{ marginLeft: 4 }}>
                              ({((item.count / totalGrade) * 100).toFixed(1)}%)
                            </span>
                          )}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 28,
                          backgroundColor: '#f5f5f5',
                          borderRadius: 6,
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${(item.count / maxGrade) * 100}%`,
                            backgroundColor: gradeColors[index % gradeColors.length],
                            borderRadius: 6,
                            transition: 'width 0.6s ease',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: 10,
                            minWidth: item.count > 0 ? 40 : 0,
                          }}
                        >
                          <span
                            style={{
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 600,
                              opacity: (item.count / maxGrade) > 0.3 ? 1 : 0,
                            }}
                          >
                            {item.count} 人
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card title="学生性别分布">
              {stats.studentsByGender.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>
                  暂无数据
                </div>
              ) : (
                <div style={{ padding: '16px 0', textAlign: 'center' }}>
                  <div
                    style={{
                      width: 160,
                      height: 160,
                      borderRadius: '50%',
                      margin: '0 auto 20px',
                      background: `conic-gradient(
                        ${stats.studentsByGender
                          .map((item, index) => {
                            const startPct = stats.studentsByGender
                              .slice(0, index)
                              .reduce((s, g) => s + (g.count / totalGender) * 100, 0);
                            const pct = (item.count / totalGender) * 100;
                            return `${genderColors[item.gender] || '#ccc'} ${startPct}% ${startPct + pct}%`;
                          })
                          .join(', ')}
                      )`,
                      position: 'relative',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: 20, fontWeight: 700, color: token.colorText }}>
                        {totalGender}
                      </span>
                      <span style={{ fontSize: 12, color: token.colorTextSecondary }}>总人数</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 24,
                      flexWrap: 'wrap',
                    }}
                  >
                    {stats.studentsByGender.map((item) => (
                      <div key={item.gender} style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            display: 'inline-block',
                            width: 12,
                            height: 12,
                            borderRadius: 3,
                            backgroundColor: genderColors[item.gender] || '#ccc',
                            marginRight: 6,
                            verticalAlign: 'middle',
                          }}
                        />
                        <span style={{ fontSize: 14, color: token.colorTextSecondary }}>
                          {item.gender}
                        </span>
                        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4, color: token.colorText }}>
                          {item.count}
                          <span style={{ fontSize: 13, fontWeight: 400, color: token.colorTextSecondary, marginLeft: 4 }}>
                            ({(totalGender > 0 ? ((item.count / totalGender) * 100).toFixed(1) : 0)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        <Card
          title="近期选课动态"
          style={{ marginTop: 16 }}
        >
          {stats.recentEnrollments.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>
              暂无选课记录
            </div>
          ) : (
            <div>
              {stats.recentEnrollments.map((enrollment: any) => (
                <div
                  key={enrollment._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <ScheduleOutlined style={{ fontSize: 18, color: '#1677ff' }} />
                    <div>
                      <span style={{ fontWeight: 500, marginRight: 8 }}>
                        {enrollment.studentName || enrollment.studentId}
                      </span>
                      <span style={{ color: token.colorTextSecondary }}>
                        选修了 <strong>{enrollment.courseName}</strong>
                      </span>
                    </div>
                  </div>
                  <Space>
                    <Tag color="blue">{enrollment.courseCode}</Tag>
                    <span style={{ fontSize: 13, color: token.colorTextSecondary }}>
                      {dayjs(enrollment.createdAt).format('MM-DD HH:mm')}
                    </span>
                  </Space>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Spin>
    </div>
  );
}
