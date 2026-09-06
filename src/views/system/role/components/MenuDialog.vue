<template>
  <el-dialog
    v-model="dialogVisible"
    title="分配菜单"
    width="500px"
    :before-close="handleClose"
  >
    <el-form label-width="80px">
      <el-form-item label="角色名称">
        <el-input
          :model-value="roleInfo?.roleName"
          disabled
        />
      </el-form-item>

      <el-form-item label="菜单列表">
        <el-tree
          ref="menuTreeRef"
          :data="menuTreeData"
          :props="{
            label: 'menuName',
            children: 'children'
          }"
          node-key="id"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkedKeys"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">
        取消
      </el-button>

      <el-button
        type="primary"
        :loading="submitting"
        @click="handleSubmit"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'

import {
  fetchMenuListAPI,
  getRoleMenuAPI,
  saveRoleMenuAPI
} from '@/api/menu'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },

  roleInfo: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'update:visible',
  'success'
])

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value)
  }
})

// 菜单树
const menuTreeRef = ref(null)
const menuTreeData = ref([])

// 当前角色已有菜单
const checkedKeys = ref([])

const submitting = ref(false)

/**
 * 弹窗打开
 */
watch(
  () => props.visible,
  async (visible) => {

    if (!visible || !props.roleInfo) {
      return
    }

    try {

      // 1. 获取全部菜单树
      const menuResult = await fetchMenuListAPI({})

      if (menuResult.code !== 200) {
        ElMessage.error(
          menuResult.message || '获取菜单列表失败'
        )
        return
      }

      menuTreeData.value = menuResult.data || []

      // 2. 获取当前角色已有菜单
      const roleResult = await getRoleMenuAPI(
        props.roleInfo.id
      )

      if (roleResult.code !== 200) {
        ElMessage.error(
          roleResult.message || '获取角色菜单失败'
        )
        return
      }

      checkedKeys.value = roleResult.data || []

    } catch (error) {
      ElMessage.error('获取菜单权限失败')
    }
  }
)

/**
 * 关闭弹窗
 */
const handleClose = () => {
  dialogVisible.value = false

  checkedKeys.value = []
  menuTreeData.value = []
}

/**
 * 提交角色菜单权限
 */
const handleSubmit = async () => {

  if (!props.roleInfo) {
    return
  }

  submitting.value = true

  try {

    // 获取选中的节点
    const checkedIds =
      menuTreeRef.value?.getCheckedKeys(false) || []

    // 获取半选中的父节点
    const halfCheckedIds =
      menuTreeRef.value?.getHalfCheckedKeys() || []

    // 合并菜单 ID
    const menuIds = [
      ...new Set([
        ...checkedIds,
        ...halfCheckedIds
      ])
    ]

    const data = {
      roleId: props.roleInfo.id,
      menuIds
    }

    const result = await saveRoleMenuAPI(data)

    if (result.code !== 200) {
      ElMessage.error(
        result.message || '权限分配失败'
      )
      return
    }

    ElMessage.success('权限分配成功')

    emit('success')

    handleClose()

  } catch (error) {
    ElMessage.error('权限分配失败')
  } finally {
    submitting.value = false
  }
}
</script>