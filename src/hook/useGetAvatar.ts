import { ref } from "vue";
import { useLoginStore } from "@/store/login";
const loginStore = useLoginStore();
export function useGetAvatar(
  roleId: number = Number(loginStore.userInfo.user.roleId)
) {
  const roleIdRef = ref<number>(roleId === 11 ? 5 : roleId);
  const avatar = ref<string>("");
  async function loadImage() {
    const imageModule = await import(
      `@/assets/images/avatar/${roleIdRef.value}.jpg`
    );
    avatar.value = imageModule.default;
  }
  loadImage();
  return {
    avatar,
  };
}
