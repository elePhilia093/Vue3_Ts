import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { userInfoAPI } from "@/api/auth";
import type { UserInfo } from "@/api/auth";

export const useAuthStore = defineStore(
  "user",
  () => {
    // token 状态
    const token = ref("");
    // 存储用户信息状态
    const userInfo = ref<UserInfo | null>({
      userId: 0,
      username: "",
      role: [],
    });
    // 菜单状态
    const menus = ref([]);

    const logout = () => {
      token.value = "";
      userInfo.value = null;
      menus.value = [];
    };

    // 获取用户信息
    const handleUserInfo = async () => {
      try {
        const result = await userInfoAPI();
        console.log(result);

        if (result.code == 200) {
          userInfo.value = result.data;
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    };

    return { token, userInfo, menus, logout, handleUserInfo };
    // 持久化存储
  },
  {
    persist: {
      key: "app-user",
      storage: localStorage,
      paths: ["token", "userInfo", "menus"],
    },
  },
);
