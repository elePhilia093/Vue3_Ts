<template>
  <div class="layout">
    <el-container>
      <el-aside width="240px">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <Main />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import Main from './components/Main.vue'
import Sidebar from './components/Sidebar.vue'

</script>

<style lang="scss" scoped>
:root {
  --brand-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.layout {
  // 1. 基础尺寸：确保布局占满整个浏览器可视区域
  width: 100vw;
  height: 100vh;
  overflow: hidden; // 防止外层容器出现滚动条

  // 2. Element Plus 容器自适应
  .el-container {
    height: 100%; // 让 el-container 撑满父级

    // 侧边栏样式
    .el-aside {
      /* 关键：应用蓝紫渐变背景 */
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
      z-index: 10;
      transition: width 0.3s; // 侧边栏收缩时的过渡动画

      // 侧边栏内部菜单高度撑满
      .el-menu {
        height: 100%;
        border-right: none; // 去掉 Element Plus 默认的右侧边框
      }
    }

    // 右侧主内容区容器
    .el-container {
      background-color: #f0f2f5; // 后台系统常用的浅灰色背景

      // 顶部导航栏样式
      .el-header {
        background-color: #ffffff;
        border-bottom: 1px solid #e8e8e8; // 底部分割线
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); // 轻微的阴影提升层次感
        display: flex;
        align-items: center; // 垂直居中
        justify-content: space-between; // 左右分布
        padding: 0; // 调整默认内边距
      }

      // 主内容展示区
      .el-main {
        height: 100%;
        padding: 0; // 内容区内边距
        overflow-y: auto; // 核心：当内容超出时，仅在此区域产生垂直滚动条

        // 可选：自定义滚动条样式（让滚动条不那么突兀）
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
