<template>
  <el-dialog :title="dialogTitle" v-model="visible" width="600px" append-to-body @close="handleClose">
    <el-form ref="menuFormRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="form.deptName" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :value="0" label="0">停用</el-radio>
          <el-radio :value="1" label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { onMounted } from 'vue';
import type { FormInstance } from 'element-plus';
import { addDeptAPI, updateDeptAPI } from '@/api/dept';

// --- Props & Emits ---
const props = defineProps({
  modelValue: Boolean, // 控制弹窗显示
  title: String,       // 弹窗标题
  formData: Object,    // 传入的表单数据（编辑时）
});

const emit = defineEmits(['update:modelValue', 'submit']);

// --- State ---
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const dialogTitle = computed(() => props.title || '新增菜单');

// 表单数据模型
const form = reactive({
  deptName: '',
  status:  1
});

// 校验规则
const rules = {
  deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '部门状态不能为空', trigger: 'change' }],
};

const menuFormRef = ref<FormInstance>();



const resetForm = () => {
  form.deptName = '';
  form.status = 1;
  menuFormRef.value?.resetFields();
};



// --- Watchers ---
// 监听 props.formData 变化，进行数据回填
watch(() => props.formData, (newVal) => {
  if (newVal) {
    Object.assign(form, newVal);
    // 确保 parentId 存在，如果是根节点可能是 null 或 0
    if (form.parentId === null) form.parentId = 0;
  } else {
    resetForm();
  }
}, { immediate: true });

// --- Methods ---


const handleClose = () => {
  resetForm();
};

const submitForm = () => {
  if (!menuFormRef.value) return;

  menuFormRef.value.validate(async (valid) => {
    if (valid) {
      // 构造提交给后端的数据
      const submitData = { ...form };
      if (form.id) {
        await updateDeptAPI(submitData);
      } else {
        await addDeptAPI(submitData);
      }
      // 更新菜单列表
      emit('submit', submitData);
      visible.value = false;
    }
  });
};

onMounted(() => {

});
</script>