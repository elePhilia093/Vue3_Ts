<template>
  <div class="user-container">
    <!-- 1. 顶部查询区 -->
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="queryParams.phone" placeholder="请输入手机号" clearable />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon>
              <Search />
            </el-icon> 查询
          </el-button>
          <el-button @click="resetQuery">
            <el-icon>
              <Refresh />
            </el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 2. 数据表格区 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <el-button type="primary" plain @click="handleAdd">
          <el-icon>
            <Plus />
          </el-icon> 新增用户
        </el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" height="100%">
        <!-- <el-table-column prop="id" label="ID" width="80" align="center" /> -->
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="150" show-overflow-tooltip />

        <!-- <el-table-column prop="gender" label="性别" width="80" align="center">
          <template #default="scope">
            {{ scope.row.gender === 'male' ? '男' : scope.row.gender === 'female' ? '女' : '-' }}
          </template>
</el-table-column> -->

        <!-- <el-table-column prop="age" label="年龄" width="80" align="center" /> -->

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? "正常" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="160" align="center" />

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="确认删除吗？" @confirm="handleDelete(scope.row)">

              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
          :page-sizes="[2, 4, 6, 20]" :page-size="queryParams.pageSize" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 引用封装好的弹窗组件 -->
    <UserFormDialog v-model="dialogVisible" :user-data="currentRow" @success="getList" />
  </div>
</template>

<script setup lang="ts">
import { fetchUserListAPI, deleteUserAPI } from "@/api/user";
import { ref, reactive, onMounted } from "vue";
import { Search, Refresh, Plus } from "@element-plus/icons-vue";
import UserFormDialog from './components/UserFormDialog.vue';
import type { User } from '@/types/user'

// --- 模拟数据与逻辑 ---
const loading = ref(false);
const total = ref(0);

// 查询参数
const queryParams = reactive({
  username: "",
  phone: "",
  status: 1,
  pageSize: 4,
  pageNum: 1,
});

// 表格数据 (对应你的数据库字段)
const tableData = ref<User[]>([]);

const getList = async () => {
  loading.value = true;
  try {
    const res = await fetchUserListAPI(queryParams);
    tableData.value = res.records;
    total.value = res.total;
  } catch (error) {
    console.error("获取用户列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 分页处理
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

const handleSearch = () => {
  console.log("执行查询:", queryParams);
  getList();
  // TODO: 调用后端接口 this.list(new QueryWrapper<User>().like("username", ...))
};

const resetQuery = () => {
  queryParams.username = "";
  queryParams.phone = "";
  queryParams.status = 1;
  handleSearch();
};

// 弹窗控制变量
const dialogVisible = ref(false);
const currentRow = ref(null); // 用于存储当前正在编辑的行数据

// 新增用户
const handleAdd = () => {
  currentRow.value = null;
  dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (row: any) => {
  currentRow.value = row;
  dialogVisible.value = true;
};

// 删除用户
const handleDelete = async (row: any) => {
  try {
    await deleteUserAPI(row.id);
    ElMessage.success('删除成功');
    getList();
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
.user-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.search-card {
  flex-shrink: 0;
  margin-bottom: 20px;

  .search-form {
    margin-bottom: -18px; // 修正 el-form inline 的底部间距
  }
}

.table-card {
  height: 100%;
  flex: 1;
  /* 占据剩余空间 */
  min-height: 0;
  /* 关键！允许子元素收缩 */
  overflow: hidden;

  /* 防止表格溢出 */
  .table-header {
    margin-bottom: 15px;
  }
}

.el-table {
  height: calc(100% - 100px) !important;
  /* 强制表格填满父容器 */
}

/* 可选：美化滚动条 */
.el-table__body-wrapper::-webkit-scrollbar {
  width: 8px;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
