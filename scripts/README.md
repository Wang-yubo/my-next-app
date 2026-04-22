# 学生数据导入说明

## 文件说明

- `students.json` - MongoDB 标准格式的20条学生数据（JSON Lines 格式）
- `seed-students.js` - JavaScript 格式的模拟数据（备用）
- `import-students.js` - Node.js 数据导入脚本

## 数据格式

采用 **JSON Lines** 格式（每行一个 JSON 对象），符合 MongoDB 导入标准：
```json
{"id":"2021001","name":"张伟","gender":"男",...}
{"id":"2021002","name":"李娜","gender":"女",...}
```

日期字段使用 MongoDB Extended JSON 格式：
```json
"enrollDate":{"$date":"2021-09-01T00:00:00.000Z"}
```

## 数据结构

每条学生记录包含以下字段：
- `id`: 学号（唯一）
- `name`: 姓名
- `gender`: 性别（男/女）
- `age`: 年龄
- `major`: 专业
- `grade`: 年级（如：2021级）
- `phone`: 电话号码
- `email`: 邮箱
- `status`: 状态（在读/休学/毕业）
- `enrollDate`: 入学日期

## 使用方法

### 方式一：使用 mongoimport 命令（推荐）

这是 MongoDB 官方推荐的导入方式，速度最快：

```bash
# 基本导入
mongoimport --uri="mongodb://localhost:27017/your_database" --collection=students --file=scripts/students.json --jsonArray

# 如果已配置 MONGODB_URI 环境变量
mongoimport --uri="$MONGODB_URI" --collection=students --file=scripts/students.json --jsonArray
```

**参数说明：**
- `--uri`: MongoDB 连接字符串
- `--collection`: 目标集合名称（students）
- `--file`: 数据文件路径
- `--jsonArray`: 指定为 JSON 数组格式

### 方式二：使用 Node.js 脚本

```bash
pnpm seed:students
```

或者：

```bash
node scripts/import-students.js
```

### 方式三：MongoDB Compass 图形界面

1. 打开 MongoDB Compass
2. 连接到数据库
3. 选择 `students` 集合
4. 点击 "ADD DATA" → "Import File"
5. 选择 `scripts/students.json` 文件
6. 选择文件格式为 "JSON"
7. 点击 "Import"

## 注意事项

1. **确保 MongoDB 正在运行**
   - 检查 `.env.local` 文件中的 `MONGODB_URI` 配置是否正确

2. **避免重复导入**
   - 脚本会自动检测已存在的学号，跳过重复数据
   - 如需重新导入，可以取消注释 `import-students.js` 中的清空代码：
     ```javascript
     // await Student.deleteMany({});
     // console.log('已清空现有数据');
     ```

3. **导入结果**
   - 成功插入：显示新添加的学生数量
   - 跳过重复：显示已存在的学生数量
   - 总计处理：显示总共处理的数据条数

## 示例输出

```
MongoDB 连接成功: localhost
添加学生: 张伟 (2021001)
添加学生: 李娜 (2021002)
...
跳过已存在的学生: 张伟 (2021001)

========== 导入完成 ==========
成功插入: 20 条
跳过重复: 0 条
总计处理: 20 条
```
