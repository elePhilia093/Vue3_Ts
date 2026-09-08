<template>
  <div class="personal-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button
        type="primary"
        :loading="saveLoading"
        @click="handleSave"
      >
        保存修改
      </el-button>
    </div>

    <!-- 基本信息 -->
    <el-card
      shadow="never"
      class="info-card"
    >

      <div class="card-title">
        基本信息
      </div>

      <el-descriptions
        :column="2"
        border
      >

        <el-descriptions-item label="用户名">
          {{ userInfo.username || "--" }}
        </el-descriptions-item>

        <el-descriptions-item label="员工编号">
          {{ userInfo.employeeNo || "--" }}
        </el-descriptions-item>

        <el-descriptions-item label="员工姓名">
          {{ userInfo.employeeName || "--" }}
        </el-descriptions-item>

        <el-descriptions-item label="性别">
          {{ getGenderText(userInfo.gender) }}
        </el-descriptions-item>

        <el-descriptions-item label="出生日期">
          {{ userInfo.birthDate || "--" }}
        </el-descriptions-item>

        <el-descriptions-item label="所属部门">
          {{ userInfo.deptName || "--" }}
        </el-descriptions-item>

        <el-descriptions-item label="职位">
          {{ userInfo.positionName || "--" }}
        </el-descriptions-item>

        <el-descriptions-item label="账号状态">
          <el-tag
            :type="
              userInfo.status === 1
                ? 'success'
                : 'danger'
            "
            size="small"
          >
            {{
              userInfo.status === 1
                ? "正常"
                : "停用"
            }}
          </el-tag>
        </el-descriptions-item>

      </el-descriptions>

    </el-card>

    <!-- 联系方式 -->
    <el-card
      shadow="never"
      class="info-card"
    >

      <div class="card-title">
        联系方式
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        class="contact-form"
      >

        <el-form-item
          label="联系电话"
          prop="phone"
        >
          <el-input
            v-model="formData.phone"
            placeholder="请输入联系电话"
            clearable
            maxlength="20"
            style="width: 360px"
          />
        </el-form-item>

        <el-form-item
          label="电子邮箱"
          prop="email"
        >
          <el-input
            v-model="formData.email"
            placeholder="请输入电子邮箱"
            clearable
            maxlength="100"
            style="width: 360px"
          />
        </el-form-item>

      </el-form>

    </el-card>

    <!-- 提示 -->
    <el-card
      shadow="never"
      class="info-card"
    >

      <div class="info-tip">
        员工编号、姓名、所属部门和职位等信息由系统统一维护，
        当前用户只能修改联系电话和电子邮箱。
      </div>

    </el-card>

  </div>
</template>

<script setup lang="ts">

import {
  onMounted,
  reactive,
  ref
} from "vue";

import {
  ElMessage,
  type FormInstance,
  type FormRules
} from "element-plus";

import {
  getPersonalInfo,
  updatePersonalInfo,
} from "@/api/personal";


/**
 * =========================
 * 页面状态
 * =========================
 */

const loading = ref(false);

const saveLoading = ref(false);


/**
 * =========================
 * 当前用户信息
 * =========================
 */

const userInfo = reactive({

  username: "",

  employeeNo: "",

  employeeName: "",

  gender: null,

  birthDate: "",

  deptName: "",

  positionName: "",

  phone: "",

  email: "",

  status: null

});


/**
 * =========================
 * 可修改表单
 * =========================
 */

const formRef =
  ref<FormInstance>();

const formData = reactive({

  phone: "",

  email: ""

});


/**
 * =========================
 * 表单校验
 * =========================
 */

const rules: FormRules = {

  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ],

  email: [
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: "blur"
    }
  ]

};


/**
 * =========================
 * 获取个人信息
 * =========================
 */

const loadData = async () => {

  loading.value = true;

  try {

    const res =
      await getPersonalInfo();

    if (res.code === 200) {

      Object.assign(
        userInfo,
        res.data
      );

      formData.phone =
        res.data.phone || "";

      formData.email =
        res.data.email || "";

    } else {

      ElMessage.error(
        res.message ||
        "获取个人信息失败"
      );
    }

  } catch (error) {

    console.error(error);

    ElMessage.error(
      "获取个人信息失败"
    );

  } finally {

    loading.value = false;

  }

};


/**
 * =========================
 * 保存个人信息
 * =========================
 */

const handleSave = async () => {

  if (!formRef.value) {
    return;
  }

  const valid =
    await formRef.value.validate();

  if (!valid) {
    return;
  }

  saveLoading.value = true;

  try {

    const data = {

      phone:
        formData.phone || null,

      email:
        formData.email || null

    };

    const res =
      await updatePersonalInfo(data);

    if (res.code === 200) {

      ElMessage.success(
        "个人信息修改成功"
      );

      /*
       * 保存成功后同步页面数据
       */
      userInfo.phone =
        formData.phone;

      userInfo.email =
        formData.email;

    } else {

      ElMessage.error(
        res.message ||
        "个人信息修改失败"
      );
    }

  } catch (error) {

    console.error(error);

    ElMessage.error(
      "个人信息修改失败"
    );

  } finally {

    saveLoading.value = false;

  }

};


/**
 * =========================
 * 性别
 * =========================
 */

const getGenderText = (
  gender: number | null
) => {

  switch (gender) {

    case 1:
      return "男";

    case 2:
      return "女";

    default:
      return "--";

  }

};


/**
 * =========================
 * 页面初始化
 * =========================
 */

onMounted(() => {

  loadData();

});

</script>


<style lang="scss" scoped>

.personal-container {
  padding: 16px;
}


/* =========================
   页面头部
   ========================= */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-title {
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.page-desc {
  margin-top: 4px;
  color: #909399;
  font-size: 13px;
}


/* =========================
   卡片
   ========================= */

.info-card {
  max-width: 1000px;
  margin-bottom: 16px;
}

.card-title {
  margin-bottom: 16px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}


/* =========================
   联系方式
   ========================= */

.contact-form {
  padding-top: 4px;
}


/* =========================
   提示
   ========================= */

.info-tip {
  padding: 12px 16px;
  border-radius: 4px;
  background: #f5f7fa;
  color: #909399;
  font-size: 13px;
  line-height: 1.8;
}

</style>