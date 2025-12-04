document.addEventListener('DOMContentLoaded', () => {
    // Determine if we are in the root or a subpage to set correct paths
    const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const basePath = isRoot ? 'pages/' : '';
    const homePath = isRoot ? 'index.html' : '../index.html';

    const navHTML = `
        <nav class="navbar">
            <a href="${homePath}" class="nav-brand">인성의 웹페이지</a>
            <div class="nav-links">
                <a href="${homePath}" class="nav-link">홈</a>
                <a href="${basePath}deeplearning.html" class="nav-link">딥러닝 게임</a>
                <a href="${basePath}seatingarrangement.html" class="nav-link">자리 배치</a>
                <a href="${basePath}pizzaschool.html" class="nav-link">피자 가게</a>
            </div>
        </nav>
    `;

    // Insert Navbar at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Add Background Blobs if they don't exist
    if (!document.querySelector('.blobs-container')) {
        const blobsHTML = `
            <div class="blobs-container">
                <div class="blob blob-1"></div>
                <div class="blob blob-2"></div>
                <div class="blob blob-3"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', blobsHTML);
    }

    // Highlight active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('href').endsWith(currentPath)) {
            link.classList.add('active');
        }
    });
});
