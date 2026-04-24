import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// GET /api/user/profile - 获取当前登录用户的个人资料
export async function GET(request: NextRequest) {
  try {
    // 验证token
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: '无效的token' },
        { status: 401 }
      );
    }

    // TODO: 后续从数据库查询真实数据
    // 目前返回模拟数据用于展示效果
    
    // 模拟学生基本信息
    const mockStudent = {
      id: decoded.userId,
      name: '张小明',
      gender: '男' as const,
      age: 21,
      idCard: '110101200301011234',
      major: '计算机科学与技术',
      className: '计算机1班',
      grade: '2022级',
      phone: '13800138000',
      email: 'zhangxiaoming@example.com',
      status: '在读' as const,
      enrollDate: new Date('2022-09-01'),
      avatar: null, // 头像URL，可为空
      bio: '热爱编程，追求技术卓越 | 全栈开发学习者', // 个性签名
    };

    // 模拟学习笔记
    const mockNotes = [
      {
        _id: '1',
        studentId: decoded.userId,
        title: 'React Hooks 深度解析',
        content: '今天深入学习了 React Hooks 的使用技巧，特别是 useEffect 的依赖数组和清理函数...',
        courseName: '前端框架开发',
        tags: ['React', 'Hooks', '前端'],
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15'),
      },
      {
        _id: '2',
        studentId: decoded.userId,
        title: '数据库索引优化实践',
        content: '在项目中遇到了查询性能问题，通过添加合适的索引，查询速度提升了10倍...',
        courseName: '数据库原理',
        tags: ['数据库', '性能优化', 'MySQL'],
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10'),
      },
      {
        _id: '3',
        studentId: decoded.userId,
        title: '算法学习：动态规划入门',
        content: '动态规划是解决最优解问题的利器，关键是找到状态转移方程...',
        courseName: '算法设计与分析',
        tags: ['算法', '动态规划', '数据结构'],
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05'),
      },
    ];

    // 模拟项目经历
    const mockProjects = [
      {
        _id: '1',
        studentId: decoded.userId,
        projectName: '学生信息管理系统',
        description: '基于 Next.js + MongoDB 的全栈学生信息管理系统，实现了学生、课程、选课的完整管理功能。采用 RESTful API 设计，支持 JWT 认证。',
        role: '全栈开发者',
        technologies: ['Next.js', 'TypeScript', 'MongoDB', 'Ant Design', 'JWT'],
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-20'),
        isOngoing: false,
        achievements: '完成了核心功能开发，包括用户认证、数据管理、API文档等模块，系统运行稳定。',
        githubUrl: 'https://github.com/example/student-management',
        demoUrl: null,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-03-20'),
      },
      {
        _id: '2',
        studentId: decoded.userId,
        projectName: '个人博客平台',
        description: '正在开发中的个人博客平台，支持文章发布、分类管理、评论互动等功能。采用现代化的技术栈，注重用户体验和性能优化。',
        role: '项目负责人',
        technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Redis'],
        startDate: new Date('2024-02-01'),
        endDate: undefined,
        isOngoing: true,
        achievements: '已完成基础架构搭建和核心功能开发，正在进行前端页面优化。',
        githubUrl: 'https://github.com/example/personal-blog',
        demoUrl: null,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-03-25'),
      },
    ];

    // 模拟心得体会
    const mockReflections = [
      {
        _id: '1',
        studentId: decoded.userId,
        title: '从后端到全栈：我的学习之路',
        content: '作为一名计算机专业的学生，我最初只专注于后端开发。但随着项目的推进，我发现掌握前端技术同样重要。开始学习 React 时，组件化思维让我耳目一新...\n\n在这个过程中，我深刻体会到：\n1. 持续学习的重要性 - 技术更新迭代很快，需要保持好奇心和学习热情\n2. 理论与实践结合 - 光看书是不够的，必须动手做项目才能真正掌握\n3. 社区的力量 - GitHub、Stack Overflow 等平台提供了丰富的学习资源',
        category: '学习感悟' as const,
        mood: '思考' as const,
        tags: ['全栈开发', '学习心得', '成长'],
        coverImage: null,
        isPublished: true,
        viewCount: 128,
        createdAt: new Date('2024-03-20'),
        updatedAt: new Date('2024-03-20'),
      },
      {
        _id: '2',
        studentId: decoded.userId,
        title: '团队协作的那些事儿',
        content: '最近参与了一个团队项目，收获颇丰。最大的感触是沟通比技术更重要。\n\n我们采用了敏捷开发模式，每日站会、每周迭代。虽然初期有些不适应，但逐渐发现这种方式确实能提高效率。\n\n遇到的挑战：\n- 代码冲突频繁 - 后来建立了更严格的分支管理规范\n- 需求变更 - 学会了灵活应对，及时调整计划\n- 时间管理 - 合理分配学习和项目时间是个难题',
        category: '生活随笔' as const,
        mood: '平静' as const,
        tags: ['团队协作', '项目管理', '经验分享'],
        coverImage: null,
        isPublished: true,
        viewCount: 86,
        createdAt: new Date('2024-03-12'),
        updatedAt: new Date('2024-03-12'),
      },
      {
        _id: '3',
        studentId: decoded.userId,
        title: '未来职业规划思考',
        content: '即将面临毕业和就业的选择，最近一直在思考自己的职业方向。\n\n我对全栈开发很感兴趣，喜欢从前端到后端的完整开发流程。但也意识到自己还有很多不足：\n- 系统设计能力需要提升\n- 对云服务和微服务架构了解不够深入\n- 算法和数据结构基础还需加强\n\n短期目标：\n1. 完成至少3个完整的项目作品\n2. 深入学习一门后端语言（Go或Java）\n3. 准备技术面试，刷LeetCode\n\n长期愿景：成为一名优秀的技术专家，能够独立设计和实现复杂的系统。',
        category: '职业规划' as const,
        mood: '思考' as const,
        tags: ['职业规划', '未来发展', '目标设定'],
        coverImage: null,
        isPublished: true,
        viewCount: 152,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01'),
      },
    ];

    // 计算学习统计
    const stats = {
      totalCourses: 24, // 已修课程数
      averageScore: 87.5, // 平均成绩
      totalCredits: 96, // 总学分
      noteCount: mockNotes.length,
      projectCount: mockProjects.length,
      reflectionCount: mockReflections.length,
    };

    return NextResponse.json({
      success: true,
      data: {
        student: mockStudent,
        notes: mockNotes,
        projects: mockProjects,
        reflections: mockReflections,
        stats,
      },
    });
  } catch (error) {
    console.error('获取用户资料错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}
