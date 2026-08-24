<template>
  <div class="menu-container">
    <!-- 1. 顶部查询区 -->
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="菜单名称">
          <el-input 
            v-model="queryParams.menuName" 
            placeholder="请输入菜单名称" 
            clearable 
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="菜单类型">
          <el-select 
            v-model="queryParams.menuType" 
            placeholder="请选择类型" 
            clearable 
            style="width: 150px"
          >
            <!-- 这里的 value 需根据你的业务枚举调整，DTO中是String -->
            <el-option label="目录" :value="1" />
            <el-option label="菜单" :value="2" />
            <el-option label="按钮" :value="3" />
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
      >
        <el-table-column prop="menuName" label="菜单名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="permission" label="权限标识" min-width="160" show-overflow-tooltip />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="success" size="small" @click="handleAdd(scope.row)" >
              新增
            </el-button>
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="确认删除该菜单吗？" @confirm="handleDelete(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Search, Refresh, Plus } from "@element-plus/icons-vue";


const queryParams = reactive({
  menuName: "",
  menuType: undefined as number | undefined,
});

const loading = ref(false);
const tableData = ref([]);



const handleSearch = () => {
  
};

const resetQuery = () => {
  queryParams.menuName = "";
  queryParams.menuType = undefined;
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