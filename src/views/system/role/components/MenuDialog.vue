<template>
  <el-dialog 
    v-model="dialogVisible" 
    title="分配菜单" 
    width="500px" 
    :before-close="handleClose"
  >
    <el-form label-width="80px">
      <el-form-item label="角色名称">
        <el-input :model-value="roleInfo?.roleName" disabled />
      </el-form-item>
      
      <el-form-item label="菜单列表">
        <!-- 核心：el-tree 树形控件 -->
        <el-tree
          ref="menuTreeRef"
          :data="menuTreeData"
          :props="{ label: 'menuName', children: 'children' }"
          node-key="id"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkedKeys"
          check-strictly
          @check="handleTreeCheck"
        />
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
import type { ElTree } from 'element-plus';
import {fetchMenuListAPI, getMenuTreeByRoleIdAPI, assignMenuAPI} from "@/api/menu";
// 定义 Props 和 Emits
const props = defineProps<{
  visible: boolean;
  roleInfo: { id: number; roleName: string } | null;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'success'): void;
}>();

// 双向绑定弹窗显隐
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
});

// 内部状态
const menuTreeRef = ref<InstanceType<typeof ElTree>>(); // 树组件的引用
const menuTreeData = ref<any[]>([]); // 菜单树数据
const checkedKeys = ref<number[]>([]); // 回显的节点ID
const submitting = ref(false);

// 监听弹窗打开，获取数据
watch(() => props.visible, async (val) => {
  if (val && props.roleInfo) {
    const res = await fetchMenuListAPI({});
    menuTreeData.value = res;
    

    
    const roleRes = await getMenuTreeByRoleIdAPI({ roleId: props.roleInfo.id });
    console.log("roleres", roleRes);
    
    checkedKeys.value = roleRes; 
  }
});

// 树节点勾选事件（可选：用于自定义逻辑）
const handleTreeCheck = (data: any, { checkedKeys, halfCheckedKeys }: any) => {
  // 如果不需要特殊处理，可以直接在提交时通过 menuTreeRef.value.getCheckedKeys() 获取
};

// 关闭弹窗并重置
const handleClose = () => {
  dialogVisible.value = false;
  checkedKeys.value = [];
};

// 提交分配菜单请求
const handleSubmit = async () => {
  if (!props.roleInfo) return;
  submitting.value = true;
  try {
    // 获取所有被勾选的节点ID（包含叶子节点和父节点）
    const checkedIds = menuTreeRef.value?.getCheckedKeys(false) as number[];
    // 获取半选的父节点ID（重要：如果不传半选ID，后端保存时可能会丢失父级关联）
    const halfCheckedIds = menuTreeRef.value?.getHalfCheckedKeys() as number[];
    
    const finalMenuIds = [...checkedIds, ...halfCheckedIds];

    // TODO: 替换为真实的分配菜单 API
    console.log('提交给后端的菜单ID:', finalMenuIds);
    await assignMenuAPI({ roleId: props.roleInfo.id, menuIds: finalMenuIds });

    emit('success');
    handleClose();
  } catch (error) {
    ElMessage.error('菜单分配失败');
  } finally {
    submitting.value = false;
  }
};
</script>