// Utility Functions
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const showToast = (message, type = 'success') => {
    showToastNotification(message, type);
};

// Ghi đè alert mặc định của trình duyệt bằng Fancy Slide-in Toast
function getOrCreateToastContainer() {
    let container = document.getElementById('fancy-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'fancy-toast-container';
        document.body.appendChild(container);
    }
    return container;
}

const showToastNotification = (message, type = 'info') => {
    const container = getOrCreateToastContainer();
    const toast = document.createElement('div');
    toast.className = `fancy-toast ${type}`;
    
    let iconHtml = '';
    let title = 'Thông báo';
    
    if (type === 'success') {
        iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>`;
        title = 'Thành công';
    } else if (type === 'error') {
        iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        title = 'Lỗi';
    } else if (type === 'warning') {
        iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>`;
        title = 'Cảnh báo';
    } else {
        iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
        title = 'Thông báo';
    }

    toast.innerHTML = `
        <div class="fancy-toast-icon">
            ${iconHtml}
        </div>
        <div class="fancy-toast-content">
            <div class="fancy-toast-title">${title}</div>
            <div class="fancy-toast-message">${message}</div>
        </div>
        <button class="fancy-toast-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
    `;
    
    container.appendChild(toast);
    
    const closeBtn = toast.querySelector('.fancy-toast-close');
    closeBtn.onclick = () => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    };
    
    setTimeout(() => {
        if (toast.parentNode) {
            closeBtn.click();
        }
    }, 4000);
};

window.alert = function(message) {
    let type = 'info';
    const msgLower = message ? message.toLowerCase() : '';
    if (msgLower.includes('thành công') || msgLower.includes('cảm ơn') || msgLower.includes('đã cập nhật') || msgLower.includes('hoàn thành') || msgLower.includes('đã xóa')) {
        type = 'success';
    } else if (msgLower.includes('lỗi') || msgLower.includes('thất bại') || msgLower.includes('không khớp') || msgLower.includes('không thể') || msgLower.includes('chưa nhập') || msgLower.includes('đăng nhập')) {
        type = 'error';
    } else if (msgLower.includes('vui lòng') || msgLower.includes('cảnh báo')) {
        type = 'warning';
    }
    showToastNotification(message, type);
};

window.confirm = function(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            background: 'rgba(17, 28, 45, 0.45)',
            backdropFilter: 'blur(8px)',
            webkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '99999',
            opacity: '0',
            transition: 'opacity 0.2s ease'
        });
        
        overlay.innerHTML = `
            <div style="background: white; padding: 32px 24px; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); max-width: 420px; width: 90%; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid rgba(255, 255, 255, 0.8); transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <div style="width: 64px; height: 64px; background: #eff6ff; color: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <h4 style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; color: #111c2d; margin: 0 0 10px 0;">Xác nhận</h4>
                <p style="font-family: 'Inter', sans-serif; font-size: 14px; color: #4b5563; line-height: 1.6; margin: 0 0 24px 0;">${message}</p>
                <div style="display: flex; gap: 12px; width: 100%;">
                    <button id="btn-confirm-cancel" style="flex: 1; padding: 12px 24px; background: transparent; color: #4b5563; border: 1.5px solid #d1d5db; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; outline: none;">Hủy</button>
                    <button id="btn-confirm-ok" style="flex: 1; padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; outline: none;">Đồng ý</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const dialog = overlay.firstElementChild;
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);
        
        const cancelBtn = overlay.querySelector('#btn-confirm-cancel');
        const okBtn = overlay.querySelector('#btn-confirm-ok');
        
        cancelBtn.onclick = () => {
            overlay.style.opacity = '0';
            dialog.style.transform = 'scale(0.9)';
            setTimeout(() => {
                overlay.remove();
                resolve(false);
            }, 250);
        };
        
        okBtn.onclick = () => {
            overlay.style.opacity = '0';
            dialog.style.transform = 'scale(0.9)';
            setTimeout(() => {
                overlay.remove();
                resolve(true);
            }, 250);
        };

        cancelBtn.onmouseenter = () => {
            cancelBtn.style.background = '#f9fafb';
            cancelBtn.style.borderColor = '#9ca3af';
        };
        cancelBtn.onmouseleave = () => {
            cancelBtn.style.background = 'transparent';
            cancelBtn.style.borderColor = '#d1d5db';
        };
        
        okBtn.onmouseenter = () => {
            okBtn.style.background = '#1d4ed8';
            okBtn.style.transform = 'translateY(-1px)';
        };
        okBtn.onmouseleave = () => {
            okBtn.style.background = '#2563eb';
            okBtn.style.transform = 'translateY(0)';
        };
        okBtn.onmousedown = () => {
            okBtn.style.transform = 'translateY(1px)';
        };
        okBtn.onmouseup = () => {
            okBtn.style.transform = 'translateY(-1px)';
        };

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                cancelBtn.click();
            }
        };
    });
};

// Hàm hiển thị Dialog yêu cầu đăng nhập — Thiết kế E-commerce chuyên nghiệp
const showLoginRequiredDialog = (redirectUrl = '') => {
    const overlay = document.createElement('div');
    overlay.className = 'fancy-alert-overlay';
    
    const finalRedirect = redirectUrl || window.location.pathname + window.location.search;
    
    overlay.innerHTML = `
        <div class="fancy-alert-dialog">
            <div class="fancy-alert-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
            </div>
            <h4 class="fancy-alert-title">Yêu cầu đăng nhập</h4>
            <p class="fancy-alert-message">Vui lòng đăng nhập tài khoản để trải nghiệm đầy đủ các tính năng mua sắm, quản lý giỏ hàng và thanh toán nhanh chóng.</p>
            <div class="fancy-alert-btn-group">
                <button class="fancy-alert-btn btn-outline" id="btn-login-cancel">Để sau</button>
                <button class="fancy-alert-btn" id="btn-login-confirm">
                    <span style="display:flex;align-items:center;justify-content:center;gap:8px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                        Đăng nhập ngay
                    </span>
                </button>
            </div>
            <p style="margin-top:16px;font-size:12px;color:#64748b;display:flex;align-items:center;gap:5px;font-family:'Inter',sans-serif;">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Thông tin của bạn luôn được bảo mật
            </p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Kích hoạt animation
    setTimeout(() => overlay.classList.add('active'), 10);
    
    const cancelBtn = overlay.querySelector('#btn-login-cancel');
    const confirmBtn = overlay.querySelector('#btn-login-confirm');
    
    cancelBtn.onclick = () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 350);
    };
    
    confirmBtn.onclick = () => {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
            window.location.href = `/login?redirect=${encodeURIComponent(finalRedirect)}`;
        }, 300);
    };

    overlay.onclick = (e) => {
        if (e.target === overlay) {
            cancelBtn.click();
        }
    };
};

// Global State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const updateCartCount = () => {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
};

const addToCart = (product) => {
    // Kiểm tra đăng nhập trước khi cho phép thêm vào giỏ
    if (!localStorage.getItem('customer') && !localStorage.getItem('user')) {
        showLoginRequiredDialog();
        return;
    }

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`Đã thêm ${product.name} vào giỏ hàng`);
};

// Wishlist Logic
const toggleWishlist = (product, btnElement) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist_' + (JSON.parse(localStorage.getItem('customer') || '{}').phone || 'guest'))) || [];
    const index = wishlist.findIndex(item => item.id === product.id);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        btnElement.classList.remove('active');
        btnElement.innerHTML = `<i data-lucide="heart" style="width: 18px; height: 18px;"></i>`;
        showToast(`Đã bỏ ${product.name} khỏi yêu thích`);
    } else {
        wishlist.push(product);
        btnElement.classList.add('active');
        btnElement.innerHTML = `<i data-lucide="heart" style="fill: #db2777; stroke: #db2777; width: 18px; height: 18px;"></i>`;
        showToast(`Đã thêm ${product.name} vào yêu thích`);
    }
    localStorage.setItem('wishlist_' + (JSON.parse(localStorage.getItem('customer') || '{}').phone || 'guest'), JSON.stringify(wishlist));
    if (window.lucide) window.lucide.createIcons();
};

const renderProducts = (products, container) => {
    if (!container) return;
    const isFeatured = container.id === 'featured-products';

    container.innerHTML = products.map(product => {
        const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;
        const imageHtml = firstImage 
            ? `<img src="${firstImage}" alt="${product.name}">`
            : `<div style="text-align:center;">
                 <i data-lucide="package" style="width: 48px; height: 48px; stroke-width: 1;"></i>
                 <div style="margin-top: 8px;">${product.name.charAt(0)}</div>
               </div>`;

        if (isFeatured) {
            return `
                <div class="featured-card" onclick="window.location.href='/products/${product.id}'" style="cursor: pointer;">
                    <div class="featured-img-box">
                        ${imageHtml}
                    </div>
                    <div class="featured-info">
                        <span class="featured-badge">${product.category_name || 'Hàng hóa'}</span>
                        <h3 class="featured-title" title="${product.name}">${product.name}</h3>
                        <p class="featured-desc">${product.description ? product.description.substring(0, 50) + '...' : 'Không có mô tả'}</p>
                        <div class="featured-price">${formatCurrency(product.selling_price)}</div>
                        <button class="featured-btn add-to-cart" 
                            data-id="${product.id}" 
                            data-name="${product.name}" 
                            data-price="${product.selling_price}" 
                            data-image="${firstImage || ''}">
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="product-card" onclick="window.location.href='/products/${product.id}'" style="cursor: pointer;">
                    <div class="product-img-wrap">
                        ${imageHtml}
                        <div class="product-fav toggle-fav" 
                            data-id="${product.id}" 
                            data-name="${product.name.replace(/"/g, '&quot;')}" 
                            data-price="${product.selling_price}" 
                            data-image="${firstImage || ''}"
                            data-category="${product.category_name || ''}"
                            onclick="event.stopPropagation();">
                            <i data-lucide="heart" style="width: 18px; height: 18px;"></i>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-badge">${product.category_name || 'Hàng hóa'}</div>
                        <h3 class="product-title" title="${product.name}">${product.name}</h3>
                        <div class="product-rating">
                            <div class="stars">
                                <i data-lucide="star" style="fill: ${(product.average_rating || 0) >= 1 ? 'currentColor' : 'none'}; width: 14px; height: 14px;"></i>
                                <i data-lucide="star" style="fill: ${(product.average_rating || 0) >= 2 ? 'currentColor' : 'none'}; width: 14px; height: 14px;"></i>
                                <i data-lucide="star" style="fill: ${(product.average_rating || 0) >= 3 ? 'currentColor' : 'none'}; width: 14px; height: 14px;"></i>
                                <i data-lucide="star" style="fill: ${(product.average_rating || 0) >= 4 ? 'currentColor' : 'none'}; width: 14px; height: 14px;"></i>
                                <i data-lucide="star" style="fill: ${(product.average_rating || 0) >= 5 ? 'currentColor' : 'none'}; width: 14px; height: 14px;"></i>
                            </div>
                            <span>(${product.review_count || 0})</span>
                        </div>
                        <div class="product-bottom">
                            <div class="product-price">${formatCurrency(product.selling_price)}</div>
                            <div class="product-cart-btn add-to-cart" 
                                data-id="${product.id}" 
                                data-name="${product.name}" 
                                data-price="${product.selling_price}" 
                                data-image="${firstImage || ''}">
                                <i data-lucide="shopping-cart" style="width: 20px; height: 20px;"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');

    // Re-initialize lucide icons for the new elements
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Add event listeners to buttons
    const addButtons = container.querySelectorAll('.add-to-cart');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent card click
            const p = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image
            };
            addToCart(p);
        });
    });

    // Add event listeners to fav buttons
    let wishlist = JSON.parse(localStorage.getItem('wishlist_' + (JSON.parse(localStorage.getItem('customer') || '{}').phone || 'guest'))) || [];
    const favButtons = container.querySelectorAll('.toggle-fav');
    favButtons.forEach(btn => {
        // Set initial state
        const isFav = wishlist.some(item => item.id === btn.dataset.id);
        if (isFav) {
            btn.classList.add('active');
            btn.innerHTML = `<i data-lucide="heart" style="fill: #db2777; stroke: #db2777; width: 18px; height: 18px;"></i>`;
        }

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const p = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image,
                category_name: btn.dataset.category
            };
            toggleWishlist(p, btn);
        });
    });
};

const loadAllProducts = async (containerId) => {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        
        // Save to localStorage for other scripts
        localStorage.setItem('all_products', JSON.stringify(products));

        const container = containerId ? document.getElementById(containerId) : null;
        if (container) {
            renderProducts(products, container);
        }

        const countText = document.getElementById('products-count-text');
        if (countText) {
            countText.innerHTML = `Hiển thị <strong>1-${products.length}</strong> trong số <strong>${products.length}</strong> sản phẩm`;
        }
        
        return products;
    } catch (err) {
        console.error('Failed to load products:', err);
        const container = containerId ? document.getElementById(containerId) : null;
        if (container) {
            container.innerHTML = '<p class="error-msg">Không thể kết nối đến máy chủ.</p>';
        }
        return [];
    }
};

// Export to window
window.formatCurrency = formatCurrency;
window.addToCart = addToCart;
window.renderProducts = renderProducts;
window.loadAllProducts = loadAllProducts;
window.updateGlobalCartCount = updateCartCount;
window.showLoginRequiredDialog = showLoginRequiredDialog;

document.addEventListener('DOMContentLoaded', () => {
    let user = JSON.parse(localStorage.getItem('customer')) || null;

    // Elements
    const authLinks = document.getElementById('auth-links');
    const userProfile = document.getElementById('user-profile');
    const userInitials = document.getElementById('user-initials');
    const featuredProductsGrid = document.getElementById('featured-products');

    // Initialize UI
    updateCartCount();
    
    // Check Auth
    if (user) {
        if (authLinks) authLinks.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'block';
            if (userInitials) userInitials.textContent = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        }
        const headerAvatar = document.querySelector('.header-actions img');
        if (headerAvatar && user.avatar) {
            headerAvatar.src = user.avatar;
        }
    } else {
        if (authLinks) authLinks.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
    }

    // Auto-load featured is now handled dynamically in index.html to support pagination
});

// ===== Navigation Category Dropdown Loader =====
(function initNavCategoryDropdown() {
    const dropdownGrid = document.getElementById('nav-dropdown-grid');
    if (!dropdownGrid) return;

    // Color palette for category icons
    const categoryPalette = [
        { bg: '#EFF6FF', color: '#2563EB' },
        { bg: '#F0FDF4', color: '#16A34A' },
        { bg: '#FFF7ED', color: '#EA580C' },
        { bg: '#FDF4FF', color: '#9333EA' },
        { bg: '#FFF1F2', color: '#E11D48' },
        { bg: '#F0FDFA', color: '#0D9488' },
        { bg: '#FFFBEB', color: '#D97706' },
        { bg: '#F5F3FF', color: '#7C3AED' },
    ];

    // SVG icons mapped to category keywords (inline SVG, Lucide-style)
    function getCategoryIcon(name) {
        const n = (name || '').toLowerCase();
        // Bánh kẹo / ăn vặt
        if (n.includes('bánh') || n.includes('kẹo') || n.includes('ăn vặt'))
            return `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>`;
        // Kem / đông lạnh
        if (n.includes('kem') || n.includes('đông lạnh') || n.includes('lạnh'))
            return `<svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 1 5 5c0 1.61-.76 3.04-1.94 3.96L18 22H6l2.94-11.04A5 5 0 0 1 12 2z"/></svg>`;
        // Nước / đồ uống
        if (n.includes('nước') || n.includes('đồ uống') || n.includes('giải khát'))
            return `<svg viewBox="0 0 24 24"><path d="M8 2h8l1 7H7L8 2z"/><rect x="7" y="9" width="10" height="11" rx="2"/><path d="M10 13h4"/></svg>`;
        // Gia vị / thực phẩm
        if (n.includes('gia vị') || n.includes('thực phẩm') || n.includes('đóng gói'))
            return `<svg viewBox="0 0 24 24"><path d="M3 2h18v4H3z"/><path d="M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6"/><path d="M10 11h4"/></svg>`;
        // Hóa mỹ phẩm / chăm sóc
        if (n.includes('hóa mỹ') || n.includes('chăm sóc') || n.includes('mỹ phẩm'))
            return `<svg viewBox="0 0 24 24"><path d="M9 3h6l1 4H8L9 3z"/><rect x="7" y="7" width="10" height="14" rx="2"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>`;
        // Vệ sinh / tẩy rửa
        if (n.includes('chất tẩy') || n.includes('vệ sinh') || n.includes('tẩy rửa'))
            return `<svg viewBox="0 0 24 24"><path d="M4 20h16"/><path d="M9 20V8l3-5 3 5v12"/><path d="M6 12h12"/></svg>`;
        // Thiết bị điện
        if (n.includes('thiết bị') || n.includes('điện') || n.includes('dân dụng'))
            return `<svg viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 8h4"/><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/></svg>`;
        // Rau củ quả
        if (n.includes('rau') || n.includes('củ') || n.includes('quả') || n.includes('trái cây'))
            return `<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/></svg>`;
        // Thịt / hải sản
        if (n.includes('thịt') || n.includes('cá') || n.includes('hải sản'))
            return `<svg viewBox="0 0 24 24"><path d="M6.5 12C4 10 2 7 2 5c3 0 5 1 6.5 3"/><path d="M17.5 12C20 10 22 7 22 5c-3 0-5 1-6.5 3"/><ellipse cx="12" cy="14" rx="6" ry="5"/><path d="M9 14h6"/></svg>`;
        // Sữa / trứng
        if (n.includes('sữa') || n.includes('trứng'))
            return `<svg viewBox="0 0 24 24"><path d="M8 2h8c0 4-2 6-4 7-2-1-4-3-4-7z"/><rect x="6" y="9" width="12" height="13" rx="2"/></svg>`;
        // Mặc định: hộp sản phẩm
        return `<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>`;
    }

    fetch('/api/categories')
        .then(res => res.json())
        .then(categories => {
            if (!categories || categories.length === 0) {
                dropdownGrid.innerHTML = '<p style="color:var(--on-surface-variant); font-size:13px; padding:8px;">Chưa có danh mục nào.</p>';
                return;
            }
            dropdownGrid.innerHTML = categories.map((cat, i) => {
                const palette = categoryPalette[i % categoryPalette.length];
                const icon = getCategoryIcon(cat.name);
                const encodedId = encodeURIComponent(cat.id);
                return `
                <a href="/products?category=${encodedId}" class="nav-dropdown-item">
                    <div class="nav-dropdown-item-icon" style="background:${palette.bg}; color:${palette.color};">
                        ${icon}
                    </div>
                    <div class="nav-dropdown-item-text">
                        <span class="nav-dropdown-item-name">${cat.name}</span>
                        <span class="nav-dropdown-item-desc">${cat.description || 'Xem sản phẩm →'}</span>
                    </div>
                </a>`;
            }).join('');
        })
        .catch(() => {
            dropdownGrid.innerHTML = '<p style="color:var(--on-surface-variant); font-size:13px; padding:8px;">Không thể tải danh mục.</p>';
        });

    // JS-controlled show/hide to avoid CSS transform conflict with fixed positioning
    const navItem = document.querySelector('.nav-item-dropdown');
    const dropdown = document.getElementById('nav-categories-dropdown');
    if (navItem && dropdown) {
        let hideTimer = null;

        function positionDropdown() {
            const rect = navItem.getBoundingClientRect();
            const dropW = 480;
            let left = rect.left + rect.width / 2 - dropW / 2;
            left = Math.max(16, Math.min(left, window.innerWidth - dropW - 16));
            dropdown.style.left = left + 'px';
            dropdown.style.transform = 'none';
        }

        function showDropdown() {
            clearTimeout(hideTimer);
            positionDropdown();
            dropdown.style.opacity = '1';
            dropdown.style.pointerEvents = 'auto';
            dropdown.style.top = '80px';
            navItem.classList.add('is-open');
        }

        function hideDropdown() {
            hideTimer = setTimeout(() => {
                dropdown.style.opacity = '0';
                dropdown.style.pointerEvents = 'none';
                navItem.classList.remove('is-open');
            }, 80);
        }

        navItem.addEventListener('mouseenter', showDropdown);
        navItem.addEventListener('mouseleave', hideDropdown);
        dropdown.addEventListener('mouseenter', () => clearTimeout(hideTimer));
        dropdown.addEventListener('mouseleave', hideDropdown);
    }
})();



