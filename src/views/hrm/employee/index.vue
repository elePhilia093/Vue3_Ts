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

                <el-option label="男" :value="1" />

                <el-option label="女" :value="0" />

              </el-select>

            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item>

              <el-button type="primary" @click="handleQuery">
                <el-icon>
                  <Search />
                </el-icon>
                查询
              </el-button>

              <el-button @click="resetQuery">
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

      <!-- 表格操作栏 -->
      <div class="table-header">

        <div class="table-actions">

          <!-- 新增员工 -->
          <el-button type="primary" plain @click="handleAdd">
            <el-icon>
              <Plus />
            </el-icon>
            新增员工
          </el-button>

          <!-- Excel 导入 -->
          <el-upload action="#" :auto-upload="false" :show-file-list="false" accept=".xls,.xlsx"
            :on-change="handleExcelChange">
            <el-button type="success" plain :loading="importLoading">
              <el-icon>
                <Upload />
              </el-icon>
              Excel导入
            </el-button>
          </el-upload>

          <!-- Excel 导出 -->
          <el-button type="warning" plain :loading="exportLoading" @click="handleExport">
            <el-icon>
              <Download />
            </el-icon>
            Excel导出
          </el-button>

        </div>

      </div>


      <!-- 员工表格 -->
      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" height="100%">

        <el-table-column prop="employeeNo" label="员工编号" />

        <el-table-column prop="employeeName" label="员工姓名" />

        <el-table-column prop="gender" label="性别">
          <template #default="{ row }">

            {{
              row.gender === 1
                ? "男"
                : row.gender === 0
                  ? "女"
                  : "--"
            }}

          </template>
        </el-table-column>

        <el-table-column prop="deptName" label="所属部门">
          <template #default="{ row }">
            {{ row.deptName || "--" }}
          </template>
        </el-table-column>

        <el-table-column prop="positionName" label="职位" />

        <el-table-column prop="phone" label="手机号" min-width="120" />

        <el-table-column prop="email" label="邮箱" min-width="140" />

        <el-table-column label="操作" width="180" align="center" fixed="right">

          <template #default="scope">

            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>

            <el-popconfirm title="确认删除吗？" @confirm="handleDelete(scope.row)">

              <template #reference>

                <el-button link type="danger" size="small">
                  删除
                </el-button>

              </template>

            </el-popconfirm>

          </template>

        </el-table-column>

      </el-table>


      <!-- 分页 -->
      <div class="pagination-container">

        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
          :page-sizes="[10, 20, 50]" :page-size="queryParams.size" :current-page="queryParams.current"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />

      </div>

    </el-card>


    <!-- 新增 / 编辑员工弹窗 -->
    <EmployeeDialog v-model="dialogVisible" :dept-options="deptOptions" :edit-data="currentEditData"
      @save="handleSave" />

  </div>
</template>


<script setup lang="ts">

import {
  ref,
  reactive,
  onMounted
} from "vue";

import {
  ElMessage
} from "element-plus";

import {
  Search,
  Refresh,
  Plus,
  Upload,
  Download
} from "@element-plus/icons-vue";

import {
  getEmployeeList,
  importEmployeeExcel,
  exportEmployeeExcel
} from "@/api/employee";

import {
  getDeptListAPI
} from "@/api/dept";

import EmployeeDialog
  from "./component/addEmpDialog.vue";

import {
  flattenDeptTree
} from "@/utils/flattenDeptTree";


/**
 * =========================
 * 查询参数
 * =========================
 */

const queryParams = reactive({

  employeeNo: undefined,

  employeeName: undefined,

  deptId: undefined,

  gender: undefined,

  current: 1,

  size: 10

});


/**
 * =========================
 * 表格
 * =========================
 */

const tableData =
  ref<any[]>([]);

const total =
  ref(0);

const loading =
  ref(false);


/**
 * =========================
 * 部门
 * =========================
 */

const deptOptions =
  ref<any[]>([]);


/**
 * =========================
 * Excel 状态
 * =========================
 */

const importLoading =
  ref(false);

const exportLoading =
  ref(false);


/**
 * =========================
 * 获取部门列表
 * =========================
 */

const getDeptList = async () => {

  try {

    const result =
      await getDeptListAPI({});

    if (result.code === 200) {

      deptOptions.value =
        flattenDeptTree(
          result.data
        );

    }

  } catch (error: any) {

    console.error(
      "获取部门列表失败:",
      error
    );

    ElMessage.error(
      error?.message ||
      "获取部门列表失败"
    );

  }

};


/**
 * =========================
 * 获取员工列表
 * =========================
 */

const getList = async () => {

  loading.value = true;

  try {

    const result =
      await getEmployeeList(
        queryParams
      );

    if (result.code === 200) {

      tableData.value =
        result.data.records || [];

      total.value =
        result.data.total || 0;

    } else {

      ElMessage.error(
        result.message ||
        "获取员工列表失败"
      );

    }

  } catch (error: any) {

    console.error(
      "获取员工列表失败:",
      error
    );

    ElMessage.error(
      error?.message ||
      "获取员工列表失败"
    );

  } finally {

    loading.value = false;

  }

};


/**
 * =========================
 * 查询
 * =========================
 */

const handleQuery = () => {

  queryParams.current = 1;

  getList();

};


/**
 * =========================
 * 重置查询
 * =========================
 */

const resetQuery = () => {

  queryParams.employeeNo =
    undefined;

  queryParams.employeeName =
    undefined;

  queryParams.deptId =
    undefined;

  queryParams.gender =
    undefined;

  queryParams.current = 1;

  getList();

};


/**
 * =========================
 * 分页
 * =========================
 */

const handleSizeChange = (
  val: number
) => {

  queryParams.size = val;

  queryParams.current = 1;

  getList();

};


const handleCurrentChange = (
  val: number
) => {

  queryParams.current = val;

  getList();

};


/**
 * =========================
 * 弹窗
 * =========================
 */

const dialogVisible =
  ref(false);

const currentEditData =
  ref<any>({});


/**
 * 新增
 */

const handleAdd = () => {

  currentEditData.value = {};

  dialogVisible.value = true;

};


/**
 * 编辑
 */

const handleEdit = (
  row: any
) => {

  currentEditData.value =
    { ...row };

  dialogVisible.value = true;

};


/**
 * 保存成功
 */

const handleSave = (
  formData: any
) => {

  console.log(
    "父组件接收到的表单数据:",
    formData
  );

  getList();

};


/**
 * =========================
 * 删除
 * =========================
 *
 * 这里假设你的原有删除逻辑
 * 已经实现。
 * =========================
 */

const handleDelete = async (
  row: any
) => {

  console.log(
    "删除员工:",
    row
  );

  // 保持你原来的删除接口即可
};


/**
 * =========================
 * Excel 导入
 * =========================
 */

const handleExcelChange = async (
  file: any
) => {

  if (!file.raw) {
    return;
  }

  const fileName =
    file.name.toLowerCase();

  const isExcel =
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx");

  if (!isExcel) {

    ElMessage.error(
      "只能选择 Excel 文件"
    );

    return;
  }

  importLoading.value = true;

  try {

    const result =
      await importEmployeeExcel(
        file.raw
      );

    if (result.code === 200) {

      ElMessage.success(
        result.message ||
        "Excel 导入成功"
      );

      /*
       * 导入成功后重新查询
       */
      queryParams.current = 1;

      await getList();

    } else {

      ElMessage.error(
        result.message ||
        "Excel 导入失败"
      );

    }

  } catch (error: any) {

    console.error(
      "Excel 导入失败:",
      error
    );

    ElMessage.error(
      error?.message ||
      "Excel 导入失败"
    );

  } finally {

    importLoading.value = false;

  }

};


/**
 * =========================
 * Excel 导出
 * =========================
 */

const handleExport = async () => {

  exportLoading.value = true;

  try {

    const response =
      await exportEmployeeExcel(
        queryParams
      );

    /*
     * request 如果返回 AxiosResponse，
     * 文件数据通常位于 response.data。
     */
    const blob =
      response.data instanceof Blob
        ? response.data
        : response;

    const url =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `员工信息_${Date.now()}.xlsx`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    ElMessage.success(
      "Excel 导出成功"
    );

  } catch (error: any) {

    console.error(
      "Excel 导出失败:",
      error
    );

    ElMessage.error(
      error?.message ||
      "Excel 导出失败"
    );

  } finally {

    exportLoading.value = false;

  }

};


/**
 * =========================
 * 页面初始化
 * =========================
 */

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


/* =========================
   查询区域
   ========================= */

.search-card {
  flex-shrink: 0;
  margin-bottom: 20px;

  .search-form {
    margin-bottom: -18px;
  }
}


/* =========================
   表格区域
   ========================= */

.table-card {
  height: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  .table-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 15px;
  }
}


/* =========================
   操作按钮
   ========================= */

.table-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.table-actions :deep(.el-upload) {
  display: inline-flex;
}


/* =========================
   表格
   ========================= */

.el-table {
  height: calc(100% - 100px) !important;
}


/* =========================
   滚动条
   ========================= */

.el-table__body-wrapper::-webkit-scrollbar {
  width: 8px;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}


/* =========================
   分页
   ========================= */

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>