'use client';

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';

interface UnifiedUser {
  _id: string;
  displayName: string;
  email: string;
  username?: string;
  nickname?: string;
  roleName: string;
  roleCode: string;
  source: 'admin' | 'teacher' | 'student';
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusColorMap: Record<string, string> = {
  active: 'green',
  disabled: 'default',
  在职: 'green',
  离职: 'default',
  休假: 'orange',
  在读: 'blue',
  休学: 'orange',
  毕业: 'green',
};

interface UseUserDetailModalReturn {
  detailModalVisible: boolean;
  currentUser: UnifiedUser | null;
  handleView: (record: UnifiedUser) => void;
  handleCloseDetail: () => void;
  DetailModal: React.FC;
}

export function useUserDetailModal(): UseUserDetailModalReturn {
  const [detailModalVisible, setDetailModalVisible] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<UnifiedUser | null>(null);

  const handleView = (record: UnifiedUser) => {
    setCurrentUser(record);
    setDetailModalVisible(true);
  };

  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setCurrentUser(null);
  };

  const renderDetailContent = (user: UnifiedUser) => {
    if (user.source === 'admin') {
      return (
        <div style={{ marginTop: 16 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
            <Descriptions.Item label="昵称">{user.nickname || '-'}</Descriptions.Item>
            <Descriptions.Item label="邮箱" span={2}>{user.email}</Descriptions.Item>
            <Descriptions.Item label="角色">
              <Tag color="blue">{user.roleName}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="来源">
              <Tag>系统账号</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusColorMap[user.status] || 'default'}>
                {user.status === 'active' ? '启用' : '禁用'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {new Date(user.createdAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间" span={2}>
              {new Date(user.updatedAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
          </Descriptions>
        </div>
      );
    }

    if (user.source === 'teacher') {
      return (
        <div style={{ marginTop: 16 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="姓名">{user.displayName}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
            <Descriptions.Item label="角色">
              <Tag color="green">教师</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="来源">
              <Tag>教师档案</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusColorMap[user.status] || 'default'}>{user.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {new Date(user.createdAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间" span={2}>
              {new Date(user.updatedAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
          </Descriptions>
        </div>
      );
    }

    return (
      <div style={{ marginTop: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="姓名">{user.displayName}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
          <Descriptions.Item label="角色">
            <Tag color="default">学生</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="来源">
            <Tag>学生档案</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusColorMap[user.status] || 'default'}>{user.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>
            {new Date(user.createdAt).toLocaleString('zh-CN')}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间" span={2}>
            {new Date(user.updatedAt).toLocaleString('zh-CN')}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  const DetailModal: React.FC = () => (
    <Modal
      title="用户详情"
      open={detailModalVisible}
      onCancel={handleCloseDetail}
      footer={null}
      width={700}
    >
      {currentUser && renderDetailContent(currentUser)}
    </Modal>
  );

  return {
    detailModalVisible,
    currentUser,
    handleView,
    handleCloseDetail,
    DetailModal,
  };
}
