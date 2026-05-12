const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const LOCAL_URI = process.env.MONGODB_URI;
const REMOTE_URI = process.argv[2];

if (!REMOTE_URI) {
  console.error('请提供线上数据库连接地址作为参数');
  process.exit(1);
}

const COLLECTIONS = [
  'students', 'teachers', 'roles', 'adminusers',
  'courses', 'enrollments', 'activitylogs', 'notes',
];

async function syncData() {
  console.log('========== 开始同步数据 ==========\n');

  // 读取本地数据
  console.log('1. 读取本地数据...');
  const local = new mongoose.mongo.MongoClient(LOCAL_URI);
  await local.connect();
  const localDb = local.db();
  const allData = {};
  for (const name of COLLECTIONS) {
    const docs = await localDb.collection(name).find({}).toArray();
    if (docs.length > 0) {
      allData[name] = docs;
      console.log(`   [${name}] ${docs.length} 条`);
    }
  }
  await local.close();
  console.log('   ✅ 本地数据读取完成\n');

  // 写入线上数据库
  console.log('2. 连接线上数据库并写入...');
  const remote = new mongoose.mongo.MongoClient(REMOTE_URI, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  });
  await remote.connect();
  const remoteDb = remote.db();
  console.log('   ✅ 线上数据库连接成功\n');

  for (const [name, docs] of Object.entries(allData)) {
    let inserted = 0, updated = 0, skipped = 0;
    for (const doc of docs) {
      const { _id, __v, ...data } = doc;
      try {
        const existing = await remoteDb.collection(name).findOne({ _id });
        if (existing) {
          await remoteDb.collection(name).replaceOne({ _id }, { ...data, _id });
          updated++;
        } else {
          await remoteDb.collection(name).insertOne({ ...data, _id });
          inserted++;
        }
      } catch (err) {
        err.code === 11000 ? skipped++ : console.error(`   [${name}] 失败:`, err.message.substring(0, 60));
      }
    }
    console.log(`   [${name}] ${docs.length} 条 → 新增 ${inserted}，更新 ${updated}，跳过 ${skipped}`);
  }

  console.log('\n========== 同步完成 ==========');
  await remote.close();
  process.exit(0);
}

syncData().catch((err) => { console.error('同步失败:', err.message); process.exit(1); });
