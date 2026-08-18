import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore(
  'user',
  () => {
    // token 状态
    const token = ref('');
    // 存储用户信息状态
    const userInfo = ref({});

    return { token, userInfo };
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
