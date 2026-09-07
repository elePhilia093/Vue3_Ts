<template>
  <div class="employee-container">
    <!-- 1. 顶部查询区 -->
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="员工编号">
              <el-input v-model="queryParams.employeeNo" placeholder="请输入员工编号" clearable style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工姓名">
              <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" clearable style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属部门">
              <el-select v-model="queryParams.deptId" placeholder="请选择所属部门" clearable style="width: 200px">
                <el-option v-for="dept in deptOptions" :key="dept.id" :label="dept.deptName" :value="dept.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别">
              <el-select v-model="queryParams.gender" placeholder="请选择性别" clearable style="width: 200px">
                <el-option label="全部" value="" />
                <el-option label="男" :value="1" />
                <el-option label="女" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary">
                <el-icon>
                  <Search />
                </el-icon>
                查询
              </el-button>
              <el-button>
                <el-icon>
                  <Refresh />
                </el-icon>
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 2. 数据表格区 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <el-button type="primary" plain @click="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          新增员工
        </el-button>
      </div>
      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" height="100%">
        <el-table-column prop="employeeNo" label="员工编号" />
        <el-table-column prop="employeeName" label="员工姓名" />

        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="deptId" label="所属部门" />
        <el-table-column prop="positionName" label="职位" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)" size="small">编辑</el-button>
            <el-popconfirm title="确认删除吗？">
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
          :page-sizes="[1, 2, 4, 6, 20]" :page-size="queryParams.size" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <!-- 新增员工弹窗 -->
    <EmployeeDialog v-model="dialogVisible" :dept-options="deptOptions" :edit-data="currentEditData"
      @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getEmployeeList } from "@/api/employee";
import { getDeptListAPI } from '@/api/dept'
import EmployeeDialog from "./component/addEmpDialog.vue";
import { flattenDeptTree } from "@/utils/flattenDeptTree";

const queryParams = reactive({
  employeeNo: undefined,
  employeeName: undefined,
  deptId: undefined,
  gender: undefined,
  current: 1,
  size: 10,
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const deptOptions = ref([]);

// 获取部门列表
const getDeptList = async () => {
  try {
    const result = await getDeptListAPI({});
    if (result.code == 200) {
      deptOptions.value = flattenDeptTree(result.data);
    }
  } catch (error) {
    console.error("获取部门列表失败:", error);
    ElMessage.error(error.message || "获取部门列表失败");
  }
}



// 弹窗显隐状态
const dialogVisible = ref(false)
// 当前正在编辑的行数据
const currentEditData = ref({})

const getList = async () => {
  loading.value = true;
  try {
    const result = await getEmployeeList(queryParams);
    if (result.code == 200) {
      tableData.value = result.data.records;
      total.value = result.data.total;
    }
  } catch (error) {
    console.error("获取员工列表失败:", error);
    ElMessage.error(error.message || "获取员工列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSizeChange = (val: number) => {
  queryParams.size = val;
};

const handleCurrentChange = (val: number) => {
  queryParams.current = val;
};

// 新增员工
const handleAdd = () => {
  dialogVisible.value = true
  currentEditData.value = {}
}

// 编辑员工
const handleEdit = (row) => {
  dialogVisible.value = true
  currentEditData.value = { ...row }
}

// 接收子组件抛出的保存数据
const handleSave = (formData) => {
  console.log('父组件接收到的表单数据:', formData)
  getList();
}


onMounted(() => {
  getList();
  getDeptList();
});


</script>

<style lang="scss" scoped>
.employee-container {
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