// Load header
fetch('./components/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;

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
      iconSearch.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.innerWidth <= 1096) {
          searchContainer.classList.toggle('expanded');
          searchBar.classList.toggle('expanded');
        }
      });

      document.addEventListener('click', (e) => {
        if (
          window.innerWidth <= 1096 &&
          !searchContainer.contains(e.target) &&
          searchContainer.classList.contains('expanded')
        ) {
          searchContainer.classList.remove('expanded');
          searchBar.classList.remove('expanded');
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 1096) {
          searchContainer.classList.remove('expanded');
          searchBar.classList.remove('collapsed');
          searchBar.style.display = 'block';
        }
      });
    }
  })
  .catch((error) => console.error('Error loading header:', error));
