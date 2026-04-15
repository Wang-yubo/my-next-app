import { Metadata } from 'next';
import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './react-swagger';

export const metadata: Metadata = {
  title: 'API 文档 - 学生信息管理系统',
  description: '学生信息管理系统 API 接口文档',
};

export default async function ApiDocsPage() {
  const spec = await getApiDocs();

  return (
    <section style={{ padding: '24px', minHeight: '100vh', background: '#fff' }}>
      <ReactSwagger spec={spec} />
    </section>
  );
}
