window.renderPagination = function(totalItems, itemsPerPage, currentPage, containerElement, onPageChangeCallback) {
    if (!containerElement) return;
    if (totalItems === 0) {
        containerElement.innerHTML = '';
        return;
    }
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    containerElement.innerHTML = '';
    
    const createBtn = (text, page, isActive, isDisabled, isIcon) => {
        const btn = document.createElement('button');
        btn.className = `page-btn ${isActive ? 'active' : ''}`;
        if (isDisabled) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
        if (isIcon) {
            btn.innerHTML = `<i data-lucide="${text}" style="width: 16px; height: 16px;"></i>`;
        } else {
            btn.textContent = text;
        }
        if (!isDisabled && !isActive) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                onPageChangeCallback(page);
            });
        }
        return btn;
    };

    const createDots = () => {
        const span = document.createElement('span');
        span.className = 'page-dots';
        span.textContent = '...';
        return span;
    };

    // Prev
    containerElement.appendChild(createBtn('chevron-left', currentPage - 1, false, currentPage === 1, true));
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            containerElement.appendChild(createBtn(i, i, i === currentPage, false, false));
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            containerElement.appendChild(createDots());
        }
    }
    
    // Next
    containerElement.appendChild(createBtn('chevron-right', currentPage + 1, false, currentPage === totalPages, true));
    
    if (window.lucide) window.lucide.createIcons();
};
