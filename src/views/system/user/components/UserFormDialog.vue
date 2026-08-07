<template>
  <el-dialog
    :title="isEdit ? '编辑用户' : '新增用户'"
    v-model="visible"
    width="500px"
    @close="handleClose"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
    >
      <!-- 用户名：编辑时通常不可修改 -->
      <el-form-item label="用户名" prop="username">
        <el-input 
          v-model="formData.username" 
          placeholder="请输入用户名" 
          :disabled="isEdit" 
        />
      </el-form-item>

      <!-- 昵称 -->
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入昵称" />
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号" maxlength="11" />
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>

      <!-- 状态 -->
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :value="1">正常</el-radio>
          <el-radio :value="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus'
import { addUserAPI, updateUserAPI } from '@/api/user';
import type { UpdateUserRequest } from '@/types/user';
// 定义 Props
const props = defineProps({
  modelValue: Boolean, // 控制弹窗显示隐藏
  userData: Object     // 编辑时传入的行数据，新增时为 null/undefined
});

// 定义 Emits
const emit = defineEmits(['update:modelValue', 'success']);

const formRef = ref<FormInstance>();
const loading = ref(false);

// 表单默认数据结构
const defaultForm = {
  id: undefined,
  username: '',
  nickname: '',
  phone: '',
  email: '',
  status: 1
};

// 使用 reactive 创建响应式表单数据
const formData = reactive({ ...defaultForm });

// 判断是编辑还是新增 (有 id 就是编辑)
const isEdit = computed(() => !!formData.id);

// 监听 props.modelValue 变化，同步给内部 visible
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const resetForm = () => {
  Object.assign(formData, defaultForm);
};

// 监听 userData 变化，回显数据
watch(() => props.userData, (newVal) => {
  if (newVal) {
    // 编辑模式：将行数据拷贝到表单中
    Object.assign(formData, newVal);
  } else {
    // 新增模式：重置表单
    resetForm();
  }
}, { immediate: true });

// 表单校验规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
};

// 提交逻辑
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // TODO: 在这里调用你的 API
        if (isEdit.value) await updateUserAPI(formData as UpdateUserRequest);
        else await addUserAPI(formData);
        
        console.log('提交的数据:', JSON.parse(JSON.stringify(formData)));
        
        ElMessage.success(isEdit.value ? '修改成功' : '新增成功');
        visible.value = false; // 关闭弹窗
        emit('success');       // 通知父组件刷新列表
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    }
  });
};

// 关闭弹窗时的清理工作
const handleClose = () => {
  resetForm();
  if (formRef.value) formRef.value.clearValidate();
};


</script>