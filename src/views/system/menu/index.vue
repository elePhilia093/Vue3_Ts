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
      <div class="table-header">
        <el-button type="primary" plain @click="handleAdd()">
          <el-icon><Plus /></el-icon> 新增菜单
        </el-button>
      </div>

      <!-- 
        关键点：
        1. row-key="id": 树形表格必须指定唯一标识
        2. tree-props: 指定子节点字段名，默认是 children
      -->
      <el-table 
        v-loading="loading" 
        :data="tableData" 
        border 
        stripe 
        style="width: 100%" 
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="menuName" label="菜单名称" min-width="180" show-overflow-tooltip />
      

        <el-table-column prop="permission" label="权限标识" min-width="160" show-overflow-tooltip />

        <el-table-column prop="path" label="路由地址" min-width="150" show-overflow-tooltip />

        <el-table-column prop="menuType" label="类型" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.menuType === 1" type="warning">目录</el-tag>
            <el-tag v-else-if="scope.row.menuType === 2">菜单</el-tag>
            <el-tag v-else-if="scope.row.menuType === 3" type="info">按钮</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            
            <!-- 只有目录和菜单才能新增子级，按钮通常没有子级 -->
            <el-button link type="success" size="small" @click="handleAdd(scope.row)" v-if="scope.row.menuType !== 3">
              新增子项
            </el-button>

            <el-popconfirm title="确认删除该菜单吗？" @confirm="handleDelete(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

     <!-- 弹窗组件 -->
    <MenuDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :form-data="currentFormData"
      :menu-list="tableData" 
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Search, Refresh, Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { fetchMenuListAPI, deleteMenuAPI, addMenuAPI, updateMenuAPI } from "@/api/menu"; // 引入你的API
import MenuDialog from "./components/MenuDialog.vue";

// 1. 查询参数 (对应 DTO 中的查询字段)
const queryParams = reactive({
  menuName: "",
  menuType: undefined as number | undefined,
});

// --- 核心方法 ---
const loading = ref(false);
const tableData = ref([]);

const dialogVisible = ref(false);
const dialogTitle = ref('');


const currentFormData = ref(null);
const getList = async () => {
  loading.value = true;
  try {
    // 模拟 API 调用参数合并
    const data = {
      ...queryParams
    };
    const res = await fetchMenuListAPI(data);
    console.log("获取列表成功:", res);
    tableData.value = res;
  } catch (error) {
    console.error("获取列表失败:", error);
  } finally {
    loading.value = false;
  }
};


const handleSearch = () => {
  getList();
};


const resetQuery = () => {
  queryParams.menuName = "";
  queryParams.menuType = undefined;
  handleSearch();
};

const handleAdd = (row) => {
  
  dialogTitle.value = row ? `新增[${row.menuName}]子项` : '新增菜单';
  currentFormData.value = null; // 重置表单
  
  if (row) {
    // 如果是点击某行的“新增子项”，自动填充 parentId
    currentFormData.value = { parentId: row.id, menuType: 2 };
  } else {
    // 如果是点击顶部的“新增菜单”，默认 parentId 为 0
    currentFormData.value = { parentId: 0, menuType: 1 };
  }
  
  dialogVisible.value = true;
};


// 点击编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑菜单';
  // 将当前行数据传入组件进行回显
  currentFormData.value = { ...row };
  dialogVisible.value = true;
};

// 提交表单（由子组件触发）
const handleSubmit = async (data) => {
  try {
    if (data.id) {
      await updateMenuAPI(data);
    } else {
      await addMenuAPI(data);
    }
    getList();
  } catch (error) {
    console.error(error);
  }
};



const handleDelete = async (row) => {
  try {
    await deleteMenuAPI({ id: row.id });
    getList();
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

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