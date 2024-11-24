function toggleDropdown(selector) {
  const wrapper = selector.parentElement;
  wrapper.classList.toggle('open');
}

function selectOption(option) {
  const wrapper = option.closest('.selector-wrapper');
  const selector = wrapper.querySelector('.selector');

  selector.textContent = option.textContent;

  wrapper.classList.remove('open');
}

document.addEventListener('click', function (e) {
  const isDropdown = e.target.closest('.selector-wrapper');
  document.querySelectorAll('.selector-wrapper').forEach(wrapper => {
    if (wrapper !== isDropdown) wrapper.classList.remove('open');
  });
});
