<template>
  <el-dialog :title="dialogTitle" v-model="visible" width="600px" append-to-body @close="handleClose">
    <el-form ref="menuFormRef" :model="form" :rules="rules" label-width="100px">
      <!-- 上级菜单 (Tree Select) -->
      <el-form-item label="上级菜单" prop="parentId">
        <el-tree-select v-model="form.parentId" :data="[{ id: 0, menuName: '一级菜单', children: [] }, ...menuOptions]"
          :props="{ value: 'id', label: 'menuName', children: 'children' }" value-key="id" placeholder="选择上级菜单"
          check-strictly clearable>
        </el-tree-select>
      </el-form-item>

      <!-- 菜单类型 -->
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="form.menuType" @change="handleMenuTypeChange">
          <el-radio :value="1">目录</el-radio>
          <el-radio :value="2">菜单</el-radio>
          <el-radio :value="3">按钮</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 菜单名称 -->
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
      </el-form-item>

      <!-- 路由地址 (仅目录和菜单显示) -->
      <el-form-item label="路由地址" prop="path" v-if="form.menuType !== 3">
        <el-input v-model="form.path" placeholder="请输入路由地址 (如 /system/user)" />
      </el-form-item>

      <!-- 页面组件 -->
      <el-form-item label="组件路径" prop="component" v-if="form.menuType === 2">
        <el-input v-model="form.component" placeholder="请输入组件路径 (如 system/user/index)" />
      </el-form-item>

      <!-- 权限标识 (仅菜单和按钮显示) -->
      <el-form-item label="权限标识" prop="permission" v-if="form.menuType !== 1">
        <el-input v-model="form.permission" placeholder="如 system:user:list" />
      </el-form-item>

      <!-- 排序/状态等其他字段可根据需要添加 -->
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
onMounted(() => {

});

// --- Props & Emits ---
const props = defineProps({
  modelValue: Boolean, // 控制弹窗显示
  title: String,       // 弹窗标题
  formData: Object,    // 传入的表单数据（编辑时）
  menuList: Array      // 用于生成上级菜单树的完整列表
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
  id: undefined,
  parentId: 0, // 默认为顶级
  menuName: '',
  menuType: 2, // 默认为菜单
  path: '',
  component: '', // 页面组件
  permission: ''
});

// 校验规则
const rules = {
  menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
  component: [{ required: true, message: '组件路径不能为空', trigger: 'blur' }],
  permission: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
};

const menuFormRef = ref<FormInstance>();


const menuOptions = computed(() => {
  return props.menuList || [];
});

const resetForm = () => {
  form.id = undefined;
  form.parentId = 0;
  form.menuName = '';
  form.menuType = 2;
  form.path = '';
  form.component = '';
  form.permission = '';
  if (menuFormRef.value) menuFormRef.value.resetFields();
};

// 处理菜单类型变化
const handleMenuTypeChange = () => {
  form.path = '';
  form.component = '';
  form.permission = '';
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

  menuFormRef.value.validate((valid) => {
    if (valid) {
      // 构造提交给后端的数据
      const submitData = { ...form };

      // 特殊处理：如果是顶级目录，parentId 设为 0
      if (!submitData.parentId) submitData.parentId = 0;
      // 更新菜单列表
      

      emit('submit', submitData);
      visible.value = false;
    }
  });
};

</script>