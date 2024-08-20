export function getAvatar(roleId: number): Promise<string> {
  roleId = roleId === 11 ? 5 : roleId;
  return import(`@/assets/images/avatar/${roleId}.jpg`)
    .then((res) => res.default)
    .catch((error) => {
      console.error("Failed to load image:", error);
      throw error;
    });
}
