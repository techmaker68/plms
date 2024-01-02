/*
***********************************
@author Mohanned Hassan
@create_date 5th Dec 2023

***********************************
*/
export const validateDirective = (el, binding, vnode, prevVnode) => {
  const invalidClass = "invalid-form-container";
  const emptyClass = "empty-form-container";
  const requiredClass = "required-form-container";

  const validClass = "valid-form-container";
  const fillClass = "filled-form-container";
  const optionalClass = "optional-form-container";

  const emptyCheck = "empty";

  if (binding.value?.required) {
    el.classList.add(requiredClass);
    el.classList.remove(optionalClass);
  } else {
    el.classList.add(optionalClass);
    el.classList.remove(requiredClass);
  }

  if (binding.value?.$invalid) {
    el.classList.add(invalidClass);
    el.classList.remove(validClass);
  } else {
    el.classList.add(validClass);
    el.classList.remove(invalidClass);
  }

  if (binding.value?.$model || (binding.arg == emptyCheck && binding.value)) {
    el.classList.add(fillClass);
    el.classList.remove(emptyClass);
  } else {
    el.classList.add(emptyClass);
    el.classList.remove(fillClass);
  }
};
