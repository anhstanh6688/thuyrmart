document.addEventListener('DOMContentLoaded', () => {
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
        } else if (msgLower.includes('lỗi') || msgLower.includes('thất bại') || msgLower.includes('chưa chọn') || msgLower.includes('chưa nhập') || msgLower.includes('không khớp') || msgLower.includes('không thể') || msgLower.includes('không có nợ') || msgLower.includes('chưa đủ tiền')) {
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
                <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); max-width: 400px; width: 90%; border: 1px solid #e5e7eb; transform: translateY(-20px); transition: transform 0.2s ease;">
                    <h4 style="font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">Xác nhận</h4>
                    <p style="font-family: 'Inter', sans-serif; font-size: 14px; color: #4b5563; line-height: 1.5; margin: 0 0 24px 0;">${message}</p>
                    <div style="display: flex; justify-content: flex-end; gap: 12px;">
                        <button id="btn-confirm-cancel" style="padding: 8px 16px; background: white; color: #374151; border: 1px solid #d1d5db; border-radius: 6px; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.2s;">Hủy</button>
                        <button id="btn-confirm-ok" style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.2s;">Đồng ý</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            const dialog = overlay.firstElementChild;
            setTimeout(() => {
                overlay.style.opacity = '1';
                dialog.style.transform = 'translateY(0)';
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

            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    cancelBtn.click();
                }
            };
        });
    };

    // Auto-init lucide icons on DOM mutations
    const observer = new MutationObserver((mutations) => {
        let shouldInit = false;
        for (const m of mutations) {
            if (m.addedNodes.length > 0) {
                shouldInit = true;
                break;
            }
        }
        if (shouldInit && window.lucide) {
            lucide.createIcons();
            document.querySelectorAll('svg[data-lucide]').forEach(el => el.removeAttribute('data-lucide'));
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Auth Check
    const user = JSON.parse(localStorage.getItem('user'));
    if ((!user || (user.role !== 'admin' && user.role !== 'staff')) && window.location.pathname !== '/login') {
        window.location.href = '/login';
        return;
    }

    // Display Logged-in User Info in Header
    if (user) {
        const userNameEl = document.querySelector('.user-name');
        const userAvatarEl = document.querySelector('.user-avatar');
        if (userNameEl) {
            userNameEl.textContent = user.name || 'Quản trị viên';
        }
        if (userAvatarEl) {
            const name = user.name || 'Admin';
            const parts = name.trim().split(/\s+/);
            let initials = 'AD';
            if (parts.length >= 2) {
                initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            } else if (parts.length === 1 && parts[0].length > 0) {
                initials = parts[0].substring(0, 2).toUpperCase();
            }
            userAvatarEl.textContent = initials;
        }

        // Hide users page link if user is not admin (Family Permission Logic)
        if (user.role !== 'admin') {
            const usersNavItem = document.querySelector('.nav-item[data-page="users"]');
            if (usersNavItem) {
                usersNavItem.style.display = 'none';
            }
        }
    }

    // UI Elements
    const sidebar = document.getElementById('sidebar');

    // Fetch Wrapper for Security
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            options.headers = options.headers || {};
            options.headers['x-user-id'] = user.id;
        }
        const response = await originalFetch(url, options);
        if (response.status === 403) {
            const data = await response.clone().json();
            if (data.error === 'Account Locked') {
                alert(data.message);
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return response;
    };

    const toggleSidebar = document.getElementById('toggle-sidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const pageContent = document.getElementById('page-content');
    const aiToggle = document.getElementById('ai-toggle');
    const aiChatBox = document.getElementById('ai-chat-box');
    const closeChat = document.getElementById('close-chat');

    // State
    let currentPage = 'dashboard';

    // Event Listeners
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.main-content')?.classList.toggle('sidebar-collapsed');
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            if (page) switchPage(page);
        });
    });

    if (aiToggle) {
        aiToggle.addEventListener('click', () => {
            aiChatBox.classList.toggle('active');
            if (aiChatBox.classList.contains('active')) {
                aiChatBox.style.display = 'flex';
                document.getElementById('ai-input').focus();
            } else {
                aiChatBox.style.display = 'none';
            }
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            aiChatBox.classList.remove('active');
            aiChatBox.style.display = 'none';
        });
    }

    // Page Switching Logic
    async function switchPage(page) {
        // Prevent non-admin from accessing users page
        if (page === 'users' && user?.role !== 'admin') {
            switchPage('dashboard');
            return;
        }
        if (currentPage === page && page !== 'dashboard') return;

        // Update Nav UI
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-page') === page);
        });

        currentPage = page;
        renderLoading();

        // Load page content
        const html = await getPageHTML(page);
        pageContent.innerHTML = html;

        // Initialize page specific JS
        await initPage(page);
    }

    async function getPageHTML(page) {
        switch (page) {
            case 'dashboard':
                return `
                    <div class="dashboard-view">
                        <div class="premium-banner">
                            <h1 class="banner-title">Chào mừng trở lại!</h1>
                            <p class="banner-subtitle">Hệ thống đã sẵn sàng. Hôm nay bạn muốn quản lý điều gì?</p>
                        </div>
                        
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon blue"><i data-lucide="shopping-cart"></i></div>
                                <div><span class="stat-label">Doanh thu ngày</span><span class="stat-value" id="today-sales">0đ</span></div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon green"><i data-lucide="file-text"></i></div>
                                <div><span class="stat-label">Đơn hàng mới</span><span class="stat-value" id="today-orders">0</span></div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon orange"><i data-lucide="package"></i></div>
                                <div><span class="stat-label">Hàng sắp hết</span><span class="stat-value" id="low-stock">0</span></div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon purple"><i data-lucide="users"></i></div>
                                <div><span class="stat-label">Khách hàng mới</span><span class="stat-value" id="new-customers">0</span></div>
                            </div>
                        </div>

                        <div class="report-card mt-4">
                            <h3><i data-lucide="arrow-right-left"></i> Giao dịch gần đây</h3>
                            <table class="data-table">
                                <thead><tr><th>Mã HĐ</th><th>Thời gian</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead>
                                <tbody id="recent-sales"><tr><td colspan="5" class="text-center">Đang tải dữ liệu...</td></tr></tbody>
                            </table>
                        </div>

                    </div>
                `;
            case 'pos':
                return `
                    <div class="pos-view">
                        <div class="pos-layout">
                            <div class="pos-main">
                                <div class="pos-search-wrapper" style="position: relative; margin-bottom: 16px;">
                                    <div class="card" style="border-radius: 8px; border: 1px solid var(--border-color); background: #f1f5f9; box-shadow: none;">
                                        <div class="card-body" style="padding: 8px 24px; display: flex; align-items: center; gap: 15px;">
                                            <i data-lucide="scan-barcode" style="color: var(--primary-color); font-size: 20px; flex-shrink: 0;"></i>
                                            <input type="text" id="product-search" placeholder="Gõ tên sản phẩm, mã SKU hoặc quét mã vạch..." 
                                                style="width: 100%; border: none; outline: none; font-size: 14px; padding: 10px 0; background: transparent;" autocomplete="off">
                                            <div id="barcode-hint" style="display:flex; align-items:center; gap:4px; font-size: 11px; color: var(--text-muted); white-space: nowrap; flex-shrink: 0; background:#f1f5f9; border-radius:20px; padding:4px 10px;"><i data-lucide="scan-line" style="width:12px;height:12px;"></i> Quét mã</div>
                                        </div>
                                    </div>
                                    <div id="search-results" class="search-results"></div>
                                </div>
                                
                                <!-- Customer & Note Row -->
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                                    <div style="position: relative;">
                                        <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 16px; display: flex; align-items: center; gap: 10px;">
                                            <i data-lucide="user" style="color: var(--text-muted); width: 16px; flex-shrink: 0;"></i>
                                            <input type="text" id="pos-customer-search" placeholder="Khách lẻ (gõ để tìm KH)" 
                                                style="border: none; outline: none; font-size: 13px; width: 100%; background: transparent;" autocomplete="off">
                                            <button id="pos-clear-customer" style="display:none; border:none; background:none; color:#94a3b8; cursor:pointer; font-size:16px; line-height:1;">×</button>
                                        </div>
                                        <div id="pos-customer-results" class="search-results" style="position: absolute; top: 100%; left: 0; width: 100%; z-index: 200;"></div>
                                    </div>
                                    <div>
                                        <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 16px; display: flex; align-items: center; gap: 10px;">
                                            <i data-lucide="pencil" style="color: var(--text-muted); width: 16px; flex-shrink: 0;"></i>
                                            <input type="text" id="pos-note" placeholder="Ghi chú đơn hàng..." 
                                                style="border: none; outline: none; font-size: 13px; width: 100%; background: transparent;">
                                        </div>
                                    </div>
                                </div>

                                <div class="pos-table-container" style="background: white; border-radius: 8px; border: 1px solid var(--border-color); overflow: hidden;">
                                    <div style="padding: 16px 24px; border-bottom: 1px solid var(--border-color);">
                                        <h3 style="font-weight: 600; color: var(--text-main); font-size: 16px; margin: 0;">Chi tiết đơn hàng</h3>
                                    </div>
                                    <div id="empty-cart-msg" style="text-align: center; padding: 60px; color: var(--text-muted);">
                                        <i data-lucide="shopping-basket" style="font-size: 48px; margin-bottom: 16px; opacity: 0.2;"></i>
                                        <p style="font-size: 14px;">Chưa có sản phẩm nào trong giỏ hàng</p>
                                    </div>
                                    <table class="data-table" id="cart-table" style="display: none;">
                                        <thead><tr><th>SẢN PHẨM</th><th>ĐVT</th><th>ĐƠN GIÁ</th><th style="width: 120px; text-align: center;">SỐ LƯỢNG</th><th>THÀNH TIỀN</th><th style="width: 50px;"></th></tr></thead>
                                        <tbody id="cart-items"></tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="pos-sidebar" style="background: white; padding: 32px; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: none;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                                    <h2 style="font-weight: 600; font-size: 20px; margin: 0; color: var(--text-main);">Thanh toán</h2>
                                    <span class="badge" style="background: #e2e8f0; color: #475569; padding: 4px 10px; border-radius: 4px; font-size: 12px; letter-spacing: 0.5px;">#HD${Date.now().toString().slice(-6)}</span>
                                </div>
                                <!-- Customer Info Display -->
                                <div id="pos-customer-info" style="display:none; background:#f0fdf4; border:1px solid #86efac; border-radius:8px; padding:12px 16px; margin-bottom:16px; font-size:13px;">
                                    <div style="font-weight:700; color:#166534;" id="pos-customer-name-display"></div>
                                    <div style="color:#16a34a; margin-top:2px;" id="pos-customer-debt-display"></div>
                                </div>
                                <div class="summary-section" style="flex: 1;">
                                    <div class="summary-row" style="margin-bottom: 16px;"><span class="text-muted" style="font-size: 14px;">Tổng tiền hàng</span><span id="sub-total" style="font-weight: 600; font-size: 16px; color: var(--text-main);">0đ</span></div>
                                    <div class="summary-row" style="margin-bottom: 16px;"><div class="d-flex align-items-center gap-2"><span class="text-muted" style="font-size: 14px;">Giảm giá</span><i data-lucide="tag" style="color: var(--text-muted); width: 14px;"></i></div><input type="number" id="discount" class="form-control" value="0" style="width: 100px; text-align: right; padding: 8px 12px; margin: 0; height: auto; border-radius: 4px;"></div>
                                    <div class="summary-row total" style="margin-top: 24px; padding-top: 24px; border-top: 1px dashed var(--border-color); display: flex; align-items: center; justify-content: space-between;"><span style="font-weight: 600; font-size: 14px; color: var(--text-muted);">KHÁCH PHẢI TRẢ</span><span id="final-total" style="font-weight: 700; font-size: 28px; color: var(--primary-color);">0đ</span></div>
                                    
                                    <!-- Payment Mode Toggle -->
                                    <div style="display: flex; gap: 8px; margin-top: 16px; margin-bottom: 16px;">
                                        <button id="pos-pay-cash" class="pos-pay-btn active" style="flex:1;">
                                            <i data-lucide="banknote" style="width:15px;height:15px;"></i> Tiền mặt
                                        </button>
                                        <button id="pos-pay-transfer" class="pos-pay-btn" style="flex:1;">
                                            <i data-lucide="credit-card" style="width:15px;height:15px;"></i> CK
                                        </button>
                                        <button id="pos-pay-credit" class="pos-pay-btn" style="flex:1;">
                                            <i data-lucide="notebook-pen" style="width:15px;height:15px;"></i> Ghi nợ
                                        </button>
                                    </div>
                                    <input type="hidden" id="pos-payment-method" value="cash">

                                    <div id="pos-cash-section" class="payment-method-box" style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; padding: 24px;">
                                        <div class="mb-4"><label class="d-block mb-2 text-muted" style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tiền khách đưa (F8)</label><input type="number" id="customer-cash" class="form-control" placeholder="0" style="height: 56px; font-size: 24px; font-weight: 700; text-align: right; background: white; border-radius: 4px; margin-bottom: 0;"></div>
                                        <div class="d-flex justify-content-between align-items-center" style="margin-top: 16px;"><span class="text-muted" style="font-size: 14px;">Tiền thừa trả khách:</span><span id="change-text" style="font-weight: 700; font-size: 16px; color: #10b981;">0đ</span></div>
                                    </div>
                                    
                                    <div id="pos-credit-section" style="display:none; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; padding:20px;">
                                        <div style="font-size: 13px; color: #92400e; margin-bottom: 12px;"><b>⚠️ Bán ghi nợ</b> – Khách hàng sẽ trả tiền sau</div>
                                        <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Trả trước (nếu có)</label>
                                        <input type="number" id="customer-credit-paid" class="form-control" placeholder="0" style="height: 48px; font-size: 20px; font-weight: 700; text-align: right; background: white; margin-bottom: 8px;">
                                        <div style="font-size: 12px; color: #b45309;">Còn nợ: <b id="pos-remaining-debt" style="color:#dc2626;">0đ</b></div>
                                    </div>
                                </div>
                                <div class="checkout-area" style="margin-top: 32px;"><button id="btn-checkout" class="btn btn-primary" style="width: 100%; padding: 16px; font-size: 14px; border-radius: 8px; display: flex; justify-content: center; font-weight: 600; letter-spacing: 0.5px;"><i data-lucide="printer" class="mr-2" style="width: 18px;"></i> XUẤT HÓA ĐƠN (F16)</button></div>
                            </div>
                        </div>
                    </div>
                `;
            case 'products':
                return `
                    <div class="products-view">
                        <div class="page-header">
                            <div class="page-title-wrapper">
                                <h2>Quản lý sản phẩm</h2>
                                <p class="page-subtitle">Xem và quản lý danh sách sản phẩm, giá bán, tồn kho.</p>
                            </div>
                            <button class="btn btn-primary" id="btn-add-product"><i data-lucide="plus"></i> Thêm sản phẩm</button>
                        </div>
                        <div class="table-container">
                             <table class="data-table" id="products-table">
                                <thead><tr><th>Hình ảnh</th><th>Mã</th><th>Tên sản phẩm</th><th>Danh mục</th><th>Giá bán</th><th>Tồn kho</th><th class="text-right">Thao tác</th></tr></thead>
                                <tbody id="products-list"></tbody>
                             </table>
                        </div>
                    </div>
                `;
            case 'categories':
                return `
                    <div class="categories-view">
                        <div class="page-header">
                            <div class="page-title-wrapper">
                                <h2>Danh mục hàng hóa</h2>
                                <p class="page-subtitle">Quản lý các nhóm danh mục sản phẩm của cửa hàng.</p>
                            </div>
                            <button class="btn btn-primary" id="btn-add-category"><i data-lucide="plus"></i> Thêm danh mục</button>
                        </div>
                        <div class="table-container">
                             <table class="data-table">
                                <thead><tr><th>Tên Danh Mục</th><th>Mô Tả</th><th class="text-right">Thao Tác</th></tr></thead>
                                <tbody id="categories-list"></tbody>
                             </table>
                        </div>
                    </div>
                `;
            case 'customers':
                return `
                    <div class="customers-view">
                        <div class="page-header">
                            <div class="page-title-wrapper">
                                <h2>Quản lý khách hàng</h2>
                                <p class="page-subtitle">Danh sách thông tin, liên hệ và công nợ khách hàng.</p>
                            </div>
                            <button class="btn btn-primary" id="btn-add-customer"><i data-lucide="plus"></i> Thêm khách hàng</button>
                        </div>
                        <div class="filter-bar" style="margin-bottom: 1.5rem; display: flex; gap: 12px; align-items: center; background: white; padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e2e8f0);">
                            <span style="font-weight: 700; font-size: 13px; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
                                <i data-lucide="filter" style="width: 16px; height: 16px; color: #64748b;"></i> Lọc danh sách:
                            </span>
                            <select id="customer-debt-filter" class="pos-input" style="max-width: 220px; padding: 8px 12px; text-align: left; font-size: 14px; font-weight: 500; height: 38px;">
                                <option value="all">Tất cả khách hàng</option>
                                <option value="debt">Khách hàng đang nợ</option>
                            </select>
                        </div>
                        <div class="table-container">
                             <table class="data-table">
                                <thead><tr><th>Họ tên</th><th>Điện thoại</th><th>Địa chỉ</th><th>Công nợ</th><th class="text-right">Thao tác</th></tr></thead>
                                <tbody id="customers-list"></tbody>
                             </table>
                        </div>
                    </div>
                `;
            case 'stock-in':
                return `
                    <div class="stock-in-view">
                        <div class="page-header">
                            <div class="page-title-wrapper">
                                <h2>Nhập hàng / Nhập kho</h2>
                                <p class="page-subtitle">Quản lý các phiếu nhập hàng và công nợ với nhà cung cấp.</p>
                            </div>
                            <button class="btn btn-primary" id="btn-new-purchase"><i data-lucide="plus"></i> Tạo phiếu nhập</button>
                        </div>
                        <div class="table-container">
                             <table class="data-table">
                                <thead><tr><th>Ngày nhập</th><th>Nhà cung cấp</th><th>Tổng tiền</th><th style="color:#10b981;">Đã trả</th><th>Còn nợ</th><th>Người nhập</th><th>Ghi chú</th><th class="text-right">Thao tác</th></tr></thead>
                                <tbody id="purchases-list"></tbody>
                             </table>
                        </div>
                    </div>
                `;
            case 'suppliers':
                return `
                    <div class="suppliers-view">
                        <div class="page-header">
                            <div class="page-title-wrapper">
                                <h2>Quản lý nhà cung cấp</h2>
                                <p class="page-subtitle">Danh sách nhà cung cấp và theo dõi tình trạng công nợ.</p>
                            </div>
                            <button class="btn btn-primary" id="btn-add-supplier"><i data-lucide="plus"></i> Thêm nhà cung cấp</button>
                        </div>
                        <div class="table-container">
                             <table class="data-table">
                                 <thead><tr><th>Tên NCC</th><th>Điện thoại</th><th>Địa chỉ</th><th>Mặt hàng</th><th style="color:#ef4444;">Công nợ</th><th class="text-right">Thao tác</th></tr></thead>
                                 <tbody id="suppliers-list"></tbody>
                             </table>
                        </div>
                    </div>
                `;
            case 'users':
                return `
                    <div class="page-header">
                        <h2>Quản lý nhân viên</h2>
                        <button class="btn btn-primary" id="btn-add-user"><i data-lucide="plus"></i> Thêm nhân viên</button>
                    </div>
                    <div class="card mt-3">
                        <table class="data-table">
                            <thead><tr><th>Tên nhân viên</th><th>Tên đăng nhập</th><th>Số điện thoại</th><th>Quyền</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                            <tbody id="users-list"></tbody>
                        </table>
                    </div>`;
            case 'inventory-logs':
                return `
                    <div class="page-header">
                        <h2>Nhật ký biến động kho</h2>
                    </div>
                    <div class="card mt-3">
                        <table class="data-table">
                            <thead><tr><th>Thời gian</th><th>Sản phẩm</th><th>Loại</th><th>Số lượng</th><th>Ghi chú</th></tr></thead>
                            <tbody id="inventory-logs-list"></tbody>
                        </table>
                    </div>`;
            case 'reports':
                return `
                    <div class="reports-view">
                        <div class="page-header">
                            <h2>Phân tích & Báo cáo</h2>
                            <div class="header-actions" style="display: flex; gap: 10px;">
                                <button class="btn btn-success" id="btn-export-excel">
                                    <i data-lucide="file-spreadsheet"></i> Xuất Excel
                                </button>
                                <button class="btn btn-primary" onclick="loadReports()">
                                    <i data-lucide="refresh-cw"></i> Cập nhật dữ liệu
                                </button>
                            </div>
                        </div>


                        <!-- Thống kê hôm nay -->
                        <div style="margin-bottom: 24px;">
                            <div style="font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; font-family: 'Inter', sans-serif;">Số liệu hôm nay</div>
                            <div class="report-summary-grid">
                                <div class="report-summary-card">
                                    <span class="label">Doanh thu ngày</span>
                                    <span class="value" id="report-today-rev">0đ</span>
                                </div>
                                <div class="report-summary-card">
                                    <span class="label">Lợi nhuận ngày</span>
                                    <span class="value" id="report-today-profit">0đ</span>
                                </div>
                                <div class="report-summary-card">
                                    <span class="label">Số đơn hàng</span>
                                    <span class="value" id="report-today-orders">0</span>
                                </div>
                                <div class="report-summary-card">
                                    <span class="label">Sản phẩm sắp hết</span>
                                    <span class="value text-danger" id="report-low-stock">0</span>
                                </div>
                            </div>
                        </div>

                        <!-- Thống kê tổng quan -->
                        <div style="margin-bottom: 24px;">
                            <div style="font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; font-family: 'Inter', sans-serif;">Thống kê tổng quan</div>
                            <div class="report-summary-grid">
                                <div class="report-summary-card">
                                    <span class="label">Đơn thành công</span>
                                    <span class="value text-success" id="report-orders-completed">0</span>
                                </div>
                                <div class="report-summary-card">
                                    <span class="label">Đơn chờ xử lý</span>
                                    <span class="value text-warning" id="report-orders-pending">0</span>
                                </div>
                                <div class="report-summary-card">
                                    <span class="label">Đơn đã hủy</span>
                                    <span class="value text-danger" id="report-orders-cancelled">0</span>
                                </div>
                                <div class="report-summary-card">
                                    <span class="label">Tổng khách hàng</span>
                                    <span class="value text-primary" id="report-total-customers">0</span>
                                </div>
                            </div>
                        </div>

                        <!-- Biểu đồ và Top sản phẩm -->
                        <div class="report-main-section">
                            <div class="report-chart-card">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
                                    <h3 style="margin: 0; display:flex; align-items:center; gap:8px;"><i data-lucide="line-chart" style="color:var(--primary-color);"></i> Biểu đồ Tăng trưởng</h3>
                                    <select id="report-chart-filter" class="pos-input" style="max-width: 180px; padding: 6px 12px; font-size: 13px; font-weight: 600; height: 34px;">
                                        <option value="7days">7 ngày qua</option>
                                        <option value="day">Theo ngày (Tháng này)</option>
                                        <option value="month">Theo tháng (Năm này)</option>
                                    </select>
                                </div>
                                <div style="position: relative; height: 350px; width: 100%;">
                                    <canvas id="revenueChart"></canvas>
                                </div>
                            </div>
                            <div class="report-card">
                                <h3><i data-lucide="award"></i> Sản phẩm bán chạy</h3>
                                <table class="report-table-compact" id="best-selling-table">
                                    <thead><tr><th>Tên Sản phẩm</th><th style="text-align:right;">Số lượng</th></tr></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Bảng chi tiết bổ sung -->
                        <div class="reports-grid">
                            <div class="report-card">
                                <h3><i data-lucide="archive"></i> Tồn kho nhiều</h3>
                                <table class="report-table-compact" id="slow-moving-table">
                                    <thead><tr><th>Tên Sản phẩm</th><th style="text-align:right;">Số lượng tồn</th></tr></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                            <div class="report-card">
                                <h3><i data-lucide="history"></i> Đơn hàng gần đây</h3>
                                <table class="report-table-compact" id="recent-orders-table">
                                    <thead><tr><th>Khách hàng</th><th style="text-align:right;">Thành tiền</th></tr></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Công nợ khách hàng -->
                        <div class="report-card" style="border-left: 4px solid #f59e0b;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                                <h3 style="margin:0;"><i data-lucide="alert-triangle" style="color:#f59e0b;"></i> Khách hàng còn nợ</h3>
                                <span id="report-total-debt-badge" style="background:#fef3c7; color:#b45309; padding:6px 16px; border-radius:20px; font-weight:700; font-size:14px;">Tổng: 0đ</span>
                            </div>
                            <table class="report-table-compact" id="customer-debt-table">
                                <thead><tr><th>Khách hàng</th><th>Điện thoại</th><th style="text-align:right;">Số nợ</th><th style="text-align:center;">Trạng thái</th></tr></thead>
                                <tbody><tr><td colspan="4" class="text-muted" style="text-align:center; padding:20px;">Đang tải...</td></tr></tbody>
                            </table>
                        </div>
                    </div>
                `;



            case 'sales-history':
                return `
                    <div class="sales-history-view">
                        <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
                            <h2>Lịch sử bán hàng</h2>
                            <div class="filters-bar" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                                <div style="position:relative;">
                                    <input type="text" id="sale-search" placeholder="Tìm mã HĐ, tên KH..." 
                                           style="padding:8px 12px 8px 32px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; width:220px; outline:none; background:#f8fafc;">
                                    <i data-lucide="search" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); width:14px; height:14px; color:var(--text-muted);"></i>
                                </div>
                                <select id="sale-status-filter" style="padding:8px 12px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; outline:none; background:#f8fafc; color:#334155;">
                                    <option value="">-- Tất cả trạng thái --</option>
                                    <option value="pending">Chờ xử lý</option>
                                    <option value="delivering">Đang giao</option>
                                    <option value="completed">Hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
                                </select>
                                <select id="sale-payment-filter" style="padding:8px 12px; border:1px solid var(--border-color); border-radius:8px; font-size:13px; outline:none; background:#f8fafc; color:#334155;">
                                    <option value="">-- Tất cả thanh toán --</option>
                                    <option value="cash">Tiền mặt</option>
                                    <option value="transfer">Chuyển khoản</option>
                                    <option value="credit">Ghi nợ</option>
                                </select>
                            </div>
                        </div>
                        <div class="table-container">
                             <table class="data-table">
                                <thead><tr><th>Mã HĐ</th><th>Ngày bán</th><th>Khách hàng</th><th>Tổng tiền</th><th>Thanh toán</th><th style="text-align:center;">Thao tác</th></tr></thead>
                                <tbody id="sales-list"></tbody>
                             </table>
                        </div>
                    </div>
                `;
            default:
                return `<h2>Trang ${page} đang phát triển</h2>`;
        }
    }

    async function loadDashboardStats() {
        try {
            const res = await fetch('/api/reports/dashboard');
            const data = await res.json();
            if (document.getElementById('today-sales')) document.getElementById('today-sales').innerText = (data.today_revenue || 0).toLocaleString() + 'đ';
            if (document.getElementById('today-orders')) document.getElementById('today-orders').innerText = data.today_orders || 0;
            if (document.getElementById('low-stock')) document.getElementById('low-stock').innerText = data.low_stock_count || 0;
            if (document.getElementById('new-customers')) document.getElementById('new-customers').innerText = data.new_customers_count || 0;

            const recentList = document.getElementById('recent-sales');
            if (recentList) {
                const salesRes = await fetch('/api/sales');
                const sales = await salesRes.json();
                if (sales && sales.length > 0) {
                    recentList.innerHTML = sales.slice(0, 5).map(s => {
                        let statusHtml = '';
                        if (s.status === 'completed') statusHtml = '<span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Hoàn thành</span>';
                        else if (s.status === 'cancelled') statusHtml = '<span style="background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Đã hủy</span>';
                        else if (s.status === 'delivering') statusHtml = '<span style="background: #e0e7ff; color: #4338ca; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Đang giao</span>';
                        else statusHtml = '<span style="background: #fef9c3; color: #854d0e; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Chờ xử lý</span>';

                        return `
                        <tr>
                            <td><span style="font-weight: 700; color: var(--primary-color);">#HD${s.id.slice(-8).toUpperCase()}</span></td>
                            <td>${new Date(s.order_date).toLocaleTimeString('vi-VN')}</td>
                            <td>${s.customer_name || 'Khách lẻ'}</td>
                            <td style="font-weight: 700;">${s.final_amount.toLocaleString()}đ</td>
                            <td>${statusHtml}</td>
                        </tr>
                        `;
                    }).join('');
                } else {
                    recentList.innerHTML = '<tr><td colspan="5" class="text-center" style="padding: 20px;">Chưa có giao dịch gần đây</td></tr>';
                }
            }
        } catch (err) { console.error(err); }
    }

    async function initPage(page) {
        console.log('Initializing page:', page);
        if (page === 'dashboard') {
            await loadDashboardStats();
        } else if (page === 'pos') {
            initPOS();
        } else if (page === 'products') {
            await loadProducts();
            setupProductActions();
        } else if (page === 'categories') {
            await loadCategories();
            setupCategoryActions();
        } else if (page === 'customers') {
            await loadCustomers();
            setupCustomerActions();
        } else if (page === 'suppliers') {
            await loadSuppliers();
            setupSupplierActions();
        } else if (page === 'stock-in') {
            await loadPurchases();
            setupStockInActions();
        } else if (page === 'reports') {
            await loadReports();
            const chartFilter = document.getElementById('report-chart-filter');
            if (chartFilter) {
                chartFilter.onchange = () => {
                    loadReports(chartFilter.value);
                };
            }
            document.getElementById('btn-export-excel')?.addEventListener('click', () => {
                if (!window.lastReportData) { alert('Chưa có dữ liệu để xuất!'); return; }
                const data = window.lastReportData;
                const wb = XLSX.utils.book_new();
                
                // 1. Sheet Tóm tắt
                const summaryData = [
                    ['TIÊU CHÍ', 'GIÁ TRỊ'],
                    ['Doanh thu ngày', document.getElementById('report-today-rev')?.innerText || '0đ'],
                    ['Lợi nhuận ngày', document.getElementById('report-today-profit')?.innerText || '0đ'],
                    ['Số đơn hàng', document.getElementById('report-today-orders')?.innerText || '0'],
                    ['Sản phẩm sắp hết', document.getElementById('report-low-stock')?.innerText || '0']
                ];
                const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
                XLSX.utils.book_append_sheet(wb, wsSummary, "Tóm tắt");

                // 2. Sheet Hóa đơn (Chi tiết các đơn gần đây)
                if (data.recentOrders) {
                    const salesData = [['Mã HĐ', 'Khách hàng', 'Tổng tiền', 'Ngày tạo']];
                    data.recentOrders.forEach(o => {
                        salesData.push([o.id, o.customer_name, o.final_amount, new Date(o.createdAt).toLocaleString('vi-VN')]);
                    });
                    const wsSales = XLSX.utils.aoa_to_sheet(salesData);
                    XLSX.utils.book_append_sheet(wb, wsSales, "Danh sách Hóa đơn");
                }

                // 3. Sheet Toàn bộ Kho (Tính giá trị vốn)
                if (data.allProducts) {
                    const inventoryData = [['Tên sản phẩm', 'Tồn kho', 'Giá vốn', 'Giá bán', 'Giá trị tồn (Vốn)']];
                    let totalInventoryValue = 0;
                    data.allProducts.forEach(p => {
                        const value = p.stock_quantity * p.cost_price;
                        totalInventoryValue += value;
                        inventoryData.push([p.name, p.stock_quantity, p.cost_price, p.selling_price, value]);
                    });
                    inventoryData.push(['', '', '', 'TỔNG GIÁ TRỊ VỐN:', totalInventoryValue]);
                    const wsInv = XLSX.utils.aoa_to_sheet(inventoryData);
                    XLSX.utils.book_append_sheet(wb, wsInv, "Giá trị Kho hàng");
                }

                // 4. Sheet Sản phẩm bán chạy
                const bestTable = document.getElementById('best-selling-table');
                if (bestTable) {
                    const wsBest = XLSX.utils.table_to_sheet(bestTable);
                    XLSX.utils.book_append_sheet(wb, wsBest, "Top bán chạy");
                }

                XLSX.writeFile(wb, `BaoCao_HTDS_ChiTiet_${new Date().toISOString().split('T')[0]}.xlsx`);
            });


        } else if (page === 'sales-history') {
            await loadSalesHistory();
            setupSalesFilters();
        } else if (page === 'users') {
            await loadUsers();
            if (document.getElementById('btn-add-user')) document.getElementById('btn-add-user').onclick = setupAddUser;
        } else if (page === 'inventory-logs') {
            await loadInventoryLogs();
        }
    }

    // Modal System
    function showModal(title, content, onSubmit, sizeClass = '') {
        let modal = document.getElementById('app-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'app-modal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }
        modal.innerHTML = `<div class="modal-content ${sizeClass}"><div class="modal-header"><h3>${title}</h3><button class="close-modal">&times;</button></div><div class="modal-body">${content}</div></div>`;
        modal.style.display = 'flex';
        modal.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
        
        const form = modal.querySelector('form');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                if (await onSubmit(data, form)) modal.style.display = 'none';
            };
        }
        return modal;
    }

    // Generic CRUD Action Handler (Event Delegation)
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-icon');
        if (!btn) return;

        const row = btn.closest('tr');
        if (!row) return;

        const id = row.getAttribute('data-id');
        if (!id) return;

        if (btn.classList.contains('btn-view-debt')) {
            handleViewDebt(id);
        } else if (btn.classList.contains('text-primary')) { // EDIT/VIEW
            handleEditAction(currentPage, id);
        } else if (btn.classList.contains('text-danger')) { // DELETE
            handleDeleteAction(currentPage, id);
        } else if (btn.classList.contains('btn-adjust-stock')) {
            handleAdjustStock(id);
        } else if (btn.classList.contains('btn-pay-debt')) {
            handlePaySupplierDebt(id);
        }
    });

    async function handleEditAction(page, id) {
        switch (page) {
            case 'products':
                const product = await (await fetch(`/api/products/${id}`)).json();
                const categories = await (await fetch('/api/categories')).json();
                showModal('Chỉnh sửa sản phẩm', `
                    <form>
                        <div class="form-row">
                            <div class="mb-3"><label>Tên sản phẩm</label><input type="text" name="name" class="form-control" value="${product.name}" required></div>
                            <div class="mb-3"><label>Mã SKU</label><input type="text" name="sku" class="form-control" value="${product.sku}" required></div>
                        </div>

                        <div class="form-row">
                            <div class="mb-3"><label>Danh mục</label>
                                <select name="category_id" class="form-control">
                                    ${categories.map(c => `<option value="${c.id}" ${c.id == product.category_id ? 'selected' : ''}>${c.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="mb-3"><label>Đơn vị tính</label><input type="text" name="unit" class="form-control" value="${product.unit || ''}"></div>
                        </div>

                        <div class="form-row">
                            <div class="mb-3">
                                <label>Giá nhập (Gần nhất)</label>
                                <input type="number" name="cost_price" class="form-control readonly-info" value="${product.cost_price}" readonly title="Giá này tự động cập nhật từ phiếu nhập hàng">
                            </div>
                            <div class="mb-3">
                                <label>Giá bán (Hiện tại)</label>
                                <input type="number" name="selling_price" class="form-control" value="${product.selling_price}" required style="font-weight: 800; color: var(--primary-color);">
                            </div>
                            <div class="mb-3">
                                <label>Tồn tối thiểu</label>
                                <input type="number" name="min_stock" class="form-control" value="${product.min_stock || 10}">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="mb-3">
                                <label>Hình ảnh mới (Tối đa 4 ảnh, để trống nếu không đổi)</label>
                                <input type="file" name="image_files" id="edit-product-images" class="form-control" multiple accept="image/*">
                                <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">Đã có ${product.images ? product.images.length : 0} ảnh</div>
                            </div>
                            <div class="mb-3">
                                <label>Link Video (YouTube/TikTok...)</label>
                                <input type="url" name="video" class="form-control" value="${product.video || ''}" placeholder="https://youtube.com/...">
                            </div>
                        </div>

                        <div class="mb-3"><label>Mô tả chi tiết</label><textarea name="description" class="form-control" rows="3" placeholder="Nhập mô tả sản phẩm để hiển thị trên trang khách hàng...">${product.description || ''}</textarea></div>
                        <button type="submit" class="btn btn-primary btn-block">CẬP NHẬT THÔNG TIN</button>
                    </form>
                `, async (data, form) => {
                    try {
                        const fileInput = form.querySelector('#edit-product-images');
                        let uploadedImages = [];
                        let hasNewImages = false;

                        if (fileInput && fileInput.files.length > 0) {
                            if (fileInput.files.length > 4) {
                                alert('Chỉ được tải lên tối đa 4 ảnh!');
                                return false;
                            }
                            const uploadData = new FormData();
                            Array.from(fileInput.files).forEach(file => {
                                uploadData.append('images', file);
                            });
                            const uploadRes = await fetch('/api/upload/multiple', { method: 'POST', body: uploadData });
                            const uploadResult = await uploadRes.json();
                            if (uploadResult.success) {
                                uploadedImages = uploadResult.urls;
                                hasNewImages = true;
                            } else {
                                alert('Lỗi tải ảnh: ' + uploadResult.error);
                                return false;
                            }
                        }

                        data.images = hasNewImages ? uploadedImages : product.images;

                        const res = await fetch(`/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                        if (res.ok) { loadProducts(); return true; }
                        else { alert('Lỗi cập nhật'); return false; }
                    } catch(e) { console.error(e); alert('Lỗi hệ thống'); return false; }
                }, 'modal-lg');
                break;
            case 'categories':
                const category = await (await fetch(`/api/categories/${id}`)).json();
                showModal('Chỉnh sửa danh mục', `
                    <form>
                        <div class="mb-3"><label>Tên danh mục</label><input type="text" name="name" class="form-control" value="${category.name}" required></div>
                        <div class="mb-3"><label>Mô tả</label><textarea name="description" class="form-control">${category.description || ''}</textarea></div>
                        <button type="submit" class="btn btn-primary btn-block">CẬP NHẬT</button>
                    </form>
                `, async (data) => {
                    const res = await fetch(`/api/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    if (res.ok) { loadCategories(); return true; }
                });
                break;
            case 'customers':
                const customer = await (await fetch(`/api/customers/${id}`)).json();
                showModal('Chỉnh sửa khách hàng', `
                    <form>
                        <div class="mb-3"><label>Họ tên</label><input type="text" name="name" class="form-control" value="${customer.name}" required></div>
                        <div class="mb-3"><label>Số điện thoại</label><input type="text" name="phone" class="form-control" value="${customer.phone || ''}"></div>
                        <div class="mb-3"><label>Địa chỉ</label><input type="text" name="address" class="form-control" value="${customer.address || ''}"></div>
                        <div class="mb-3"><label>Công nợ</label><input type="number" name="debt" class="form-control" value="${customer.debt || 0}"></div>
                        <button type="submit" class="btn btn-primary btn-block">CẬP NHẬT</button>
                    </form>
                `, async (data) => {
                    const res = await fetch(`/api/customers/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    if (res.ok) { loadCustomers(); return true; }
                });
                break;
            case 'suppliers':
                const supplier = await (await fetch(`/api/suppliers/${id}`)).json();
                showModal('Chỉnh sửa nhà cung cấp', `
                    <form>
                        <div class="mb-3"><label>Tên NCC</label><input type="text" name="name" class="form-control" value="${supplier.name}" required></div>
                        <div class="mb-3"><label>Số điện thoại</label><input type="text" name="phone" class="form-control" value="${supplier.phone || ''}"></div>
                        <div class="mb-3"><label>Email</label><input type="email" name="email" class="form-control" value="${supplier.email || ''}"></div>
                        <div class="mb-3"><label>Địa chỉ</label><input type="text" name="address" class="form-control" value="${supplier.address || ''}"></div>
                        <div class="mb-3"><label>Mặt hàng cung cấp</label><input type="text" name="supply_items" class="form-control" value="${supplier.supply_items || ''}"></div>
                        <div class="mb-3"><label>Ghi chú</label><textarea name="note" class="form-control">${supplier.note || ''}</textarea></div>
                        <button type="submit" class="btn btn-primary btn-block">CẬP NHẬT</button>
                    </form>
                `, async (data) => {
                    const res = await fetch(`/api/suppliers/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    if (res.ok) { loadSuppliers(); return true; }
                });
                break;
            case 'users':
                const usr = await (await fetch(`/api/users/${id}`)).json();
                showModal('Chỉnh sửa nhân viên', `
                    <form>
                        <div class="mb-3"><label>Họ tên</label><input type="text" name="full_name" class="form-control" value="${usr.full_name}" required></div>
                        <div class="mb-3"><label>Số điện thoại</label><input type="tel" name="phone" class="form-control" value="${usr.phone || ''}"></div>
                        <div class="mb-3"><label>Quyền hạn</label>
                            <select name="role" class="form-control">
                                <option value="staff" ${usr.role === 'staff' ? 'selected' : ''}>Nhân viên</option>
                                <option value="admin" ${usr.role === 'admin' ? 'selected' : ''}>Admin</option>
                            </select>
                        </div>
                        <div class="mb-3"><label>Trạng thái</label>
                            <select name="status" class="form-control">
                                <option value="true" ${usr.status ? 'selected' : ''}>Hoạt động</option>
                                <option value="false" ${!usr.status ? 'selected' : ''}>Khóa</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label>Đổi mật khẩu (Để trống nếu không đổi)</label>
                            <input type="password" name="password" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">CẬP NHẬT</button>
                    </form>
                `, async (data) => {
                    // Convert status string to boolean
                    data.status = data.status === 'true';
                    if (!data.password) delete data.password;
                    const res = await fetch(`/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    if (res.ok) { loadUsers(); return true; }
                });
                break;

            case 'stock-in':

                const po = await (await fetch(`/api/purchases/${id}`)).json();
                showModal('Chi tiết phiếu nhập hàng', `
                    <div class="detail-view">
                        <div class="detail-header">
                            <div><strong>Nhà cung cấp:</strong> ${po.supplier_name}</div>
                            <div><strong>Ngày nhập:</strong> ${new Date(po.order_date).toLocaleString('vi-VN')}</div>
                            <div><strong>Người nhập:</strong> ${po.user_name}</div>
                        </div>
                        <table class="data-table mt-3">
                            <thead><tr><th>Sản phẩm</th><th>Giá nhập</th><th>Số lượng</th><th>Thành tiền</th></tr></thead>
                            <tbody>
                                ${po.items.map(item => `<tr><td>${item.product_name}</td><td>${item.unit_price.toLocaleString()}đ</td><td>${item.quantity}</td><td>${item.subtotal.toLocaleString()}đ</td></tr>`).join('')}
                            </tbody>
                        </table>
                        <div class="detail-footer mt-3" style="text-align: right;">
                            <div>Tổng cộng: <strong>${po.total_amount.toLocaleString()}đ</strong></div>
                            <div>Đã trả: <strong style="color: #22c55e;">${po.paid_amount.toLocaleString()}đ</strong></div>
                            <div>Còn nợ: <strong style="color: #ef4444;">${po.balance_amount.toLocaleString()}đ</strong></div>
                        </div>
                    </div>
                `, () => {}, 'modal-lg');
                break;
            case 'sales-history':
                const sale = await (await fetch(`/api/sales/${id}`)).json();
                showModal('Chi tiết hóa đơn bán hàng', `
                    <div class="detail-view">
                        <div class="detail-header">
                            <div><strong>Khách hàng:</strong> ${sale.customer_name}</div>
                            <div><strong>Ngày bán:</strong> ${new Date(sale.order_date).toLocaleString('vi-VN')}</div>
                            <div><strong>Người bán:</strong> ${sale.user_name}</div>
                        </div>
                        <table class="data-table mt-3">
                            <thead><tr><th>Sản phẩm</th><th>Giá bán</th><th>Số lượng</th><th>Thành tiền</th></tr></thead>
                            <tbody>
                                ${sale.items.map(item => `<tr><td>${item.product_name}</td><td>${item.unit_price.toLocaleString()}đ</td><td>${item.quantity}</td><td>${item.subtotal.toLocaleString()}đ</td></tr>`).join('')}
                            </tbody>
                        </table>
                        <div class="detail-footer mt-3" style="text-align: right;">
                            <div style="font-size: 1.2rem;">Tổng thanh toán: <strong>${sale.final_amount.toLocaleString()}đ</strong></div>
                            <div class="text-muted mb-2">Hình thức: ${sale.payment_method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</div>
                            <button class="btn btn-outline-primary" onclick="printInvoice('${sale.id}')"><i data-lucide="printer"></i> In hóa đơn</button>
                        </div>
                    </div>
                `, () => {}, 'modal-lg');
                break;
            case 'users':
                const user = await (await fetch(`/api/users/${id}`)).json();
                showModal('Chỉnh sửa nhân viên', `
                    <form>
                        <div class="mb-3"><label>Tên nhân viên</label><input type="text" name="full_name" class="form-control" value="${user.full_name}" required></div>
                        <div class="mb-3"><label>Số điện thoại</label><input type="tel" name="phone" class="form-control" value="${user.phone || ''}"></div>
                        <div class="mb-3"><label>Quyền hạn</label>
                            <select name="role" class="form-control">
                                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                                <option value="staff" ${user.role === 'staff' ? 'selected' : ''}>Nhân viên</option>
                            </select>
                        </div>
                        <div class="mb-3"><label>Đổi mật khẩu (để trống nếu không đổi)</label><input type="password" name="password" class="form-control"></div>
                        <div class="mb-3"><label>Trạng thái</label>
                            <select name="status" class="form-control">
                                <option value="true" ${user.status ? 'selected' : ''}>Đang hoạt động</option>
                                <option value="false" ${!user.status ? 'selected' : ''}>Khóa</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">CẬP NHẬT</button>
                    </form>
                `, async (data) => {
                    const res = await fetch(`/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    if (res.ok) { loadUsers(); return true; }
                });
                break;
        }
    }

    async function handleDeleteAction(page, id) {
        if (!await confirm('Bạn có chắc chắn muốn xóa mục này?')) return;
        let url = '';
        let callback = null;
        switch (page) {
            case 'products': url = `/api/products/${id}`; callback = loadProducts; break;
            case 'categories': url = `/api/categories/${id}`; callback = loadCategories; break;
            case 'customers': url = `/api/customers/${id}`; callback = loadCustomers; break;
            case 'suppliers': url = `/api/suppliers/${id}`; callback = loadSuppliers; break;
            case 'users': url = `/api/users/${id}`; callback = loadUsers; break;
        }

        if (url) {
            const res = await fetch(url, { method: 'DELETE' });
            if (res.ok) { alert('Đã xóa thành công!'); callback(); }
            else { const err = await res.json(); alert('Lỗi: ' + (err.message || err.error)); }
        }
    }

    function setupProductActions() {
        const btn = document.getElementById('btn-add-product');
        if (!btn) return;
        btn.onclick = async () => {
            const categories = await (await fetch('/api/categories')).json();
            showModal('Thêm sản phẩm mới', `
                <form id="product-form">
                    <div class="form-row">
                        <div class="mb-3"><label>Tên sản phẩm</label><input type="text" name="name" class="form-control" required placeholder="Nhập tên sản phẩm..."></div>
                        <div class="mb-3"><label>Mã SKU</label><input type="text" name="sku" class="form-control" required placeholder="Gõ mã hoặc dùng máy quét..."></div>
                    </div>
                    
                    <div class="form-row">
                        <div class="mb-3"><label>Danh mục</label>
                            <select name="category_id" class="form-control">
                                ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mb-3"><label>Đơn vị tính</label><input type="text" name="unit" class="form-control" value="Cái"></div>
                    </div>

                    <div class="form-row">
                        <div class="mb-3"><label>Giá nhập (Ước tính)</label><input type="number" name="cost_price" class="form-control" value="0"></div>
                        <div class="mb-3"><label>Giá bán (Niêm yết)</label><input type="number" name="selling_price" class="form-control" required placeholder="0"></div>
                        <div class="mb-3"><label>Tồn kho ban đầu</label><input type="number" name="stock_quantity" class="form-control" value="0"></div>
                    </div>

                    <div class="form-row">
                        <div class="mb-3"><label>Hình ảnh (Tối đa 4 ảnh)</label><input type="file" name="image_files" id="product-images" class="form-control" multiple accept="image/*"></div>
                        <div class="mb-3"><label>Link Video (YouTube/TikTok...)</label><input type="url" name="video" class="form-control" placeholder="https://youtube.com/..."></div>
                    </div>

                    <div class="mb-3"><label>Mô tả chi tiết</label><textarea name="description" class="form-control" rows="3" placeholder="Nhập mô tả sản phẩm để hiển thị trên trang khách hàng..."></textarea></div>
                    <button type="submit" class="btn btn-primary btn-block">LƯU SẢN PHẨM MỚI</button>
                </form>
            `, async (data, form) => {
                try {
                    const fileInput = form.querySelector('#product-images');
                    let uploadedImages = [];
                    if (fileInput && fileInput.files.length > 0) {
                        if (fileInput.files.length > 4) {
                            alert('Chỉ được tải lên tối đa 4 ảnh!');
                            return false;
                        }
                        const uploadData = new FormData();
                        Array.from(fileInput.files).forEach(file => {
                            uploadData.append('images', file);
                        });
                        const uploadRes = await fetch('/api/upload/multiple', { method: 'POST', body: uploadData });
                        const uploadResult = await uploadRes.json();
                        if (uploadResult.success) {
                            uploadedImages = uploadResult.urls;
                        } else {
                            alert('Lỗi tải ảnh: ' + uploadResult.error);
                            return false;
                        }
                    }

                    // Update data payload
                    data.images = uploadedImages;

                    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    if (res.ok) { alert('Thành công!'); loadProducts(); return true; }
                    else { alert('Lỗi khi lưu sản phẩm'); return false; }
                } catch(e) { console.error(e); alert('Lỗi hệ thống'); return false; }
            }, 'modal-lg');
        };
    }

    function setupCategoryActions() {
        const btn = document.getElementById('btn-add-category');
        if (!btn) return;
        btn.onclick = () => {
            showModal('Thêm danh mục', `<form id="category-form"><div class="mb-3"><label>Tên danh mục</label><input type="text" name="name" class="form-control" required></div><div class="mb-3"><label>Mô tả</label><textarea name="description" class="form-control"></textarea></div><button type="submit" class="btn btn-primary btn-block">LƯU DANH MỤC</button></form>`, async (data) => {
                const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                if (res.ok) { alert('Thành công!'); loadCategories(); return true; }
            });
        };
    }

    function setupCustomerActions() {
        const btn = document.getElementById('btn-add-customer');
        if (btn) {
            btn.onclick = () => {
                showModal('Thêm khách hàng', `<form id="customer-form"><div class="mb-3"><label>Họ tên</label><input type="text" name="name" class="form-control" required></div><div class="mb-3"><label>Số điện thoại</label><input type="text" name="phone" class="form-control"></div><div class="mb-3"><label>Địa chỉ</label><input type="text" name="address" class="form-control"></div><button type="submit" class="btn btn-primary btn-block">LƯU KHÁCH HÀNG</button></form>`, async (data) => {
                    const res = await fetch('/api/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    if (res.ok) { alert('Thành công!'); loadCustomers(); return true; }
                });
            };
        }
        const filter = document.getElementById('customer-debt-filter');
        if (filter) {
            filter.onchange = () => {
                loadCustomers();
            };
        }
    }

    function renderLoading() { pageContent.innerHTML = '<div class="loading-spinner"><i data-lucide="loader-2"></i></div>'; }

    function initPOS() {
        const searchInput = document.getElementById('product-search');
        const resultsDiv = document.getElementById('search-results');
        const cartItems = document.getElementById('cart-items');
        let cart = [];
        let currentTotal = 0;
        let selectedCustomer = null;
        let paymentMethod = 'cash';

        // ===== BARCODE SCANNER SUPPORT =====
        // Detect rapid scan: if input arrives very fast (barcode scanner sends chars < 50ms apart),
        // treat as a barcode and look up product by exact SKU on Enter or timeout.
        let barcodeBuffer = '';
        let barcodeTimer = null;
        const BARCODE_TIMEOUT = 150; // ms between chars to detect scanner

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    tryBarcodeSearch(query);
                    searchInput.value = '';
                    resultsDiv.style.display = 'none';
                }
            }
        });

        async function tryBarcodeSearch(sku) {
            try {
                // Try exact SKU match first (barcode scan)
                const res = await fetch(`/api/products/search?q=${encodeURIComponent(sku)}`);
                const products = await res.json();
                const exact = products.find(p => p.sku && p.sku.toLowerCase() === sku.toLowerCase());
                if (exact) {
                    addToCart(exact);
                    // Flash barcode hint green
                    const hint = document.getElementById('barcode-hint');
                    if (hint) { hint.innerHTML = '<i data-lucide="check-circle-2" style="width:12px;height:12px;"></i> ' + exact.name; hint.style.color = '#16a34a'; hint.style.background = '#f0fdf4'; setTimeout(() => { hint.innerHTML = '<i data-lucide="scan-line" style="width:12px;height:12px;"></i> Quét mã'; hint.style.color = 'var(--text-muted)'; hint.style.background = '#f1f5f9'; if(window.lucide) lucide.createIcons(); }, 1500); }
                } else if (products.length === 1) {
                    addToCart(products[0]);
                } else if (products.length > 1) {
                    // Show dropdown for manual selection
                    showSearchDropdown(products);
                } else {
                    const hint = document.getElementById('barcode-hint');
                    if (hint) { hint.innerHTML = '<i data-lucide="alert-circle" style="width:12px;height:12px;"></i> Không thấy'; hint.style.color = '#dc2626'; hint.style.background = '#fef2f2'; setTimeout(() => { hint.innerHTML = '<i data-lucide="scan-line" style="width:12px;height:12px;"></i> Quét mã'; hint.style.color = 'var(--text-muted)'; hint.style.background = '#f1f5f9'; if(window.lucide) lucide.createIcons(); }, 1500); }
                }
            } catch (err) { console.error(err); }
        }

        function showSearchDropdown(products) {
            resultsDiv.innerHTML = products.map(p => `<div class="search-item" data-id="${p.id}"><div class="name">${p.name}</div><div class="meta">${p.sku} | Tồn: ${p.stock_quantity} | ${p.selling_price.toLocaleString()}đ</div></div>`).join('');
            resultsDiv.style.display = 'block';
            resultsDiv.querySelectorAll('.search-item').forEach(item => {
                item.addEventListener('click', () => {
                    const pid = item.getAttribute('data-id');
                    const product = products.find(prod => prod.id == pid);
                    addToCart(product);
                    searchInput.value = '';
                    resultsDiv.style.display = 'none';
                });
            });
        }

        searchInput.addEventListener('input', async (e) => {
            const query = e.target.value.trim();
            if (query.length < 2) { resultsDiv.style.display = 'none'; return; }
            try {
                const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
                const products = await res.json();
                if (products.length > 0) {
                    showSearchDropdown(products);
                } else { resultsDiv.style.display = 'none'; }
            } catch (err) { console.error(err); }
        });

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
                resultsDiv.style.display = 'none';
            }
        });

        // ===== CUSTOMER SEARCH =====
        const customerSearch = document.getElementById('pos-customer-search');
        const customerResults = document.getElementById('pos-customer-results');
        const clearCustomerBtn = document.getElementById('pos-clear-customer');
        let allCustomers = [];

        // Load customers list once
        fetch('/api/customers').then(r => r.json()).then(data => { allCustomers = data; }).catch(() => {});

        customerSearch.addEventListener('input', () => {
            const q = customerSearch.value.trim().toLowerCase();
            if (q.length < 1) { customerResults.style.display = 'none'; return; }
            const matches = allCustomers.filter(c => 
                (c.name && c.name.toLowerCase().includes(q)) || 
                (c.phone && c.phone.includes(q))
            ).slice(0, 8);
            if (matches.length > 0) {
                customerResults.innerHTML = matches.map(c => `
                    <div class="search-item" data-id="${c.id || c._id}" style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div class="name">${c.name}</div>
                            <div class="meta">${c.phone || ''} ${c.debt > 0 ? '| <b style="color:#dc2626;">Nợ: ' + (c.debt||0).toLocaleString() + 'đ</b>' : ''}</div>
                        </div>
                    </div>
                `).join('');
                customerResults.style.display = 'block';
                customerResults.querySelectorAll('.search-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const cid = item.getAttribute('data-id');
                        const customer = allCustomers.find(c => (c.id || c._id) == cid);
                        selectCustomer(customer);
                    });
                });
            } else {
                customerResults.innerHTML = '<div style="padding: 16px; color: var(--text-muted); font-size: 13px;">Không tìm thấy khách hàng</div>';
                customerResults.style.display = 'block';
            }
        });

        function selectCustomer(customer) {
            selectedCustomer = customer;
            customerSearch.value = customer.name + (customer.phone ? ' - ' + customer.phone : '');
            customerResults.style.display = 'none';
            clearCustomerBtn.style.display = 'block';
            // Show customer info box
            const infoBox = document.getElementById('pos-customer-info');
            const nameDisplay = document.getElementById('pos-customer-name-display');
            const debtDisplay = document.getElementById('pos-customer-debt-display');
            if (infoBox) {
                nameDisplay.textContent = '👤 ' + customer.name;
                debtDisplay.textContent = customer.debt > 0 ? 'Công nợ hiện tại: ' + (customer.debt||0).toLocaleString() + 'đ' : 'Không có công nợ';
                debtDisplay.style.color = customer.debt > 0 ? '#dc2626' : '#16a34a';
                infoBox.style.display = 'block';
            }
        }

        if (clearCustomerBtn) {
            clearCustomerBtn.addEventListener('click', () => {
                selectedCustomer = null;
                customerSearch.value = '';
                clearCustomerBtn.style.display = 'none';
                const infoBox = document.getElementById('pos-customer-info');
                if (infoBox) infoBox.style.display = 'none';
            });
        }

        document.addEventListener('click', (e) => {
            if (!customerSearch?.contains(e.target) && !customerResults?.contains(e.target)) {
                customerResults.style.display = 'none';
            }
        });

        // ===== PAYMENT METHOD TOGGLE =====
        const btnCash = document.getElementById('pos-pay-cash');
        const btnTransfer = document.getElementById('pos-pay-transfer');
        const btnCredit = document.getElementById('pos-pay-credit');
        const cashSection = document.getElementById('pos-cash-section');
        const creditSection = document.getElementById('pos-credit-section');
        const payMethodInput = document.getElementById('pos-payment-method');

        function setPaymentMethod(method) {
            paymentMethod = method;
            payMethodInput.value = method;
            // Reset all buttons
            [btnCash, btnTransfer, btnCredit].forEach(b => { if(b) b.classList.remove('active'); });
            const activeBtn = method === 'cash' ? btnCash : method === 'transfer' ? btnTransfer : btnCredit;
            if (activeBtn) activeBtn.classList.add('active');
            // Toggle credit UI
            if (cashSection) cashSection.style.display = method === 'credit' ? 'none' : 'block';
            if (creditSection) creditSection.style.display = method === 'credit' ? 'block' : 'none';
            updateChange();
        }

        if (btnCash) btnCash.addEventListener('click', () => setPaymentMethod('cash'));
        if (btnTransfer) btnTransfer.addEventListener('click', () => setPaymentMethod('transfer'));
        if (btnCredit) btnCredit.addEventListener('click', () => { 
            if (!selectedCustomer) { alert('Vui lòng chọn khách hàng trước khi ghi nợ!'); return; }
            setPaymentMethod('credit'); 
        });
        setPaymentMethod('cash'); // default

        function addToCart(product) {
            const existing = cart.find(item => item.id === product.id);
            if (existing) { existing.quantity += 1; } else { cart.push({ ...product, quantity: 1 }); }
            renderCart();
        }

        function renderCart() {
            const emptyMsg = document.getElementById('empty-cart-msg');
            const cartTable = document.getElementById('cart-table');
            if (cart.length === 0) {
                cartItems.innerHTML = ''; emptyMsg.style.display = 'block'; if (cartTable) cartTable.style.display = 'none';
            } else {
                emptyMsg.style.display = 'none'; if (cartTable) cartTable.style.display = 'table';
                cartItems.innerHTML = cart.map((item, index) => `
                    <tr><td><div style="font-weight: 600;">${item.name}</div><div style="font-size: 12px; color: var(--text-muted);">${item.sku}</div></td><td>${item.unit || 'Cái'}</td><td>${item.selling_price.toLocaleString()}đ</td><td align="center"><input type="number" value="${item.quantity}" min="1" class="qty-input form-control" style="width: 80px; text-align: center; padding: 6px; margin: 0; display: inline-block;" data-index="${index}"></td><td style="font-weight: 700;">${(item.selling_price * item.quantity).toLocaleString()}đ</td><td><button class="btn-icon text-danger btn-remove" data-index="${index}"><i data-lucide="trash-2"></i></button></td></tr>
                `).join('');
                if (window.lucide) {
                    lucide.createIcons();
                    document.querySelectorAll('svg[data-lucide]').forEach(el => el.removeAttribute('data-lucide'));
                }
            }
            updateTotals();
            document.querySelectorAll('.qty-input').forEach(input => { input.addEventListener('change', (e) => { const idx = e.target.getAttribute('data-index'); cart[idx].quantity = parseInt(e.target.value); renderCart(); }); });
            document.querySelectorAll('.btn-remove').forEach(btn => { btn.addEventListener('click', () => { cart.splice(btn.getAttribute('data-index'), 1); renderCart(); }); });
        }

        function updateTotals() {
            const subtotal = cart.reduce((sum, item) => sum + (Number(item.selling_price) * Number(item.quantity)), 0);
            const discount = parseInt(document.getElementById('discount').value) || 0;
            currentTotal = subtotal - discount;
            
            document.getElementById('sub-total').innerText = subtotal.toLocaleString() + 'đ';
            document.getElementById('final-total').innerText = currentTotal.toLocaleString() + 'đ';
            updateChange();
        }

        function updateChange() {
            if (paymentMethod === 'credit') {
                const creditPaidEl = document.getElementById('customer-credit-paid');
                const cash = parseInt(creditPaidEl?.value) || 0;
                const remaining = currentTotal - cash;
                const debtEl = document.getElementById('pos-remaining-debt');
                if (debtEl) debtEl.textContent = (remaining > 0 ? remaining : 0).toLocaleString() + 'đ';
            } else {
                const cashEl = document.getElementById('customer-cash');
                const cash = parseInt(cashEl?.value) || 0;
                const change = cash - currentTotal;
                document.getElementById('change-text').innerText = (change > 0 ? change.toLocaleString() : '0') + 'đ';
            }
        }

        document.getElementById('discount').addEventListener('input', updateTotals);
        document.addEventListener('input', (e) => { 
            if (e.target.id === 'customer-cash' || e.target.id === 'customer-credit-paid') {
                updateChange(); 
            }
        });

        document.getElementById('btn-checkout').addEventListener('click', async () => {
            if (cart.length === 0) { alert('Vui lòng chọn sản phẩm!'); return; }
            
            const paid = paymentMethod === 'credit'
                ? (parseInt(document.getElementById('customer-credit-paid')?.value) || 0)
                : (parseInt(document.getElementById('customer-cash')?.value) || 0);
            
            if (paymentMethod === 'cash' && paid < currentTotal) { 
                alert('Khách đưa chưa đủ tiền!'); return; 
            }
            if (paymentMethod === 'credit' && !selectedCustomer) {
                alert('Ghi nợ cần chọn khách hàng!'); return;
            }
            
            try {
                const orderNote = document.getElementById('pos-note')?.value || '';
                const res = await fetch('/api/sales/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        order: { 
                            customer_id: selectedCustomer?.id || selectedCustomer?._id || null,
                            total_amount: cart.reduce((sum, item) => sum + (Number(item.selling_price) * Number(item.quantity)), 0), 
                            discount: parseInt(document.getElementById('discount').value) || 0, 
                            final_amount: currentTotal, 
                            paid_amount: paid, 
                            change_amount: paymentMethod === 'credit' ? 0 : Math.max(0, paid - currentTotal), 
                            payment_method: paymentMethod,
                            status: 'completed',
                            user_id: JSON.parse(localStorage.getItem('user'))?.id,
                            note: orderNote
                        }, 
                        items: cart 
                    })
                });
                const result = await res.json();
                if (result.success) { 
                    const msg = paymentMethod === 'credit' 
                        ? `Ghi nợ thành công! Nợ còn lại: ${(currentTotal - paid).toLocaleString()}đ`
                        : 'Thanh toán thành công!';
                    alert(msg); 
                    // Print invoice automatically
                    if (paymentMethod !== 'credit') window.printInvoice(result.saleId);
                    cart = []; 
                    renderCart(); 
                    document.getElementById('customer-cash').value = ''; 
                    const creditPaidEl = document.getElementById('customer-credit-paid');
                    if (creditPaidEl) creditPaidEl.value = '';
                    document.getElementById('discount').value = '0';
                    if (document.getElementById('pos-note')) document.getElementById('pos-note').value = '';
                    // Reset customer
                    selectedCustomer = null;
                    if (customerSearch) customerSearch.value = '';
                    if (clearCustomerBtn) clearCustomerBtn.style.display = 'none';
                    const infoBox = document.getElementById('pos-customer-info');
                    if (infoBox) infoBox.style.display = 'none';
                    setPaymentMethod('cash');
                } else { 
                    alert('Lỗi: ' + result.error); 
                }
            } catch (err) { 
                console.error(err); 
                alert('Lỗi hệ thống!'); 
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!document.querySelector('.pos-view')) return; // Only when POS page is active
            if (e.key === 'F8') { e.preventDefault(); document.getElementById('customer-cash')?.focus(); }
            if (e.key === 'F16' || (e.key === 'F10' && !e.shiftKey)) { e.preventDefault(); document.getElementById('btn-checkout')?.click(); }
        });
    }

    function setupSupplierActions() {
        const btn = document.getElementById('btn-add-supplier');
        if (!btn) return;
        btn.onclick = () => {
            showModal('Thêm nhà cung cấp mới', `
                <form>
                    <div class="mb-3"><label>Tên nhà cung cấp</label><input type="text" name="name" class="form-control" required></div>
                    <div class="mb-3"><label>Số điện thoại</label><input type="text" name="phone" class="form-control"></div>
                    <div class="mb-3"><label>Email</label><input type="email" name="email" class="form-control"></div>
                    <div class="mb-3"><label>Địa chỉ</label><input type="text" name="address" class="form-control"></div>
                    <div class="mb-3"><label>Mặt hàng cung cấp</label><input type="text" name="supply_items" class="form-control"></div>
                    <div class="mb-3"><label>Ghi chú</label><textarea name="note" class="form-control"></textarea></div>
                    <button type="submit" class="btn btn-primary btn-block">LƯU NHÀ CUNG CẤP</button>
                </form>
            `, async (data) => {
                const res = await fetch('/api/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                if (res.ok) { alert('Thành công!'); loadSuppliers(); return true; }
            });
        };
    }

    function setupStockInActions() {
        const btn = document.getElementById('btn-new-purchase');
        if (!btn) return;
        btn.onclick = async () => {
            const suppliers = await (await fetch('/api/suppliers')).json();
            const categories = await (await fetch('/api/categories')).json();
            const modal = showModal('Tạo phiếu nhập hàng', `
                <div class="stock-in-form">
                    <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                        <div class="form-group">
                            <label style="font-weight: 700; color: var(--text-muted); font-size: 11px; text-transform: uppercase;">Nhà cung cấp</label>
                            <select id="po-supplier" class="form-control">
                                ${suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="font-weight: 700; color: var(--text-muted); font-size: 11px; text-transform: uppercase;">Ghi chú phiếu nhập</label>
                            <input type="text" id="po-note" class="form-control" placeholder="Tên lô hàng, ghi chú...">
                        </div>
                    </div>
                    
                    <div class="search-section" style="position: relative; margin-bottom: 32px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <label style="font-weight: 700; color: var(--text-muted); font-size: 11px; text-transform: uppercase;">Tìm sản phẩm cần nhập</label>
                            <button id="btn-quick-add-sp" class="btn" style="padding: 4px 12px; font-size: 12px; border: 1px dashed var(--primary-color); color: var(--primary-color); background: #fff7ed; border-radius: 20px;">
                                <i data-lucide="plus"></i> Thêm SP mới
                            </button>
                        </div>
                         <div style="position: relative;">
                            <i data-lucide="search" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                            <input type="text" id="po-product-search" class="form-control" placeholder="Gõ tên sản phẩm, mã SKU..." style="padding-left: 45px; border-radius: 40px; margin: 0;">
                        </div>
                        <div id="po-search-results" class="search-results"></div>
                    </div>

                    <div id="quick-product-box" class="quick-product-box">
                        <h4><i class="fas fa-box-open"></i> THÊM NHANH SẢN PHẨM MỚI</h4>
                        <div class="form-row">
                            <div class="mb-3"><label>Tên sản phẩm</label><input type="text" id="q-name" class="form-control"></div>
                            <div class="mb-3"><label>Mã SKU</label><input type="text" id="q-sku" class="form-control"></div>
                        </div>
                        <div class="form-row">
                            <div class="mb-3"><label>Danh mục</label>
                                <select id="q-cat" class="form-control">
                                    ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="mb-3"><label>ĐVT</label><input type="text" id="q-unit" class="form-control" value="Cái"></div>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button id="btn-save-quick-sp" class="btn btn-primary" style="flex: 2;">LƯU VÀ THÊM VÀO PHIẾU</button>
                            <button id="btn-cancel-quick-sp" class="btn" style="flex: 1; background: #f1f5f9;">HỦY</button>
                        </div>
                    </div>

                    <div style="max-height: 400px; overflow-y: auto; background: white; border-radius: 12px; border: 1px solid var(--border-color);">
                        <table class="data-table" style="margin: 0; width: 100%;">
                            <thead style="position: sticky; top: 0; z-index: 10; background: #fcfcfc;">
                                <tr>
                                    <th style="width: 40%;">Sản phẩm</th>
                                    <th style="width: 20%; text-align: center;">Giá nhập</th>
                                    <th style="width: 15%; text-align: center;">Số lượng</th>
                                    <th style="width: 20%; text-align: right;">Thành tiền</th>
                                    <th style="width: 5%; text-align: center;"></th>
                                </tr>
                            </thead>
                            <tbody id="po-items"></tbody>
                        </table>
                    </div>

                    <div class="po-total-display">
                        <div class="po-total-label">Tổng tiền nhập hàng</div>
                        <div class="po-total-value" id="po-total">0đ</div>
                    </div>

                    <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 16px; padding: 20px; margin-top: 16px;">
                        <div class="form-row" style="margin-bottom: 12px;">
                            <div class="mb-3">
                                <label style="font-weight: 700; color: var(--text-muted); font-size: 11px; text-transform: uppercase;">Đã thanh toán NCC</label>
                                <input type="number" id="po-paid-amount" class="form-control" placeholder="0 = nợ toàn bộ" style="font-size: 18px; font-weight: 700; text-align: right; background: white; border-color: #fb923c;">
                            </div>
                            <div class="mb-3" id="po-debt-display" style="display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: 16px;">
                                <label style="font-weight: 700; color: var(--text-muted); font-size: 11px; text-transform: uppercase;"><span class="debt-label">Còn nợ NCC:</span></label>
                                <div id="po-debt-value" style="font-size: 24px; font-weight: 900; color: #ef4444;">0đ</div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 24px;">
                        <button class="checkout-btn" id="btn-save-po">LƯU PHIẾU NHẬP</button>
                    </div>
                </div>
            `, async () => false, 'modal-lg');

            const searchInput = document.getElementById('po-product-search');
            const resultsDiv = document.getElementById('po-search-results');
            const itemsTable = document.getElementById('po-items');
            const totalText = document.getElementById('po-total');
            const quickBox = document.getElementById('quick-product-box');
            let poItems = [];

            // Quick Add SP Logic
            document.getElementById('btn-quick-add-sp').onclick = () => {
                quickBox.style.display = 'block';
                document.getElementById('q-name').value = searchInput.value;
                document.getElementById('q-name').focus();
            };
            document.getElementById('btn-cancel-quick-sp').onclick = () => quickBox.style.display = 'none';
            document.getElementById('btn-save-quick-sp').onclick = async () => {
                const name = document.getElementById('q-name').value;
                const sku = document.getElementById('q-sku').value;
                const category_id = document.getElementById('q-cat').value;
                const unit = document.getElementById('q-unit').value;

                if (!name || !sku) { alert('Vui lòng nhập tên và mã SKU!'); return; }

                try {
                    const res = await fetch('/api/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, sku, category_id, unit, selling_price: 0, stock_quantity: 0 })
                    });
                    const newProd = await res.json();
                    if (res.ok) {
                        poItems.push({ 
                            product_id: newProd.id, 
                            name: newProd.name, 
                            cost_price: 0, 
                            quantity: 1 
                        });
                        renderPoItems();
                        quickBox.style.display = 'none';
                        searchInput.value = '';
                    }
                } catch (err) { alert('Lỗi khi thêm sản phẩm nhanh'); }
            };

            searchInput.addEventListener('input', async (e) => {
                const query = e.target.value.trim();
                if (query.length < 2) { resultsDiv.style.display = 'none'; return; }
                const products = await (await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)).json();
                resultsDiv.innerHTML = products.map(p => `
                    <div class="search-item" data-id="${p.id}">
                        <div class="name">${p.name}</div>
                        <div class="meta">${p.sku} | Tồn hiện tại: ${p.stock_quantity} ${p.unit}</div>
                    </div>`).join('');
                resultsDiv.style.display = 'block';
                
                resultsDiv.querySelectorAll('.search-item').forEach(item => {
                    item.onclick = () => {
                        const product = products.find(p => p.id == item.dataset.id);
                        const existing = poItems.find(i => i.product_id == product.id);
                        if (existing) {
                            existing.quantity++;
                        } else {
                            poItems.push({ 
                                product_id: product.id, 
                                name: product.name, 
                                cost_price: parseFloat(product.cost_price) || 0, 
                                quantity: 1 
                            });
                        }
                        renderPoItems();
                        resultsDiv.style.display = 'none';
                        searchInput.value = '';
                    };
                });
            });

            // Real-time debt calculation helper
            function updateDebtIndicator() {
                const total = poItems.reduce((acc, i) => acc + (Number(i.cost_price) * Number(i.quantity)), 0);
                totalText.innerText = total.toLocaleString() + 'đ';
                const paidInput = document.getElementById('po-paid-amount');
                const debtDisplay = document.getElementById('po-debt-display');
                const debtValue = document.getElementById('po-debt-value');
                if (!paidInput || !debtDisplay || !debtValue) return;
                const paid = Number(paidInput.value) || 0;
                const debt = Math.max(0, total - paid);
                debtValue.innerText = debt.toLocaleString() + 'đ';
                debtDisplay.style.color = debt > 0 ? '#ef4444' : '#22c55e';
                debtDisplay.querySelector('span.debt-label').innerText = debt > 0 ? 'Còn nợ NCC:' : 'Thanh toán đủ:';
            }

            function renderPoItems() {
                itemsTable.innerHTML = poItems.length === 0 
                  ? '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted); opacity: 0.5;">Chưa có sản phẩm nào được chọn</td></tr>'
                  : poItems.map((item, idx) => `
                    <tr>
                        <td style="font-weight: 600;">${item.name}</td>
                        <td style="text-align: center;"><input type="number" class="po-input po-cost" data-idx="${idx}" value="${item.cost_price}"></td>
                        <td style="text-align: center;"><input type="number" class="po-input po-qty" data-idx="${idx}" value="${item.quantity}"></td>
                        <td style="text-align: right; font-weight: 700; color: var(--text-main);">${(Number(item.cost_price) * Number(item.quantity)).toLocaleString()}đ</td>
                        <td style="text-align: center;"><button class="btn-remove" onclick="poItems.splice(${idx}, 1); renderPoItems();"><i class="fas fa-times"></i></button></td>
                    </tr>
                `).join('');

                updateDebtIndicator();
                
                itemsTable.querySelectorAll('.po-cost').forEach(inp => inp.onchange = (e) => { 
                    poItems[e.target.dataset.idx].cost_price = parseFloat(e.target.value) || 0; 
                    renderPoItems(); 
                });
                itemsTable.querySelectorAll('.po-qty').forEach(inp => inp.onchange = (e) => { 
                    poItems[e.target.dataset.idx].quantity = parseInt(e.target.value) || 0; 
                    renderPoItems(); 
                });

                // Bind paid_amount input to live recalculate
                const paidInput = document.getElementById('po-paid-amount');
                if (paidInput) paidInput.oninput = () => updateDebtIndicator();
            }

            document.getElementById('btn-save-po').onclick = async () => {
                if (poItems.length === 0) { alert('Chưa có mặt hàng nào!'); return; }
                const supplier_id = document.getElementById('po-supplier').value;
                const note = document.getElementById('po-note').value;
                const total_amount = poItems.reduce((acc, i) => acc + (Number(i.cost_price) * Number(i.quantity)), 0);
                const paid_amount = Number(document.getElementById('po-paid-amount')?.value) || 0;
                
                try {
                    const res = await fetch('/api/purchases', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            purchaseData: { supplier_id, user_id: JSON.parse(localStorage.getItem('user'))?.id, total_amount, paid_amount, note },
                            items: poItems
                        })
                    });
                    if (res.ok) { 
                        alert('Đã nhập hàng thành công!'); 
                        modal.style.display = 'none'; 
                        if (typeof loadPurchases === 'function') loadPurchases();
                        if (typeof loadSuppliers === 'function') loadSuppliers();
                        if (currentPage === 'products') loadProducts();
                    } else {
                        const err = await res.json();
                        alert('Lỗi: ' + (err.message || err.error));
                    }
                } catch (err) {
                    console.error(err);
                    alert('Lỗi hệ thống khi lưu phiếu nhập!');
                }
            };
        };
    }


    // --- Pagination Helper ---
    window.adminDataCache = window.adminDataCache || {};
    window.adminPage = window.adminPage || {};
    function paginateAdminTable(key, data, listElement, renderRowFn) {
        window.adminDataCache[key] = data;
        window.adminPage[key] = window.adminPage[key] || 1;
        const limit = 10;
        
        const render = () => {
            const page = window.adminPage[key];
            const startIdx = (page - 1) * limit;
            const paginated = data.slice(startIdx, startIdx + limit);
            
            if (paginated.length === 0) {
                listElement.innerHTML = '<tr><td colspan="10" class="text-center text-muted" style="padding:20px;">Không có dữ liệu</td></tr>';
            } else {
                listElement.innerHTML = paginated.map(renderRowFn).join('');
            }
            
            let wrapper = listElement.closest('.table-container') || listElement.closest('.table-responsive') || listElement.closest('.card');
            if (wrapper) {
                let pageContainer = wrapper.nextElementSibling;
                if (!pageContainer || !pageContainer.classList.contains('admin-pagination-container')) {
                    pageContainer = document.createElement('div');
                    pageContainer.className = 'admin-pagination-container pagination';
                    pageContainer.style.justifyContent = 'flex-end';
                    pageContainer.style.marginTop = '16px';
                    wrapper.parentNode.insertBefore(pageContainer, wrapper.nextSibling);
                }
                if (window.renderPagination) {
                    window.renderPagination(data.length, limit, page, pageContainer, (newPage) => {
                        window.adminPage[key] = newPage;
                        render();
                    });
                }
            }
            
            if (window.lucide) {
                lucide.createIcons();
                document.querySelectorAll('svg[data-lucide]').forEach(el => el.removeAttribute('data-lucide'));
            }
        };
        render();
    }
    // -------------------------

    async function loadProducts() {
        try {
            const res = await fetch('/api/products');
            const products = await res.json();
            const list = document.getElementById('products-list');
            if (list) {
                paginateAdminTable('products', products, list, (p) => {
                    const threshold = p.min_stock || 5;
                    let stockClass = 'badge-success';
                    let stockText = 'Còn hàng';

                    if (p.stock_quantity <= 0) {
                        stockClass = 'badge-danger';
                        stockText = 'Hết hàng';
                    } else if (p.stock_quantity <= threshold) {
                        stockClass = 'badge-warning';
                        stockText = 'Sắp hết';
                    }

                    return `
                        <tr data-id="${p.id}">
                            <td style="width: 60px;">
                                ${p.images && p.images.length > 0 ? `<img src="${p.images[0]}" alt="${p.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">` : '<div style="width: 48px; height: 48px; background: #f1f5f9; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #cbd5e1;"><i data-lucide="image"></i></div>'}
                            </td>
                            <td>${p.sku || '---'}</td>
                            <td style="font-weight: 600;">${p.name}</td>
                            <td><span class="badge badge-info">${p.category_name || 'Khác'}</span></td>
                            <td style="font-weight: 700;">${p.selling_price.toLocaleString()}đ</td>
                            <td><span class="badge ${stockClass}">${p.stock_quantity} ${p.unit} - ${stockText}</span></td>
                            <td class="text-right" style="white-space: nowrap;">
                                <button class="btn-icon text-primary"><i data-lucide="pen-line"></i></button>
                                <button class="btn-icon text-info btn-adjust-stock" title="Điều chỉnh kho"><i data-lucide="refresh-cw"></i></button>
                                ${user?.role === 'admin' ? '<button class="btn-icon text-danger"><i data-lucide="trash-2"></i></button>' : ''}
                            </td>
                        </tr>
                    `;
                });
            }
        } catch (err) { console.error(err); }
    }

    async function loadCategories() {
        try {
            const res = await fetch('/api/categories');
            const categories = await res.json();
            const list = document.getElementById('categories-list');
            if (list) {
                paginateAdminTable('categories', categories, list, (c) => {
                    return `<tr data-id="${c.id}">
                    <td>${c.name}</td>
                    <td>${c.description || '-'}</td>
                    <td class="text-right">
                        <button class="btn-icon text-primary"><i data-lucide="pen-line"></i></button>
                        ${user?.role === 'admin' ? '<button class="btn-icon text-danger"><i data-lucide="trash-2"></i></button>' : ''}
                    </td>
                </tr>`;
                });
            }
        } catch (err) { console.error(err); }
    }

    async function loadCustomers() {
        try {
            const res = await fetch('/api/customers');
            let data = await res.json();
            
            // Áp dụng bộ lọc khách nợ
            const filter = document.getElementById('customer-debt-filter');
            if (filter && filter.value === 'debt') {
                data = data.filter(c => c.debt > 0);
            }

            const list = document.getElementById('customers-list');
            if (list) {
                paginateAdminTable('customers', data, list, (c) => {
                    const hasDebt = c.debt > 0;
                    const debtBtn = hasDebt 
                        ? `<button class="btn-icon btn-view-debt" style="color:#ea580c; background:#fff7ed;" title="Xem lịch sử nợ"><i data-lucide="history"></i></button>`
                        : `<button class="btn-icon text-muted btn-view-debt" title="Lịch sử mua hàng"><i data-lucide="history"></i></button>`;
                    const debtDisplay = hasDebt
                        ? `<div style="display:flex; align-items:center; gap:6px;">
                            <span style="background:#fef3c7; color:#b45309; padding:3px 10px; border-radius:20px; font-weight:700; font-size:13px; border: 1px solid #fde68a;">
                                <i class="fas fa-exclamation-circle" style="font-size:11px;"></i> ${(c.debt).toLocaleString()}đ
                            </span>
                           </div>`
                        : `<span style="color:#94a3b8; font-size:13px;">Không nợ</span>`;
                    const rowStyle = hasDebt ? 'background: #fffbeb;' : '';
                    return `<tr data-id="${c.id}" style="${rowStyle}">
                        <td style="font-weight:${hasDebt ? '700' : '500'};">${c.name}${hasDebt ? ' <i class="fas fa-circle" style="font-size:6px; color:#f59e0b; vertical-align:middle;"></i>' : ''}</td>
                        <td>${c.phone || '---'}</td>
                        <td>${c.address || '---'}</td>
                        <td>${debtDisplay}</td>
                        <td class="text-right">${debtBtn}<button class="btn-icon text-primary"><i data-lucide="pen-line"></i></button>${user?.role === 'admin' ? '<button class="btn-icon text-danger"><i data-lucide="trash-2"></i></button>' : ''}</td>
                    </tr>`;
                });
            }
        } catch (err) { console.error(err); }
    }

    async function loadPurchases() {
        const list = document.getElementById('purchases-list');
        if (!list) return;
        try {
            const res = await fetch('/api/purchases');
            const data = await res.json();
            paginateAdminTable('purchases', data, list, (p) => {
                    const paid = Number(p.paid_amount) || 0;
                const balance = Number(p.balance_amount) || 0;
                const debtBadge = balance > 0 
                    ? `<span class="badge" style="background:#fef2f2;color:#ef4444;border-radius:8px;">Nợ: ${balance.toLocaleString()}đ</span>`
                    : `<span class="badge badge-success" style="border-radius:8px;">Đã trả đủ</span>`;
                return `
                <tr data-id="${p.id}">
                    <td>${new Date(p.order_date).toLocaleDateString('vi-VN')}</td>
                    <td>${p.supplier_name || 'N/A'}</td>
                    <td style="font-weight: 700;">${Number(p.total_amount).toLocaleString()}đ</td>
                    <td style="color: #22c55e; font-weight: 600;">${paid.toLocaleString()}đ</td>
                    <td>${debtBadge}</td>
                    <td>${p.user_name || 'Admin'}</td>
                    <td>${p.note || ''}</td>
                    <td class="text-right">
                        <button class="btn-icon text-primary"><i data-lucide="eye"></i></button>
                    </td>
                </tr>`;
                });
            
        } catch (err) { console.error(err); }
    }

    async function loadSuppliers() {
        const list = document.getElementById('suppliers-list');
        if (!list) return;
        try {
            const res = await fetch('/api/suppliers');
            const data = await res.json();
            paginateAdminTable('suppliers', data, list, (s) => {
                    const debt = Number(s.debt) || 0;
                const debtBadge = debt > 0
                    ? `<span class="badge" style="background:#fef2f2;color:#ef4444;border-radius:8px;font-weight:700;">${debt.toLocaleString()}đ</span>`
                    : `<span class="badge badge-success" style="border-radius:8px;">Không nợ</span>`;
                return `
                <tr data-id="${s.id}">
                    <td style="font-weight: 600;">${s.name}</td>
                    <td>${s.phone || '---'}</td>
                    <td>${s.address || '---'}</td>
                    <td>${s.supply_items || '---'}</td>
                    <td>${debtBadge}</td>
                    <td class="text-right" style="white-space: nowrap;">
                        <button class="btn-icon text-success btn-pay-debt" title="Trả nợ"><i data-lucide="hand-coins"></i></button>
                        <button class="btn-icon text-primary"><i data-lucide="pen-line"></i></button>
                        ${user?.role === 'admin' ? '<button class="btn-icon text-danger"><i data-lucide="trash-2"></i></button>' : ''}
                    </td>
                </tr>
            `;
                });
            
        } catch (err) { console.error(err); }
    }

    async function loadSalesHistory() {
        const list = document.getElementById('sales-list');
        if (!list) return;
        try {
            const res = await fetch('/api/sales');
            const data = await res.json();
            window.allSalesData = data;
            
            const searchInput = document.getElementById('sale-search');
            if (searchInput) {
                applySalesFilters();
            } else {
                renderSalesHistory(data);
            }
        } catch (err) { console.error(err); }
    }

    function renderSalesHistory(salesData) {
        const list = document.getElementById('sales-list');
        if (!list) return;
        paginateAdminTable('sales', salesData, list, (s) => {
            let statusHtml = '';
            if (s.status === 'completed') statusHtml = '<span class="sale-badge badge-done">Hoàn thành</span>';
            else if (s.status === 'cancelled') statusHtml = '<span class="sale-badge badge-cancel">Đã hủy</span>';
            else if (s.status === 'delivering') statusHtml = '<span class="sale-badge badge-delivering" style="background:#e0e7ff; color:#4338ca; padding:4px 8px; border-radius:100px; font-size:11px; font-weight:700;">Đang giao</span>';
            else statusHtml = '<span class="sale-badge badge-pending">Chờ xử lý</span>';
            
            const pmIconMap = { 
                cash: '<i data-lucide="banknote" style="width:13px;height:13px;"></i> Tiền mặt', 
                transfer: '<i data-lucide="credit-card" style="width:13px;height:13px;"></i> Chuyển khoản', 
                credit: '<i data-lucide="notebook-pen" style="width:13px;height:13px;"></i> Ghi nợ' 
            };
            const pmHtml = `<span style="display:inline-flex; align-items:center; gap:4px; font-size:12px; color:var(--text-muted); font-weight:500;">${pmIconMap[s.payment_method] || 'Tiền mặt'}</span>`;
            const hasDebt = s.payment_method === 'credit' && s.paid_amount < s.final_amount;
            const debtAmt = hasDebt ? (s.final_amount - s.paid_amount) : 0;
            const rowStyle = hasDebt ? 'background:#fffbeb;' : '';

            return `
            <tr data-id="${s.id}" style="${rowStyle}">
                <td><span style="font-weight: 700; color: var(--primary-color);">#HD${s.id.slice(-8).toUpperCase()}</span></td>
                <td>${new Date(s.order_date).toLocaleString('vi-VN')}</td>
                <td>${s.customer_name || 'Khách lẻ'}</td>
                <td style="font-weight: 700;">${s.final_amount.toLocaleString()}đ</td>
                <td>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        ${pmHtml}
                        <div style="display:flex; align-items:center; gap:6px;">
                            ${statusHtml}
                            ${hasDebt ? `<span style="background:#fef2f2;color:#dc2626;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;">Nợ ${debtAmt.toLocaleString()}đ</span>` : ''}
                        </div>
                    </div>
                </td>
                <td style="text-align:center;">
                    ${s.status === 'pending' ? `<button class="btn-icon" style="color:#4f46e5;" onclick="window.updateOrderStatus('${s.id}', 'delivering', event)" title="Đi giao hàng"><i data-lucide="truck"></i></button>` : ''}
                    ${s.status === 'delivering' ? `<button class="btn-icon" style="color:#22c55e;" onclick="window.updateOrderStatus('${s.id}', 'completed', event)" title="Đã giao & Nhận tiền"><i data-lucide="check-circle"></i></button>` : ''}
                    ${(s.status === 'pending' || s.status === 'delivering') ? `<button class="btn-icon" style="color:#ef4444;" onclick="window.updateOrderStatus('${s.id}', 'cancelled', event)" title="Hủy đơn"><i data-lucide="x-circle"></i></button>` : ''}
                    <button class="btn-icon text-primary" title="Xem chi tiết"><i data-lucide="eye"></i></button>
                    <button class="btn-icon" style="color:#6b7280;" onclick="window.printInvoice('${s.id}')" title="In hóa đơn"><i data-lucide="printer"></i></button>
                </td>
            </tr>
            `;
        });
    }

    function applySalesFilters() {
        if (!window.allSalesData) return;
        const searchInput = document.getElementById('sale-search');
        const statusFilter = document.getElementById('sale-status-filter');
        const paymentFilter = document.getElementById('sale-payment-filter');

        const searchVal = searchInput?.value.trim().toLowerCase() || '';
        const statusVal = statusFilter?.value || '';
        const paymentVal = paymentFilter?.value || '';

        const filtered = window.allSalesData.filter(s => {
            const hdId = `#HD${s.id.slice(-8).toUpperCase()}`.toLowerCase();
            const custName = (s.customer_name || 'Khách lẻ').toLowerCase();
            const matchesSearch = searchVal === '' || hdId.includes(searchVal) || custName.includes(searchVal);
            
            const matchesStatus = statusVal === '' || s.status === statusVal;
            const matchesPayment = paymentVal === '' || s.payment_method === paymentVal;

            return matchesSearch && matchesStatus && matchesPayment;
        });

        window.adminPage['sales'] = 1;
        renderSalesHistory(filtered);
    }

    function setupSalesFilters() {
        const searchInput = document.getElementById('sale-search');
        const statusFilter = document.getElementById('sale-status-filter');
        const paymentFilter = document.getElementById('sale-payment-filter');

        searchInput?.addEventListener('input', applySalesFilters);
        statusFilter?.addEventListener('change', applySalesFilters);
        paymentFilter?.addEventListener('change', applySalesFilters);
    }

    async function loadInventoryLogs() {
        const list = document.getElementById('inventory-logs-list');
        if (!list) return;
        try {
            const res = await fetch('/api/inventory/logs');
            const data = await res.json();
            paginateAdminTable('inventory', data, list, (log) => {
                const typeText = log.type === 'in' ? 'Nhập hàng' : (log.type === 'out' ? 'Bán hàng' : 'Điều chỉnh');
                const typeClass = log.type === 'in' ? 'text-success' : (log.type === 'out' ? 'text-danger' : 'text-info');
                return `
                    <tr>
                        <td>${new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                        <td style="font-weight: 600;">${log.product_id?.name || 'Sản phẩm đã xóa'}</td>
                        <td class="${typeClass}">${typeText}</td>
                        <td style="font-weight: 700;">${log.quantity > 0 ? '+' : ''}${log.quantity}</td>
                        <td class="text-muted">${log.note || ''}</td>
                    </tr>
                `;
            });
        } catch (err) { console.error(err); }
    }

    async function loadReports(range = '7days') {
        try {
            const res = await fetch(`/api/reports/dashboard?range=${range}`);
            const data = await res.json();
            window.lastReportData = data;
            const bestTable = document.querySelector('#best-selling-table tbody');

            const slowTable = document.querySelector('#slow-moving-table tbody');
            const recentOrdersTable = document.querySelector('#recent-orders-table tbody');
            
            // Summary Cards
            if (document.getElementById('report-today-rev')) document.getElementById('report-today-rev').innerText = (data.today_revenue || 0).toLocaleString() + 'đ';
            if (document.getElementById('report-today-profit')) {
                const todayProfit = data.dailyStats?.find(s => s._id === new Date().toISOString().split('T')[0])?.profit || 0;
                document.getElementById('report-today-profit').innerText = todayProfit.toLocaleString() + 'đ';
            }
            if (document.getElementById('report-today-orders')) document.getElementById('report-today-orders').innerText = data.today_orders || 0;
            if (document.getElementById('report-low-stock')) document.getElementById('report-low-stock').innerText = data.low_stock_count || 0;
            
            // New status-based order counts
            if (document.getElementById('report-orders-completed')) document.getElementById('report-orders-completed').innerText = data.orders_completed || 0;
            if (document.getElementById('report-orders-pending')) document.getElementById('report-orders-pending').innerText = data.orders_pending || 0;
            if (document.getElementById('report-orders-cancelled')) document.getElementById('report-orders-cancelled').innerText = data.orders_cancelled || 0;
            if (document.getElementById('report-total-customers')) document.getElementById('report-total-customers').innerText = data.total_customers_count || 0;

            if (bestTable && data.bestSellers) {
                bestTable.innerHTML = data.bestSellers.length > 0 
                    ? data.bestSellers.map(b => `<tr><td>${b.name}</td><td style="font-weight:700; text-align:right;">${b.totalQty}</td></tr>`).join('')
                    : '<tr><td colspan="2" class="text-muted">Chưa có dữ liệu</td></tr>';
            }
            if (slowTable && data.highStock) {
                slowTable.innerHTML = data.highStock.length > 0
                    ? data.highStock.map(h => `<tr><td>${h.name}</td><td style="font-weight:700; text-align:right;">${h.stock_quantity}</td></tr>`).join('')
                    : '<tr><td colspan="2" class="text-muted">Kho đang trống</td></tr>';
            }
            if (recentOrdersTable && data.recentOrders) {
                recentOrdersTable.innerHTML = data.recentOrders.length > 0
                    ? data.recentOrders.map(o => `<tr><td>${o.customer_name}</td><td style="font-weight:700; text-align:right;">${o.final_amount.toLocaleString()}đ</td></tr>`).join('')
                    : '<tr><td colspan="2" class="text-muted">Chưa có đơn hàng</td></tr>';
            }

            // Render Chart
            const ctx = document.getElementById('revenueChart');
            if (ctx && data.dailyStats) {
                if (window.myChart) window.myChart.destroy();
                window.myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.dailyStats.map(s => {
                            if (range === 'month') {
                                const parts = s._id.split('-');
                                return `Tháng ${parts[1]}/${parts[0]}`;
                            } else {
                                const d = new Date(s._id);
                                return `${d.getDate()}/${d.getMonth() + 1}`;
                            }
                        }),
                        datasets: [
                            {
                                label: 'Doanh thu',
                                data: data.dailyStats.map(s => s.revenue),
                                borderColor: '#2563eb',
                                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                fill: true,
                                tension: 0.4
                            },
                            {
                                label: 'Lợi nhuận',
                                data: data.dailyStats.map(s => s.profit),
                                borderColor: '#22c55e',
                                backgroundColor: 'transparent',
                                borderDash: [5, 5],
                                tension: 0.4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'top' } },
                        scales: { y: { beginAtZero: true } }
                    }
                });
            }

            // Load customer debt report
            const debtTable = document.querySelector('#customer-debt-table tbody');
            const debtBadge = document.getElementById('report-total-debt-badge');
            if (debtTable) {
                try {
                    const custRes = await fetch('/api/customers');
                    const customers = await custRes.json();
                    const debtors = customers.filter(c => c.debt > 0).sort((a, b) => b.debt - a.debt);
                    const totalDebt = debtors.reduce((sum, c) => sum + c.debt, 0);
                    if (debtBadge) debtBadge.textContent = 'Tổng nợ: ' + totalDebt.toLocaleString() + 'đ';
                    if (debtors.length > 0) {
                        debtTable.innerHTML = debtors.map((c, idx) => `
                            <tr style="background: ${idx % 2 === 0 ? '#fffbeb' : '#fff'};">
                                <td style="font-weight:700;">${c.name}</td>
                                <td style="color:var(--text-muted);">${c.phone || '---'}</td>
                                <td style="font-weight:800; color:#dc2626; text-align:right;">${c.debt.toLocaleString()}đ</td>
                                <td style="text-align:center;"><span style="background:#fef2f2; color:#991b1b; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700;">Chưa trả</span></td>
                            </tr>
                        `).join('');
                    } else {
                        debtTable.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:24px; color:#22c55e; font-weight:600;"><i class="fas fa-check-circle"></i> Không có khách hàng nào còn nợ!</td></tr>';
                        if (debtBadge) { debtBadge.textContent = 'Không có nợ'; debtBadge.style.background = '#dcfce7'; debtBadge.style.color = '#166534'; }
                    }
                } catch(e) { console.error(e); }
            }

        } catch (err) { console.error(err); }
    }

    async function loadUsers() {
        const list = document.getElementById('users-list');
        if (!list) return;
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            paginateAdminTable('users', data, list, (u) => {
                    return `
                <tr data-id="${u.id}">
                    <td style="font-weight: 600;">${u.full_name}</td>
                    <td>${u.username}</td>
                    <td>${u.phone || ''}</td>
                    <td><span class="badge ${u.role === 'admin' ? 'badge-info' : 'badge-success'}">${u.role.toUpperCase()}</span></td>
                    <td><span class="badge ${u.status ? 'badge-success' : 'badge-warning'}">${u.status ? 'Hoạt động' : 'Khóa'}</span></td>
                    <td>
                        <button class="btn-icon text-primary"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon text-danger"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
                });
        } catch (err) { console.error(err); }
    }

    function setupAddUser() {
        showModal('Thêm nhân viên mới', `
            <form>
                <div class="mb-3"><label>Tên đăng nhập</label><input type="text" name="username" class="form-control" required></div>
                <div class="mb-3"><label>Mật khẩu</label><input type="password" name="password" class="form-control" required></div>
                <div class="mb-3"><label>Tên đầy đủ</label><input type="text" name="full_name" class="form-control" required></div>
                <div class="mb-3"><label>Số điện thoại</label><input type="tel" name="phone" class="form-control"></div>
                <div class="mb-3"><label>Quyền hạn</label>
                    <select name="role" class="form-control">
                        <option value="staff">Nhân viên</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary btn-block">LƯU NHÂN VIÊN</button>
            </form>
        `, async (data) => {
            const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (res.ok) { loadUsers(); return true; }
        });
    }

    // AI Chat
    const aiInput = document.getElementById('ai-input');
    const sendAiBtn = document.getElementById('send-ai');
    if (sendAiBtn) {
        sendAiBtn.onclick = async () => {
            const text = aiInput.value.trim();
            if (!text) return;
            addMessage(text, true);
            aiInput.value = '';
            try {
                const res = await fetch('/api/ai/query', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: text }) });
                const data = await res.json();
                addMessage(data.response);
            } catch (err) { addMessage('Lỗi kết nối.'); }
        };
    }
    function addMessage(text, isUser = false) {
        const chatMessages = document.getElementById('chat-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        msgDiv.innerText = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleAdjustStock(id) {
        const product = await (await fetch(`/api/products/${id}`)).json();
        showModal(`Điều chỉnh kho: ${product.name}`, `
            <form>
                <div class="mb-3">
                    <label>Tồn kho hiện tại: <strong>${product.stock_quantity}</strong></label>
                </div>
                <div class="mb-3">
                    <label>Số lượng thay đổi (+ để tăng, - để giảm)</label>
                    <input type="number" name="change_qty" class="form-control" required placeholder="Ví dụ: -5 hoặc 10">
                </div>
                <div class="mb-3">
                    <label>Lý do điều chỉnh</label>
                    <input type="text" name="note" class="form-control" required placeholder="Ví dụ: Hàng hỏng, Kiểm kho...">
                </div>
                <button type="submit" class="btn btn-primary btn-block">CẬP NHẬT KHO</button>
            </form>
        `, async (data) => {
            const res = await fetch('/api/inventory/adjust', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: id, ...data })
            });
            if (res.ok) { loadProducts(); return true; }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.onclick = () => { 
        localStorage.removeItem('user'); 
        localStorage.removeItem('customer');
        window.location.href = '/login'; 
    };

    async function handlePaySupplierDebt(id) {
        const suppliers = await (await fetch('/api/suppliers')).json();
        const s = suppliers.find(item => item.id === id);
        const debt = Number(s.debt) || 0;

        if (debt <= 0) {
            alert('Nhà cung cấp này không có nợ!');
            return;
        }

        showModal(`Trả nợ NCC: ${s.name}`, `
            <form>
                <div class="mb-3">
                    <label>Tổng nợ hiện tại: <strong style="color:var(--danger-color); font-size: 1.2rem;">${debt.toLocaleString()}đ</strong></label>
                </div>
                <div class="mb-3">
                    <label>Số tiền thanh toán</label>
                    <input type="number" name="amount" class="form-control" required value="${debt}" max="${debt}">
                </div>
                <div class="mb-3">
                    <label>Phương thức</label>
                    <select name="payment_method" class="form-control">
                        <option value="cash">Tiền mặt</option>
                        <option value="transfer">Chuyển khoản</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label>Ghi chú</label>
                    <input type="text" name="note" class="form-control" placeholder="Trả nợ nhập hàng ngày...">
                </div>
                <button type="submit" class="btn btn-success btn-block">XÁC NHẬN TRẢ NỢ</button>
            </form>
        `, async (data) => {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await fetch('/api/supplier-payments/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ supplier_id: id, user_id: user?.id, ...data })
            });
            if (res.ok) { loadSuppliers(); return true; }
            else { const err = await res.json(); alert('Lỗi: ' + err.error); return false; }
        });
    }

    async function handleViewDebt(customerId) {
        try {
            const customerRes = await fetch(`/api/customers/${customerId}`);
            if (!customerRes.ok) throw new Error('Không thể tải thông tin khách hàng');
            const customer = await customerRes.json();

            const salesRes = await fetch(`/api/sales/customer/${customerId}`);
            if (!salesRes.ok) throw new Error('Không thể tải lịch sử giao dịch');
            const sales = await salesRes.json();

            const salesHtml = sales.length === 0 
                ? `<tr><td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted); opacity: 0.5;">Không có lịch sử giao dịch nào</td></tr>`
                : sales.map(s => {
                    const dateStr = new Date(s.order_date).toLocaleString('vi-VN') || '---';
                    const invoiceCode = `#HD${s.id.slice(-6).toUpperCase()}`;
                    
                    // Items: What was bought (Nợ cái gì)
                    const itemsHtml = s.items && s.items.length > 0
                        ? s.items.map(item => `
                            <div style="font-size: 13px; line-height: 1.4; color: var(--text-main); margin-bottom: 4px; padding-left: 12px; position: relative;">
                                <span style="position: absolute; left: 0;">•</span>
                                <strong>${item.product_name}</strong>
                                <span style="color: var(--text-muted); font-size: 12px; margin-left: 4px;">x${item.quantity} (${item.unit_price.toLocaleString()}đ)</span>
                            </div>
                        `).join('')
                        : `<span style="color: var(--text-muted); font-style: italic;">Không có thông tin mặt hàng</span>`;

                    const unpaidAmount = Math.max(0, s.final_amount - s.paid_amount);
                    const unpaidColor = unpaidAmount > 0 ? '#ef4444' : '#22c55e';
                    const unpaidText = unpaidAmount > 0 ? `${unpaidAmount.toLocaleString()}đ` : 'Hết nợ';
                    
                    let statusBadge = '';
                    if (s.status === 'cancelled') {
                        statusBadge = `<span class="badge badge-danger" style="border-radius: 8px; white-space: nowrap;">Đã hủy</span>`;
                    } else if (s.status === 'expired') {
                        statusBadge = `<span class="badge" style="background: #f1f5f9; color: #64748b; border-radius: 8px; white-space: nowrap;">Hết hạn</span>`;
                    } else if (unpaidAmount > 0) {
                        statusBadge = `<span class="badge" style="background: #fff7ed; color: #ea580c; border-radius: 8px; white-space: nowrap;">Còn nợ</span>`;
                    } else if (s.status === 'completed') {
                        statusBadge = `<span class="badge badge-success" style="border-radius: 8px; white-space: nowrap;">Đã đủ</span>`;
                    } else if (s.status === 'pending') {
                        statusBadge = `<span class="badge badge-warning" style="border-radius: 8px; white-space: nowrap;">Chờ duyệt</span>`;
                    } else if (s.status === 'delivering') {
                        statusBadge = `<span class="badge" style="background: #e0e7ff; color: #4338ca; border-radius: 8px; white-space: nowrap;">Đang giao</span>`;
                    }

                    const canPay = unpaidAmount > 0 && s.status !== 'cancelled' && s.status !== 'expired';
                    const actionBtn = canPay
                        ? `<button class="btn btn-sm btn-success pay-invoice-debt-btn" data-sale-id="${s.id}" style="padding: 6px 12px; font-size: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; white-space: nowrap;"><i class="fas fa-hand-holding-usd"></i> Thu nợ</button>`
                        : `<span style="color: var(--text-muted); font-size: 12px; font-style: italic; white-space: nowrap;">---</span>`;

                    return `
                        <tr>
                            <td style="font-weight: 500;">${dateStr}</td>
                            <td><strong style="color: var(--primary-color); cursor: pointer;" onclick="window.printInvoice('${s.id}')" title="Bấm để in hóa đơn">${invoiceCode}</strong></td>
                            <td style="vertical-align: top; padding: 12px 16px; text-align: left;">${itemsHtml}</td>
                            <td style="text-align: right; font-weight: 600; color: var(--text-main);">${s.final_amount.toLocaleString()}đ</td>
                            <td style="text-align: right; font-weight: 600; color: #22c55e;">${s.paid_amount.toLocaleString()}đ</td>
                            <td style="text-align: right; font-weight: 700; color: ${unpaidColor};">${unpaidText}</td>
                            <td style="text-align: center;">${statusBadge}</td>
                            <td style="text-align: center;">${actionBtn}</td>
                        </tr>
                    `;
                }).join('');

            showModal(`Lịch sử mua hàng & Công nợ: ${customer.name}`, `
                <div class="debt-detail-container" style="display: flex; flex-direction: column; gap: 24px; text-align: left;">
                    <!-- Customer Profile card -->
                    <div style="background: #f8fafc; border: 1px solid var(--border-color); padding: 20px 24px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap;">
                        <div style="display: flex; gap: 40px; flex-wrap: wrap; flex: 1;">
                            <div>
                                <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Khách hàng</div>
                                <div style="font-size: 18px; font-weight: 800; color: var(--text-main); margin-top: 4px;">${customer.name}</div>
                            </div>
                            <div>
                                <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Số điện thoại</div>
                                <div style="font-size: 15px; font-weight: 600; color: var(--text-main); margin-top: 4px;">${customer.phone || '---'}</div>
                            </div>
                            <div>
                                <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Địa chỉ</div>
                                <div style="font-size: 15px; font-weight: 600; color: var(--text-main); margin-top: 4px;">${customer.address || '---'}</div>
                            </div>
                        </div>
                        <div style="background: ${customer.debt > 0 ? '#fef2f2' : '#f0fdf4'}; border: 1px solid ${customer.debt > 0 ? '#fecaca' : '#bbf7d0'}; padding: 12px 24px; border-radius: 12px; text-align: center; min-width: 180px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); flex-shrink: 0;">
                            <div style="font-size: 11px; font-weight: 700; color: ${customer.debt > 0 ? '#991b1b' : '#166534'}; text-transform: uppercase; letter-spacing: 0.5px;">Tổng nợ hiện tại</div>
                            <div style="font-size: 26px; font-weight: 900; color: ${customer.debt > 0 ? '#dc2626' : '#16a34a'}; margin-top: 4px;">${(customer.debt || 0).toLocaleString()}đ</div>
                        </div>
                    </div>

                    <!-- Debt and Purchases List -->
                    <div>
                        <h4 style="font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="receipt"></i> CHI TIẾT GIAO DỊCH & NỢ (NỢ NGÀY NÀO - NỢ CÁI GÌ)
                        </h4>
                        <div style="max-height: 400px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 12px; background: white;">
                            <table class="data-table" style="margin: 0; width: 100%;">
                                <thead style="position: sticky; top: 0; background: #f8fafc; z-index: 10;">
                                    <tr>
                                        <th style="font-size: 12px; font-weight: 700; text-transform: uppercase;">Ngày nợ</th>
                                        <th style="font-size: 12px; font-weight: 700; text-transform: uppercase;">Mã hóa đơn</th>
                                        <th style="font-size: 12px; font-weight: 700; text-transform: uppercase; width: 35%; text-align: left;">Chi tiết mua hàng (Nợ cái gì)</th>
                                        <th style="font-size: 12px; font-weight: 700; text-transform: uppercase; text-align: right;">Tổng tiền</th>
                                        <th style="font-size: 12px; font-weight: 700; text-transform: uppercase; text-align: right;">Đã trả</th>
                                        <th style="font-size: 12px; font-weight: 700; text-transform: uppercase; text-align: right;">Còn nợ</th>
                                        <th style="font-size: 12px; font-weight: 700; text-transform: uppercase; text-align: center;">Trạng thái</th>
                                        <th style="font-size: 12px; font-weight: 700; text-transform: uppercase; text-align: center;">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${salesHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `, null, 'modal-xl');

            if (window.lucide) {
                window.lucide.createIcons();
            }

            // Wire up pay invoice debt handlers
            const modalEl = document.getElementById('app-modal');
            if (modalEl) {
                modalEl.querySelectorAll('.pay-invoice-debt-btn').forEach(btn => {
                    btn.onclick = async (e) => {
                        e.stopPropagation();
                        const saleId = btn.getAttribute('data-sale-id');
                        if (!await confirm("Bạn có chắc chắn muốn xác nhận thu hồi toàn bộ công nợ cho hóa đơn này không?")) return;
                        
                        try {
                            const res = await fetch(`/api/sales/${saleId}/pay`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' }
                            });
                            
                            if (res.ok) {
                                alert("Thu nợ hóa đơn thành công!");
                                await loadCustomers(); // Refresh the parent table list
                                await handleViewDebt(customerId); // Refresh the modal list live
                            } else {
                                const err = await res.json();
                                alert("Lỗi khi thu nợ: " + (err.message || err.error));
                            }
                        } catch (err) {
                            console.error(err);
                            alert("Lỗi hệ thống khi thu nợ!");
                        }
                    };
                });
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi: " + error.message);
        }
    }

    window.updateOrderStatus = async (id, newStatus, event) => {
        if (event) event.stopPropagation();
        const confirmMsg = newStatus === 'delivering' ? 'Bắt đầu đi giao đơn hàng này?' :
                           newStatus === 'completed' ? 'Xác nhận đã giao hàng thành công và thu tiền?' :
                           'Bạn chắc chắn muốn hủy đơn hàng này?';
        const isConfirmed = await confirm(confirmMsg);
        if (!isConfirmed) return;

        try {
            const res = await fetch(`/api/sales/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                if (currentPage === 'dashboard') loadDashboardStats();
                if (currentPage === 'sales-history') loadSalesHistory();
            } else {
                const data = await res.json();
                alert('Lỗi: ' + (data.error || 'Không thể cập nhật trạng thái'));
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi kết nối');
        }
    };

    // Print Invoice Global
    window.printInvoice = async (id) => {
        try {
            const sale = await (await fetch(`/api/sales/${id}`)).json();
            const printWin = window.open('', '', 'width=800,height=600');
            printWin.document.write(`
                <html>
                <head>
                    <title>In hóa đơn - ${sale.id}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 20px; color: #333; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .store-name { font-size: 24px; font-weight: bold; }
                        .info { margin-bottom: 10px; font-size: 14px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border-bottom: 1px solid #eee; padding: 10px; text-align: left; }
                        .total-row { font-weight: bold; font-size: 18px; }
                        .footer { text-align: center; margin-top: 30px; font-style: italic; font-size: 12px; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="store-name">HTDS - ThuyR Mart</div>
                        <div>Địa chỉ: tổ dân phố Thư Đôi, phường Ninh Xá, tỉnh Bắc Ninh</div>
                        <div>SĐT: 0383303180</div>
                        <h2 style="margin-top: 15px;">HÓA ĐƠN BÁN LẺ</h2>
                    </div>
                    <div class="info">
                        <div>Mã HĐ: <strong>#HD${sale.id.slice(-6).toUpperCase()}</strong></div>
                        <div>Ngày: ${new Date(sale.order_date).toLocaleString('vi-VN')}</div>
                        <div>Khách hàng: ${sale.customer_name}</div>
                        <div>Người bán: ${sale.user_name}</div>
                    </div>
                    <table>
                        <thead><tr><th>Sản phẩm</th><th>Đơn giá</th><th>SL</th><th>T.Tiền</th></tr></thead>
                        <tbody>
                            ${sale.items.map(i => `<tr><td>${i.product_name}</td><td>${i.unit_price.toLocaleString()}</td><td>${i.quantity}</td><td>${i.subtotal.toLocaleString()}</td></tr>`).join('')}
                        </tbody>
                        <tfoot>
                            <tr><td colspan="3" style="text-align: right;">Tổng tiền:</td><td>${sale.total_amount.toLocaleString()}đ</td></tr>
                            ${sale.discount > 0 ? `<tr><td colspan="3" style="text-align: right;">Giảm giá:</td><td>-${sale.discount.toLocaleString()}đ</td></tr>` : ''}
                            <tr class="total-row"><td colspan="3" style="text-align: right;">THANH TOÁN:</td><td>${sale.final_amount.toLocaleString()}đ</td></tr>
                        </tfoot>
                    </table>
                    <div class="footer">
                        <p>Cảm ơn Quý khách! Hẹn gặp lại!</p>
                        <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;">IN NGAY</button>
                    </div>
                </body>
                </html>
            `);
            printWin.document.close();
        } catch (err) { console.error(err); alert('Lỗi khi in hóa đơn!'); }
    };

    // Start
    switchPage('dashboard');
});

