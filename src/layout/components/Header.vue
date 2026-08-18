<template>
  <header class="app-header">
    <!-- 左侧：面包屑导航 -->
    <div class="header-left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧：用户信息 -->
    <div class="header-right">
      <div class="user-profile">
        <el-avatar
          :size="36"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          class="user-avatar"
        />
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            欢迎您：{{userStore.userInfo.username || '用户' }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const router = useRouter();
const handleCommand = (command: string) => {
  console.log(command);
  if (command === "logout") {
    // 执行退出登录操作
    localStorage.clear()
    router.push("/login");
  }
};
</script>

<style scoped>
/* 头部容器 */
.app-header {
  height: 60px;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 关键优化：使用柔和阴影代替生硬边框 */
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 14px;
  position: relative;
  z-index: 10;
}

/* 左侧面包屑样式微调 */
.header-left :deep(.el-breadcrumb__inner) {
  color: #606266;
  font-weight: 500;
}
.header-left :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #303133; /* 当前页加深 */
  font-weight: 600;
}

/* 右侧用户区域 */
.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

/* 悬停效果：增加浅灰背景，提升交互感 */
.user-profile:hover {
  background-color: #f5f7fa;
}

.username {
  margin-left: 8px;
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.arrow-down {
  margin-left: 4px;
  font-size: 12px;
  color: #909399;
  transition: transform 0.3s;
}

/* 悬停时小箭头旋转 */
.user-profile:hover .arrow-down {
  transform: rotate(180deg);
}
</style>
