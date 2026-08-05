<template>
  <div class="layout-sidebar">
    <el-scrollbar>
      <el-menu router :default-active="$route.path" class="custom-menu" background-color="transparent"
        text-color="#e0e6ed" active-text-color="#ffffff" :collapse="false">
        <el-menu-item index="/dashboard">
          <el-icon>
            <Odometer />
          </el-icon> <!-- 可选图标 -->
          <span>Dashboard</span>
        </el-menu-item>

        <el-sub-menu index="/trade">
          <template #title>
            <el-icon>
              <Message />
            </el-icon>交易管理
          </template>
          <el-menu-item-group>
            <el-menu-item index="/trade/customers">客户信息</el-menu-item>
            <el-menu-item index="/trade/orders">订单信息</el-menu-item>
          </el-menu-item-group>

        </el-sub-menu>
        <el-sub-menu index="/system">
          <template #title>
            <el-icon>
              <Menu />
            </el-icon>系统管理
          </template>
          <el-menu-item-group>
            <el-menu-item index="/system/user">用户管理</el-menu-item>
            <el-menu-item index="/system/role">角色管理</el-menu-item>
            <el-menu-item index="/system/menu">菜单管理</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.layout-sidebar {
  height: 100%;

  .custom-menu {
    border-right: none !important;
  }

  /* 1. 父级菜单项 (Submenu Title) */
  .custom-menu :deep(.el-sub-menu__title) {
    color: rgba(255, 255, 255, 0.8) !important;
    height: 56px;
    line-height: 56px;
    transition: all 0.3s ease;
  }

  /* Hover 效果：文字变白，背景微亮 */
  .custom-menu :deep(.el-sub-menu__title:hover) {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: #fff !important;
  }

  /* 2. 子级菜单项 (Menu Item) */
  .custom-menu :deep(.el-menu-item) {
    color: rgba(255, 255, 255, 0.7) !important;
    height: 50px;
    line-height: 50px;
    margin: 4px 8px;
    /* 给菜单项一点内边距，做成胶囊感 */
    border-radius: 8px;
    /* 圆角 */
    transition: all 0.3s ease;
  }

  /* 子菜单 Hover */
  .custom-menu :deep(.el-menu-item:hover) {
    background-color: rgba(255, 255, 255, 0.15) !important;
    color: #fff !important;
  }

  /* 3. 选中状态 (Active) - 重点设计 */
  .custom-menu :deep(.el-menu-item.is-active) {
    /* 使用纯白背景或高亮色块 */
    background-color: #fff !important;
    color: #764ba2 !important;
    /* 文字变成品牌紫，形成反差 */
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* 4. 图标样式微调 */
  .custom-menu :deep(.el-icon) {
    vertical-align: middle;
    margin-right: 10px;
    width: 20px;
    text-align: center;
  }

  /* 5. 展开时的箭头颜色 */
  .custom-menu :deep(.el-sub-menu__icon-arrow) {
    color: inherit !important;
  }


}
</style>
