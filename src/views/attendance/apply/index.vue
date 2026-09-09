<template>
  <div class="leave-container">
    <!-- 操作区 -->
    <el-card v-if="!isAdmin" shadow="never" class="operation-card">
      <div class="operation-content">
        <!-- 普通员工和主管可以申请 -->
        <el-button v-if="!isAdmin" type="primary" @click="openAddDialog"> 申请请假 </el-button>
      </div>
    </el-card>

    <!-- 查询区 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline class="search-form">
        <!-- 管理员可以按员工查询 -->
        <el-form-item v-if="isAdmin" label="员工">
          <el-select
            v-model="queryParams.employeeId"
            placeholder="请选择员工"
            clearable
            filterable
            style="width: 180px"
          >
            <el-option
              v-for="employee in employeeList"
              :key="employee.id"
              :label="employee.employeeName"
              :value="employee.id"
            />
          </el-select>
        </el-form-item>

        <!-- 开始日期 -->
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="queryParams.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            clearable
          />
        </el-form-item>

        <!-- 结束日期 -->
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="queryParams.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            clearable
          />
        </el-form-item>

        <!-- 审批状态 -->
        <el-form-item label="状态">
          <el-select v-model="queryParams.approvalStatus" placeholder="全部" clearable style="width: 150px">
            <el-option label="待审批" :value="0" />

            <el-option label="已通过" :value="1" />

            <el-option label="已驳回" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery"> 查询 </el-button>

          <el-button @click="resetQuery"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 请假记录 -->
    <el-card shadow="never" class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        max-height="500"
        style="width: 100%"
        empty-text="暂无请假记录"
      >
        <!-- 员工 -->
        <el-table-column prop="employeeName" label="员工姓名" min-width="110" align="center" />

        <!-- 请假类型 -->
        <el-table-column prop="leaveType" label="请假类型" min-width="100" align="center">
          <template #default="{ row }">
            {{ getLeaveTypeText(row.leaveType) }}
          </template>
        </el-table-column>

        <!-- 开始时间 -->
        <el-table-column prop="startTime" label="开始时间" min-width="170" align="center" />

        <!-- 结束时间 -->
        <el-table-column prop="endTime" label="结束时间" min-width="170" align="center" />

        <!-- 请假天数 -->
        <el-table-column prop="leaveDays" label="请假天数" min-width="100" align="center">
          <template #default="{ row }"> {{ row.leaveDays }} 天 </template>
        </el-table-column>

        <!-- 原因 -->
        <el-table-column prop="reason" label="请假原因" min-width="180" show-overflow-tooltip />

        <!-- 审批状态 -->
        <el-table-column prop="approvalStatus" label="审批状态" min-width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.approvalStatus)" size="small">
              {{ getStatusText(row.approvalStatus) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 审批人 -->
        <el-table-column prop="approverName" label="审批人" min-width="110" align="center">
          <template #default="{ row }">
            {{ row.approverName || '--' }}
          </template>
        </el-table-column>

        <!-- 审批意见 -->
        <el-table-column prop="approvalComment" label="审批意见" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.approvalComment || '--' }}
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" min-width="100" fixed="right" align="center">
          <template #default="{ row }">
            <!-- 主管 / 管理员才能审批 -->
            <el-button
              v-if="(isAdmin || isManager) && row.approvalStatus === 0"
              type="primary"
              size="small"
              link
              @click="openAuditDialog(row)"
            >
              审批
            </el-button>

            <span v-else class="empty-text"> -- </span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="queryParams.current"
          v-model:page-size="queryParams.size"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- ==================== -->
    <!-- 请假申请弹窗 -->
    <!-- ==================== -->

    <el-dialog v-model="addDialogVisible" title="申请请假" width="520px" destroy-on-close>
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="90px">
        <el-form-item label="请假类型" prop="leaveType">
          <el-select v-model="addForm.leaveType" placeholder="请选择请假类型" style="width: 100%">
            <el-option label="事假" :value="1" />

            <el-option label="病假" :value="2" />

            <el-option label="年假" :value="3" />

            <el-option label="其他" :value="4" />
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="addForm.startTime"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            placeholder="请选择开始时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="addForm.endTime"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            placeholder="请选择结束时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="请假原因" prop="reason">
          <el-input
            v-model="addForm.reason"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            placeholder="请输入请假原因"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addDialogVisible = false"> 取消 </el-button>

        <el-button type="primary" :loading="submitLoading" @click="submitAdd"> 提交申请 </el-button>
      </template>
    </el-dialog>

    <!-- ==================== -->
    <!-- 审批弹窗 -->
    <!-- ==================== -->

    <el-dialog v-model="auditDialogVisible" title="请假审批" width="560px" destroy-on-close>
      <el-descriptions :column="2" border class="leave-detail">
        <el-descriptions-item label="员工">
          {{ currentLeave.employeeName }}
        </el-descriptions-item>

        <el-descriptions-item label="请假类型">
          {{ getLeaveTypeText(currentLeave.leaveType) }}
        </el-descriptions-item>

        <el-descriptions-item label="开始时间">
          {{ currentLeave.startTime }}
        </el-descriptions-item>

        <el-descriptions-item label="结束时间">
          {{ currentLeave.endTime }}
        </el-descriptions-item>

        <el-descriptions-item label="请假天数"> {{ currentLeave.leaveDays }} 天 </el-descriptions-item>

        <el-descriptions-item label="请假原因" :span="2">
          {{ currentLeave.reason }}
        </el-descriptions-item>
      </el-descriptions>

      <el-form ref="auditFormRef" :model="auditForm" :rules="auditRules" label-width="90px" class="audit-form">
        <el-form-item label="审批结果" prop="approvalStatus">
          <el-radio-group v-model="auditForm.approvalStatus">
            <el-radio :value="1"> 通过 </el-radio>

            <el-radio :value="2"> 驳回 </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审批意见" prop="approvalComment">
          <el-input
            v-model="auditForm.approvalComment"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            placeholder="请输入审批意见"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="auditDialogVisible = false"> 取消 </el-button>

        <el-button type="primary" :loading="auditLoading" @click="submitAudit"> 确定审批 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { addLeave, auditLeave, getLeaveList, type LeaveVO } from '@/api/leave';
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

const auditLoading = ref(false);

const total = ref(0);

const tableData = ref<LeaveVO[]>([]);

const employeeList = ref<any[]>([]);

const isAdmin = computed(() => {
  return userInfo.roles?.includes('ADMIN') ?? false;
});

const isManager = computed(() => {
  return userInfo.roles?.includes('MANAGER') ?? false;
});

/**
 * =========================
 * 页面日期
 * =========================
 */

const todayText = computed(() => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
});

/**
 * =========================
 * 查询参数
 * =========================
 */

const queryParams = reactive({
  employeeId: undefined as number | undefined,

  approvalStatus: undefined as number | undefined,

  startDate: '',

  endDate: '',

  current: 1,

  size: 10,
});

/**
 * =========================
 * 请假申请
 * =========================
 */

const addDialogVisible = ref(false);

const addFormRef = ref<FormInstance>();

const addForm = reactive({
  leaveType: undefined as number | undefined,

  startTime: '',

  endTime: '',

  reason: '',
});

const addRules: FormRules = {
  leaveType: [
    {
      required: true,
      message: '请选择请假类型',
      trigger: 'change',
    },
  ],

  startTime: [
    {
      required: true,
      message: '请选择开始时间',
      trigger: 'change',
    },
  ],

  endTime: [
    {
      required: true,
      message: '请选择结束时间',
      trigger: 'change',
    },
  ],

  reason: [
    {
      required: true,
      message: '请输入请假原因',
      trigger: 'blur',
    },
  ],
};

/**
 * =========================
 * 审批
 * =========================
 */

const auditDialogVisible = ref(false);

const auditFormRef = ref<FormInstance>();

const currentLeave = ref<Partial<LeaveVO>>({});

const auditForm = reactive({
  id: 0,

  approvalStatus: 1,

  approvalComment: '',
});

const auditRules: FormRules = {
  approvalStatus: [
    {
      required: true,
      message: '请选择审批结果',
      trigger: 'change',
    },
  ],

  approvalComment: [
    {
      required: true,
      message: '请输入审批意见',
      trigger: 'blur',
    },
  ],
};

/**
 * =========================
 * 查询列表
 * =========================
 */

const loadData = async () => {
  loading.value = true;

  try {
    const res = await getLeaveList(queryParams);

    if (res.code === 200) {
      tableData.value = res.data.records || [];

      total.value = res.data.total || 0;
    } else {
      ElMessage.error(res.message || '获取请假记录失败');
    }
  } catch (error) {
    console.error(error);

    ElMessage.error('获取请假记录失败');
  } finally {
    loading.value = false;
  }
};

/**
 * =========================
 * 管理员获取员工列表
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

  queryParams.approvalStatus = undefined;

  queryParams.startDate = '';

  queryParams.endDate = '';

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
 * 打开申请弹窗
 * =========================
 */

const openAddDialog = () => {
  addForm.leaveType = undefined;

  addForm.startTime = '';

  addForm.endTime = '';

  addForm.reason = '';

  addDialogVisible.value = true;
};

/**
 * =========================
 * 提交请假申请
 * =========================
 */

const submitAdd = async () => {
  if (!addFormRef.value) {
    return;
  }

  const valid = await addFormRef.value.validate();

  if (!valid) {
    return;
  }

  /**
   * 前端先检查时间顺序
   */
  if (addForm.startTime && addForm.endTime && new Date(addForm.endTime) < new Date(addForm.startTime)) {
    ElMessage.warning('结束时间不能早于开始时间');

    return;
  }

  submitLoading.value = true;

  try {
    const res = await addLeave({
      leaveType: addForm.leaveType!,

      startTime: addForm.startTime,

      endTime: addForm.endTime,

      reason: addForm.reason,
    });

    if (res.code === 200) {
      ElMessage.success('请假申请提交成功');

      addDialogVisible.value = false;

      await loadData();
    } else {
      ElMessage.error(res.message || '请假申请提交失败');
    }
  } catch (error) {
    console.error(error);

    ElMessage.error('请假申请提交失败');
  } finally {
    submitLoading.value = false;
  }
};

/**
 * =========================
 * 打开审批弹窗
 * =========================
 */

const openAuditDialog = (row: LeaveVO) => {
  currentLeave.value = {
    ...row,
  };

  auditForm.id = row.id;

  auditForm.approvalStatus = 1;

  auditForm.approvalComment = '';

  auditDialogVisible.value = true;
};

/**
 * =========================
 * 提交审批
 * =========================
 */

const submitAudit = async () => {
  if (!auditFormRef.value) {
    return;
  }

  const valid = await auditFormRef.value.validate();

  if (!valid) {
    return;
  }

  auditLoading.value = true;

  try {
    const res = await auditLeave({
      id: auditForm.id,

      approvalStatus: auditForm.approvalStatus,

      approvalComment: auditForm.approvalComment,
    });

    if (res.code === 200) {
      ElMessage.success('审批处理成功');

      auditDialogVisible.value = false;

      await loadData();
    } else {
      ElMessage.error(res.message || '审批失败');
    }
  } catch (error) {
    console.error(error);

    ElMessage.error('审批失败');
  } finally {
    auditLoading.value = false;
  }
};

/**
 * =========================
 * 请假类型
 * =========================
 *
 * 当前页面暂定：
 * 1-事假
 * 2-病假
 * 3-年假
 * 4-其他
 */

const getLeaveTypeText = (type: number) => {
  switch (type) {
    case 1:
      return '事假';

    case 2:
      return '病假';

    case 3:
      return '年假';

    case 4:
      return '其他';

    default:
      return '未知';
  }
};

/**
 * =========================
 * 审批状态文字
 * =========================
 */

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '待审批';

    case 1:
      return '已通过';

    case 2:
      return '已驳回';

    default:
      return '未知';
  }
};

/**
 * =========================
 * 审批状态标签
 * =========================
 */

const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return 'warning';

    case 1:
      return 'success';

    case 2:
      return 'danger';

    default:
      return 'info';
  }
};

/**
 * 页面初始化
 */
onMounted(async () => {
  await loadEmployeeList();

  await loadData();
});
</script>

<style lang="scss" scoped>
.leave-container {
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

.operation-card {
  margin-bottom: 16px;
}

.operation-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.operation-title {
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.operation-desc {
  margin-top: 6px;
  color: #909399;
  font-size: 13px;
}

/* =========================
   查询区域
   ========================= */

.search-card {
  margin-bottom: 16px;
}

.search-form {
  margin-bottom: -18px;
}

/* =========================
   卡片标题
   ========================= */

.card-title {
  margin-bottom: 18px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.table-title {
  margin-bottom: 16px;
}

/* =========================
   表格
   ========================= */

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

/* =========================
   审批弹窗
   ========================= */

.leave-detail {
  margin-bottom: 22px;
}

.audit-form {
  margin-top: 10px;
}
</style>
