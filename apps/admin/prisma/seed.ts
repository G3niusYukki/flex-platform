import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 管理员账号（管理后台调试用）
  const adminPhone = 'admin';
  const adminPassword = 'admin123';
  const adminPasswordHash = await hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { phone: adminPhone },
    update: { passwordHash: adminPasswordHash, status: 'ACTIVE', userType: 'ADMIN' },
    create: {
      phone: adminPhone,
      passwordHash: adminPasswordHash,
      userType: 'ADMIN',
      status: 'ACTIVE',
      realName: '管理员',
    },
  });

  // 测试用户（前端调试登录用）
  const testPhone = '13800138000';
  const testPassword = '123456';
  const testPasswordHash = await hash(testPassword, 12);

  await prisma.user.upsert({
    where: { phone: testPhone },
    update: { passwordHash: testPasswordHash, status: 'ACTIVE' },
    create: {
      phone: testPhone,
      passwordHash: testPasswordHash,
      userType: 'WORKER',
      status: 'ACTIVE',
      realName: '测试用户',
    },
  });

  console.log('✅ 管理员账号已创建/更新: admin');
  console.log('✅ 测试用户已创建/更新: 13800138000（调试登录用）');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
