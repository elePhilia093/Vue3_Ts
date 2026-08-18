import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { userInfoAPI } from '@/api/login';

export const useUserStore = defineStore(
  'user',
  () => {
    // token 状态
    const token = ref('');
    // 存储用户信息状态
    const userInfo = ref({});
    // 菜单状态
    const menus = ref([]);


    // 获取用户信息
    const handleUserInfo = async () => {
      
      
      try {
        console.log('jdsfksjl');
        const result = await userInfoAPI();
        userInfo.value = result;
        menus.value = result.menus || [];
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    }

    return { token, userInfo, menus, handleUserInfo  };
    // 持久化存储
  },
  {
    persist: {
      key: 'app-user',
      storage: localStorage,
      paths: ['token', 'userInfo'],
    },
  },
);
