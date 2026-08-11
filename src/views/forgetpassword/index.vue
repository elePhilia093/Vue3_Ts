<template>
  <div class="auth-layout">
    <!-- 左侧：保持一致 -->
    <div class="auth-banner">
      <h1>Your Logo</h1>
      <p>构建下一代企业级智能管理平台。<br />安全、高效、极简。</p>
    </div>

    <!-- 右侧：找回密码表单 -->
    <div class="auth-form-container">
      <div class="form-box">
        <div class="header">
          <h2>忘记密码？</h2>
          <p>请输入账号信息重置密码</p>
        </div>

        <el-form ref="formRef" :model="formData" :rules="rules" size="large">
          
          <!-- 账号/邮箱 -->
          <el-form-item prop="account">
            <el-input v-model="formData.account" placeholder="用户名 / 手机号 / 邮箱" prefix-icon="User" />
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item prop="code">
            <div style="display: flex; gap: 10px; width: 100%;">
              <el-input v-model="formData.code" placeholder="验证码" prefix-icon="Key" />
              <el-button 
                style="width: 120px;" 
                :disabled="countdown > 0"
                @click="sendCode"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>

          <!-- 新密码 -->
          <el-form-item prop="newPassword">
            <el-input v-model="formData.newPassword" type="password" placeholder="设置新密码" prefix-icon="Lock" show-password />
          </el-form-item>

          <el-button type="primary" class="btn-submit" :loading="loading" @click="handleReset">
            重置密码
          </el-button>
        </el-form>

        <div class="footer-links">
          想起密码了？ <router-link to="/login">返回登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

const formRef = ref<FormInstance>();
const loading = ref(false);
const countdown = ref(0);

const formData = reactive({
  account: '',
  code: '',
  newPassword: ''
});

const rules = reactive<FormRules>({
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '长度至少 6 个字符', trigger: 'blur' }
  ]
});

// 发送验证码逻辑
const sendCode = () => {
  if (!formData.account) {
    ElMessage.warning('请先输入账号');
    return;
  }
  // TODO: 调用发送验证码接口
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) clearInterval(timer);
  }, 1000);
  ElMessage.success('验证码已发送');
};

const handleReset = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      // TODO: 调用重置密码接口
      setTimeout(() => {
        ElMessage.success('密码重置成功，请登录');
        loading.value = false;
        // router.push('/login');
      }, 1500);
    }
  });
};
</script>

<style scoped lang="scss">
/* 引入上面定义的公共样式 */
@use '@/styles/common-auth.scss';
</style>