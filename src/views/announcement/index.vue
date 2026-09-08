<template>
  <div class="announcement-container">
    <div class="page-header">
      <!-- 管理员显示 -->
      <el-button v-if="isAdmin" type="primary" @click="handleAdd">
        <el-icon>
          <Plus />
        </el-icon>
        发布公告
      </el-button>
    </div>

    <!-- ========================= -->
    <!-- 查询区域 -->
    <!-- ========================= -->

    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="公告标题">
          <el-input v-model="queryParams.title" placeholder="请输入公告标题" clearable style="width: 220px" />
        </el-form-item>

        <el-form-item v-if="isAdmin" label="发布状态">
          <el-select v-model="queryParams.publishStatus" placeholder="全部" clearable style="width: 150px">
            <el-option label="未发布" :value="0" />

            <el-option label="已发布" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery"> 查询 </el-button>

          <el-button @click="resetQuery"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- ========================= -->
    <!-- 公告列表 -->
    <!-- ========================= -->

    <el-card shadow="never" class="table-card">
      <div class="table-header">
        <div class="card-title">公告列表</div>
      </div>

      <el-table v-loading="loading" :data="tableData" border max-height="520" style="width: 100%" empty-text="暂无公告">
        <!-- 公告标题 -->
        <el-table-column prop="title" label="公告标题" min-width="280" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="title-cell">
              <el-tag v-if="row.isTop === 1" type="warning" size="small"> 置顶 </el-tag>

              <span>
                {{ row.title }}
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- 发布人 -->
        <el-table-column prop="publisherName" label="发布人" width="130" align="center" />

        <!-- 状态 -->
        <el-table-column prop="publishStatus" label="状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.publishStatus === 1" type="success" size="small"> 已发布 </el-tag>

            <el-tag v-else type="info" size="small"> 未发布 </el-tag>
          </template>
        </el-table-column>

        <!-- 发布时间 -->
        <el-table-column prop="publishTime" label="发布时间" width="180" align="center">
          <template #default="{ row }">
            <span v-if="row.publishTime">
              {{ formatDateTime(row.publishTime) }}
            </span>

            <span v-else class="empty-text"> -- </span>
          </template>
        </el-table-column>

        <!-- 创建时间 -->
        <el-table-column prop="createTime" label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" :width="isAdmin ? 210 : 100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleView(row)"> 查看 </el-button>

            <template v-if="isAdmin">
              <el-button type="primary" size="small" link @click="handleEdit(row)"> 编辑 </el-button>

              <el-popconfirm
                title="确定删除这条公告吗？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="handleDelete(row.id)"
              >
                <template #reference>
                  <el-button size="small" type="danger" link> 删除 </el-button>
                </template>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- ========================= -->
      <!-- 分页 -->
      <!-- ========================= -->

      <div class="pagination">
        <el-pagination
          v-model:current-page="queryParams.current"
          v-model:page-size="queryParams.size"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <!-- ========================= -->
    <!-- 查看公告 -->
    <!-- ========================= -->

    <el-dialog v-model="viewVisible" title="公告详情" width="720px">
      <div class="announcement-detail">
        <div class="detail-title">
          {{ viewData.title }}
        </div>

        <div class="detail-meta">
          <span> 发布人：{{ viewData.publisherName || '--' }} </span>

          <span>
            发布时间：
            {{ viewData.publishTime ? formatDateTime(viewData.publishTime) : '--' }}
          </span>
        </div>

        <el-divider />

        <div class="detail-content">
          {{ viewData.content }}
        </div>
      </div>
    </el-dialog>

    <!-- ========================= -->
    <!-- 新增 / 编辑公告 -->
    <!-- ========================= -->

    <el-dialog v-model="formVisible" :title="isEdit ? '编辑公告' : '发布公告'" width="650px" destroy-on-close>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px">
        <!-- 标题 -->
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入公告标题" maxlength="200" show-word-limit clearable />
        </el-form-item>

        <!-- 内容 -->
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="8"
            maxlength="5000"
            show-word-limit
            placeholder="请输入公告内容"
          />
        </el-form-item>

        <!-- 发布状态 -->
        <el-form-item label="状态" prop="publishStatus">
          <el-radio-group v-model="formData.publishStatus">
            <el-radio :value="0"> 暂不发布 </el-radio>

            <el-radio :value="1"> 立即发布 </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 置顶 -->
        <el-form-item label="是否置顶" prop="isTop">
          <el-switch v-model="formData.isTop" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="formVisible = false"> 取消 </el-button>

        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { getAnnouncementList, addAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/api/announcement';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const userInfo = authStore.userInfo;
/* =========================
   基础状态
   ========================= */

const loading = ref(false);

const submitLoading = ref(false);

const total = ref(0);

const tableData = ref<any[]>([]);

/* =========================
   管理员权限
   =========================

   这里先按照你项目现有的角色状态来接。

   你项目已经通过 Spring Security
   加载 ROLE_ADMIN。

   如果你的 Pinia 用户仓库已经有 roles，
   只需要把这里替换成真实 store。
   ========================= */

const isAdmin = computed(() => {
  return userInfo.roles?.includes('ADMIN') ?? false;
});

/* =========================
   查询参数
   ========================= */

const queryParams = reactive<any>({
  title: '',
  publishStatus: undefined,
  current: 1,
  size: 10,
});

/* =========================
   查看公告
   ========================= */

const viewVisible = ref(false);

const viewData = reactive<any>({
  id: 0,
  title: '',
  content: '',
  publisherId: 0,
  publisherName: '',
  publishStatus: 0,
  publishTime: null,
  isTop: 0,
  createTime: '',
  updateTime: '',
});

/* =========================
   新增 / 编辑
   ========================= */

const formVisible = ref(false);

const isEdit = ref(false);

const formRef = ref<FormInstance>();

const formData = reactive<any>({
  id: undefined,
  title: '',
  content: '',
  publishStatus: 0,
  isTop: 0,
});

/* =========================
   表单校验
   ========================= */

const rules: FormRules = {
  title: [
    {
      required: true,
      message: '请输入公告标题',
      trigger: 'blur',
    },
  ],

  content: [
    {
      required: true,
      message: '请输入公告内容',
      trigger: 'blur',
    },
  ],

  publishStatus: [
    {
      required: true,
      message: '请选择发布状态',
      trigger: 'change',
    },
  ],
};

/* =========================
   查询列表
   ========================= */

const loadData = async () => {
  loading.value = true;

  try {
    const res = await getAnnouncementList(queryParams);

    if (res.code === 200) {
      tableData.value = res.data.records || [];

      total.value = res.data.total || 0;
    } else {
      ElMessage.error(res.message || '获取公告失败');
    }
  } catch (error) {
    console.error(error);

    ElMessage.error('获取公告失败');
  } finally {
    loading.value = false;
  }
};

/* =========================
   查询
   ========================= */

const handleQuery = () => {
  queryParams.current = 1;

  loadData();
};

/* =========================
   重置
   ========================= */

const resetQuery = () => {
  queryParams.title = '';

  queryParams.publishStatus = undefined;

  queryParams.current = 1;

  loadData();
};

/* =========================
   新增
   ========================= */

const handleAdd = () => {
  isEdit.value = false;

  resetForm();

  formVisible.value = true;
};

/* =========================
   查看
   ========================= */

const handleView = (row: any) => {
  viewData.id = row.id;
  viewData.title = row.title;
  viewData.content = row.content;
  viewData.publisherId = row.publisherId;
  viewData.publisherName = row.publisherName || '';
  viewData.publishStatus = row.publishStatus;
  viewData.publishTime = row.publishTime;
  viewData.isTop = row.isTop;
  viewData.createTime = row.createTime;
  viewData.updateTime = row.updateTime;
  viewVisible.value = true;
};

/* =========================
   编辑
   ========================= */

const handleEdit = (row: any) => {
  isEdit.value = true;

  formData.id = row.id;

  formData.title = row.title;

  formData.content = row.content;

  formData.publishStatus = row.publishStatus;

  formData.isTop = row.isTop;

  formVisible.value = true;
};

/* =========================
   重置表单
   ========================= */

const resetForm = () => {
  formData.id = undefined;

  formData.title = '';

  formData.content = '';

  formData.publishStatus = 0;

  formData.isTop = 0;
};

/* =========================
   提交
   ========================= */

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
    let res;

    if (isEdit.value) {
      res = await updateAnnouncement(formData);
    } else {
      res = await addAnnouncement(formData);
    }

    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '公告修改成功' : '公告发布成功');

      formVisible.value = false;

      await loadData();
    } else {
      ElMessage.error(res.message || '操作失败');
    }
  } catch (error) {
    console.error(error);

    ElMessage.error('操作失败');
  } finally {
    submitLoading.value = false;
  }
};

/* =========================
   删除
   ========================= */

const handleDelete = async (id: number) => {
  try {
    const res = await deleteAnnouncement(id);

    if (res.code === 200) {
      ElMessage.success('公告删除成功');

      await loadData();
    } else {
      ElMessage.error(res.message || '删除失败');
    }
  } catch (error) {
    console.error(error);

    ElMessage.error('删除失败');
  }
};

/* =========================
   时间格式化
   ========================= */

const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return '--';
  }

  return value.replace('T', ' ');
};

/* =========================
   初始化
   ========================= */

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.announcement-container {
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
   页面头部
   ========================= */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-title {
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.page-desc {
  margin-top: 4px;
  color: #909399;
  font-size: 13px;
}

/* =========================
   查询
   ========================= */

.search-card {
  margin-bottom: 16px;
}

/* =========================
   表格
   ========================= */

.table-card {
  margin-bottom: 16px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title {
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.table-tip {
  color: #909399;
  font-size: 13px;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
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

/* =========================
   公告详情
   ========================= */

.announcement-detail {
  padding: 0 10px 10px;
}

.detail-title {
  text-align: center;
  color: #303133;
  font-size: 22px;
  font-weight: 600;
  line-height: 32px;
}

.detail-meta {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 12px;
  color: #909399;
  font-size: 13px;
}

.detail-content {
  min-height: 180px;
  color: #606266;
  font-size: 14px;
  line-height: 1.9;
  white-space: pre-wrap;
}
</style>
