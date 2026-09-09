<template>
  <div class="employee-container">

    <!-- 1. 顶部查询区 -->
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-row>

          <el-col :span="8">
            <el-form-item label="员工编号">
              <el-input
                v-model="queryParams.employeeNo"
                placeholder="请输入员工编号"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="员工姓名">
              <el-input
                v-model="queryParams.employeeName"
                placeholder="请输入员工姓名"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="所属部门">
              <el-select
                v-model="queryParams.deptId"
                placeholder="请选择所属部门"
                clearable
                style="width: 200px"
              >
                <el-option
                  v-for="dept in deptOptions"
                  :key="dept.id"
                  :label="dept.deptName"
                  :value="dept.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="性别">
              <el-select
                v-model="queryParams.gender"
                placeholder="请选择性别"
                clearable
                style="width: 200px"
              >
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
          <el-button
            type="primary"
            plain
            @click="handleAdd"
          >
            <el-icon>
              <Plus />
            </el-icon>
            新增员工
          </el-button>

          <!-- Excel 导入 -->
          <el-button
            type="success"
            plain
            :disabled="importLoading"
            @click="openImportDialog"
          >
            <el-icon>
              <Upload />
            </el-icon>
            Excel导入
          </el-button>

          <!-- Excel 导出 -->
          <el-button
            type="warning"
            plain
            :loading="exportLoading"
            :disabled="exportLoading"
            @click="handleExport"
          >
            <el-icon>
              <Download />
            </el-icon>
            Excel导出
          </el-button>

        </div>
      </div>

      <!-- 员工表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        height="100%"
      >
        <el-table-column
          prop="employeeNo"
          label="员工编号"
        />

        <el-table-column
          prop="employeeName"
          label="员工姓名"
        />

        <el-table-column
          prop="gender"
          label="性别"
        >
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

        <el-table-column
          prop="deptName"
          label="所属部门"
        >
          <template #default="{ row }">
            {{ row.deptName || "--" }}
          </template>
        </el-table-column>

        <el-table-column
          prop="positionName"
          label="职位"
        />

        <el-table-column
          prop="phone"
          label="手机号"
          min-width="120"
        />

        <el-table-column
          prop="email"
          label="邮箱"
          min-width="140"
        />

        <el-table-column
          label="操作"
          width="180"
          align="center"
          fixed="right"
        >
          <template #default="scope">

            <el-button
              link
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>

            <el-popconfirm
              title="确认删除吗？"
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-button
                  link
                  type="danger"
                  size="small"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50]"
          :page-size="queryParams.size"
          :current-page="queryParams.current"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

    </el-card>

    <!-- 新增 / 编辑员工弹窗 -->
    <EmployeeDialog
      v-model="dialogVisible"
      :dept-options="deptOptions"
      :edit-data="currentEditData"
      @save="handleSave"
    />

    <!-- Excel 导入弹窗 -->
    <el-dialog
      v-model="importDialogVisible"
      title="Excel导入"
      width="520px"
      :close-on-click-modal="false"
      :close-on-press-escape="!importLoading"
      :show-close="!importLoading"
      @close="handleImportDialogClose"
    >

      <el-upload
        v-model:file-list="uploadFileList"
        action="#"
        :auto-upload="false"
        :limit="1"
        accept=".xls,.xlsx"
        :on-change="handleExcelChange"
        :on-remove="handleExcelRemove"
        :on-exceed="handleExcelExceed"
      >
        <el-button
          type="primary"
          :disabled="importLoading"
        >
          选择Excel文件
        </el-button>

        <template #tip>
          <div class="el-upload__tip">
            只能选择 .xls 或 .xlsx 文件
          </div>
        </template>
      </el-upload>

      <!-- 导入错误信息 -->
      <div
        v-if="importErrors.length > 0"
        class="import-error-container"
      >
        <el-alert
          title="Excel中存在错误数据，请修改后重新导入"
          type="error"
          :closable="false"
          show-icon
        />

        <el-table
          :data="importErrors"
          border
          size="small"
          max-height="240"
          style="margin-top: 15px"
        >
          <el-table-column
            prop="rowNumber"
            label="行号"
            width="70"
          />

          <el-table-column
            prop="field"
            label="字段"
            width="100"
          />

          <el-table-column
            prop="message"
            label="错误原因"
          />
        </el-table>
      </div>

      <template #footer>

        <el-button
          :disabled="importLoading"
          @click="importDialogVisible = false"
        >
          取消
        </el-button>

        <el-button
          type="primary"
          :loading="importLoading"
          :disabled="!selectedFile || importLoading"
          @click="confirmImport"
        >
          确定导入
        </el-button>

      </template>

    </el-dialog>

  </div>
</template>

<script setup lang="ts">

import {
  ref,
  reactive,
  onMounted
} from "vue";

import {
  ElMessage,
  type UploadFile,
  type UploadUserFile
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
const tableData = ref<any[]>([]);

const total = ref(0);

const loading = ref(false);


/**
 * =========================
 * 部门
 * =========================
 */
const deptOptions = ref<any[]>([]);


/**
 * =========================
 * Excel 状态
 * =========================
 */
const importLoading = ref(false);

const exportLoading = ref(false);

/**
 * Excel 导入弹窗
 */
const importDialogVisible = ref(false);

/**
 * 当前选择的 Excel 文件
 */
const selectedFile = ref<File | null>(null);

/**
 * Element Plus 文件列表
 */
const uploadFileList = ref<UploadUserFile[]>([]);

/**
 * Excel 错误信息
 */
const importErrors = ref<any[]>([]);


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

  queryParams.employeeNo = undefined;

  queryParams.employeeName = undefined;

  queryParams.deptId = undefined;

  queryParams.gender = undefined;

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
const dialogVisible = ref(false);

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
 * =========================
 * 保存成功
 * =========================
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

/**
 * 打开导入弹窗
 */
const openImportDialog = () => {

  importDialogVisible.value = true;

  selectedFile.value = null;

  uploadFileList.value = [];

  importErrors.value = [];
};


/**
 * 选择 Excel 文件
 */
const handleExcelChange = (
  uploadFile: UploadFile
) => {

  importErrors.value = [];

  if (!uploadFile.raw) {

    selectedFile.value = null;

    return;
  }

  const fileName =
    uploadFile.name.toLowerCase();

  const isExcel =
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx");

  if (!isExcel) {

    ElMessage.error(
      "只能选择 Excel 文件"
    );

    selectedFile.value = null;

    uploadFileList.value = [];

    return;
  }

  selectedFile.value =
    uploadFile.raw;
};


/**
 * 移除 Excel 文件
 */
const handleExcelRemove = () => {

  selectedFile.value = null;

  uploadFileList.value = [];

  importErrors.value = [];
};


/**
 * 超出文件数量限制
 */
const handleExcelExceed = () => {

  ElMessage.warning(
    "一次只能选择一个 Excel 文件"
  );
};


/**
 * 确定导入
 */
const confirmImport = async () => {

  if (!selectedFile.value) {

    ElMessage.warning(
      "请先选择 Excel 文件"
    );

    return;
  }

  /*
   * 防止重复点击
   */
  if (importLoading.value) {
    return;
  }

  importLoading.value = true;

  importErrors.value = [];

  try {
    const result =
      await importEmployeeExcel(
        selectedFile.value
      );
    
    if (result.code !== 200) {

      ElMessage.error(
        result.message ||
        "Excel导入失败"
      );

      return;
    }

    const data =
      result.data;

    /*
     * 存在错误行
     */
    if (
      data &&
      data.errorCount > 0
    ) {

      importErrors.value =
        data.errorList || [];

      ElMessage.error(
        `导入失败，共${data.errorCount}行数据存在问题`
      );

      /*
       * 失败不关闭弹窗
       */
      return;
    }

    /*
     * 完全成功
     */
    ElMessage.success(
      `Excel导入成功，共导入${data?.successCount || 0}条员工数据`
    );

    /*
     * 关闭弹窗
     */
    importDialogVisible.value = false;

    /*
     * 清理状态
     */
    selectedFile.value = null;

    uploadFileList.value = [];

    importErrors.value = [];

    /*
     * 刷新列表
     */
    queryParams.current = 1;

    await getList();

  } catch (error: any) {

    console.error(
      "Excel导入失败:",
      error
    );

    ElMessage.error(
      error?.message ||
      "Excel导入失败"
    );

  } finally {

    importLoading.value = false;
  }
};


/**
 * 导入弹窗关闭
 */
const handleImportDialogClose = () => {

  if (importLoading.value) {
    return;
  }

  selectedFile.value = null;

  uploadFileList.value = [];

  importErrors.value = [];
};


/**
 * =========================
 * Excel 导出
 * =========================
 */
const handleExport = async () => {

  /*
   * 防止重复点击
   */
  if (exportLoading.value) {
    return;
  }

  exportLoading.value = true;

  try {

    const response =
      await exportEmployeeExcel(
        queryParams
      );

    const blob =
      response instanceof Blob
        ? response
        : response.data;

    if (!(blob instanceof Blob)) {

      throw new Error(
        "导出文件数据异常"
      );
    }

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
      "Excel导出成功"
    );

  } catch (error: any) {

    console.error(
      "Excel导出失败:",
      error
    );

    ElMessage.error(
      error?.message ||
      "Excel导出失败"
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


/* =========================
   Excel 导入错误
   ========================= */
.import-error-container {
  margin-top: 20px;
}

.import-error-container :deep(.el-alert) {
  margin-bottom: 10px;
}

</style>