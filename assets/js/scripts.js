// Toggle menu navigasi untuk tampilan mobile
document.addEventListener('DOMContentLoaded', function () {
    const menu = document.querySelector('#menu-btn');
    const navbar = document.querySelector('.header .content');

    if (!menu || !navbar) return;

    menu.onclick = () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    };

    window.onscroll = () => {
        menu.classList.remove('fa-times');
        navbar.classList.remove('active');
    };
});
