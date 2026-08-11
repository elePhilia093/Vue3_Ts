<template>
  <div class="auth-layout">
    <!-- 左侧：复用登录页的品牌展示 -->
    <div class="auth-banner">
      <h1>Your Logo</h1>
      <p>构建下一代企业级智能管理平台。<br />安全、高效、极简。</p>
    </div>

    <!-- 右侧：注册表单 -->
    <div class="auth-form-container">
      <div class="form-box">
        <div class="header">
          <h2>立即注册</h2>
          <p>创建您的账号以继续</p>
        </div>

        <el-form 
          ref="formRef" 
          :model="formData" 
          :rules="rules" 
          label-position="top"
          size="large"
        >
          <el-form-item prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名" prefix-icon="User" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="formData.password" type="password" placeholder="设置密码" prefix-icon="Lock" show-password />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input v-model="formData.confirmPassword" type="password" placeholder="再次确认密码" prefix-icon="Lock" show-password />
          </el-form-item>

          <el-button type="primary" class="btn-submit" :loading="loading" @click="handleRegister">
            注 册
          </el-button>
        </el-form>

        <div class="footer-links">
          已有账号？ <router-link to="/login">立即登录</router-link>
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

const formData = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

// 自定义校验规则：确认密码必须一致
const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== formData.password) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '长度至少 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }]
});

const handleRegister = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      // TODO: 调用后端注册接口
      setTimeout(() => {
        ElMessage.success('注册成功！');
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