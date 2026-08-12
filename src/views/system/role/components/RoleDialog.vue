<template>
  <el-dialog
    :title="isEdit ? '编辑角色' : '新增角色'"
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
      <!-- 角色名称 -->
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="formData.roleName"
          placeholder="请输入角色名称"
          clearable
        />
      </el-form-item>

      <!-- 角色编码 -->
      <el-form-item label="角色编码" prop="roleCode">
        <el-input
          v-model="formData.roleCode"
          placeholder="请输入唯一标识(如: admin)"
          clearable
          :disabled="isEdit" 
        />
      </el-form-item>

      <!-- 状态 -->
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :value="1">启用</el-radio>
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

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { addRole, updateRole } from '@/api/role';

// --- 1. 定义 Props 和 Emits ---
interface Props {
  modelValue: boolean; // 控制弹窗显示
  rowData?: any;       // 编辑时传入的行数据
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  rowData: null,
});

const emit = defineEmits(['update:modelValue', 'success']);

// --- 2. 响应式数据 ---
const visible = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();

// 表单默认数据结构（对应你的数据库字段）
const defaultForm = {
  id: undefined as number | undefined,
  roleName: '',
  roleCode: '',
  status: 1, // 默认为启用
};

const formData = reactive({ ...defaultForm });

// 判断当前是否为编辑模式
const isEdit = computed(() => !!props.rowData?.id);

// --- 3. 表单校验规则 ---
const rules = reactive<FormRules>({
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  roleCode: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
});

// --- 4. 监听逻辑 ---

// 监听外部传入的 modelValue 变化
watch(() => props.modelValue, (val) => {
  visible.value = val;
  if (val && props.rowData) {
    // 如果是编辑，回显数据（深拷贝防止污染原表格数据）
    Object.assign(formData, JSON.parse(JSON.stringify(props.rowData)));
  } else if (val) {
    // 如果是新增，重置为默认值
    resetForm();
  }
});

// 监听内部 visible 变化同步给外部
watch(visible, (val) => {
  emit('update:modelValue', val);
});

// --- 5. 方法定义 ---

// 重置表单
const resetForm = () => {
  Object.assign(formData, defaultForm);
  formData.id = undefined;
  formRef.value?.clearValidate();
};

// 关闭弹窗
const handleClose = () => {
  resetForm();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // TODO: 这里调用你的 API
        const apiFunc = isEdit.value ? updateRole : addRole;
        const res = await apiFunc(formData);
        
        visible.value = false;
        emit('success'); // 通知父组件刷新列表
      } catch (error) {
        // 错误通常在全局拦截器处理，这里可以处理特定逻辑
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>