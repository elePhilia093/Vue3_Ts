<template>
  <div class="record-container">
    <!-- 今日考勤 -->
    <el-card shadow="never" class="operation-card">
      <div class="operation-header">
        <div class="operation-title">今日考勤</div>
      </div>

      <div class="operation-content">
        <!-- 打卡按钮 -->
        <div class="operation-left">
          <el-button
            type="primary"
            size="large"
            :disabled="checkInDisabled"
            @click="handleCheckIn"
          >
            上班打卡
          </el-button>

          <el-button
            type="success"
            size="large"
            @click="handleCheckOut"
          >
            下班打卡
          </el-button>
        </div>

        <!-- 今日信息 -->
        <div class="attendance-info">
          <div class="info-item">
            <div class="info-label">上班时间</div>

            <div class="info-value">
              {{ todayCheckIn }}
            </div>
          </div>

          <div class="info-item">
            <div class="info-label">下班时间</div>

            <div class="info-value">
              {{ todayCheckOut }}
            </div>
          </div>

          <div class="info-item">
            <div class="info-label">今日状态</div>

            <div class="info-value">
              <el-tag :type="todayStatusType">
                {{ todayStatus }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 查询条件 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline class="search-form">
        <!-- 管理员、主管 -->
        <el-form-item v-if="isAdmin || isManager" label="员工">
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

        <!-- 普通员工不显示员工筛选 -->
        <el-form-item label="考勤日期">
          <el-date-picker
            v-model="queryParams.attendanceDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            clearable
            style="width: 180px"
          />
        </el-form-item>

        <el-form-item label="考勤状态">
          <el-select
            v-model="queryParams.attendanceStatus"
            placeholder="全部"
            clearable
            style="width: 160px"
          >
            <el-option label="正常" :value="0" />

            <el-option label="迟到" :value="1" />

            <el-option label="早退" :value="2" />

            <el-option label="迟到且早退" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery"> 查询 </el-button>

          <el-button @click="resetQuery"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 考勤记录 -->
    <el-card shadow="never" class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        max-height="500"
        empty-text="暂无考勤记录"
      >
        <el-table-column
          prop="employeeName"
          label="员工姓名"
          min-width="120"
          align="center"
        />

        <el-table-column
          prop="attendanceDate"
          label="考勤日期"
          min-width="120"
          align="center"
        />

        <el-table-column
          prop="checkInTime"
          label="上班时间"
          min-width="120"
          align="center"
        >
          <template #default="{ row }">
            <span v-if="row.checkInTime" class="time-text">
              {{ row.checkInTime }}
            </span>

            <span v-else class="empty-text"> -- </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="checkOutTime"
          label="下班时间"
          min-width="120"
          align="center"
        >
          <template #default="{ row }">
            <span v-if="row.checkOutTime" class="time-text">
              {{ row.checkOutTime }}
            </span>

            <span v-else class="empty-text"> -- </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="attendanceStatus"
          label="考勤状态"
          min-width="120"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.attendanceStatus)" size="small">
              {{ getStatusText(row.attendanceStatus) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="lateMinutes"
          label="迟到"
          min-width="110"
          align="center"
        >
          <template #default="{ row }">
            <span
              :class="{
                'abnormal-number': row.lateMinutes > 0,
              }"
            >
              {{ row.lateMinutes || 0 }} 分钟
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="earlyLeaveMinutes"
          label="早退"
          min-width="110"
          align="center"
        >
          <template #default="{ row }">
            <span
              :class="{
                'abnormal-number': row.earlyLeaveMinutes > 0,
              }"
            >
              {{ row.earlyLeaveMinutes || 0 }} 分钟
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="remark"
          label="备注"
          min-width="150"
          align="center"
        >
          <template #default="{ row }">
            <span v-if="row.remark">
              {{ row.remark }}
            </span>

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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

import { ElMessage } from "element-plus";

import { checkIn, checkOut, getAttendanceList } from "@/api/attendance";

import { getEmployeeList } from "@/api/employee";

/**
 * 员工下拉数据
 */
interface EmployeeOption {
  id: number;
  employeeName: string;
}

/**
 * 考勤记录
 */
interface AttendanceVO {
  id: number;
  employeeId: number;
  employeeName: string;
  attendanceDate: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  attendanceStatus: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  remark: string | null;
}

/**
 * =========================
 * 基础数据
 * =========================
 */

const loading = ref(false);

const tableData = ref<AttendanceVO[]>([]);

const total = ref(0);

const employeeList = ref<EmployeeOption[]>([]);

/**
 * 当前角色
 *
 * 注意：
 * 这里暂时沿用你目前代码的写法。
 * 后面把它换成你项目已有的 Pinia 用户角色即可。
 */
const currentRole = ref("EMPLOYEE");

/**
 * 是否管理员
 */
const isAdmin = computed(() => {
  return currentRole.value === "ADMIN";
});

/**
 * 是否主管
 */
const isManager = computed(() => {
  return currentRole.value === "MANAGER";
});

/**
 * 查询参数
 */
const queryParams = reactive({
  employeeId: undefined as number | undefined,

  attendanceDate: "",

  attendanceStatus: undefined as number | undefined,

  current: 1,

  size: 10,
});

/**
 * =========================
 * 日期
 * =========================
 */

const todayText = computed(() => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
});

/**
 * =========================
 * 今日考勤
 * =========================
 *
 * 普通员工：
 * tableData 本身就是当前员工的数据，
 * 可以直接寻找今天的记录。
 *
 * 管理员 / 主管：
 * 如果选择了员工，
 * 则可以从当前查询结果中寻找今天的记录。
 */
const todayAttendance = computed(() => {
  return tableData.value.find((item) => {
    const isToday = item.attendanceDate === todayText.value;

    if (!isToday) {
      return false;
    }

    if ((isAdmin.value || isManager.value) && queryParams.employeeId) {
      return item.employeeId === queryParams.employeeId;
    }

    return true;
  });
});

/**
 * 今日上班时间
 */
const todayCheckIn = computed(() => {
  return todayAttendance.value?.checkInTime || "--:--:--";
});

/**
 * 今日下班时间
 */
const todayCheckOut = computed(() => {
  return todayAttendance.value?.checkOutTime || "--:--:--";
});

/**
 * 今日状态
 */
const todayStatus = computed(() => {
  if (!todayAttendance.value) {
    return "未打卡";
  }

  return getStatusText(todayAttendance.value.attendanceStatus);
});

/**
 * 今日状态类型
 */
const todayStatusType = computed(() => {
  if (!todayAttendance.value) {
    return "info";
  }

  return getStatusType(todayAttendance.value.attendanceStatus);
});

/**
 * =========================
 * 打卡按钮状态
 * =========================
 *
 * 这些状态主要用于改善 UI。
 * 后端仍然会再次进行业务校验。
 */

/**
 * 上班打卡是否禁用
 */
const checkInDisabled = computed(() => {
  return !!todayAttendance.value?.checkInTime;
});

/**
 * 下班打卡是否禁用
 */
const checkOutDisabled = computed(() => {
  if (!todayAttendance.value) {
    return true;
  }

  if (!todayAttendance.value.checkInTime) {
    return true;
  }

  return !!todayAttendance.value.checkOutTime;
});

/**
 * =========================
 * 查询考勤
 * =========================
 */

const loadData = async () => {
  loading.value = true;

  try {
    const res = await getAttendanceList(queryParams);

    if (res.code === 200) {
      tableData.value = res.data.records || [];

      total.value = res.data.total || 0;
    } else {
      ElMessage.error(res.message || "获取考勤记录失败");
    }
  } catch (error) {
    console.error(error);

    ElMessage.error("获取考勤记录失败");
  } finally {
    loading.value = false;
  }
};

/**
 * =========================
 * 获取员工列表
 * =========================
 *
 * 主管、管理员使用。
 */
const loadEmployeeList = async () => {
  if (!isAdmin.value && !isManager.value) {
    return;
  }

  try {
    const res = await getEmployeeList({
      current: 1,
      size: 1000,
    });

    if (res.code === 200) {
      employeeList.value = res.data.records || [];
    } else {
      ElMessage.error(res.message || "获取员工列表失败");
    }
  } catch (error) {
    console.error(error);

    ElMessage.error("获取员工列表失败");
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

  queryParams.attendanceDate = "";

  queryParams.attendanceStatus = undefined;

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
 * 上班打卡
 * =========================
 */

const handleCheckIn = async () => {
  try {
    const res = await checkIn();

    if (res.code === 200) {
      ElMessage.success("上班打卡成功");

      await loadData();
    } else {
      ElMessage.error(res.message || "上班打卡失败");
    }
  } catch (error) {
    console.error(error);

    ElMessage.error("上班打卡失败");
  }
};

/**
 * =========================
 * 下班打卡
 * =========================
 */

const handleCheckOut = async () => {
  try {
    const res = await checkOut();

    if (res.code === 200) {
      ElMessage.success("下班打卡成功");

      await loadData();
    } else {
      ElMessage.error(res.message || "下班打卡失败");
    }
  } catch (error) {
    console.error(error);

    ElMessage.error("下班打卡失败");
  }
};

/**
 * =========================
 * 状态文字
 * =========================
 */

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "正常";

    case 1:
      return "迟到";

    case 2:
      return "早退";

    case 3:
      return "迟到且早退";

    default:
      return "未知";
  }
};

/**
 * =========================
 * 状态标签
 * =========================
 */

const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return "success";

    case 1:
    case 2:
      return "warning";

    case 3:
      return "danger";

    default:
      return "info";
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
.record-container {
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

/* =========================
   今日考勤
   ========================= */

.operation-card {
  margin-bottom: 16px;
}

.operation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.operation-title {
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.operation-desc {
  color: #909399;
  font-size: 13px;
}

.operation-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.operation-left {
  display: flex;
  gap: 12px;
}

.attendance-info {
  display: flex;
  align-items: center;
  gap: 70px;
  padding-right: 20px;
}

.info-item {
  min-width: 90px;
}

.info-label {
  margin-bottom: 8px;
  color: #909399;
  font-size: 13px;
}

.info-value {
  color: #303133;
  font-size: 16px;
  font-weight: 500;
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
   查询区域
   ========================= */

.search-card {
  margin-bottom: 16px;
}

.search-form {
  margin-bottom: -18px;
}

/* =========================
   表格
   ========================= */


.time-text {
  color: #303133;
}

.empty-text {
  color: #c0c4cc;
}

.abnormal-number {
  color: #e6a23c;
  font-weight: 500;
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
