<template>
  <el-dialog 
    v-model="visible" 
    :title="isEdit ? '编辑员工' : '新增员工'" 
    width="500px"
    :before-close="handleCancel"
  >
    <el-form :model="formData" :rules="employeeFormRules" label-width="100px" ref="formRef">
      <el-form-item label="员工编号" prop="employeeNo">
        <!-- ✅ 编辑模式下编号不可修改 -->
        <el-input v-model="formData.employeeNo" placeholder="请输入员工编号" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="员工姓名" prop="employeeName">
        <el-input v-model="formData.employeeName" placeholder="请输入员工姓名" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="formData.gender" placeholder="请选择">
          <el-option label="男" :value="1" />
          <el-option label="女" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthDate">
        <el-date-picker 
          v-model="formData.birthDate" 
          type="date" 
          placeholder="YYYY-MM-DD" 
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD" 
          style="width: 100%;" 
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入电子邮箱" />
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <el-select v-model="formData.deptId" placeholder="请选择部门">
          <el-option v-for="item in deptOptions" :key="item.id" :label="item.deptName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="职位名称" prop="positionName">
        <el-input v-model="formData.positionName" placeholder="请输入职位名称" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { addEmployee, updateEmployee } from '@/api/employee'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  deptOptions: {
    type: Array,
    default: () => []
  },
  editData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const formRef = ref(null)
const submitLoading = ref(false)

const defaultForm = {
  employeeNo: '',
  employeeName: '',
  gender: '',
  birthDate: '',
  phone: '',
  email: '',
  deptId: '',
  positionName: ''
}

const formData = reactive({ ...defaultForm })

const employeeFormRules = reactive({
  employeeNo: [{ required: true, message: '请输入员工编号', trigger: 'blur' }],
  employeeName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birthDate: [],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
  positionName: [{ required: true, message: '请输入职位名称', trigger: 'blur' }]
})

// ✅ 核心改动：通过 id 是否存在来判断新增/编辑
const isEdit = computed(() => {
  return !!(props.editData && props.editData.id)
})

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 监听 editData 变化，回显或重置
watch(
  () => props.editData,
  (newVal) => {
    if (props.modelValue) {
      if (newVal && newVal.id) {
        // ✅ 有 id → 编辑模式，回显数据
        Object.assign(formData, newVal)
      } else {
        // ✅ 无 id → 新增模式，重置表单
        Object.assign(formData, { ...defaultForm })
      }
    }
  },
  { deep: true, immediate: true }
)

const handleCancel = () => {
  visible.value = false
}

const handleConfirm = async () => {
  if (!formRef.value) return

  try {
    // 1. 表单校验
    await formRef.value.validate()
    submitLoading.value = true

    // 2. 根据 id 判断调用新增还是编辑接口
    if (isEdit.value) {
      await updateEmployee(formData)
      ElMessage.success('编辑成功')
    } else {
      await addEmployee(formData)
      ElMessage.success('新增成功')
    }



    // 3. 通知父组件刷新列表
    emit('save')

    // 4. 关闭弹窗
    visible.value = false

    // 重置表单数据
    Object.assign(formData, { ...defaultForm })
  } catch (error) {
    // validate 校验不通过时不弹错误提示
    if (error !== false) {
      ElMessage.error(isEdit.value ? '编辑失败' : '新增失败')
    }
  } finally {
    submitLoading.value = false
  }
}
</script>