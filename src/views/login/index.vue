<template>
  <div class="login-page">
    <!-- 左侧：品牌展示区 -->
    <div class="login-brand">
      <div class="brand-content">
        <h1 class="brand-title">Your Logo</h1>
        <p class="brand-desc">
          构建下一代企业级智能管理平台。<br />
          安全、高效、极简。
        </p>
      </div>
    </div>

    <!-- 右侧：表单交互区 -->
    <div class="login-form-wrapper">
      <div class="form-container">
        <div class="form-header">
          <h2>欢迎登录</h2>
          <p>请输入您的账号信息以继续</p>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          size="large"
          class="modern-form"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="邮箱 / 手机号"
              prefix-icon="User"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
              clearable
            />
          </el-form-item>

          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '验证中...' : '登 录' }}
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import {useRouter} from 'vue-router'
const router = useRouter()
interface LoginFormState {
  username: string;
  password: string;
  rememberMe: boolean;
}

const loginFormRef = ref<FormInstance>();
const loading = ref(false);

const loginForm = reactive<LoginFormState>({
  username: '',
  password: '',
  rememberMe: false
});

const loginRules = reactive<FormRules<LoginFormState>>({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
});

const handleLogin = () => {
  if (!loginFormRef.value) return;
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      ElMessage.success('登录成功！');
        loading.value = false;
        router.push('/dashboard');
    }
  });
};
</script>

<style scoped>
/* 1. 整体布局：左右分栏，全屏高度 */
.login-page {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', sans-serif;
}

/* 2. 左侧品牌区：动态渐变背景 */
.login-brand {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  /* 隐藏小屏幕下的左侧 */
}

.brand-content {
  color: #fff;
  text-align: center;
  animation: fadeIn 1s ease-out;
}

.brand-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -1px;
}

.brand-desc {
  font-size: 18px;
  opacity: 0.9;
  line-height: 1.6;
}

/* 3. 右侧表单区：毛玻璃效果 */
.login-form-wrapper {
  width: 480px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.05);
}

.form-container {
  width: 100%;
  max-width: 360px;
  padding: 40px;
  animation: slideUp 0.6s ease-out;
}

.form-header {
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 32px;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.form-header p {
  color: #888;
  font-size: 14px;
  margin: 0;
}

/* 4. 表单细节美化 */
.modern-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 4px 12px;
  box-shadow: 0 0 0 1px #e4e7ed inset;
  transition: all 0.3s ease;
}

.modern-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #667eea inset !important;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
}

/* 5. 登录按钮 */
.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(102, 126, 234, 0.4);
}

.form-footer {
  text-align: center;
  margin-top: 30px;
  color: #888;
  font-size: 14px;
}

/* 6. 动画定义 */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 7. 响应式适配（手机端隐藏左侧） */
@media (max-width: 768px) {
  .login-brand {
    display: none;
  }
  .login-form-wrapper {
    width: 100%;
    background: #fff; /* 手机端不需要毛玻璃，直接纯白 */
  }
}
</style>