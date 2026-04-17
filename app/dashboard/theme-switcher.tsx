'use client';

import React, { useState, useEffect } from 'react';
import { ColorPicker, Popover, Button, Space, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';

const { Text } = Typography;

interface ThemeSwitcherProps {
  onThemeChange?: (color: string) => void;
}

export default function ThemeSwitcher({ onThemeChange }: ThemeSwitcherProps) {
  const [customColor, setCustomColor] = useState<string>(() => {
    // 在初始化时就尝试从 localStorage 读取，避免首次渲染闪烁
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme-color') || '#1677ff';
    }
    return '#1677ff';
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 确保颜色变化时同步给父组件
    onThemeChange?.(customColor);
  }, []);

  // 处理颜色变化
  const handleColorChange = (color: Color) => {
    const hexColor = color.toHexString();
    setCustomColor(hexColor);
    localStorage.setItem('theme-color', hexColor);
    onThemeChange?.(hexColor);
  };

  // 重置为默认主题色
  const handleReset = () => {
    const defaultColor = '#1677ff';
    setCustomColor(defaultColor);
    localStorage.setItem('theme-color', defaultColor);
    onThemeChange?.(defaultColor);
    setOpen(false);
  };

  const content = (
    <Space direction="vertical" size="middle" style={{ minWidth: 240 }}>
      <div>
        <Text strong>选择主题色</Text>
      </div>
      
      <ColorPicker
        value={customColor}
        onChange={handleColorChange}
        showText
        format="hex"
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          当前: {customColor}
        </Text>
        <Button size="small" onClick={handleReset}>
          重置默认
        </Button>
      </div>
    </Space>
  );

  return (
    <Popover
      content={content}
      title="主题设置"
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
    >
      <Button
        type="text"
        icon={<SettingOutlined />}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        主题
      </Button>
    </Popover>
  );
}
