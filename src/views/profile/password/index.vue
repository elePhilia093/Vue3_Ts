<template>
  <div class="password-container">
    <!-- 修改密码 -->
    <el-card shadow="never" class="password-card">
      <div class="card-title">修改登录密码</div>

      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" class="password-form">
        <!-- 原密码 -->
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="formData.oldPassword"
            type="password"
            show-password
            clearable
            autocomplete="off"
            placeholder="请输入原密码"
          />
        </el-form-item>

        <!-- 新密码 -->
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="formData.newPassword"
            type="password"
            show-password
            clearable
            autocomplete="new-password"
            placeholder="请输入新密码"
          />
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            show-password
            clearable
            autocomplete="new-password"
            placeholder="请再次输入新密码"
          />
        </el-form-item>

        <!-- 操作 -->
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 修改密码 </el-button>

          <el-button @click="handleReset"> 重置 </el-button>
        </el-form-item>
      </el-form>

      <div class="password-tip">
        <div>密码修改成功后，当前登录状态将失效，需要重新登录。</div>
        <div>新密码长度建议保持在 6-20 位。</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

import { updatePassword } from '@/api/personal';

/**
 * =========================
 * 表单引用
 * =========================
 */

const formRef = ref<FormInstance>();

/**
 * =========================
 * 提交状态
 * =========================
 */

const submitLoading = ref(false);

/**
 * =========================
 * 表单数据
 * =========================
 */

const formData = reactive({
  oldPassword: '',

  newPassword: '',

  confirmPassword: '',
});

/**
 * =========================
 * 确认密码校验
 * =========================
 */

const validateConfirmPassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请再次输入新密码'));

    return;
  }

  if (value !== formData.newPassword) {
    callback(new Error('两次输入的密码不一致'));

    return;
  }

  callback();
};

/**
 * =========================
 * 表单校验
 * =========================
 */

const rules: FormRules = {
  oldPassword: [
    {
      required: true,
      message: '请输入原密码',
      trigger: 'blur',
    },
  ],

  newPassword: [
    {
      required: true,
      message: '请输入新密码',
      trigger: 'blur',
    },
    {
      min: 6,
      max: 20,
      message: '密码长度为6-20位',
      trigger: 'blur',
    },
    {
      validator: (_rule, value, callback) => {
        if (value && value === formData.oldPassword) {
          callback(new Error('新密码不能与原密码相同'));

          return;
        }

        callback();
      },
      trigger: 'blur',
    },
  ],

  confirmPassword: [
    {
      required: true,
      message: '请确认新密码',
      trigger: 'blur',
    },
    {
      validator: validateConfirmPassword,
      trigger: 'blur',
    },
  ],
};

/**
 * =========================
 * 提交修改密码
 * =========================
 */

const handleSubmit = async () => {
  if (!formRef.value) {
    return;
  }

  try {
    await formRef.value.validate();

    submitLoading.value = true;

    const res = await updatePassword({
      oldPassword: formData.oldPassword,

      newPassword: formData.newPassword,
    });

    if (res.code === 200) {
      ElMessage.success('密码修改成功，请重新登录');

      handleReset();

      /*
       * 这里暂时只提示。
       *
       * 后面可以根据你项目现有的
       * logout / token 清理逻辑处理：
       *
       * 1. 清除本地 token
       * 2. 清除 Pinia 用户信息
       * 3. 跳转登录页
       */
    } else {
      ElMessage.error(res.message || '密码修改失败');
    }
  } catch (error) {
    console.error(error);

    /*
     * 表单校验失败时不会进入这里的
     * 接口调用结果处理。
     */
    if (error) {
      // 保持页面原有提示
    }
  } finally {
    submitLoading.value = false;
  }
};

/**
 * =========================
 * 重置表单
 * =========================
 */

const handleReset = () => {
  formRef.value?.resetFields();
};
</script>

<style lang="scss" scoped>
.password-container {
  padding: 16px;
}

/* =========================
   页面头部
   ========================= */

.page-header {
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
   卡片
   ========================= */

.password-card {
  max-width: 700px;
}

.card-title {
  margin-bottom: 20px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

/* =========================
   表单
   ========================= */

.password-form {
  max-width: 560px;
}

.password-form :deep(.el-input) {
  width: 360px;
}

/* =========================
   提示
   ========================= */

.password-tip {
  margin-top: 10px;
  padding: 12px 16px;
  border-radius: 4px;
  background: #f5f7fa;
  color: #909399;
  font-size: 13px;
  line-height: 1.8;
}
</style>
