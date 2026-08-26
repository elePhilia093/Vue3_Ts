<template>
  <div class="menu-container">
    <!-- 1. 顶部查询区 -->
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="部门名称">
          <el-input v-model.trim="queryParams.deptName" placeholder="请输入部门名称" clearable style="width: 200px" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 150px">
            <!-- 这里的 value 需根据你的业务枚举调整，DTO中是String -->
            <el-option label="正常" :value="1" />
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
      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" row-key="id"
        :tree-props="{ children: 'children' }">
        <el-table-column prop="deptName" label="部门名称" min-width="180" show-overflow-tooltip />

        <el-table-column prop="status" label="状态" min-width="160" show-overflow-tooltip>

          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>

        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" min-width="150" show-overflow-tooltip />
        <el-table-column prop="updateTime" label="更新时间" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" min-width="220">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="success" size="small" @click="handleAdd(scope.row)">添加子部门</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 3. 弹窗区 -->
    <DeptDialog 
      v-model="dialogVisible"
      :title="dialogTitle"
      :form-data="currentFormData"
      :menu-list="tableData" 
      @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getDeptListAPI,updateDeptAPI,deleteDeptAPI } from "@/api/dept";
import DeptDialog from "./components/DeptDialog.vue"
// 
const queryParams = reactive({
  deptName: "",
  status: undefined as number | undefined,
});

const loading = ref(false);
const tableData = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const currentFormData = ref({});



const getList = async () => {

  try {
    loading.value = true;
    const res = await getDeptListAPI(queryParams);
    tableData.value = res || [];
  } finally {
    loading.value = false;
  }

}

const handleSearch = () => {
  getList();
};

const resetQuery = () => {
  queryParams.deptName = "";
  queryParams.status = undefined;
  getList();
};

const handleAdd = (row) => {
  dialogTitle.value = '添加子部门';
  currentFormData.value = { parentId: row.id };
  dialogVisible.value = true;
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑部门';
  currentFormData.value = { ...row };
  dialogVisible.value = true;
}

const handleDelete = async (row) => {
  try {
    await deleteDeptAPI(row.id);
    getList();
  } catch (error) {
    
  }
  
}

const handleSubmit = (formData) => {
  getList();
}

onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
/* 保持原有的样式结构 */
.menu-container {
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
    margin-bottom: -18px;
  }
}

.table-card {
  height: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .table-header {
    margin-bottom: 15px;
  }

  /* 让表格区域自适应高度 */
  :deep(.el-table) {
    flex: 1;
  }
}
</style>