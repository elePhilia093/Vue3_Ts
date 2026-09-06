<template>
  <el-dialog
    v-model="dialogVisible"
    title="分配角色"
    width="500px"
  >
    <el-form label-width="80px">

      <el-form-item label="用户名">
        <el-input
          :model-value="userInfo?.username"
          disabled
        />
      </el-form-item>

      <el-form-item label="角色列表">
        <el-checkbox-group v-model="roleForm.roleIds">
          <el-checkbox
            v-for="role in allRoles"
            :key="role.id"
            :value="role.id"
          >
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
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

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getUserRoleAPI,
  saveUserRoleAPI
} from '@/api/user'

const props = defineProps<{
  visible: boolean
  userInfo: {
    id: number
    username: string
  } | null
  allRoles: {
    id: number
    roleName: string
  }[]
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const roleForm = reactive({
  userId: undefined as number | undefined,
  roleIds: [] as number[]
})

const submitting = ref(false)

/**
 * 弹窗打开时获取当前用户已有角色
 */
watch(
  () => props.visible,
  async (visible) => {
    if (!visible || !props.userInfo) {
      return
    }

    roleForm.userId = props.userInfo.id

    try {
      const result = await getUserRoleAPI(
        props.userInfo.id
      )

      if (result.code !== 200) {
        ElMessage.error(
          result.message || '获取用户角色失败'
        )
        return
      }

      roleForm.roleIds = result.data || []
    } catch (error) {
      ElMessage.error('获取用户角色失败')
    }
  }
)

/**
 * 重置
 */
const resetForm = () => {
  roleForm.userId = undefined
  roleForm.roleIds = []
}

/**
 * 关闭弹窗
 */
const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

/**
 * 保存角色
 */
const handleSubmit = async () => {
  if (!roleForm.userId) {
    return
  }

  submitting.value = true

  try {
    const result = await saveUserRoleAPI(
      roleForm.userId,
      roleForm.roleIds
    )

    if (result.code !== 200) {
      ElMessage.error(
        result.message || '角色分配失败'
      )
      return
    }

    ElMessage.success('角色分配成功')

    dialogVisible.value = false
    emit('success')
    resetForm()

  } catch (error) {
    ElMessage.error('角色分配失败')
  } finally {
    submitting.value = false
  }
}
</script>