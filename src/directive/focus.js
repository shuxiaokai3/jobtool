



export default {
    update(el, binding) {
        if (binding.value === true) {
            el.focus();
        }
        // console.log(el, binding.value)
    }
}
