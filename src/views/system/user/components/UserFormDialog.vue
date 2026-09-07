<template>
  <el-dialog :title="isEdit ? '编辑用户' : '新增用户'" v-model="visible" width="500px" @close="handleClose" destroy-on-close>
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <!-- 用户名：编辑时通常不可修改 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" />
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" :placeholder="isEdit ? '不修改密码请留空' : '请输入密码'" type="text" />
      </el-form-item>

      <el-form-item label="员工编号" prop="employeeId">
        <el-select v-model="formData.employeeId" placeholder="请选择员工">
          <el-option v-for="employee in employeeList" :key="employee.id" :label="employee.employeeName"
            :value="employee.id" />
        </el-select>
      </el-form-item>

      <!-- 状态 -->
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :value="1">正常</el-radio>
          <el-radio :value="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 备注 -->
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" :rows="3" />
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
import { ref, reactive, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { userAddAPI, userUpdateAPI } from "@/api/user";
// 定义 Props
const props = defineProps({
  modelValue: Boolean,
  userData: Object,
  employeeList: Array,
});

// 定义 Emits
const emit = defineEmits(["update:modelValue", "success"]);

const formRef = ref<FormInstance>();
const loading = ref(false);

// 表单默认数据结构
const defaultForm = {
  id: undefined,
  username: "",
  password: "",
  employeeId: undefined,
  status: 1,
  remark: "",
};

// 使用 reactive 创建响应式表单数据
const formData = reactive({ ...defaultForm });

// 判断是编辑还是新增 (有 id 就是编辑)
const isEdit = computed(() => !!formData.id);

// 监听 props.modelValue 变化，同步给内部 visible
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const resetForm = () => {
  Object.assign(formData, defaultForm);
};

// 监听 userData 变化，回显数据
watch(
  () => props.userData,
  (newVal) => {
    if (newVal) {
      console.log(newVal);

      Object.assign(formData, newVal);
    } else {
      // 新增模式：重置表单
      resetForm();
    }
  },
  { immediate: true },
);

// 表单校验规则
const rules = {
  username: [
    {
      required: true,
      message: "请输入登录账号",
      trigger: "blur",
    },
  ],

  password: [
    {
      validator: (rule, value, callback) => {
        if (!isEdit.value && !value) {
          callback(new Error('请输入密码'))
          return
        }

        callback()
      },
      trigger: 'blur'
    }
  ],

  status: [
    {
      required: true,
      message: "请选择账号状态",
      trigger: "change",
    },
  ],
};

// 提交逻辑
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // TODO: 在这里调用你的 API
        if (isEdit.value) await userUpdateAPI(formData);
        else await userAddAPI(formData);

        visible.value = false; // 关闭弹窗
        emit("success"); // 通知父组件刷新列表
      } catch (error) {
        console.error(error);
        ElMessage.error(error.message);
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
