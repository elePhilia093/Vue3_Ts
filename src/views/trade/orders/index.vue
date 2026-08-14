<template>
  <div>
    目前测试页面

    <el-button type="primary" @click="testClick">点击测试</el-button>
    <br>
    <el-button type="primary" @click="testClick2">点击测试2</el-button>
  </div>
</template>

<script setup lang="ts">
import request from '@/api/index'

const testClick = () => {
  console.log('点击了测试按钮');
  request({
    url: '/sysUserRole/assign',
    method: 'post',
    data: {
      "userId": 1,
      "roleIds": [1, 2]
    }
  }).then(res => {
    console.log(res);
  })
}

const testClick2 = () => {
  request({
    url: '/sysRoleMenu/assign',
    method: 'post',
    data: {
      "roleId": 1,
      "menuIds": [1, 2, 3, 4, 5, 6]
    }
  }).then(res => {
    console.log(res);
  })
}
</script>

<style scoped></style>