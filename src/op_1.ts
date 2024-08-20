import { App, DirectiveBinding } from "vue";

export default (app: App) => {
  app.directive("op", {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      if (!hasOp(binding.value)) {
        el.style.display = "none";
      }
    },
  });
};

export function hasOp(op: string) {
  const operation: string[] = JSON.parse(
    localStorage.getItem("operation") as string
  );
  return operation.includes(op);
}
