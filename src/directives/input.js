/*
***********************************
@author Mohanned Hassan
@create_date 5th Dec 2023

***********************************
*/
export const inputDirective = {
  mounted(el, binding, vnode, prevVnode) {
    const uppercaseCheck = "upper";
    const capitalizeCheck = "capital";

    el.addEventListener("blur", (event) => {
      if (typeof binding?.value?.$model == "string") {
        binding.value.$model = binding.value.$model
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
    });

    switch (binding.arg) {
      case uppercaseCheck: {
        el.addEventListener("blur", (event) => {
          if (typeof binding?.value?.$model == "string") {
            binding.value.$model = binding.value.$model.toUpperCase();
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  },
  updated(el, binding, vnode, prevVnode) {
    const invalidClass = "invalid-form-control";
    const validClass = "valid-form-control";

    if (binding.value) {
      if (binding.value?.$invalid) {
        el.classList.add(invalidClass);
        el.classList.remove(validClass);
      } else {
        el.classList.add(validClass);
        el.classList.remove(invalidClass);
      }
    }
  },
};
