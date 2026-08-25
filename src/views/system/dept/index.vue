<template>
  <div class="menu-container">
    <!-- 1. 顶部查询区 -->
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="部门名称">
          <el-input 
            v-model.trim="queryParams.deptName" 
            placeholder="请输入部门名称" 
            clearable 
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select 
            v-model="queryParams.status" 
            placeholder="请选择状态" 
            clearable 
            style="width: 150px"
          >
            <!-- 这里的 value 需根据你的业务枚举调整，DTO中是String -->
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 查询
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 2. 数据表格区 -->
    <el-card class="table-card" shadow="never">
      <el-table 
        v-loading="loading" 
        :data="tableData" 
        border 
        stripe 
        style="width: 100%" 
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="deptName" label="部门名称" min-width="180" show-overflow-tooltip />
      
        <el-table-column prop="status" label="状态" min-width="160" show-overflow-tooltip />

        <el-table-column prop="createTime" label="创建时间" min-width="150" show-overflow-tooltip />
        <el-table-column prop="updateTime" label="更新时间" min-width="150" show-overflow-tooltip />

      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Search, Refresh, Plus } from "@element-plus/icons-vue";
import { getDeptListAPI } from "@/api/dept";

// 
const queryParams = reactive({
  deptName: "",
  status: undefined as number | undefined,
});

const loading = ref(false);
const tableData = ref([]);





const getList = async () => {
  const res = await getDeptListAPI(queryParams);
  tableData.value = res || [];
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

}

const handleEdit = (row) => {
  
}

const handleDelete = (row) => {
  
}
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
  .search-form { margin-bottom: -18px; }
}

.table-card {
  height: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .table-header { margin-bottom: 15px; }
  
  /* 让表格区域自适应高度 */
  :deep(.el-table) {
     flex: 1;
  }
}

</style>