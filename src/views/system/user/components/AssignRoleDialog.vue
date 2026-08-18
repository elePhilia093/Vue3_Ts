<template>
  <el-dialog v-model="dialogVisible" title="分配角色" width="500px" :before-close="handleClose">
    <el-form label-width="80px">
      <el-form-item label="用户名">
        <el-input :model-value="userInfo?.username" disabled />
      </el-form-item>
      <el-form-item label="角色列表">
        <el-checkbox-group v-model="selectedRoleIds">
          <el-checkbox v-for="role in allRoles" :key="role.id" :value="role.id">
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchRoleListAll } from '@/api/role'
import { getRolesByUserIdAPI, assignRolesAPI } from '@/api/user'


// 定义 Props 和 Emits 的类型
const props = defineProps<{
  visible: boolean;
  userInfo: { id: number; username: string } | null;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'success'): void;
}>();

// 1. 双向绑定弹窗的显隐状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
});

// 2. 内部状态管理
const allRoles = ref<{ id: number; name: string }[]>([]); // 所有角色列表
const selectedRoleIds = ref<number[]>([]); // 当前用户选中的角色ID数组
const submitting = ref(false);

// 3. 监听弹窗打开，获取数据
watch(() => props.visible, async (val) => {
  if (val && props.userInfo) {
    // 获取所有角色列表
    const res = await fetchRoleListAll();
    allRoles.value = res;
    console.log("allRoles",res);
    

    // 获取当前用户已有的角色ID
    const userRes = await getRolesByUserIdAPI({ userId: props.userInfo.id });
    console.log("userRes",userRes);
    
    selectedRoleIds.value = userRes.map(item => item.id);

  }
});

// 4. 关闭弹窗并重置数据
const handleClose = () => {
  dialogVisible.value = false;
  selectedRoleIds.value = [];
};

// 5. 提交分配角色请求
const handleSubmit = async () => {
  if (!props.userInfo) return;
  submitting.value = true;
  try {
    // TODO: 替换为真实的分配角色 API
    await assignRolesAPI({ userId: props.userInfo.id, roleIds: selectedRoleIds.value });

    console.log('提交的角色ID:', selectedRoleIds.value);
    emit('success');
    handleClose();
  } catch (error) {
    ElMessage.error('分配角色失败');
  } finally {
    submitting.value = false;
  }
};
</script>