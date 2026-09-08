<template>
  <div class="salary-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline class="search-form">
        <el-form-item v-if="isAdmin" label="员工">
          <el-select v-model="queryParams.employeeId" placeholder="请选择员工" clearable filterable style="width: 180px">
            <el-option v-for="employee in employeeList" :key="employee.id" :label="employee.employeeName"
              :value="employee.id" />
          </el-select>
        </el-form-item>
        <!-- 薪资月份 -->
        <el-form-item label="薪资月份">
          <el-date-picker v-model="queryParams.salaryMonth" type="month" value-format="YYYY-MM" placeholder="请选择月份"
            clearable style="width: 180px" />
        </el-form-item>

        <!-- 发放状态 -->
        <el-form-item label="发放状态">
          <el-select v-model="queryParams.paymentStatus" placeholder="全部" clearable style="width: 150px">
            <el-option label="未发放" :value="0" />

            <el-option label="已发放" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery"> 查询 </el-button>

          <el-button @click="resetQuery"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- ========================= -->
    <!-- 薪资列表 -->
    <!-- ========================= -->

    <el-card shadow="never" class="table-card">
      <div class="table-header">
        <div class="card-title">薪资记录</div>

        <!-- 只有管理员可以新增 -->
        <el-button v-if="isAdmin" type="primary" @click="openAddDialog"> 新增薪资 </el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" border max-height="500" style="width: 100%" empty-text="暂无薪资记录">
        <!-- 员工 -->
        <el-table-column prop="employeeName" label="员工姓名" min-width="110" align="center" fixed="left" />

        <!-- 月份 -->
        <el-table-column prop="salaryMonth" label="薪资月份" min-width="110" align="center">
          <template #default="{ row }">
            {{ formatMonth(row.salaryMonth) }}
          </template>
        </el-table-column>

        <!-- 基本工资 -->
        <el-table-column prop="baseSalary" label="基本工资" min-width="120" align="right">
          <template #default="{ row }">
            {{ formatMoney(row.baseSalary) }}
          </template>
        </el-table-column>

        <!-- 绩效工资 -->
        <el-table-column prop="performanceSalary" label="绩效工资" min-width="120" align="right">
          <template #default="{ row }">
            {{ formatMoney(row.performanceSalary) }}
          </template>
        </el-table-column>

        <!-- 津贴 -->
        <el-table-column prop="allowance" label="津贴补助" min-width="120" align="right">
          <template #default="{ row }">
            {{ formatMoney(row.allowance) }}
          </template>
        </el-table-column>

        <!-- 奖金 -->
        <el-table-column prop="bonus" label="奖金" min-width="110" align="right">
          <template #default="{ row }">
            {{ formatMoney(row.bonus) }}
          </template>
        </el-table-column>

        <!-- 应发工资 -->
        <el-table-column prop="grossSalary" label="应发工资" min-width="120" align="right">
          <template #default="{ row }">
            <span class="gross-salary">
              {{ formatMoney(row.grossSalary) }}
            </span>
          </template>
        </el-table-column>

        <!-- 其他扣除 -->
        <el-table-column prop="otherDeduction" label="其他扣除" min-width="120" align="right">
          <template #default="{ row }">
            {{ formatMoney(row.otherDeduction) }}
          </template>
        </el-table-column>

        <!-- 个税 -->
        <el-table-column prop="incomeTax" label="个人所得税" min-width="120" align="right">
          <template #default="{ row }">
            {{ formatMoney(row.incomeTax) }}
          </template>
        </el-table-column>

        <!-- 实发工资 -->
        <el-table-column prop="netSalary" label="实发工资" min-width="130" align="right">
          <template #default="{ row }">
            <span class="net-salary">
              {{ formatMoney(row.netSalary) }}
            </span>
          </template>
        </el-table-column>

        <!-- 发放状态 -->
        <el-table-column prop="paymentStatus" label="发放状态" min-width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getPaymentStatusType(row.paymentStatus)" size="small">
              {{ getPaymentStatusText(row.paymentStatus) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 发放时间 -->
        <el-table-column prop="paymentTime" label="发放时间" min-width="160" align="center">
          <template #default="{ row }">
            <span v-if="row.paymentTime">
              {{ row.paymentTime }}
            </span>

            <span v-else class="empty-text"> -- </span>
          </template>
        </el-table-column>

        <!-- 备注 -->
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.remark">
              {{ row.remark }}
            </span>

            <span v-else class="empty-text"> -- </span>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column v-if="isAdmin" label="操作" min-width="130" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="openEditDialog(row)"> 编辑 </el-button>

            <el-popconfirm title="确定删除这条薪资记录吗？" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button type="danger" size="small" link> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- ========================= -->
      <!-- 分页 -->
      <!-- ========================= -->

      <div class="pagination">
        <el-pagination v-model:current-page="queryParams.current" v-model:page-size="queryParams.size" :total="total"
          :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" @size-change="handlePageChange"
          @current-change="handlePageChange" />
      </div>
    </el-card>

    <!-- ========================= -->
    <!-- 新增 / 编辑弹窗 -->
    <!-- ========================= -->

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑薪资' : '新增薪资'" width="700px" destroy-on-close>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <!-- 第一行：员工与月份 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工" prop="employeeId">
              <el-select v-model="formData.employeeId" placeholder="请选择员工" clearable filterable style="width: 100%">
                <el-option v-for="employee in employeeList" :key="employee.id" :label="employee.employeeName"
                  :value="employee.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪资月份" prop="salaryMonth">
              <el-date-picker v-model="formData.salaryMonth" type="month" value-format="YYYY-MM" placeholder="请选择薪资月份"
                style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行：收入项 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="基本工资" prop="baseSalary">
              <el-input-number v-model="formData.baseSalary" :min="0" :precision="2" :step="100" :controls="false"
                style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绩效工资" prop="performanceSalary">
              <el-input-number v-model="formData.performanceSalary" :min="0" :precision="2" :step="100"
                :controls="false" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="津贴补助" prop="allowance">
              <el-input-number v-model="formData.allowance" :min="0" :precision="2" :step="100" :controls="false"
                style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="奖金" prop="bonus">
              <el-input-number v-model="formData.bonus" :min="0" :precision="2" :step="100" :controls="false"
                style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行：扣除项 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="其他扣除" prop="otherDeduction">
              <el-input-number v-model="formData.otherDeduction" :min="0" :precision="2" :step="100" :controls="false"
                style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人所得税" prop="incomeTax">
              <el-input-number v-model="formData.incomeTax" :min="0" :precision="2" :step="100" :controls="false"
                style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行：计算结果（视觉分组） -->
        <el-card shadow="never" style="margin-bottom: 20px; background-color: #f9f9f9;">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="应发工资">
                <el-input :model-value="formatMoney(formData.grossSalary)" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实发工资">
                <el-input :model-value="formatMoney(formData.netSalary)" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 第五行：状态与备注 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发放状态" prop="paymentStatus">
              <el-select v-model="formData.paymentStatus" style="width: 100%">
                <el-option label="未发放" :value="0" />
                <el-option label="已发放" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 占位，保持对齐 -->
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" maxlength="255" show-word-limit
            placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { addSalary, deleteSalary, getSalaryList, updateSalary } from '@/api/salary';
import { getEmployeeList } from '@/api/employee';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const userInfo = authStore.userInfo;

/**
 * =========================
 * 基础数据
 * =========================
 */

const loading = ref(false);

const submitLoading = ref(false);

const total = ref(0);

const tableData = ref<any[]>([]);

const employeeList = ref<any[]>([]);




const isAdmin = computed(() => {
  return userInfo.roles?.includes('ADMIN') ?? false;
});

const isManager = computed(() => {
  return userInfo.roles?.includes('MANAGER') ?? false;
});


/**
 * =========================
 * 查询参数
 * =========================
 */

const queryParams = reactive({
  employeeId: undefined as number | undefined,

  salaryMonth: '',

  paymentStatus: undefined as number | undefined,

  current: 1,

  size: 10,
});

/**
 * =========================
 * 弹窗
 * =========================
 */

const dialogVisible = ref(false);

const isEdit = ref(false);

const formRef = ref<FormInstance>();

/**
 * =========================
 * 表单
 * =========================
 */

const formData = reactive<any>({
  id: undefined,

  employeeId: undefined,

  salaryMonth: '',

  baseSalary: 0,

  performanceSalary: 0,

  allowance: 0,

  bonus: 0,

  otherDeduction: 0,

  incomeTax: 0,

  paymentStatus: 0,

  remark: '',
});

/**
 * =========================
 * 表单校验
 * =========================
 */

const rules: FormRules = {
  employeeId: [
    {
      required: true,
      message: '请选择员工',
      trigger: 'change',
    },
  ],

  salaryMonth: [
    {
      required: true,
      message: '请选择薪资月份',
      trigger: 'change',
    },
  ],

  baseSalary: [
    {
      required: true,
      message: '请输入基本工资',
      trigger: 'change',
    },
  ],

  performanceSalary: [
    {
      required: true,
      message: '请输入绩效工资',
      trigger: 'change',
    },
  ],

  allowance: [
    {
      required: true,
      message: '请输入津贴补助',
      trigger: 'change',
    },
  ],

  bonus: [
    {
      required: true,
      message: '请输入奖金',
      trigger: 'change',
    },
  ],

  otherDeduction: [
    {
      required: true,
      message: '请输入其他扣除',
      trigger: 'change',
    },
  ],

  incomeTax: [
    {
      required: true,
      message: '请输入个人所得税',
      trigger: 'change',
    },
  ],

  paymentStatus: [
    {
      required: true,
      message: '请选择发放状态',
      trigger: 'change',
    },
  ],
};

/**
 * =========================
 * 工资计算
 * =========================
 *
 * 应发 =
 * 基本工资
 * + 绩效工资
 * + 津贴补助
 * + 奖金
 *
 * 实发 =
 * 应发
 * - 其他扣除
 * - 个人所得税
 */

const grossSalary = computed(() => {
  return (
    Number(formData.baseSalary || 0) +
    Number(formData.performanceSalary || 0) +
    Number(formData.allowance || 0) +
    Number(formData.bonus || 0)
  );
});

const netSalary = computed(() => {
  return Math.max(0, grossSalary.value - Number(formData.otherDeduction || 0) - Number(formData.incomeTax || 0));
});

/**
 * 让页面表单中的计算结果同步
 */
watch([grossSalary, netSalary], () => {
  // SalaryForm 不直接保存这两个值，
  // 提交时统一组装。
});

Object.defineProperty(formData, 'grossSalary', {
  get() {
    return grossSalary.value;
  },
});

Object.defineProperty(formData, 'netSalary', {
  get() {
    return netSalary.value;
  },
});

/**
 * =========================
 * 查询
 * =========================
 */

const loadData = async () => {
  loading.value = true;

  try {
    const res = await getSalaryList(queryParams);

    if (res.code === 200) {
      tableData.value = res.data.records || [];

      total.value = res.data.total || 0;
    } else {
      ElMessage.error(res.message || '获取薪资记录失败');
    }
  } catch (error) {
    console.error(error);

    ElMessage.error('获取薪资记录失败');
  } finally {
    loading.value = false;
  }
};

/**
 * =========================
 * 员工下拉
 * =========================
 */

const loadEmployeeList = async () => {
  if (!isAdmin.value) {
    return;
  }

  try {
    const res = await getEmployeeList({
      current: 1,
      size: 1000,
    });

    if (res.code === 200) {
      employeeList.value = res.data.records || [];
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * =========================
 * 查询
 * =========================
 */

const handleQuery = () => {
  queryParams.current = 1;

  loadData();
};

/**
 * =========================
 * 重置
 * =========================
 */

const resetQuery = () => {
  queryParams.employeeId = undefined;
  queryParams.salaryMonth = '';
  queryParams.paymentStatus = undefined;
  queryParams.current = 1;
  loadData();
};

/**
 * =========================
 * 分页
 * =========================
 */

const handlePageChange = () => {
  loadData();
};

/**
 * =========================
 * 新增
 * =========================
 */

const openAddDialog = () => {
  isEdit.value = false;

  resetForm();

  dialogVisible.value = true;
};

/**
 * =========================
 * 编辑
 * =========================
 */

const openEditDialog = (row: SalaryVO) => {
  isEdit.value = true;

  formData.id = row.id;

  formData.employeeId = row.employeeId;

  formData.salaryMonth = formatMonth(row.salaryMonth);

  formData.baseSalary = Number(row.baseSalary || 0);

  formData.performanceSalary = Number(row.performanceSalary || 0);

  formData.allowance = Number(row.allowance || 0);

  formData.bonus = Number(row.bonus || 0);

  formData.otherDeduction = Number(row.otherDeduction || 0);

  formData.incomeTax = Number(row.incomeTax || 0);

  formData.paymentStatus = row.paymentStatus;

  formData.remark = row.remark || '';

  dialogVisible.value = true;
};

/**
 * =========================
 * 重置表单
 * =========================
 */

const resetForm = () => {
  formData.id = undefined;

  formData.employeeId = undefined;

  formData.salaryMonth = '';

  formData.baseSalary = 0;

  formData.performanceSalary = 0;

  formData.allowance = 0;

  formData.bonus = 0;

  formData.otherDeduction = 0;

  formData.incomeTax = 0;

  formData.paymentStatus = 0;

  formData.remark = '';
};

/**
 * =========================
 * 提交
 * =========================
 */

const handleSubmit = async () => {
  if (!formRef.value) {
    return;
  }

  const valid = await formRef.value.validate();

  if (!valid) {
    return;
  }

  submitLoading.value = true;

  try {
    const data = {
      id: formData.id,
      employeeId: formData.employeeId,
      salaryMonth: formData.salaryMonth,
      baseSalary: formData.baseSalary,
      performanceSalary: formData.performanceSalary,
      allowance: formData.allowance,
      bonus: formData.bonus,
      otherDeduction: formData.otherDeduction,
      incomeTax: formData.incomeTax,
      paymentStatus: formData.paymentStatus,
      remark: formData.remark,
    };

    const res = isEdit.value ? await updateSalary(data as any) : await addSalary(data as any);

    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '薪资修改成功' : '薪资新增成功');

      dialogVisible.value = false;

      await loadData();
    } else {
      ElMessage.error(res.message || '操作失败');
    }
  } catch (error) {
    console.error(error);

    ElMessage.error(error.message || '操作失败');
  } finally {
    submitLoading.value = false;
  }
};

/**
 * =========================
 * 删除
 * =========================
 */

const handleDelete = async (id: number) => {
  try {
    const res = await deleteSalary(id);

    if (res.code === 200) {
      ElMessage.success('删除成功');

      await loadData();
    } else {
      ElMessage.error(res.message || '删除失败');
    }
  } catch (error) {
    console.error(error);

    ElMessage.error('删除失败');
  }
};

/**
 * =========================
 * 金额格式
 * =========================
 */

const formatMoney = (value: number | string | null | undefined) => {
  const number = Number(value || 0);

  return number.toFixed(2);
};

/**
 * =========================
 * 月份格式
 * =========================
 */

const formatMonth = (value: string | null | undefined) => {
  if (!value) {
    return '--';
  }

  return value.substring(0, 7);
};

/**
 * =========================
 * 发放状态
 * =========================
 */

const getPaymentStatusText = (status: number) => {
  return status === 1 ? '已发放' : '未发放';
};

const getPaymentStatusType = (status: number) => {
  return status === 1 ? 'success' : 'warning';
};

/**
 * =========================
 * 页面初始化
 * =========================
 */

onMounted(async () => {
  await loadEmployeeList();

  await loadData();
});
</script>

<style lang="scss" scoped>
.salary-container {
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

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title {
  margin-bottom: 18px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.table-header .card-title {
  margin-bottom: 0;
}

.gross-salary {
  font-weight: 500;
}

.net-salary {
  font-weight: 600;
}

.empty-text {
  color: #c0c4cc;
}

/* =========================
   分页
   ========================= */

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
