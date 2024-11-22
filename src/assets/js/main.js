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
// Load header
fetch('./components/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
  });
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', function () {
        menuItems.forEach(menu => menu.classList.remove('active'));
  
        this.classList.add('active');
      });
    });
  
    const searchContainer = document.querySelector('.search-container');
    const searchBar = document.querySelector('.search-bar');
    const iconSearch = document.querySelector('.icon-search');
  
    if (searchContainer && searchBar) {
      iconSearch.addEventListener('click', () => {
        if (window.innerWidth <= 1096) {
          searchContainer.classList.toggle('expanded');
          searchBar.classList.toggle('collapsed');
        }
      });
  
      document.addEventListener('click', (e) => {
        if (
          window.innerWidth <= 1096 &&
          !searchContainer.contains(e.target) &&
          searchContainer.classList.contains('expanded')
        ) {
          searchContainer.classList.remove('expanded');
          searchBar.classList.add('collapsed');
        }
      });
    }
  });
  
  
  
  
