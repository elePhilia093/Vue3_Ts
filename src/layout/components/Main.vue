<template>
  <section class="app-main">
    <!-- 
      router-view 是核心，所有的子页面都会渲染在这里 
      v-slot 用于获取当前组件，配合 transition 可以做页面切换动画
    -->
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="key" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 如果你需要缓存页面（例如从详情页返回列表页不刷新），可以在这里配置
// 这里简单处理，默认不缓存，或者根据你的 store 来
const cachedViews = []; 

// 强制重新渲染组件的 key，确保路由参数变化时组件能更新
const key = computed(() => route.path);
</script>

<style scoped>
.app-main {
  /* 1. 占据剩余空间 */
  flex: 1;
  
  /* 2. 设置舒适的背景色 (浅灰蓝，比纯白更有质感) */
  background-color: #f0f2f5; 
  
  /* 3. 增加内边距，让内容不贴边 */

  
  /* 4. 允许内部滚动 */
  overflow-y: auto;
  
  /* 5. 限制最小高度，防止内容少时背景太短 */
  height: 100%;
  
  /* 6. 设置盒模型 */
  box-sizing: border-box;
  
  /* 7. 相对定位，方便子元素绝对定位 */
  position: relative;
}

/* --- 自定义滚动条样式 (Webkit内核浏览器) --- */
.app-main::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.app-main::-webkit-scrollbar-thumb {
  background: #dcdfe6; /* 滚动条滑块颜色 */
  border-radius: 4px;
}

.app-main::-webkit-scrollbar-track {
  background: transparent; /* 滚动条轨道透明 */
}

.app-main::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc; /* 鼠标悬停时加深 */
}

/* --- 页面切换动画 (可选，增加高级感) --- */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>