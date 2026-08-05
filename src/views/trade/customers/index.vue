<template>
  <div class="order-page-container">
    <!-- 核心容器：单一大卡片设计 -->
    <el-card shadow="never" class="main-card">
      
      <!-- 1. 顶部区域：整合搜索与功能按钮 -->
      <div class="card-header-toolbar">
        <!-- 左侧：搜索表单 -->
        <el-form :inline="true" :model="queryParams" class="search-form">
          <el-form-item label="Approved by">
            <el-input 
              v-model="queryParams.keyword" 
              placeholder="请输入关键词..." 
              clearable 
              prefix-icon="Search"
              style="width: 220px;"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 右侧：操作按钮组 -->
        <div class="action-buttons">
          <el-button type="primary" plain icon="Plus">添加新订单</el-button>
        </div>
      </div>

      <!-- 2. 中间区域：数据表格 (自动填满剩余高度) -->
      <div class="table-wrapper">
        <el-table 
          :data="tableData" 
          style="width: 100%" 
          height="100%"
          border
          stripe
        >
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button link type="primary" size="small" icon="Edit">编辑</el-button>
              <el-popconfirm title="确定删除吗？">
                <template #reference>
                  <el-button link type="danger" size="small" icon="Delete">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 3. 底部区域：分页器 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="100"
        />
      </div>

    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

// 模拟数据
const queryParams = reactive({ keyword: '' });
const tableData = [
  { name: '二顺', email: '131@1312.com', createTime: '2026-07-29 17:54:53' },
  { name: '小马2', email: '1231@163.com', createTime: '2026-07-29 17:15:50' },
  { name: '小牛', email: '898989123@qq.com', createTime: '2026-07-29 16:37:25' },
  { name: '小美', email: '23231312@qq.com', createTime: '2026-07-29 16:32:46' },
  { name: '小马2', email: '1231@163.com', createTime: '2026-07-29 17:15:50' },
  { name: '小牛', email: '898989123@qq.com', createTime: '2026-07-29 16:37:25' },
  { name: '小美', email: '23231312@qq.com', createTime: '2026-07-29 16:32:46' },
  { name: '小马2', email: '1231@163.com', createTime: '2026-07-29 17:15:50' },
  { name: '小牛', email: '898989123@qq.com', createTime: '2026-07-29 16:37:25' },
  { name: '小美', email: '23231312@qq.com', createTime: '2026-07-29 16:32:46' },
  // ...更多数据用于测试滚动
];

const handleQuery = () => console.log('查询', queryParams);
const resetQuery = () => queryParams.keyword = '';
</script>

<style lang="scss" scoped>
/* 页面容器：限制最大高度，防止撑破屏幕 */
.order-page-container {
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 主卡片：占据全部可用空间 */
.main-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px; /* 圆角更柔和 */
}

/* 去除 Element Card 默认的 body padding，改为自定义布局 */
:deep(.el-card__body) {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部工具栏：Flex 左右布局 */
.card-header-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 15px 0 15px; /* 上左右有内边距，下无 */
  flex-shrink: 0; /* 防止被压缩 */
}

.search-form {
  margin-bottom: 0; /* 消除 form 默认间距 */
}

/* 表格包装器：核心！利用 flex:1 占据剩余所有空间 */
.table-wrapper {
  height: 100%;
  flex: 1;
  padding: 20px;
  overflow: hidden; /* 隐藏溢出，让 el-table 内部处理滚动 */
  min-height: 400px; /* 关键：允许 flex 子项收缩到比内容更小 */
}

/* 分页器区域 */
.pagination-container {
  padding: 10px;
  padding-top: 0;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}
</style>