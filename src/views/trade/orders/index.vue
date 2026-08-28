<template>
  <div class="orders-container">
    目前测试页面


    <div style="margin-bottom: 10px;">
      <el-button type="primary" @click="testClick">点击测试</el-button>
    </div>

    <div style="margin-bottom: 10px;">
      <el-button type="primary" @click="testClick2">点击测试2</el-button>
    </div>

    <div style="margin-bottom: 10px;">
      <el-button type="primary" @click="testClick3">点击测试3</el-button>
    </div>

    <div style="margin-bottom: 10px;">

      测试上传：
      <input type="file" @change="handleFileChange" />
      <!-- <img v-if="isImage" :src="fileUrl" alt="预览" class="preview" /> -->
      <el-button type="primary" @click="testClick4">点击测试4-上传</el-button>
      <el-button type="primary" @click="testClick5">点击测试5-下载</el-button>
      <el-button type="primary" @click="testClick6">点击测试6-删除</el-button>
    </div>
    <div>
      测试Excel导入：
      <input type="file" @change="handleFileChange" />
      <!-- <img v-if="isImage" :src="fileUrl" alt="预览" class="preview" /> -->
      <el-button type="primary" @click="testClick7">点击测试7-导入</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import request from '@/api/index'
import { ref } from 'vue'

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

const testClick3 = () => {
  // request({
  //   url: '/auth/userInfo',
  //   method: 'get',

  // }).then(res => {
  //   console.log(res);
  // })
  // request({
  //   url: '/sys/dept/list',
  //   method: 'get',
  //   params: {
  //     "deptName": "",
  //     "status": 1
  //   }
  // }).then(res => {
  //   console.log(res);
  // })

  request({
    url: '/sys/dept/add',
    method: 'post',
    data: {
      "parentId": 2,
      "deptName": "Java组",
      "sort": 3,
      "status": 1
    }
  })
}

const file = ref(null);
const isImage = ref(false);
const fileUrl = ref(null);

const handleFileChange = (e) => {
  file.value = e.target.files[0];

}


const testClick4 = () => {
  request({
    url: '/file/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: {
      "file": file.value
    }
  }).then(res => {
    file.value = null;
    console.log(res);
  })
}

const testClick5 = () => {
  request({
    url: '/file/download/' + "2092852900139802626",
    method: 'get',
    responseType: 'blob'
  }).then(res => {
    console.log(res);
     const blob = new Blob([res.data])

    // 获取文件名
    const disposition = res.headers['content-disposition']

    let fileName = 'download'

    if (disposition) {

      // 优先处理 UTF-8 文件名
      const filenameStarMatch = disposition.match(
        /filename\*\s*=\s*UTF-8''([^;]+)/i
      )

      if (filenameStarMatch) {

        fileName = decodeURIComponent(filenameStarMatch[1])

      } else {

        // 兼容普通 filename
        const filenameMatch = disposition.match(
          /filename\s*=\s*"?([^";]+)"?/i
        )

        if (filenameMatch) {
          fileName = filenameMatch[1]
        }
      }
    }

    console.log('最终文件名：', fileName)

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.href = url
    a.download = fileName

    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)

    URL.revokeObjectURL(url)
  })
}

const testClick6 = () => {
  request({
    url: '/file/delete/' + "2092851905972301826",
    method: 'delete'
  }).then(res => {
    console.log(res);
  })
}

const testClick7 = () => {
  request({
    url: '/user/import',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: {
      "file": file.value
    }
  }).then(res => {
    file.value = null;
    console.log(res);
  })
}
</script>

<style lang="scss" scoped>
.orders-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>