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
            iconHtml = '';
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
            ${iconHtml ? `<div class="fancy-toast-icon">${iconHtml}</div>` : ''}
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

    // State - restore last page from sessionStorage
    let currentPage = 'dashboard';
    const _savedPage = sessionStorage.getItem('currentPage');

    // Sidebar Mobile Overlay
    let sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (!sidebarOverlay) {
        sidebarOverlay = document.createElement('div');
        sidebarOverlay.className = 'sidebar-overlay';
        document.body.appendChild(sidebarOverlay);
    }

    const closeMobileSidebar = () => {
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    };

    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.innerWidth <= 1024) {
                sidebar.classList.toggle('mobile-open');
                sidebarOverlay.classList.toggle('active');
            } else {
                sidebar.classList.toggle('collapsed');
                document.querySelector('.main-content')?.classList.toggle('sidebar-collapsed');
            }
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            if (page) {
                closeMobileSidebar();
                switchPage(page);
            }
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

    // Toggle sidebar nav groups
    document.querySelectorAll('.nav-group-header').forEach(header => {
        header.addEventListener('click', (e) => {
            const group = header.closest('.nav-group');
            if (group) group.classList.toggle('open');
        });
    });

    // Page Switching Logic
    async function switchPage(page) {
        // Prevent non-admin from accessing users page
        if (page === 'users' && user?.role !== 'admin') {
            switchPage('dashboard');
            return;
        }

        // Update Nav UI
        navItems.forEach(item => {
            const isActive = item.getAttribute('data-page') === page;
            item.classList.toggle('active', isActive);
            if (isActive) {
                const parentGroup = item.closest('.nav-group');
                if (parentGroup) parentGroup.classList.add('open');
            }
        });

        currentPage = page;
        // Persist current page to sessionStorage so reload restores it
        sessionStorage.setItem('currentPage', page);

        try {
            renderLoading();
            const html = await getPageHTML(page);
            pageContent.innerHTML = html;

            // Initialize page specific JS
            await initPage(page);

            if (window.lucide) {
                try {
                    lucide.createIcons();
                    document.querySelectorAll('svg[data-lucide]').forEach(el => el.removeAttribute('data-lucide'));
                } catch (e) {
                    console.warn('Lucide icon render warning:', e);
                }
            }
        } catch (err) {
            console.error('Lỗi tải trang:', page, err);
            pageContent.innerHTML = `
                <div style="padding: 32px; background: white; border-radius: 12px; border: 1px solid #fee2e2; margin: 20px; max-width: 600px;">
                    <h3 style="color: #dc2626; margin-bottom: 8px;">⚠️ Không thể tải trang</h3>
                    <p style="color: #4b5563; font-size: 14px; margin-bottom: 16px;">Xảy ra lỗi khi mở trang "${page}": ${err.message || err}</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">Thử tải lại trang</button>
                </div>
            `;
        }
    }

    async function getPageHTML(page) {
        switch (page) {
            case 'dashboard':
                return `
                    <div class="dashboard-view">
                        <div id='low-stock-alert' style='display:none;'></div>
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
                        <!-- Multi-Order Tabs Bar -->
                        <div id="pos-orders-tabs-wrapper" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; background: white; padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border-color);">
                            <div id="pos-orders-tabs" style="display: flex; align-items: center; gap: 8px; overflow-x: auto; flex: 1;"></div>
                            <button id="btn-add-pos-order" type="button" style="background: #f0fdf4; color: #166534; border: 1px dashed #86efac; font-weight: 700; white-space: nowrap; border-radius: 6px; padding: 6px 14px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
                                <i data-lucide="plus-circle" style="width: 14px; height: 14px;"></i> + Tạo đơn mới (Đơn thứ 2, 3...)
                            </button>
                        </div>

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
                                    <div style='font-size:10px;color:#94a3b8;margin-top:4px;padding-left:8px;'> F2: Tìm SP &nbsp;·&nbsp; F4: Nhập tiền &nbsp;·&nbsp; F8: Thanh toán</div>
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
                                    <span class="badge" style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600;">Đơn hàng mới</span>
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
                                        <div class="mb-4">
                                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                                <label class="text-muted" style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Tiền khách đưa (F4)</label>
                                                <button id="btn-exact-cash" style="background: var(--primary-color); color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer;">Thanh toán đủ</button>
                                            </div>
                                            <input type="text" id="customer-cash" class="form-control" placeholder="0" onfocus="this.select()" oninput="let v = this.value.replace(/[^0-9]/g, ''); this.value = v ? parseInt(v).toLocaleString('vi-VN') : ''" style="height: 56px; font-size: 24px; font-weight: 700; text-align: right; background: white; border-radius: 4px; margin-bottom: 0;">
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center" style="margin-top: 16px;"><span class="text-muted" style="font-size: 14px;">Tiền thừa trả khách:</span><span id="change-text" style="font-weight: 700; font-size: 16px; color: #10b981;">0đ</span></div>
                                    </div>
                                    
                                    <div id="pos-credit-section" style="display:none; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; padding:20px;">
                                        <div style="font-size: 13px; color: #92400e; margin-bottom: 12px;"><b>⚠️ Bán ghi nợ</b> – Khách hàng sẽ trả tiền sau</div>
                                        <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Trả trước (nếu có)</label>
                                        <input type="text" id="customer-credit-paid" class="form-control" placeholder="0" onfocus="this.select()" oninput="let v = this.value.replace(/[^0-9]/g, ''); this.value = v ? parseInt(v).toLocaleString('vi-VN') : ''" style="height: 48px; font-size: 20px; font-weight: 700; text-align: right; background: white; margin-bottom: 8px;">
                                        <div style="font-size: 12px; color: #b45309;">Còn nợ: <b id="pos-remaining-debt" style="color:#dc2626;">0đ</b></div>
                                    </div>
                                </div>
                                <div class="checkout-area" style="margin-top: 24px;">
                                    <button id="btn-checkout" class="btn btn-primary" style="width: 100%; padding: 16px; font-size: 14px; border-radius: 8px; display: flex; justify-content: center; font-weight: 600; letter-spacing: 0.5px;">
                                        <i data-lucide="check-circle" class="mr-2" style="width: 18px;"></i> THANH TOÁN (F8)
                                    </button>
                                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; font-size: 12px; color: var(--text-muted);">
                                        <input type="checkbox" id="pos-auto-print" style="width: 15px; height: 15px; cursor: pointer;">
                                        <label for="pos-auto-print" style="cursor: pointer; margin: 0; user-select: none;">Tự động in biên lai khi thanh toán</label>
                                    </div>
                                </div>
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
                        <div class="filter-bar" style="margin-bottom: 20px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                            <div class="search-input-wrapper" style="flex: 1; min-width: 220px;">
                                <input type="text" id="product-list-search" class="form-control" placeholder="Tìm kiếm sản phẩm, mã SKU, barcode...">
                            </div>
                            <select id="product-category-filter" class="form-control" style="width: 170px;">
                                <option value="">Tất cả danh mục</option>
                            </select>
                            <select id="product-stock-filter" class="form-control" style="width: 180px; font-weight: 600;">
                                <option value="">Tất cả trạng thái kho</option>
                                <option value="in_stock" style="color:#16a34a;">Còn hàng (> min)</option>
                                <option value="low_stock" style="color:#d97706;">Sắp hết hàng (≤ min)</option>
                                <option value="out_of_stock" style="color:#dc2626;">Đã hết hàng (0)</option>
                            </select>
                            <button type="button" class="btn btn-outline-primary" style="font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;" onclick="window.exportLowStockExcel()" title="Xuất danh sách sản phẩm hết/sắp hết ra file Excel để gọi nhà cung cấp">
                                <i data-lucide="file-spreadsheet" style="width:15px;height:15px;"></i> Xuất file gọi hàng Excel
                            </button>
                        </div>
                        <div class="table-container">
                             <table class="data-table" id="products-table">
                                <thead><tr><th>Hình ảnh</th><th>Mã</th><th>Mã vạch</th><th>Tên sản phẩm</th><th>Danh mục</th><th>Giá bán</th><th>Tồn kho</th><th class="text-right">Thao tác</th></tr></thead>
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
            case 'stock-take':
                return `
                    <div class="page-header">
                        <div class="page-title-wrapper">
                            <h2>Kiểm kê kho</h2>
                            <p class="page-subtitle">Quét mã vạch liên tục để đếm số lượng thực tế trong kho.</p>
                        </div>
                    </div>
                    <div class="row mt-3" style="display: flex; gap: 24px;">
                        <div style="flex: 1;">
                            <div class="card" style="padding: 24px;">
                                <div style="position: relative;">
                                    <i data-lucide="scan-barcode" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); width: 24px; height: 24px;"></i>
                                    <input type="text" id="stock-take-input" class="form-control" placeholder="Quét mã vạch (EAN/UPC) tại đây..." style="padding-left: 56px; height: 64px; font-size: 20px; border-radius: 12px; margin-bottom: 0;">
                                </div>
                                <div id="stock-take-feedback" style="margin-top: 16px; min-height: 24px; font-weight: 600; text-align: center;"></div>
                            </div>
                        </div>
                        <div style="flex: 2;">
                            <div class="card">
                                <h3 style="margin-bottom: 16px; font-size: 16px; color: var(--text-main);">Danh sách đã quét</h3>
                                <table class="data-table">
                                    <thead><tr><th>Sản phẩm</th><th style="text-align: center;">Tồn DB</th><th style="text-align: center;">Đã đếm</th><th style="text-align: center;">Chênh lệch</th><th style="text-align: right;">Thao tác</th></tr></thead>
                                    <tbody id="stock-take-list"></tbody>
                                </table>
                                <div style="margin-top: 24px; text-align: right;">
                                    <button class="btn btn-primary" id="btn-save-stock-take" style="padding: 12px 24px;">Cập nhật kho & Lưu phiếu</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
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

                        <!-- Biểu đồ tăng trưởng & Cơ cấu đơn hàng (Grid 2:1) -->
                        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px;">
                            <div class="report-card" style="margin: 0;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
                                    <h3 style="margin: 0; display:flex; align-items:center; gap:8px;"><i data-lucide="line-chart" style="color:var(--primary-color);"></i> Biểu đồ Tăng trưởng Doanh thu & Lợi nhuận</h3>
                                    <select id="report-chart-filter" class="pos-input" style="max-width: 180px; padding: 6px 12px; font-size: 13px; font-weight: 600; height: 34px;">
                                        <option value="7days">7 ngày qua</option>
                                        <option value="day">Theo ngày (Tháng này)</option>
                                        <option value="month">Theo tháng (Năm này)</option>
                                    </select>
                                </div>
                                <div style="position: relative; height: 300px; width: 100%;">
                                    <canvas id="revenueChart"></canvas>
                                </div>
                            </div>
                            <div class="report-card" style="margin: 0;">
                                <div style="margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
                                    <h3 style="margin: 0; display:flex; align-items:center; gap:8px;"><i data-lucide="pie-chart" style="color:#0ea5e9;"></i> Cơ cấu đơn hàng</h3>
                                </div>
                                <div style="position: relative; height: 300px; width: 100%; display: flex; align-items: center; justify-content: center;">
                                    <canvas id="orderStatusChart"></canvas>
                                </div>
                            </div>
                        </div>

                        <!-- Grid 2: Biểu đồ Cột Top Bán chạy & Phương thức Thanh toán -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px;">
                            <div class="report-card" style="margin: 0;">
                                <div style="margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
                                    <h3 style="margin: 0; display:flex; align-items:center; gap:8px;"><i data-lucide="bar-chart-3" style="color:#8b5cf6;"></i> Top 5 Sản phẩm Bán chạy</h3>
                                </div>
                                <div style="position: relative; height: 260px; width: 100%;">
                                    <canvas id="topProductsChart"></canvas>
                                </div>
                            </div>
                            <div class="report-card" style="margin: 0;">
                                <div style="margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
                                    <h3 style="margin: 0; display:flex; align-items:center; gap:8px;"><i data-lucide="layers" style="color:#10b981;"></i> Doanh thu theo Danh mục</h3>
                                </div>
                                <div style="position: relative; height: 260px; width: 100%; display: flex; align-items: center; justify-content: center;">
                                    <canvas id="categorySalesChart"></canvas>
                                </div>
                            </div>
                        </div>

                        <!-- Grid 1: Sản phẩm & Kho (Sản phẩm bán chạy & Tồn kho nhiều) -->
                        <div class="reports-grid" style="margin-bottom: 32px;">
                            <div class="report-card">
                                <h3><i data-lucide="award"></i> Sản phẩm bán chạy</h3>
                                <table class="report-table-compact" id="best-selling-table">
                                    <thead><tr><th>Tên Sản phẩm</th><th style="text-align:right;">Số lượng</th></tr></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                            <div class="report-card">
                                <h3><i data-lucide="archive"></i> Tồn kho nhiều</h3>
                                <table class="report-table-compact" id="slow-moving-table">
                                    <thead><tr><th>Tên Sản phẩm</th><th style="text-align:right;">Số lượng tồn</th></tr></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Grid 2: Đơn hàng & Công nợ (Đơn hàng gần đây & Khách hàng còn nợ) -->
                        <div class="reports-grid">
                            <div class="report-card">
                                <h3><i data-lucide="history"></i> Đơn hàng gần đây</h3>
                                <table class="report-table-compact" id="recent-orders-table">
                                    <thead><tr><th>Khách hàng</th><th style="text-align:right;">Thành tiền</th></tr></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                            <div class="report-card" style="border-left: 4px solid #f59e0b;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                                    <h3 style="margin:0; font-size: 18px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 12px;"><i data-lucide="alert-triangle" style="color:#f59e0b;"></i> Khách hàng còn nợ</h3>
                                    <span id="report-total-debt-badge" style="background:#fef3c7; color:#b45309; padding:6px 16px; border-radius:20px; font-weight:700; font-size:14px;">Tổng: 0đ</span>
                                </div>
                                <table class="report-table-compact" id="customer-debt-table">
                                    <thead><tr><th>Khách hàng</th><th>Điện thoại</th><th style="text-align:right;">Số nợ</th><th style="text-align:center;">Trạng thái</th></tr></thead>
                                    <tbody><tr><td colspan="4" class="text-muted" style="text-align:center; padding:20px;">Đang tải...</td></tr></tbody>
                                </table>
                            </div>
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
            case 'inventory-audit':
                return `
                    <div class='page-header'>
                        <div class='page-title-wrapper'>
                            <h2>Kiểm kê kho</h2>
                            <p class='page-subtitle'>Nhập số lượng thực tế để cân bằng tồn kho hệ thống.</p>
                        </div>
                        <button class='btn btn-success' id='btn-save-audit'><i data-lucide='save'></i> Lưu phiếu kiểm kê</button>
                    </div>
                    <div class="filter-bar" style="margin-bottom: 20px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                        <div class="search-input-wrapper" style="flex: 1; min-width: 250px;">
                            <input type="text" id="audit-search" class="form-control" placeholder="Tìm tên sản phẩm, mã SKU...">
                        </div>
                        <select id="audit-status-filter" class="form-control" style="width: 200px; font-weight: 600;">
                            <option value="">Tất cả sản phẩm</option>
                            <option value="low" style="color:#d97706;">Sản phẩm sắp hết hàng</option>
                            <option value="out" style="color:#dc2626;">Sản phẩm đã hết hàng</option>
                        </select>
                    </div>
                    <div class='table-container'>
                        <table class='data-table' id='audit-table'>
                            <thead><tr><th>Sản phẩm</th><th>SKU</th><th>Đơn vị</th><th>Tồn HT</th><th style='width:130px'>Thực tế kiểm</th><th>Chênh lệch</th></tr></thead>
                            <tbody id='audit-list'></tbody>
                        </table>
                    </div>
                `;
            case 'settings':
                return `
                    <div class="page-header" style="margin-bottom: 24px;">
                        <div class="page-title-wrapper">
                            <h2>Cài đặt & Quản lý dữ liệu</h2>
                            <p class="page-subtitle">Sao lưu, khôi phục và quản lý dữ liệu phục vụ vận hành thực tế.</p>
                        </div>
                    </div>

                    <!-- Row 1: Sao lưu & Phục hồi dữ liệu -->
                    <div class="row" style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 24px;">
                        <div class="card" style="flex: 1; min-width: 300px; padding: 24px; border-left: 4px solid #2563eb; background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                            <h3 style="color: #2563eb; font-size: 17px; font-weight: 700; margin-bottom: 12px;">Sao lưu Dữ liệu (Backup JSON)</h3>
                            <p style="font-size: 14px; color: #64748b; margin-bottom: 20px; line-height: 1.5;">Tải về file sao lưu định dạng .json lưu trữ an toàn toàn bộ Sản phẩm, Đơn hàng, Khách hàng & Công nợ.</p>
                            <a class="btn" style="background: #2563eb; color: white; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 14px; text-decoration: none; display: inline-block;" href="/api/system/backup" download>
                                Tải bản Sao lưu ngay
                            </a>
                        </div>

                        <div class="card" style="flex: 1; min-width: 300px; padding: 24px; border-left: 4px solid #059669; background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                            <h3 style="color: #059669; font-size: 17px; font-weight: 700; margin-bottom: 12px;">Phục hồi Dữ liệu (Restore)</h3>
                            <p style="font-size: 14px; color: #64748b; margin-bottom: 16px; line-height: 1.5;">Chọn file .json đã sao lưu trước đó để khôi phục lại dữ liệu hệ thống.</p>
                            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                                <input type="file" id="restore-file-input" accept=".json" class="form-control" style="font-size: 13px; height: 40px; padding: 6px 12px; flex: 1; min-width: 180px;">
                                <button class="btn" style="background: #059669; color: white; white-space: nowrap; height: 40px; padding: 0 16px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer;" onclick="window.handleRestoreBackup()">Khôi phục ngay</button>
                            </div>
                        </div>
                    </div>

                    <!-- Row 2: Xóa dữ liệu thử nghiệm & Reset hệ thống -->
                    <div class="row" style="display: flex; gap: 20px; flex-wrap: wrap;">
                        <div class="card" style="flex: 1; min-width: 300px; padding: 24px; border-left: 4px solid #ea580c; background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                            <h3 style="color: #ea580c; font-size: 17px; font-weight: 700; margin-bottom: 12px;">Xóa dữ liệu thử nghiệm (Bán thực tế)</h3>
                            <p style="font-size: 14px; color: #64748b; margin-bottom: 20px; line-height: 1.5;">Xóa toàn bộ lịch sử hóa đơn test, phiếu nhập test. Giữ lại danh sách Sản phẩm, Danh mục, Khách hàng, NCC để bán hàng thực tế.</p>
                            <button class="btn" style="background: #ea580c; color: white; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 14px; border: none; cursor: pointer;" onclick="window.resetSystemData('transactions')">Xóa dữ liệu thử nghiệm</button>
                        </div>

                        <div class="card" style="flex: 1; min-width: 300px; padding: 24px; border-left: 4px solid #dc2626; background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                            <h3 style="color: #dc2626; font-size: 17px; font-weight: 700; margin-bottom: 12px;">Reset toàn bộ hệ thống</h3>
                            <p style="font-size: 14px; color: #64748b; margin-bottom: 20px; line-height: 1.5;">Xóa TẤT CẢ dữ liệu bao gồm sản phẩm, khách hàng, giao dịch. Hệ thống sẽ trở về trạng thái trống ban đầu.</p>
                            <button class="btn btn-danger" style="background: #dc2626; color: white; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 14px; border: none; cursor: pointer;" onclick="window.resetSystemData('full')">Xóa toàn bộ dữ liệu</button>
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
                            <td><span style="font-weight: 700; color: var(--primary-color);">#BL-${s.id.slice(-6).toUpperCase()}</span></td>
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
            await loadLowStockAlert();
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
            document.getElementById('btn-export-excel')?.addEventListener('click', async () => {
                if (!window.lastReportData) { alert('Chưa có dữ liệu để xuất!'); return; }
                await exportExcelJSReport(window.lastReportData);
            });


        } else if (page === 'sales-history') {
            await loadSalesHistory();
            setupSalesFilters();
        } else if (page === 'users') {
            await loadUsers();
            if (document.getElementById('btn-add-user')) document.getElementById('btn-add-user').onclick = setupAddUser;
        } else if (page === 'inventory-logs') {
            await loadInventoryLogs();
        } else if (page === 'stock-take') {
            setupStockTake();
        } else if (page === 'inventory-audit') {
            await loadInventoryAudit();
        } else if (page === 'settings') {
            setupSettingsActions();
        }
    }

    function setupSettingsActions() {
        // Settings page ready (Backup, Restore, and Reset controls initialized)
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

        // Auto-focus first visible text/search input in modal for instant typing
        setTimeout(() => {
            const priorityInput = modal.querySelector('#po-product-search, input[type="text"]:not([readonly]):not([disabled]), input[type="search"]:not([readonly]):not([disabled]), input[type="number"]:not([readonly]):not([disabled]), textarea, select');
            if (priorityInput) {
                priorityInput.focus();
                if (priorityInput.select && typeof priorityInput.select === 'function') priorityInput.select();
            }
        }, 120);

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

                        <div class="mb-3">
                            <label style="display:flex;align-items:center;gap:6px;"><i data-lucide="scan-barcode" style="width:14px;height:14px;color:var(--primary-color)"></i> Mã vạch (EAN/UPC)</label>
                            <input type="text" name="barcode" class="form-control" value="${product.barcode || ''}" placeholder="Quét máy hoặc nhập thủ công (VD: 8934588593067)...">
                        </div>

                        <div class="form-row">
                            <div class="mb-3"><label>Danh mục</label>
                                <select name="category_id" class="form-control">
                                    <option value="" ${!product.category_id ? 'selected' : ''}>Khác</option>
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
                                <input type="number" name="min_stock" class="form-control" value="${product.min_stock || 5}">
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
                        if (data.category_id === "") data.category_id = null;

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
                const poCode = `#PN-${po.id.slice(-6).toUpperCase()}`;
                const poBalance = Math.max(0, po.total_amount - po.paid_amount);
                
                showModal('Chi tiết phiếu nhập hàng', `
                    <div style="padding: 4px 0;">
                        <!-- Header Badges & Info Card -->
                        <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed var(--border-color);">
                                <div style="font-weight: 700; font-size: 16px; color: var(--primary-color);">${poCode}</div>
                                ${poBalance > 0 
                                    ? `<span class="badge" style="background: #fff7ed; color: #c2410c; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 12px;">Còn nợ NCC: ${poBalance.toLocaleString()}đ</span>` 
                                    : `<span class="badge" style="background: #dcfce7; color: #15803d; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 12px;">Đã thanh toán đủ</span>`}
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 13px;">
                                <div><span style="color: var(--text-muted);">Nhà cung cấp:</span> <strong style="color: var(--text-main);">${po.supplier_name}</strong></div>
                                <div><span style="color: var(--text-muted);">Thời gian nhập:</span> <strong style="color: var(--text-main);">${new Date(po.order_date).toLocaleString('vi-VN')}</strong></div>
                                <div><span style="color: var(--text-muted);">Người nhập:</span> <strong style="color: var(--text-main);">${po.user_name || 'Quản trị viên'}</strong></div>
                            </div>
                        </div>

                        <!-- Items Table -->
                        <div style="border: 1px solid var(--border-color); border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
                            <table class="data-table" style="margin: 0; width: 100%; table-layout: fixed;">
                                <thead style="background: #f1f5f9;">
                                    <tr>
                                        <th style="width: 40%; text-align: left; padding: 10px 12px;">Sản phẩm</th>
                                        <th style="width: 20%; text-align: right; padding: 10px 12px;">Giá nhập</th>
                                        <th style="width: 15%; text-align: center; padding: 10px 6px;">Số lượng</th>
                                        <th style="width: 25%; text-align: right; padding: 10px 12px;">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${po.items.map(item => `
                                        <tr>
                                            <td style="font-weight: 600; padding: 10px 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.product_name}</td>
                                            <td style="text-align: right; padding: 10px 12px;">${item.unit_price.toLocaleString()}đ</td>
                                            <td style="text-align: center; padding: 10px 6px; font-weight: 600;">${item.quantity}</td>
                                            <td style="text-align: right; padding: 10px 12px; font-weight: 700;">${item.subtotal.toLocaleString()}đ</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <!-- Summary Footer Card -->
                        <div style="background: #fafafa; border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                            <div style="font-size: 13px; line-height: 1.6;">
                                <div>Đã thanh toán: <strong style="color: #16a34a;">${po.paid_amount.toLocaleString()}đ</strong></div>
                                <div>Còn nợ NCC: <strong style="color: ${poBalance > 0 ? '#dc2626' : '#16a34a'};">${poBalance.toLocaleString()}đ</strong></div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Tổng giá trị nhập</div>
                                <div style="font-size: 24px; font-weight: 800; color: var(--primary-color);">${po.total_amount.toLocaleString()}đ</div>
                            </div>
                        </div>
                    </div>
                `, () => {}, 'modal-lg');
                break;
            case 'sales-history':
                showSaleDetailModal(id);
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
                        <div class="mb-3"><label>Mã SKU <small style="font-weight:400; color:#94a3b8;">— để trống tự sinh</small></label><input type="text" name="sku" class="form-control" placeholder="Để trống tự sinh (hoặc gõ/quét mã)..."></div>
                    </div>

                    <div class="mb-3">
                        <label style="display:flex;align-items:center;gap:6px;"><i data-lucide="scan-barcode" style="width:14px;height:14px;color:var(--primary-color)"></i> Mã vạch (EAN/UPC)</label>
                        <input type="text" name="barcode" class="form-control" placeholder="Quét máy hoặc nhập thủ công (VD: 8934588593067)...">
                    </div>
                    
                    <div class="form-row">
                        <div class="mb-3"><label>Danh mục</label>
                            <select name="category_id" class="form-control">
                                <option value="">Khác</option>
                                ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                            </select>
                        </div>
                         <div class="mb-3">
                            <label>Đơn vị tính</label>
                            <select name="unit" class="form-control" id="prod-unit-select"
                                onchange="if(this.value==='__other__'){document.getElementById('prod-unit-custom').style.display='block';document.getElementById('prod-unit-custom').focus();}else{document.getElementById('prod-unit-custom').style.display='none';}">
                                <option value="Cái">Cái</option>
                                <option value="Hộp">Hộp</option>
                                <option value="Lon">Lon</option>
                                <option value="Chai">Chai</option>
                                <option value="Gói">Gói</option>
                                <option value="Túi">Túi</option>
                                <option value="Thùng">Thùng</option>
                                <option value="Bịch">Bịch</option>
                                <option value="Kg">Kg</option>
                                <option value="Lít">Lít</option>
                                <option value="Gram">Gram</option>
                                <option value="__other__">— Tùy chỉnh (gõ tay)...</option>
                            </select>
                            <input type="text" id="prod-unit-custom" class="form-control" placeholder="Nhập đơn vị tính..." style="display:none; margin-top:6px;">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="mb-3"><label>Giá nhập (đ) <small style="font-weight:400; color:#94a3b8;">— tự cập nhật khi nhập hàng</small></label><input type="number" name="cost_price" class="form-control" value="0"></div>
                        <div class="mb-3"><label>Giá bán (Niêm yết)</label><input type="number" name="selling_price" class="form-control" required placeholder="0"></div>
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
                    if (!data.sku || !data.sku.trim()) {
                        delete data.sku;
                    }
                    const unitCustomEl = form.querySelector('#prod-unit-custom');
                    const unitSelectEl = form.querySelector('#prod-unit-select');
                    if (unitCustomEl && unitCustomEl.style.display !== 'none' && unitCustomEl.value.trim()) {
                        data.unit = unitCustomEl.value.trim();
                    } else if (unitSelectEl) {
                        data.unit = unitSelectEl.value === '__other__' ? 'Cái' : unitSelectEl.value;
                    }
                    data.images = uploadedImages;

                    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    const resData = await res.json().catch(() => ({}));
                    if (res.ok) { 
                        alert('Thành công!'); 
                        loadProducts(); 
                        return true; 
                    } else { 
                        alert(resData.error || resData.message || 'Lỗi khi lưu sản phẩm'); 
                        return false; 
                    }
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
        
        // Restore multi-orders state from localStorage
        let orders = [];
        try {
            const savedOrders = localStorage.getItem('pos_orders');
            if (savedOrders) orders = JSON.parse(savedOrders);
        } catch(e) { orders = []; }

        if (!Array.isArray(orders) || orders.length === 0) {
            orders = [{ id: Date.now(), name: 'Đơn 1', cart: [], selectedCustomer: null, note: '', discount: 0, paymentMethod: 'cash' }];
        }

        let activeOrderId = localStorage.getItem('pos_active_order_id') ? Number(localStorage.getItem('pos_active_order_id')) : orders[0].id;
        if (!orders.find(o => o.id === activeOrderId)) {
            activeOrderId = orders[0].id;
        }

        function getActiveOrder() {
            let ord = orders.find(o => o.id === activeOrderId);
            if (!ord) {
                ord = orders[0];
                activeOrderId = ord.id;
            }
            return ord;
        }

        let activeOrd = getActiveOrder();
        let cart = activeOrd.cart || [];
        let currentTotal = 0;
        let selectedCustomer = activeOrd.selectedCustomer || null;
        let paymentMethod = activeOrd.paymentMethod || 'cash';

        function saveOrdersState() {
            try {
                const curOrder = getActiveOrder();
                if (curOrder) {
                    curOrder.cart = cart;
                    curOrder.selectedCustomer = selectedCustomer;
                    curOrder.note = document.getElementById('pos-note')?.value || '';
                    curOrder.discount = parseInt(document.getElementById('discount')?.value) || 0;
                    curOrder.paymentMethod = paymentMethod;
                }
                localStorage.setItem('pos_orders', JSON.stringify(orders));
                localStorage.setItem('pos_active_order_id', activeOrderId.toString());
                sessionStorage.setItem('pos_cart', JSON.stringify(cart));
            } catch(e) {}
        }

        function renderOrdersTabs() {
            const container = document.getElementById('pos-orders-tabs');
            if (!container) return;
            
            container.innerHTML = orders.map((ord, idx) => {
                const isActive = ord.id === activeOrderId;
                const totalQty = (ord.id === activeOrderId ? cart : ord.cart).reduce((sum, item) => sum + (item.quantity || 1), 0);
                const qtyBadge = totalQty > 0 
                    ? `<span style="background:${isActive ? 'white' : '#64748b'}; color:${isActive ? 'var(--primary-color)' : 'white'}; border-radius:10px; padding:1px 6px; font-size:10px; font-weight:800;">${totalQty}</span>` 
                    : '';
                
                return `
                    <div class="pos-order-tab ${isActive ? 'active' : ''}" data-id="${ord.id}" style="display:flex; align-items:center; gap:6px; padding:6px 14px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:700; white-space:nowrap; transition:all 0.2s; background:${isActive ? 'var(--primary-color)' : '#f8fafc'}; color:${isActive ? 'white' : 'var(--text-main)'}; border:1px solid ${isActive ? 'var(--primary-color)' : '#e2e8f0'}; box-shadow:${isActive ? '0 2px 4px rgba(37,99,235,0.2)' : 'none'};">
                        <span>${ord.name || ('Đơn ' + (idx + 1))}</span>
                        ${qtyBadge}
                        ${orders.length > 1 ? `<span class="btn-close-tab" data-id="${ord.id}" style="margin-left:4px; font-size:14px; opacity:0.8; border-radius:50%; width:16px; height:16px; display:inline-flex; align-items:center; justify-content:center;" title="Đóng đơn">×</span>` : ''}
                    </div>
                `;
            }).join('');

            container.querySelectorAll('.pos-order-tab').forEach(tab => {
                tab.onclick = (e) => {
                    if (e.target.classList.contains('btn-close-tab')) {
                        e.stopPropagation();
                        closeOrder(Number(e.target.dataset.id));
                        return;
                    }
                    switchOrderTab(Number(tab.dataset.id));
                };
            });
        }

        function focusPosSearch() {
            setTimeout(() => {
                const el = document.getElementById('product-search');
                if (el) {
                    el.focus();
                    if (el.select) el.select();
                }
            }, 60);
        }

        function switchOrderTab(targetId) {
            saveOrdersState();
            if (targetId !== activeOrderId) {
                activeOrderId = targetId;
                const ord = getActiveOrder();
                cart = ord.cart || [];
                selectedCustomer = ord.selectedCustomer || null;
                paymentMethod = ord.paymentMethod || 'cash';
                
                if (document.getElementById('pos-note')) document.getElementById('pos-note').value = ord.note || '';
                if (document.getElementById('discount')) document.getElementById('discount').value = ord.discount || 0;
                
                if (selectedCustomer) {
                    selectCustomer(selectedCustomer);
                } else {
                    if (customerSearch) customerSearch.value = '';
                    if (clearCustomerBtn) clearCustomerBtn.style.display = 'none';
                    const infoBox = document.getElementById('pos-customer-info');
                    if (infoBox) infoBox.style.display = 'none';
                }
                setPaymentMethod(paymentMethod);
                renderCart();
                renderOrdersTabs();
                saveOrdersState();
            }
            focusPosSearch();
        }

        function addNewOrder() {
            saveOrdersState();
            const newId = Date.now();
            const newOrder = {
                id: newId,
                name: 'Đơn ' + (orders.length + 1),
                cart: [],
                selectedCustomer: null,
                note: '',
                discount: 0,
                paymentMethod: 'cash'
            };
            orders.push(newOrder);
            switchOrderTab(newId);
        }

        function closeOrder(closeId) {
            const ordToClose = orders.find(o => o.id === closeId);
            const ordCart = closeId === activeOrderId ? cart : (ordToClose?.cart || []);
            if (ordCart.length > 0) {
                if (!confirm(`Đơn này đang có ${ordCart.length} sản phẩm. Bạn có chắc muốn đóng đơn này?`)) return;
            }
            orders = orders.filter(o => o.id !== closeId);
            if (orders.length === 0) {
                orders = [{ id: Date.now(), name: 'Đơn 1', cart: [], selectedCustomer: null, note: '', discount: 0, paymentMethod: 'cash' }];
            }
            if (closeId === activeOrderId) {
                activeOrderId = orders[0].id;
                const ord = getActiveOrder();
                cart = ord.cart || [];
                selectedCustomer = ord.selectedCustomer || null;
                paymentMethod = ord.paymentMethod || 'cash';
                if (document.getElementById('pos-note')) document.getElementById('pos-note').value = ord.note || '';
                if (document.getElementById('discount')) document.getElementById('discount').value = ord.discount || 0;
                if (selectedCustomer) selectCustomer(selectedCustomer);
                else {
                    if (customerSearch) customerSearch.value = '';
                    if (clearCustomerBtn) clearCustomerBtn.style.display = 'none';
                    const infoBox = document.getElementById('pos-customer-info');
                    if (infoBox) infoBox.style.display = 'none';
                }
                setPaymentMethod(paymentMethod);
                renderCart();
            }
            renderOrdersTabs();
            saveOrdersState();
            focusPosSearch();
        }

        const btnAddPosOrder = document.getElementById('btn-add-pos-order');
        if (btnAddPosOrder) {
            btnAddPosOrder.onclick = () => addNewOrder();
        }

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

        async function tryBarcodeSearch(query) {
            const looksLikeBarcode = /^\d{8,14}$/.test(query);

            if (looksLikeBarcode) {
                const found = await addProductByBarcode(query);
                if (found) return;
                // Không tìm thấy trong DB → tra Open Food Facts rồi mở quick create
                const suggestion = await lookupOpenFoodFacts(query);
                openQuickCreateModal(query, suggestion);
                return;
            }

            // Không phải barcode → tìm theo tên/SKU
            try {
                const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
                const products = await res.json();
                const exact = products.find(p => p.sku && p.sku.toLowerCase() === query.toLowerCase());
                if (exact) {
                    addToCart(exact);
                    flashBarcodeHint('success', exact.name);
                } else if (products.length === 1) {
                    addToCart(products[0]);
                } else if (products.length > 1) {
                    showSearchDropdown(products);
                } else {
                    flashBarcodeHint('error', 'Không tìm thấy');
                }
            } catch (err) { console.error(err); }
        }

        async function addProductByBarcode(barcode) {
            try {
                const res = await fetch(`/api/products/barcode/${encodeURIComponent(barcode)}`);
                if (res.status === 404) return false;
                if (!res.ok) throw new Error('Lỗi API');
                const result = await res.json();
                const product = result.data;
                addToCart(product);
                flashBarcodeHint('success', product.name);
                return true;
            } catch (err) {
                console.error(err);
                return false;
            }
        }

        async function lookupOpenFoodFacts(barcode) {
            try {
                const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}`);
                if (!res.ok) return null;
                const data = await res.json();
                if (data.status !== 1 || !data.product) return null;
                const p = data.product;
                return {
                    name: p.product_name_vi || p.product_name || p.generic_name || '',
                    brand: p.brands || '',
                    image: p.image_front_url || p.image_url || '',
                    quantity: p.quantity || ''
                };
            } catch { return null; }
        }

        function flashBarcodeHint(type, text) {
            const hint = document.getElementById('barcode-hint');
            if (!hint) return;
            if (type === 'success') {
                hint.innerHTML = '<i data-lucide="check-circle-2" style="width:12px;height:12px;"></i> ' + text;
                hint.style.color = '#16a34a'; hint.style.background = '#f0fdf4';
            } else {
                hint.innerHTML = '<i data-lucide="alert-circle" style="width:12px;height:12px;"></i> Không thấy';
                hint.style.color = '#dc2626'; hint.style.background = '#fef2f2';
            }
            if (window.lucide) lucide.createIcons();
            setTimeout(() => {
                hint.innerHTML = '<i data-lucide="scan-line" style="width:12px;height:12px;"></i> Quét mã';
                hint.style.color = 'var(--text-muted)'; hint.style.background = '#f1f5f9';
                if (window.lucide) lucide.createIcons();
            }, 1800);
        }

        function openQuickCreateModal(barcode, suggestion) {
            fetch('/api/categories').then(r => r.json()).then(categories => {
                const catOptions = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
                const suggestName = suggestion ? (suggestion.brand ? suggestion.brand + ' ' + suggestion.name : suggestion.name).trim() : '';
                const suggestImg = suggestion?.image || '';

                const modalHTML = `
                    <div style="display:flex; gap:16px; margin-bottom:20px; padding:14px 18px; background:#f0fdf4; border:1px solid #86efac; border-radius:10px; align-items:center;">
                        ${suggestImg ? `<img src="${suggestImg}" style="width:48px;height:48px;object-fit:contain;border-radius:8px;border:1px solid #e2e8f0;">` : '<div style="width:44px;height:44px;background:#dcfce7;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i data-lucide="package" style="width:22px;color:#16a34a"></i></div>'}
                        <div>
                            <div style="font-size:14px;font-weight:700;color:#166534;">🔍 Đã quét mã: <code style="background:#dcfce7;padding:3px 10px;border-radius:6px;font-weight:800;font-size:13px;">${barcode}</code></div>
                            <div style="font-size:12px;color:#15803d;margin-top:3px;">${suggestion && suggestion.name ? 'Tìm thấy gợi ý sản phẩm từ Open Food Facts' : 'Mã chưa có trong hệ thống – điền thông tin bên dưới để bán'}</div>
                        </div>
                    </div>
                    <form id="quick-create-form">
                        <input type="hidden" name="barcode" value="${barcode}">
                        
                        <div class="form-row" style="display:flex; gap:16px; margin-bottom:16px;">
                            <div style="flex:2;">
                                <label style="font-weight:600; font-size:13px; margin-bottom:6px; display:block;">Tên sản phẩm <span style="color:#dc2626">*</span></label>
                                <input type="text" name="name" id="quick-name" class="form-control" required value="${suggestName}" placeholder="Nhập tên sản phẩm..." style="height:46px; border-radius:8px; font-weight:600; font-size:14px; box-sizing:border-box;">
                            </div>
                            <div style="flex:1;">
                                <label style="font-weight:600; font-size:13px; margin-bottom:6px; display:block;">Danh mục</label>
                                <select name="category_id" class="form-control" style="height:46px; border-radius:8px; font-size:14px; box-sizing:border-box;">
                                    <option value="">Khác / Bách hóa</option>
                                    ${catOptions}
                                </select>
                            </div>
                        </div>

                        <div class="form-row" style="display:flex; gap:16px; margin-bottom:16px;">
                            <div style="flex:2;">
                                <label style="font-weight:600; font-size:13px; margin-bottom:6px; display:block;">Giá bán (đ) <span style="color:#dc2626">*</span></label>
                                <input type="text" name="selling_price" id="quick-selling-price" class="form-control" required
                                    placeholder="0"
                                    style="height:46px; border-radius:8px; font-weight:800; font-size:16px; color:var(--primary-color); text-align:right; box-sizing:border-box;"
                                    onfocus="this.select()"
                                    oninput="this.value=this.value.replace(/[^0-9]/g,'').replace(/\\B(?=(\\d{3})+(?!\\d))/g,',')">
                            </div>
                            <div style="flex:1;">
                                <label style="font-weight:600; font-size:13px; margin-bottom:6px; display:block;">Đơn vị tính</label>
                                <select name="unit" class="form-control" id="quick-unit-select" style="height:46px; border-radius:8px; font-size:14px; box-sizing:border-box;"
                                    onchange="if(this.value==='__other__'){document.getElementById('quick-unit-custom').style.display='block';document.getElementById('quick-unit-custom').focus();}">
                                    <option value="Cái">Cái</option>
                                    <option value="Hộp">Hộp</option>
                                    <option value="Lon">Lon</option>
                                    <option value="Chai">Chai</option>
                                    <option value="Gói">Gói</option>
                                    <option value="Túi">Túi</option>
                                    <option value="Thùng">Thùng</option>
                                    <option value="Bịch">Bịch</option>
                                    <option value="Kg">Kg</option>
                                    <option value="Lít">Lít</option>
                                    <option value="Gram">Gram</option>
                                    <option value="__other__">— Tùy chỉnh (gõ tay)...</option>
                                </select>
                                <input type="text" name="unit" id="quick-unit-custom" class="form-control"
                                    placeholder="Nhập ĐVT..."
                                    style="display:none; margin-top:6px; height:46px; border-radius:8px; box-sizing:border-box;">
                            </div>
                            <div style="flex:1;">
                                <label style="font-weight:600; font-size:13px; color:#64748b; margin-bottom:6px; display:block;">Mã SKU</label>
                                <input type="text" name="sku" class="form-control" placeholder="Tự sinh nếu trống" style="height:46px; border-radius:8px; font-size:14px; box-sizing:border-box;">
                            </div>
                        </div>

                        <div style="margin-top:12px;">
                            <button type="submit" class="btn btn-primary btn-block" style="height:48px; font-size:15px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:8px; border-radius:8px; width:100%; border:none;">
                                <i data-lucide="shopping-cart" style="width:18px;height:18px;"></i>
                                <span>LƯU SẢN PHẨM & THÊM VÀO GIỎ HÀNG</span>
                            </button>
                        </div>
                    </form>`;

                showModal('Thêm nhanh sản phẩm mới', modalHTML, async (data) => {
                    try {
                        // Parse giá bán: bỏ dấu phẩy ngăn cách ngàn (ví dụ: "5,000" -> 5000)
                        const sellingPrice = parseInt((data.selling_price || '0').replace(/,/g, '')) || 0;
                        if (!data.name || sellingPrice <= 0) { alert('Vui lòng điền tên và giá bán!'); return false; }
                        if (!data.sku) delete data.sku;
                        // Xử lý unit: nếu có hai trường name="unit", lấy giá trị từ custom nếu có
                        const unitCustomEl = document.getElementById('quick-unit-custom');
                        const unitSelectEl = document.getElementById('quick-unit-select');
                        let unit = 'Cái';
                        if (unitCustomEl && unitCustomEl.style.display !== 'none') {
                            unit = unitCustomEl.value.trim() || 'Cái';
                        } else if (unitSelectEl) {
                            unit = unitSelectEl.value === '__other__' ? 'Cái' : unitSelectEl.value;
                        }
                        // Sản phẩm mới tạo tại POS: giá nhập = 0, tồn kho = 0
                        // Tồn kho sẽ được nhập đúng qua Phiếu Nhập Hàng
                        const payload = {
                            name: data.name,
                            sku: data.sku,
                            barcode: data.barcode,
                            category_id: data.category_id || undefined,
                            unit: unit,
                            selling_price: sellingPrice,
                            cost_price: 0,
                            stock_quantity: 0
                        };
                        if (!payload.sku) delete payload.sku;
                        if (!payload.category_id) delete payload.category_id;
                        const res = await fetch('/api/products', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        if (!res.ok) { alert('Lỗi lưu sản phẩm'); return false; }
                        const saved = await res.json();
                        // Thêm vào giỏ hàng: hàng đang trên tay khách, bán luôn
                        addToCart({ ...payload, id: saved.id, selling_price: sellingPrice, stock_quantity: 0 });
                        flashBarcodeHint('success', payload.name);
                        setTimeout(() => { searchInput.focus(); }, 100);
                        return true;
                    } catch (e) { console.error(e); alert('Lỗi hệ thống'); return false; }
                }, 'modal-lg');

                setTimeout(() => {
                    const nameEl = document.getElementById('quick-name');
                    if (nameEl) nameEl.focus();
                    if (window.lucide) lucide.createIcons();
                }, 150);
            }).catch(err => { console.error(err); });
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
                const cashEl = document.getElementById('customer-cash');
                if (cashEl) cashEl.value = '';
                const creditPaidEl = document.getElementById('customer-credit-paid');
                if (creditPaidEl) creditPaidEl.value = '';
            } else {
                emptyMsg.style.display = 'none'; if (cartTable) cartTable.style.display = 'table';
                cartItems.innerHTML = cart.map((item, index) => `
                    <tr><td><div style="font-weight: 600;">${item.name}</div><div style="font-size: 12px; color: var(--text-muted);">${item.sku || ''}</div></td><td>${item.unit || 'Cái'}</td><td>${item.selling_price.toLocaleString()}đ</td><td align="center"><input type="number" value="${item.quantity}" min="1" class="qty-input form-control" style="width: 80px; text-align: center; padding: 6px; margin: 0; display: inline-block;" data-index="${index}"></td><td style="font-weight: 700;">${(item.selling_price * item.quantity).toLocaleString()}đ</td><td><button class="btn-icon text-danger btn-remove" data-index="${index}"><i data-lucide="trash-2"></i></button></td></tr>
                `).join('');
                if (window.lucide) {
                    lucide.createIcons();
                    document.querySelectorAll('svg[data-lucide]').forEach(el => el.removeAttribute('data-lucide'));
                }
            }
            updateTotals();
            saveOrdersState();
            renderOrdersTabs();
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
                const cash = parseInt(creditPaidEl?.value.replace(/[^0-9]/g, '')) || 0;
                const remaining = currentTotal - cash;
                const debtEl = document.getElementById('pos-remaining-debt');
                if (debtEl) debtEl.textContent = (remaining > 0 ? remaining : 0).toLocaleString() + 'đ';
            } else {
                const cashEl = document.getElementById('customer-cash');
                const cash = parseInt(cashEl?.value.replace(/[^0-9]/g, '')) || 0;
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
                ? (parseInt(document.getElementById('customer-credit-paid')?.value.replace(/[^0-9]/g, '')) || 0)
                : (parseInt(document.getElementById('customer-cash')?.value.replace(/[^0-9]/g, '')) || 0);
            
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
                    const isAutoPrint = document.getElementById('pos-auto-print')?.checked;
                    const saleId = result.saleId;
                    const changeAmt = paymentMethod === 'credit' ? 0 : Math.max(0, paid - currentTotal);
                    const changeStrText = changeAmt > 0 ? ` (Tiền thừa: ${changeAmt.toLocaleString()}đ)` : '';

                    if (isAutoPrint) {
                        window.printInvoice(saleId);
                    }
                    
                    // Thông báo Thành công trực tiếp, KHÔNG mở popup rườm rà
                    alert(`Thanh toán thành công! Mã đơn: #BL-${saleId ? saleId.slice(-6).toUpperCase() : ''}${changeStrText}`);
                    
                    // Switch to remaining order tab or reset
                    orders = orders.filter(o => o.id !== activeOrderId);
                    if (orders.length === 0) {
                        orders = [{ id: Date.now(), name: 'Đơn 1', cart: [], selectedCustomer: null, note: '', discount: 0, paymentMethod: 'cash' }];
                    }
                    activeOrderId = orders[0].id;
                    const nextOrd = getActiveOrder();
                    cart = nextOrd.cart || [];
                    selectedCustomer = nextOrd.selectedCustomer || null;
                    paymentMethod = nextOrd.paymentMethod || 'cash';
                    
                    document.getElementById('customer-cash').value = ''; 
                    const creditPaidEl = document.getElementById('customer-credit-paid');
                    if (creditPaidEl) creditPaidEl.value = '';
                    document.getElementById('discount').value = '0';
                    if (document.getElementById('pos-note')) document.getElementById('pos-note').value = nextOrd.note || '';
                    if (selectedCustomer) selectCustomer(selectedCustomer);
                    else {
                        if (customerSearch) customerSearch.value = '';
                        if (clearCustomerBtn) clearCustomerBtn.style.display = 'none';
                        const infoBox = document.getElementById('pos-customer-info');
                        if (infoBox) infoBox.style.display = 'none';
                    }
                    setPaymentMethod(paymentMethod);
                    renderCart();
                    renderOrdersTabs();
                    saveOrdersState();
                } else { 
                    alert('Lỗi: ' + result.error); 
                }
            } catch (err) { 
                console.error(err); 
                alert('Lỗi hệ thống!'); 
            }
        });

        // Keyboard shortcuts for POS
        if (window._posHotkeyListener) {
            document.removeEventListener('keydown', window._posHotkeyListener);
        }
        window._posHotkeyListener = function posHotkeys(e) {
            if (!document.querySelector('.pos-view')) return;
            // Bỏ qua khi đang focus vào input/textarea (ngoại trừ các phím F)
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                if (e.key === 'Escape') { 
                    const results = document.getElementById('search-results');
                    if(results) results.style.display = 'none';
                }
                if (!e.key.startsWith('F')) return;
            }
            if (e.key === 'F2') {
                e.preventDefault();
                document.getElementById('product-search')?.focus();
            }
            if (e.key === 'F4') {
                e.preventDefault();
                document.getElementById('customer-cash')?.focus();
                document.getElementById('customer-cash')?.select();
            }
            if (e.key === 'F8') {
                e.preventDefault();
                document.getElementById('btn-checkout')?.click();
            }
        };
        document.addEventListener('keydown', window._posHotkeyListener);
        
        // Exact cash button
        const btnExactCash = document.getElementById('btn-exact-cash');
        if (btnExactCash) {
            btnExactCash.addEventListener('click', () => {
                let val = Math.ceil(currentTotal / 1000) * 1000;
                const cashInput = document.getElementById('customer-cash');
                if (cashInput) {
                    cashInput.value = val.toLocaleString('vi-VN');
                    updateChange();
                }
            });
        }

        // Auto-print preference binding
        const autoPrintCb = document.getElementById('pos-auto-print');
        if (autoPrintCb) {
            autoPrintCb.checked = localStorage.getItem('pos_auto_print') === 'true';
            autoPrintCb.onchange = () => {
                localStorage.setItem('pos_auto_print', autoPrintCb.checked.toString());
            };
        }

        // Render initial cart, orders tabs, customer info on page init!
        if (activeOrd.note && document.getElementById('pos-note')) {
            document.getElementById('pos-note').value = activeOrd.note;
        }
        if (activeOrd.discount && document.getElementById('discount')) {
            document.getElementById('discount').value = activeOrd.discount;
        }
        if (selectedCustomer) {
            selectCustomer(selectedCustomer);
        }
        renderCart();
        renderOrdersTabs();
        focusPosSearch();
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
                            <div class="mb-3" style="flex: 2;"><label>Tên sản phẩm</label><input type="text" id="q-name" class="form-control"></div>
                            <div class="mb-3"><label>Mã vạch</label><input type="text" id="q-barcode" class="form-control" readonly style="background: #f8fafc; font-weight: 600; color: #15803d; border-color: #bbf7d0;"></div>
                            <div class="mb-3"><label>Mã SKU</label><input type="text" id="q-sku" class="form-control" placeholder="Để trống tự sinh"></div>
                        </div>
                        <div class="form-row">
                            <div class="mb-3"><label>Danh mục</label>
                                <select id="q-cat" class="form-control">
                                    <option value="">Khác</option>
                                    ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="mb-3"><label>ĐVT</label><input type="text" id="q-unit" class="form-control" value="Cái"></div>
                        </div>
                        <div class="form-row">
                            <div class="mb-3"><label>Giá nhập (đ)</label><input type="number" id="q-cost" class="form-control" value="0" min="0"></div>
                            <div class="mb-3"><label>Giá bán (đ) <span style="color:#dc2626">*</span></label><input type="number" id="q-price" class="form-control" value="0" min="0" required></div>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button id="btn-save-quick-sp" class="btn btn-primary" style="flex: 2;">LƯU VÀ THÊM VÀO PHIẾU</button>
                            <button id="btn-cancel-quick-sp" class="btn" style="flex: 1; background: #f1f5f9;">HỦY</button>
                        </div>
                    </div>

                    <div style="max-height: 400px; overflow-y: auto; background: white; border-radius: 12px; border: 1px solid var(--border-color);">
                        <table class="data-table po-table" style="margin: 0; width: 100%; table-layout: fixed;">
                            <thead style="position: sticky; top: 0; z-index: 10; background: #f8fafc;">
                                <tr>
                                    <th style="width: 26%; text-align: left; padding: 10px 12px;">Sản phẩm</th>
                                    <th style="width: 18%; text-align: right; padding: 10px 12px;">Giá nhập</th>
                                    <th style="width: 12%; text-align: center; padding: 10px 6px;">Số lượng</th>
                                    <th style="width: 16%; text-align: center; padding: 10px 6px;">Quy cách</th>
                                    <th style="width: 21%; text-align: right; padding: 10px 12px;">Thành tiền</th>
                                    <th style="width: 7%; text-align: center; padding: 10px 4px;"></th>
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
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                    <label style="font-weight: 700; color: var(--text-muted); font-size: 11px; text-transform: uppercase; margin: 0;">Đã thanh toán NCC</label>
                                    <button type="button" id="btn-pay-full" style="background: #22c55e; color: white; border: none; border-radius: 6px; padding: 3px 10px; font-size: 11px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);">
                                        <i data-lucide="check-circle-2" style="width: 12px; height: 12px;"></i> Thanh toán đủ
                                    </button>
                                </div>
                                <input type="text" id="po-paid-amount" class="form-control" placeholder="0 = nợ toàn bộ" style="font-size: 18px; font-weight: 700; text-align: right; background: white; border-color: #fb923c;" onfocus="this.select()">
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

            // Auto-focus product search input immediately upon opening modal
            setTimeout(() => { if (searchInput) searchInput.focus(); }, 150);

            // Quick Add SP Logic
            document.getElementById('btn-quick-add-sp').onclick = () => {
                quickBox.style.display = 'block';
                document.getElementById('q-name').value = searchInput.value;
                document.getElementById('q-name').focus();
            };
            document.getElementById('btn-cancel-quick-sp').onclick = () => quickBox.style.display = 'none';
            document.getElementById('btn-save-quick-sp').onclick = async () => {
                const name = document.getElementById('q-name').value;
                let sku = document.getElementById('q-sku').value;
                if (!sku || sku.trim() === '') {
                    sku = 'SP' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
                }
                const barcode = document.getElementById('q-barcode').value;
                let category_id = document.getElementById('q-cat').value;
                if (!category_id) category_id = undefined;
                const unit = document.getElementById('q-unit').value;
                const cost_price = parseInt(document.getElementById('q-cost').value) || 0;
                const selling_price = parseInt(document.getElementById('q-price').value) || 0;

                if (!name || !selling_price) { alert('Vui lòng nhập tên và giá bán sản phẩm!'); return; }

                try {
                    const res = await fetch('/api/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, sku, barcode, category_id, unit, cost_price, selling_price, stock_quantity: 0 })
                    });
                    const newProd = await res.json();
                    if (res.ok) {
                        poItems.push({ 
                            product_id: newProd.id, 
                            name: newProd.name, 
                            cost_price: cost_price, 
                            quantity: 1,
                            pack_qty: 1
                        });
                        renderPoItems();
                        quickBox.style.display = 'none';
                        searchInput.value = '';
                    } else {
                        alert('Lỗi từ hệ thống: ' + (newProd.error || 'Vui lòng kiểm tra lại dữ liệu'));
                    }
                } catch (err) { alert('Lỗi khi thêm sản phẩm nhanh'); }
            };

            searchInput.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = searchInput.value.trim();
                    if (!query) return;

                    const looksLikeBarcode = /^\d{8,14}$/.test(query);
                    if (looksLikeBarcode) {
                        try {
                            const res = await fetch(`/api/products/barcode/${encodeURIComponent(query)}`);
                            if (res.ok) {
                                const result = await res.json();
                                const product = result.data;
                                const existing = poItems.find(i => i.product_id == product.id);
                                if (existing) {
                                    existing.quantity++;
                                } else {
                                    poItems.push({ 
                                        product_id: product.id, 
                                        name: product.name, 
                                        cost_price: parseFloat(product.cost_price) || 0, 
                                        quantity: 1,
                                        pack_qty: 1
                                    });
                                }
                                renderPoItems();
                                searchInput.value = '';
                                resultsDiv.style.display = 'none';
                            } else {
                                // 404 -> Not found, quick create
                                try {
                                    const ofRes = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(query)}`);
                                    let name = '';
                                    if (ofRes.ok) {
                                        const ofData = await ofRes.json();
                                        if (ofData.status === 1 && ofData.product) {
                                            name = ofData.product.product_name || '';
                                        }
                                    }
                                    quickBox.style.display = 'block';
                                    document.getElementById('q-name').value = name;
                                    document.getElementById('q-barcode').value = query;
                                    document.getElementById('q-sku').value = '';
                                    document.getElementById('q-name').focus();
                                } catch (err) {
                                    quickBox.style.display = 'block';
                                    document.getElementById('q-barcode').value = query;
                                    document.getElementById('q-sku').value = '';
                                    document.getElementById('q-name').focus();
                                }
                            }
                        } catch(err) { console.error(err); }
                    }
                }
            });

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
                                quantity: 1,
                                pack_qty: 1
                            });
                        }
                        renderPoItems();
                        resultsDiv.style.display = 'none';
                        searchInput.value = '';
                    };
                });
            });

            // Hide PO search results when clicking outside
            document.addEventListener('click', (e) => {
                if (searchInput && resultsDiv && !searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
                    resultsDiv.style.display = 'none';
                }
            });

            // Real-time debt calculation helper
            function updateDebtIndicator() {
                const total = Math.round(poItems.reduce((acc, i) => acc + (i.subtotal !== undefined ? i.subtotal : (Number(i.cost_price) * Number(i.quantity))), 0));
                const totalText = document.getElementById('po-total');
                if (totalText) totalText.innerText = total.toLocaleString() + 'đ';
                const paidInput = document.getElementById('po-paid-amount');
                const debtDisplay = document.getElementById('po-debt-display');
                const debtValue = document.getElementById('po-debt-value');
                if (!paidInput || !debtDisplay || !debtValue) return;
                const paid = parseInt(paidInput.value.toString().replace(/[^0-9]/g, ''), 10) || 0;
                const debt = Math.max(0, total - paid);
                debtValue.innerText = debt.toLocaleString() + 'đ';
                debtDisplay.style.color = debt > 0 ? '#ef4444' : '#22c55e';
                debtDisplay.querySelector('span.debt-label').innerText = debt > 0 ? 'Còn nợ NCC:' : 'Thanh toán đủ:';
            }

            function renderPoItems() {
                itemsTable.innerHTML = poItems.length === 0 
                  ? '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted); opacity: 0.5;">Chưa có sản phẩm nào được chọn</td></tr>'
                  : poItems.map((item, idx) => `
                    <tr>
                        <td style="font-weight: 600; text-align: left; padding: 10px 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</td>
                        <td style="text-align: right; padding: 10px 12px;"><input type="text" class="po-input po-cost" data-idx="${idx}" value="${Number(item.cost_price).toLocaleString('vi-VN')}" style="width: 100%; max-width: 100px; text-align: right; padding: 6px 8px; box-sizing: border-box;" onfocus="this.select()"></td>
                        <td style="text-align: center; padding: 10px 6px;"><input type="number" class="po-input po-qty" data-idx="${idx}" value="${item.quantity}" style="width: 100%; max-width: 55px; text-align: center; padding: 6px 4px; box-sizing: border-box;" onfocus="this.select()"></td>
                        <td style="text-align: center; padding: 10px 6px;">
                            <input type="number" class="po-input po-pack" data-idx="${idx}" value="${item.pack_qty || 1}" style="width: 100%; max-width: 55px; text-align: center; padding: 6px 4px; box-sizing: border-box;" title="Ví dụ: 1 thùng có 24 lon thì nhập 24" placeholder="1" onfocus="this.select()">
                            ${(item.pack_qty && item.pack_qty > 1) 
                                ? `<div style="font-size: 10px; color: #166534; font-weight: 700; margin-top: 3px; background: #dcfce7; padding: 2px 4px; border-radius: 4px; display: inline-block;">= ${item.quantity * item.pack_qty} cái</div>` 
                                : ''}
                        </td>
                        <td style="text-align: right; padding: 10px 12px;">
                            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 3px;">
                                <input type="text" class="po-input po-subtotal" data-idx="${idx}" value="${Number(item.subtotal !== undefined ? item.subtotal : (Number(item.cost_price) * Number(item.quantity))).toLocaleString('vi-VN')}" style="font-weight: 700; color: var(--text-main); text-align: right; width: 100%; max-width: 100px; padding: 6px 6px; box-sizing: border-box;" onfocus="this.select()">
                                <span style="font-weight: 700; font-size: 12px; flex-shrink: 0;">đ</span>
                            </div>
                        </td>
                        <td style="text-align: center; padding: 10px 4px;">
                            <button class="btn-remove po-remove-item" data-idx="${idx}" style="background: #fee2e2; color: #ef4444; border: none; border-radius: 50%; padding: 0; display: inline-flex; justify-content: center; align-items: center; width: 26px; height: 26px; cursor: pointer; font-size: 13px; font-weight: bold;" title="Xóa dòng này">✕</button>
                        </td>
                    </tr>
                `).join('');

                updateDebtIndicator();
                
                // Format number input helper
                const parseNum = (str) => parseInt(str.toString().replace(/[^0-9]/g, ''), 10) || 0;

                itemsTable.querySelectorAll('.po-cost').forEach(inp => {
                    inp.oninput = (e) => {
                        const raw = parseNum(e.target.value);
                        e.target.value = raw ? raw.toLocaleString('vi-VN') : '';
                    };
                    inp.onchange = (e) => { 
                        const item = poItems[e.target.dataset.idx];
                        item.cost_price = parseNum(e.target.value); 
                        item.subtotal = item.cost_price * item.quantity;
                        renderPoItems(); 
                    };
                });
                
                itemsTable.querySelectorAll('.po-qty').forEach(inp => inp.onchange = (e) => { 
                    const item = poItems[e.target.dataset.idx];
                    item.quantity = parseInt(e.target.value) || 0; 
                    item.subtotal = item.cost_price * item.quantity;
                    renderPoItems(); 
                });

                itemsTable.querySelectorAll('.po-pack').forEach(inp => inp.onchange = (e) => { 
                    const item = poItems[e.target.dataset.idx];
                    const val = parseInt(e.target.value);
                    item.pack_qty = isNaN(val) || val < 1 ? 1 : val;
                    renderPoItems(); 
                });
                
                itemsTable.querySelectorAll('.po-subtotal').forEach(inp => {
                    inp.oninput = (e) => {
                        const raw = parseNum(e.target.value);
                        e.target.value = raw ? raw.toLocaleString('vi-VN') : '';
                    };
                    inp.onchange = (e) => { 
                        const subtotal = parseNum(e.target.value);
                        const item = poItems[e.target.dataset.idx];
                        item.subtotal = subtotal;
                        if (item.quantity > 0) {
                            item.cost_price = Math.round(subtotal / item.quantity);
                        }
                        renderPoItems(); 
                    };
                });

                // Remove PO item button listener
                itemsTable.querySelectorAll('.po-remove-item').forEach(btn => {
                    btn.onclick = () => {
                        const idx = Number(btn.dataset.idx);
                        poItems.splice(idx, 1);
                        renderPoItems();
                    };
                });

                if (window.lucide) window.lucide.createIcons();

                // Bind paid_amount input to live recalculate
                const paidInput = document.getElementById('po-paid-amount');
                if (paidInput) {
                    paidInput.oninput = (e) => {
                        const raw = parseInt(e.target.value.toString().replace(/[^0-9]/g, ''), 10) || 0;
                        e.target.value = raw ? raw.toLocaleString('vi-VN') : '';
                        updateDebtIndicator();
                    };
                }

                // Quick action: Pay Full button
                const btnPayFull = document.getElementById('btn-pay-full');
                if (btnPayFull) {
                    btnPayFull.onclick = () => {
                        const total = Math.round(poItems.reduce((acc, i) => acc + (i.subtotal !== undefined ? i.subtotal : (Number(i.cost_price) * Number(i.quantity))), 0));
                        if (paidInput) {
                            paidInput.value = total ? total.toLocaleString('vi-VN') : '';
                            updateDebtIndicator();
                        }
                    };
                }
            }

            document.getElementById('btn-save-po').onclick = async () => {
                if (poItems.length === 0) { alert('Chưa có mặt hàng nào!'); return; }
                const supplier_id = document.getElementById('po-supplier').value;
                const note = document.getElementById('po-note').value;
                const total_amount = Math.round(poItems.reduce((acc, i) => acc + (i.subtotal !== undefined ? i.subtotal : (Number(i.cost_price) * Number(i.quantity))), 0));
                
                const paidInputVal = document.getElementById('po-paid-amount')?.value || '0';
                const paid_amount = parseInt(paidInputVal.toString().replace(/[^0-9]/g, ''), 10) || 0;
                
                try {
                    const res = await fetch('/api/purchases', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            purchaseData: { supplier_id, user_id: JSON.parse(localStorage.getItem('user'))?.id, total_amount, paid_amount, note },
                            items: poItems.map(item => {
                                const pack = item.pack_qty || 1;
                                const actual_quantity = item.quantity * pack;
                                const st = item.subtotal !== undefined ? item.subtotal : (item.cost_price * item.quantity);
                                const actual_cost_price = actual_quantity > 0 ? Math.round(st / actual_quantity) : item.cost_price;
                                return {
                                    ...item,
                                    quantity: actual_quantity,
                                    cost_price: actual_cost_price
                                };
                            })
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
                        if (wrapper) {
                            wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
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

    let allProductsData = [];
    async function loadProducts() {
        try {
            const [pRes, cRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/categories')
            ]);
            allProductsData = await pRes.json();
            const categories = await cRes.json();
            
            const catFilter = document.getElementById('product-category-filter');
            if (catFilter) {
                catFilter.innerHTML = '<option value="">Tất cả danh mục</option>' + categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
            }

            const searchInput = document.getElementById('product-list-search');
            const stockFilter = document.getElementById('product-stock-filter');

            function applyProductFilters() {
                const list = document.getElementById('products-list');
                if (!list) return;
                const searchVal = searchInput?.value.trim().toLowerCase() || '';
                const catVal = catFilter?.value || '';
                const stockVal = stockFilter?.value || '';

                const filtered = allProductsData.filter(p => {
                    const threshold = p.min_stock || 5;
                    const matchesSearch = searchVal === '' || 
                        p.name.toLowerCase().includes(searchVal) || 
                        (p.sku && p.sku.toLowerCase().includes(searchVal)) || 
                        (p.barcode && p.barcode.toLowerCase().includes(searchVal));
                    
                    const matchesCat = catVal === '' || String(p.category_id) === String(catVal);

                    let matchesStock = true;
                    if (stockVal === 'out_of_stock') {
                        matchesStock = p.stock_quantity <= 0;
                    } else if (stockVal === 'low_stock') {
                        matchesStock = p.stock_quantity > 0 && p.stock_quantity <= threshold;
                    } else if (stockVal === 'in_stock') {
                        matchesStock = p.stock_quantity > threshold;
                    }

                    return matchesSearch && matchesCat && matchesStock;
                });

                paginateAdminTable('products', filtered, list, (p) => {
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
                            <td style="font-size:11px; color: var(--text-muted);">
                                ${p.barcode ? `<span style="display:inline-flex;align-items:center;gap:3px;background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;border-radius:4px;padding:2px 6px;font-weight:600;"><i data-lucide="scan-barcode" style="width:10px;height:10px;"></i>${p.barcode}</span>` : '<span style="color:#cbd5e1;">---</span>'}
                            </td>
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

            if (searchInput) searchInput.oninput = applyProductFilters;
            if (catFilter) catFilter.onchange = applyProductFilters;
            if (stockFilter) stockFilter.onchange = applyProductFilters;

            applyProductFilters();
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
                    ? `<span class="badge" style="background:#fef2f2;color:#ef4444;border-radius:8px;">Nợ: ${Math.round(balance).toLocaleString()}đ</span>`
                    : `<span class="badge badge-success" style="border-radius:8px;">Đã trả đủ</span>`;
                return `
                <tr data-id="${p.id}">
                    <td>${new Date(p.order_date).toLocaleDateString('vi-VN')}</td>
                    <td>${p.supplier_name || 'N/A'}</td>
                    <td style="font-weight: 700;">${Math.round(Number(p.total_amount)).toLocaleString()}đ</td>
                    <td style="color: #22c55e; font-weight: 600;">${Math.round(paid).toLocaleString()}đ</td>
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
            else if (s.status === 'returned') statusHtml = '<span class="sale-badge" style="background:#fee2e2; color:#991b1b; padding:4px 8px; border-radius:100px; font-size:11px; font-weight:700;">Đã trả hết</span>';
            else if (s.status === 'partially_returned') statusHtml = '<span class="sale-badge" style="background:#fef3c7; color:#b45309; padding:4px 8px; border-radius:100px; font-size:11px; font-weight:700;">Trả 1 phần</span>';
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

            const canReturn = s.status === 'completed' || s.status === 'partially_returned';

            return `
            <tr data-id="${s.id}" style="${rowStyle}">
                <td><span style="font-weight: 700; color: var(--primary-color);">#BL-${s.id.slice(-6).toUpperCase()}</span></td>
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
                <td style="text-align:center; white-space:nowrap;">
                    ${s.status === 'pending' ? `<button class="btn-icon" style="color:#4f46e5;" onclick="window.updateOrderStatus('${s.id}', 'delivering', event)" title="Đi giao hàng"><i data-lucide="truck"></i></button>` : ''}
                    ${s.status === 'delivering' ? `<button class="btn-icon" style="color:#22c55e;" onclick="window.updateOrderStatus('${s.id}', 'completed', event)" title="Đã giao & Nhận tiền"><i data-lucide="check-circle"></i></button>` : ''}
                    ${(s.status === 'pending' || s.status === 'delivering') ? `<button class="btn-icon" style="color:#ef4444;" onclick="window.updateOrderStatus('${s.id}', 'cancelled', event)" title="Hủy đơn"><i data-lucide="x-circle"></i></button>` : ''}
                    <button class="btn-icon" style="color:var(--primary-color);" title="Xem chi tiết" onclick="window.showSaleDetailModal('${s.id}', event)"><i data-lucide="eye"></i></button>
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
            const hdId = `#bl-${s.id.slice(-6).toUpperCase()}`.toLowerCase();
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
                const top5Best = data.bestSellers.slice(0, 5);
                bestTable.innerHTML = top5Best.length > 0 
                    ? top5Best.map(b => `<tr><td>${b.name}</td><td style="font-weight:700; text-align:right;">${b.totalQty}</td></tr>`).join('')
                    : '<tr><td colspan="2" class="text-muted">Chưa có dữ liệu</td></tr>';
            }
            if (slowTable && data.highStock) {
                const top5Stock = data.highStock.slice(0, 5);
                slowTable.innerHTML = top5Stock.length > 0
                    ? top5Stock.map(h => `<tr><td>${h.name}</td><td style="font-weight:700; text-align:right;">${h.stock_quantity}</td></tr>`).join('')
                    : '<tr><td colspan="2" class="text-muted">Kho đang trống</td></tr>';
            }
            if (recentOrdersTable && data.recentOrders) {
                const top5Recent = data.recentOrders.slice(0, 5);
                recentOrdersTable.innerHTML = top5Recent.length > 0
                    ? top5Recent.map(o => `<tr><td>${o.customer_name}</td><td style="font-weight:700; text-align:right;">${o.final_amount.toLocaleString()}đ</td></tr>`).join('')
                    : '<tr><td colspan="2" class="text-muted">Chưa có đơn hàng</td></tr>';
            }

            // Render Chart 1: Revenue Line Chart
            const ctx = document.getElementById('revenueChart');
            if (ctx && data.dailyStats) {
                if (window.myChart) window.myChart.destroy();
                
                const labels = data.dailyStats.map(s => {
                    if (range === 'month') {
                        const parts = s._id.split('-');
                        return `Tháng ${parts[1]}/${parts[0]}`;
                    } else {
                        const parts = s._id.split('-');
                        if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
                        return s._id;
                    }
                });

                window.myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Doanh thu (đ)',
                                data: data.dailyStats.map(s => s.revenue),
                                borderColor: '#2563eb',
                                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                                fill: true,
                                tension: 0.35,
                                borderWidth: 3,
                                pointRadius: 4,
                                pointHoverRadius: 6
                            },
                            {
                                label: 'Lợi nhuận (đ)',
                                data: data.dailyStats.map(s => s.profit),
                                borderColor: '#16a34a',
                                backgroundColor: 'rgba(22, 163, 74, 0.05)',
                                borderDash: [5, 5],
                                fill: true,
                                tension: 0.35,
                                borderWidth: 2,
                                pointRadius: 3
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'top' },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `${context.dataset.label}: ${context.raw.toLocaleString()}đ`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) { return value.toLocaleString() + 'đ'; }
                                }
                            }
                        }
                    }
                });
            }

            // Render Chart 2: Order Status Doughnut Chart
            const statusCtx = document.getElementById('orderStatusChart');
            if (statusCtx) {
                if (window.statusChart) window.statusChart.destroy();
                window.statusChart = new Chart(statusCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Thành công', 'Chờ xử lý', 'Đã hủy'],
                        datasets: [{
                            data: [data.orders_completed || 0, data.orders_pending || 0, data.orders_cancelled || 0],
                            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom' }
                        },
                        cutout: '65%'
                    }
                });
            }

            // Render Chart 3: Top Products Bar Chart
            const barCtx = document.getElementById('topProductsChart');
            if (barCtx && data.bestSellers) {
                if (window.barChart) window.barChart.destroy();
                window.barChart = new Chart(barCtx, {
                    type: 'bar',
                    data: {
                        labels: data.bestSellers.map(b => b.name.length > 14 ? b.name.substring(0, 14) + '...' : b.name),
                        datasets: [{
                            label: 'Số lượng bán',
                            data: data.bestSellers.map(b => b.totalQty),
                            backgroundColor: 'rgba(139, 92, 246, 0.85)',
                            borderColor: '#7c3aed',
                            borderWidth: 1,
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } }
                    }
                });
            }

            // Render Chart 4: Category Sales Doughnut/Pie Chart
            const catCtx = document.getElementById('categorySalesChart');
            if (catCtx && data.categoryStats) {
                if (window.categoryChart) window.categoryChart.destroy();
                
                const palette = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
                const labels = data.categoryStats.map(c => c._id);
                const chartData = data.categoryStats.map(c => c.totalRevenue);
                const colors = labels.map((_, idx) => palette[idx % palette.length]);

                window.categoryChart = new Chart(catCtx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: chartData,
                            backgroundColor: colors,
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom' },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `${context.label}: ${context.raw.toLocaleString()}đ`;
                                    }
                                }
                            }
                        }
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
                        const top5Debtors = debtors.slice(0, 5);
                        debtTable.innerHTML = top5Debtors.map((c, idx) => `
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
        // Clear session data so next user starts fresh
        sessionStorage.removeItem('pos_cart');
        sessionStorage.removeItem('currentPage');
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
                    <label>Tổng nợ hiện tại: <strong style="color:var(--danger-color); font-size: 1.2rem;">${debt.toLocaleString('vi-VN')}đ</strong></label>
                </div>
                <div class="mb-3">
                    <label style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span>Số tiền thanh toán</span>
                        <button type="button" id="btn-pay-full-debt" style="background:#22c55e; color:white; border:none; border-radius:4px; padding:4px 10px; font-size:12px; font-weight:600; cursor:pointer;">Trả đủ</button>
                    </label>
                    <input type="text" name="amount" id="pay-debt-amount" class="form-control" required value="${debt.toLocaleString('vi-VN')}">
                    <div style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">Còn lại sau thanh toán: <strong id="preview-remaining-debt" style="color: #ef4444;">0đ</strong></div>
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
            data.amount = parseInt(data.amount.toString().replace(/[^0-9]/g, ''), 10) || 0;
            const res = await fetch('/api/supplier-payments/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ supplier_id: id, user_id: user?.id, ...data })
            });
            if (res.ok) { loadSuppliers(); return true; }
            else { const err = await res.json(); alert('Lỗi: ' + err.error); return false; }
        });

        setTimeout(() => {
            const amountInput = document.getElementById('pay-debt-amount');
            const previewRemaining = document.getElementById('preview-remaining-debt');
            const btnPayFull = document.getElementById('btn-pay-full-debt');
            
            const parseAmount = (val) => parseInt(val.toString().replace(/[^0-9]/g, ''), 10) || 0;
            
            if (amountInput) {
                amountInput.oninput = (e) => {
                    let val = parseAmount(e.target.value);
                    if (val > debt) val = debt;
                    e.target.value = val ? val.toLocaleString('vi-VN') : '';
                    
                    const remaining = Math.max(0, debt - val);
                    if (previewRemaining) {
                        previewRemaining.innerText = remaining.toLocaleString('vi-VN') + 'đ';
                        previewRemaining.style.color = remaining > 0 ? '#ef4444' : '#22c55e';
                    }
                };
            }
            
            if (btnPayFull) {
                btnPayFull.onclick = () => {
                    if (amountInput) {
                        amountInput.value = debt.toLocaleString('vi-VN');
                        if (previewRemaining) {
                            previewRemaining.innerText = '0đ';
                            previewRemaining.style.color = '#22c55e';
                        }
                    }
                };
            }
        }, 100);
    }

    async function handleViewDebt(customerId) {
        try {
            const customerRes = await fetch(`/api/customers/${customerId}`);
            if (!customerRes.ok) throw new Error('Không thể tải thông tin khách hàng');
            const customer = await customerRes.json();

            const salesRes = await fetch(`/api/sales/customer/${customerId}`);
            if (!salesRes.ok) throw new Error('Không thể tải lịch sử giao dịch');
            const sales = await salesRes.json();

            // Compute actual current debt strictly from active unpaid sales
            const actualTotalDebt = sales.reduce((sum, s) => {
                if (s.status !== 'cancelled' && s.status !== 'expired') {
                    return sum + Math.max(0, s.final_amount - (s.paid_amount || 0));
                }
                return sum;
            }, 0);

            // Sync backend debt if out of sync
            if (customer.debt !== actualTotalDebt) {
                fetch(`/api/customers/${customerId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ debt: actualTotalDebt })
                }).catch(console.error);
            }

            const salesHtml = sales.length === 0 
                ? `<tr><td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted); opacity: 0.5;">Không có lịch sử giao dịch nào</td></tr>`
                : sales.map(s => {
                    const dateStr = new Date(s.order_date).toLocaleString('vi-VN') || '---';
                    const invoiceCode = `#BL-${s.id.slice(-6).toUpperCase()}`;
                    
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
                        <div style="background: ${actualTotalDebt > 0 ? '#fef2f2' : '#f0fdf4'}; border: 1px solid ${actualTotalDebt > 0 ? '#fecaca' : '#bbf7d0'}; padding: 12px 24px; border-radius: 12px; text-align: center; min-width: 180px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); flex-shrink: 0;">
                            <div style="font-size: 11px; font-weight: 700; color: ${actualTotalDebt > 0 ? '#991b1b' : '#166534'}; text-transform: uppercase; letter-spacing: 0.5px;">Tổng nợ hiện tại</div>
                            <div style="font-size: 26px; font-weight: 900; color: ${actualTotalDebt > 0 ? '#dc2626' : '#16a34a'}; margin-top: 4px;">${actualTotalDebt.toLocaleString()}đ</div>
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
            const receiptCode = `#BL-${sale.id.slice(-6).toUpperCase()}`;
            printWin.document.write(`
                <html>
                <head>
                    <title>In biên lai - ${receiptCode}</title>
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
                        <h2 style="margin-top: 15px;">BIÊN LAI BÁN HÀNG</h2>
                    </div>
                    <div class="info">
                        <div>Mã BL: <strong>${receiptCode}</strong></div>
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
                        <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;">IN BIÊN LAI</button>
                    </div>
                </body>
                </html>
            `);
            printWin.document.close();
        } catch (err) { console.error(err); alert('Lỗi khi in biên lai!'); }
    };

    function setupStockTake() {
        const input = document.getElementById('stock-take-input');
        const feedback = document.getElementById('stock-take-feedback');
        const list = document.getElementById('stock-take-list');
        const btnSave = document.getElementById('btn-save-stock-take');
        
        if (!input) return;
        
        let scannedItems = {};
        
        function renderStockTakeList() {
            if (Object.keys(scannedItems).length === 0) {
                list.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px;">Chưa có sản phẩm nào được quét</td></tr>';
                return;
            }
            
            list.innerHTML = Object.values(scannedItems).map(item => {
                const diff = item.counted - item.stock_quantity;
                const diffColor = diff > 0 ? '#22c55e' : (diff < 0 ? '#ef4444' : '#64748b');
                const diffText = diff > 0 ? `+${diff}` : diff;
                
                return `
                <tr>
                    <td>
                        <div style="font-weight: 600;">${item.name}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${item.sku}</div>
                    </td>
                    <td style="text-align: center;">${item.stock_quantity}</td>
                    <td style="text-align: center;">
                        <input type="number" class="form-control" style="width: 80px; text-align: center; margin: 0 auto; height: 32px;" value="${item.counted}" onchange="window.updateStockTakeCount('${item.id}', this.value)">
                    </td>
                    <td style="text-align: center; font-weight: 700; color: ${diffColor};">${diffText}</td>
                    <td style="text-align: right;">
                        <button class="btn-remove" onclick="window.removeStockTakeItem('${item.id}')" style="background: #fee2e2; color: #ef4444; border: none; border-radius: 50%; padding: 4px; display: inline-flex; justify-content: center; align-items: center; width: 28px; height: 28px; cursor: pointer; transition: all 0.2s;"><i data-lucide="x" style="width: 14px; height: 14px;"></i></button>
                    </td>
                </tr>
                `;
            }).join('');
            if (window.lucide) window.lucide.createIcons();
        }
        
        window.updateStockTakeCount = (id, val) => {
            if (scannedItems[id]) {
                scannedItems[id].counted = parseInt(val) || 0;
                renderStockTakeList();
            }
        };
        
        window.removeStockTakeItem = (id) => {
            delete scannedItems[id];
            renderStockTakeList();
        };

        input.focus();
        input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const barcode = input.value.trim();
                if (!barcode) return;
                
                input.value = '';
                feedback.innerHTML = `<span style="color: #3b82f6;">Đang xử lý ${barcode}...</span>`;
                
                try {
                    const res = await fetch(`/api/products/barcode/${encodeURIComponent(barcode)}`);
                    if (res.ok) {
                        const result = await res.json();
                        const p = result.data;
                        
                        if (scannedItems[p.id]) {
                            scannedItems[p.id].counted++;
                        } else {
                            scannedItems[p.id] = {
                                id: p.id,
                                name: p.name,
                                sku: p.sku || p.barcode,
                                stock_quantity: p.stock_quantity || 0,
                                counted: 1
                            };
                        }
                        
                        feedback.innerHTML = `<span style="color: #22c55e; display: inline-flex; align-items: center; justify-content: center; gap: 6px;"><i data-lucide="check-circle" style="width: 18px; height: 18px;"></i> Đã đếm: ${p.name} (SL: ${scannedItems[p.id].counted})</span>`;
                        renderStockTakeList();
                        if (window.lucide) lucide.createIcons();
                    } else {
                        feedback.innerHTML = `<span style="color: #ef4444; display: inline-flex; align-items: center; justify-content: center; gap: 6px;"><i data-lucide="alert-circle" style="width: 18px; height: 18px;"></i> Không tìm thấy sản phẩm mã: ${barcode}</span>`;
                        if (window.lucide) lucide.createIcons();
                        // Optional: trigger sound
                    }
                } catch (err) {
                    feedback.innerHTML = `<span style="color: #ef4444;">Lỗi kết nối khi tra cứu mã ${barcode}</span>`;
                }
            }
        });
        
        btnSave.onclick = async () => {
            const items = Object.values(scannedItems);
            if (items.length === 0) return alert('Chưa có dữ liệu kiểm kê!');
            if (!confirm(`Xác nhận cập nhật số lượng tồn kho cho ${items.length} sản phẩm?`)) return;
            
            try {
                // We'll call the inventory adjust API for each item that has a difference
                let successCount = 0;
                for (const item of items) {
                    const diff = item.counted - item.stock_quantity;
                    if (diff !== 0) {
                        const type = diff > 0 ? 'in' : 'out';
                        const qty = Math.abs(diff);
                        
                        const diffText = diff > 0 ? `+${diff}` : diff;
                        
                        await fetch('/api/inventory', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                product_id: item.id,
                                type: type,
                                quantity: qty,
                                note: `Kiểm kê kho thực tế (đếm được ${item.counted}, lệch ${diffText})`
                            })
                        });
                        successCount++;
                    }
                }
                
                alert(`Kiểm kê hoàn tất. Đã cập nhật ${successCount} sản phẩm có sai lệch.`);
                scannedItems = {};
                renderStockTakeList();
                feedback.innerHTML = '';
            } catch (err) {
                console.error(err);
                alert('Có lỗi xảy ra khi lưu kết quả kiểm kê!');
            }
        };

        renderStockTakeList();
    }

    async function loadLowStockAlert() {
        try {
            const res = await fetch('/api/products');
            const products = await res.json();
            const lowStock = products.filter(p => p.stock_quantity <= (p.min_stock || 5) && p.stock_quantity >= 0);
            const container = document.getElementById('low-stock-alert');
            if (!container) return;
            if (lowStock.length === 0) {
                container.style.display = 'none';
                return;
            }
            container.style.display = 'block';
            container.innerHTML = `
                <div style='background:linear-gradient(135deg,#fef2f2,#fff7ed);border:1px solid #fed7aa;border-radius:16px;padding:20px;margin-bottom:20px;'>
                    <div style='display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:12px;'>
                        <div style='display:flex;align-items:center;gap:10px;'>
                            <div style='background:#f97316;border-radius:10px;padding:8px;display:flex;'><i data-lucide='alert-triangle' style='width:20px;height:20px;color:white;'></i></div>
                            <div>
                                <div style='font-weight:800;font-size:16px;color:#9a3412;'>${lowStock.length} sản phẩm sắp hết hàng!</div>
                                <div style='font-size:12px;color:#c2410c;'>Cần nhập thêm hàng sớm để phục vụ bán lẻ</div>
                            </div>
                        </div>
                        <button type="button" onclick="window.exportLowStockExcel()" style="background:#16a34a; color:white; border:none; border-radius:8px; padding:8px 14px; font-size:13px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow: 0 2px 4px rgba(22, 163, 74, 0.2);">
                            <i data-lucide="file-spreadsheet" style="width:16px;height:16px;"></i> Xuất danh sách gọi hàng (Excel)
                        </button>
                    </div>
                    <div style='display:flex;flex-wrap:wrap;gap:8px;'>
                        ${lowStock.slice(0,8).map(p => `<span style='background:white;border:1px solid #fed7aa;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:600;color:#9a3412;'>${p.name} <span style='color:#ef4444;'>(còn ${p.stock_quantity} ${p.unit || ''})</span></span>`).join('')}
                        ${lowStock.length > 8 ? `<span style='background:#f97316;color:white;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;'>+${lowStock.length - 8} SP nữa</span>` : ''}
                    </div>
                </div>`;
            if (window.lucide) lucide.createIcons();
        } catch(e) { console.error(e); }
    }

    // Global Export Helper for Low-Stock Re-ordering Excel via ExcelJS
    window.exportLowStockExcel = async function() {
        try {
            const res = await fetch('/api/products');
            const products = await res.json();
            const lowProducts = products.filter(p => p.stock_quantity <= (p.min_stock || 5));
            
            if (lowProducts.length === 0) {
                alert('Hiện tại kho không có sản phẩm nào sắp hết hoặc đã hết hàng!');
                return;
            }

            if (!window.ExcelJS) {
                alert('Đang kết nối thư viện ExcelJS, vui lòng chờ trong giây lát...');
                return;
            }

            const workbook = new ExcelJS.Workbook();
            const ws = workbook.addWorksheet('Danh sach Goi Hang');
            ws.views = [{ showGridLines: true }];

            const headers = ['STT', 'MÃ SKU', 'BARCODE', 'TÊN SẢN PHẨM', 'DANH MỤC', 'ĐƠN VỊ', 'TỒN HT', 'TỒN MIN', 'SL ĐỀ XUẤT NHẬP', 'GIÁ NHẬP DỰ KIẾN (Đ)', 'DỰ TOÁN TIỀN NHẬP (Đ)'];

            // Title Banner
            ws.mergeCells(1, 1, 2, headers.length);
            const titleCell = ws.getCell('A1');
            titleCell.value = 'DANH SÁCH SẢN PHẨM CẦN NHẬP THÊM (GỌI NHÀ CUNG CẤP) - THỦYR MART';
            titleCell.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FF15803D' } };
            titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
            titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

            ws.getRow(3).height = 10;

            // Headers
            const hRow = ws.getRow(4);
            hRow.height = 28;
            headers.forEach((h, idx) => {
                const cell = hRow.getCell(idx + 1);
                cell.value = h;
                cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } };
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFBBF7D0' } },
                    bottom: { style: 'medium', color: { argb: 'FF15803D' } },
                    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                    right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
                };
            });

            let totalEstCost = 0;
            lowProducts.forEach((p, idx) => {
                const minStock = p.min_stock || 5;
                const suggestQty = Math.max(10, (minStock * 2) - Math.max(0, p.stock_quantity));
                const costPrice = p.cost_price || 0;
                const estCost = suggestQty * costPrice;
                totalEstCost += estCost;

                const row = ws.addRow([
                    idx + 1,
                    p.sku || '',
                    p.barcode || '',
                    p.name,
                    p.category_name || 'Khác',
                    p.unit || 'Cái',
                    p.stock_quantity || 0,
                    minStock,
                    suggestQty,
                    costPrice,
                    estCost
                ]);

                row.height = 22;
                row.eachCell((cell, colNum) => {
                    cell.font = { name: 'Segoe UI', size: 10 };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: (idx % 2 === 0) ? 'FFF8FAFC' : 'FFFFFFFF' } };
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
                    };
                    if (colNum >= 7 && colNum <= 9) cell.alignment = { horizontal: 'right' };
                    if (colNum >= 10) {
                        cell.numFmt = '#,##0 "đ"';
                        cell.alignment = { horizontal: 'right' };
                    }
                });
            });

            const footerRow = ws.addRow(['', '', '', '', '', '', '', '', '', 'TỔNG VỐN DỰ TOÁN:', totalEstCost]);
            footerRow.height = 24;
            footerRow.eachCell(cell => {
                cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF15803D' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
                cell.border = { top: { style: 'thin', color: { argb: 'FDF59E0B' } }, bottom: { style: 'double', color: { argb: 'FDF59E0B' } } };
            });
            footerRow.getCell(11).numFmt = '#,##0 "đ"';
            footerRow.getCell(11).alignment = { horizontal: 'right' };

            // Auto column widths
            ws.columns.forEach(col => {
                let maxLen = 12;
                col.eachCell({ includeEmpty: false }, cell => {
                    const valStr = cell.value !== null && cell.value !== undefined ? cell.value.toString() : '';
                    if (valStr.length > maxLen && valStr.length < 50) {
                        maxLen = valStr.length;
                    }
                });
                col.width = maxLen + 4;
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const dateStr = new Date().toISOString().split('T')[0];
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `DanhSach_GoiHang_ThuyRMart_${dateStr}.xlsx`;
            link.click();
            URL.revokeObjectURL(link.href);
            alert(`Đã xuất file Excel gồm ${lowProducts.length} sản phẩm cần nhập thêm!`);
        } catch(e) {
            console.error(e);
            alert('Lỗi khi xuất danh sách gọi hàng!');
        }
    };

    // Full Formatted Report Exporter via ExcelJS (7 Comprehensive Sheets)
    async function exportExcelJSReport(data) {
        if (!window.ExcelJS) {
            alert('Đang kết nối thư viện ExcelJS, vui lòng thử lại sau giây lát...');
            return;
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'ThuyR Mart System';
        workbook.created = new Date();

        const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
        const HEADER_FONT = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        const TITLE_FONT = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FF1E40AF' } };
        const TITLE_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } };
        const BORDER_THIN = {
            top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
        const FOOTER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
        const FOOTER_FONT = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF0F172A' } };

        function styleSheetHeadersAndBorders(sheet, titleText, headers) {
            sheet.views = [{ showGridLines: true }];
            
            sheet.mergeCells(1, 1, 2, headers.length);
            const titleCell = sheet.getCell('A1');
            titleCell.value = titleText;
            titleCell.font = TITLE_FONT;
            titleCell.fill = TITLE_FILL;
            titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

            sheet.getRow(3).height = 10;

            const hRow = sheet.getRow(4);
            hRow.height = 28;
            headers.forEach((h, idx) => {
                const cell = hRow.getCell(idx + 1);
                cell.value = h;
                cell.font = HEADER_FONT;
                cell.fill = HEADER_FILL;
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                    bottom: { style: 'medium', color: { argb: 'FF1E3A8A' } },
                    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                    right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
                };
            });
        }

        function formatDataRowsAndAutoWidth(sheet, startRowIndex = 5) {
            sheet.eachRow((row, rowNum) => {
                if (rowNum < startRowIndex) return;
                const firstVal = row.getCell(1).value !== null && row.getCell(1).value !== undefined ? row.getCell(1).value.toString() : '';
                const isFooter = firstVal === '' || firstVal.includes('TỔNG');

                row.height = isFooter ? 24 : 22;
                row.eachCell((cell) => {
                    if (isFooter) {
                        cell.font = FOOTER_FONT;
                        cell.fill = FOOTER_FILL;
                        cell.border = {
                            top: { style: 'thin', color: { argb: 'FDF59E0B' } },
                            bottom: { style: 'double', color: { argb: 'FDF59E0B' } },
                            left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                            right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
                        };
                    } else {
                        cell.font = { name: 'Segoe UI', size: 10 };
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: rowNum % 2 === 0 ? 'FFF8FAFC' : 'FFFFFFFF' }
                        };
                        cell.border = BORDER_THIN;
                    }
                });
            });

            sheet.columns.forEach((col, colIdx) => {
                let maxLen = 0;
                sheet.eachRow((row, rowNum) => {
                    if (rowNum < 4) return;
                    const firstCellVal = row.getCell(1).value !== null && row.getCell(1).value !== undefined ? row.getCell(1).value.toString() : '';
                    if (firstCellVal.includes('TỔNG')) return;

                    const cellVal = row.getCell(colIdx + 1).value;
                    if (cellVal !== null && cellVal !== undefined) {
                        const str = cellVal.toString();
                        if (str.length > maxLen) {
                            maxLen = str.length;
                        }
                    }
                });
                col.width = Math.max(8, Math.min(38, maxLen + 4));
            });
        }

        // --- SHEET 1: Tóm tắt KPI & Tổng quan ---
        const ws1 = workbook.addWorksheet('1. Tóm tắt KPI');
        const headers1 = ['STT', 'TIÊU CHÍ BÁO CÁO', 'GIÁ TRỊ THỐNG KÊ'];
        styleSheetHeadersAndBorders(ws1, 'HỆ THỐNG QUẢN LÝ BÁN HÀNG THỦYR MART - TÓM TẮT BÁO CÁO KPI', headers1);

        let totalRefundedAllTime = 0;
        if (data.recentOrders) {
            totalRefundedAllTime = data.recentOrders.reduce((sum, o) => sum + (o.refunded_amount || 0), 0);
        }

        const kpiItems = [
            [1, 'Doanh thu thuần hôm nay', data.today_revenue || 0, '#,##0 "đ"'],
            [2, 'Lợi nhuận thuần hôm nay', data.dailyStats?.find(s => s._id === new Date().toISOString().split('T')[0])?.profit || 0, '#,##0 "đ"'],
            [3, 'Số đơn bán hôm nay', data.today_orders || 0, '#,##0'],
            [4, 'Đơn bán hoàn thành', data.orders_completed || 0, '#,##0'],
            [5, 'Đơn chờ xử lý', data.orders_pending || 0, '#,##0'],
            [6, 'Đơn đã hủy', data.orders_cancelled || 0, '#,##0'],
            [7, 'Tổng giá trị hàng đã hoàn trả', data.total_refunded_amount !== undefined ? data.total_refunded_amount : totalRefundedAllTime, '#,##0 "đ"'],
            [8, 'Tổng số lượng khách hàng', data.total_customers_count || 0, '#,##0'],
            [9, 'Sản phẩm sắp/đã hết hàng', data.low_stock_count || 0, '#,##0']
        ];

        kpiItems.forEach((item) => {
            const row = ws1.addRow([item[0], item[1], item[2]]);
            row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
            const cellVal = row.getCell(3);
            cellVal.numFmt = item[3];
            cellVal.alignment = { horizontal: 'right', vertical: 'middle' };
        });
        formatDataRowsAndAutoWidth(ws1);

        // --- SHEET 2: Nhật ký Hóa đơn Bán hàng ---
        if (data.recentOrders && data.recentOrders.length > 0) {
            const ws2 = workbook.addWorksheet('2. Nhật ký Hóa đơn');
            const headers2 = ['STT', 'MÃ BIÊN LAI', 'KHÁCH HÀNG', 'SĐT KHÁCH', 'SL MÓN', 'TỔNG TIỀN (Đ)', 'GIẢM GIÁ (Đ)', 'THANH TOÁN (Đ)', 'HOÀN TRẢ (Đ)', 'DOANH THU THUẦN (Đ)', 'ĐÃ THU (Đ)', 'P.THỨC', 'THU NGÂN', 'TRẠNG THÁI', 'NGÀY TẠO ĐƠN'];
            styleSheetHeadersAndBorders(ws2, 'DANH SÁCH NHẬT KÝ HÓA ĐƠN BÁN HÀNG CHI TIẾT', headers2);

            let totalRevSales = 0;
            let totalRefundSales = 0;
            let totalNetSales = 0;
            let totalPaidSales = 0;
            const pmLabels = { cash: 'Tiền mặt', transfer: 'Chuyển khoản', credit: 'Ghi nợ' };
            const statusLabels = { completed: 'Đã đủ', returned: 'Đã trả hết', partially_returned: 'Trả 1 phần', pending: 'Chờ duyệt', cancelled: 'Đã hủy', expired: 'Hết hạn', delivering: 'Đang giao' };

            data.recentOrders.forEach((o, idx) => {
                const finalAmt = o.final_amount || 0;
                const refundAmt = o.refunded_amount || 0;
                const netAmt = Math.max(0, finalAmt - refundAmt);

                totalRevSales += finalAmt;
                totalRefundSales += refundAmt;
                totalNetSales += netAmt;
                totalPaidSales += o.paid_amount || 0;

                const row = ws2.addRow([
                    idx + 1,
                    `#BL-${o.id.slice(-6).toUpperCase()}`,
                    o.customer_name || 'Khách lẻ',
                    o.customer_phone || '---',
                    o.item_count || 1,
                    o.total_amount || 0,
                    o.discount || 0,
                    finalAmt,
                    refundAmt,
                    netAmt,
                    o.paid_amount || 0,
                    pmLabels[o.payment_method] || o.payment_method || 'Tiền mặt',
                    o.user_name || 'Thu ngân',
                    statusLabels[o.status] || o.status,
                    new Date(o.createdAt).toLocaleString('vi-VN')
                ]);
                row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(3).alignment = { horizontal: 'left', vertical: 'middle' };
                row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(5).numFmt = '#,##0';
                row.getCell(6).numFmt = '#,##0 "đ"';
                row.getCell(7).numFmt = '#,##0 "đ"';
                row.getCell(8).numFmt = '#,##0 "đ"';
                row.getCell(9).numFmt = '#,##0 "đ"';
                row.getCell(10).numFmt = '#,##0 "đ"';
                row.getCell(11).numFmt = '#,##0 "đ"';
                row.getCell(5).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(6).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(7).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(8).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(9).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(10).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(11).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(12).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(13).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(14).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(15).alignment = { horizontal: 'center', vertical: 'middle' };
            });

            const footerRow2 = ws2.addRow(['', '', 'TỔNG CỘNG:', '', '', '', '', totalRevSales, totalRefundSales, totalNetSales, totalPaidSales, '', '', '', '']);
            footerRow2.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
            footerRow2.getCell(8).numFmt = '#,##0 "đ"';
            footerRow2.getCell(9).numFmt = '#,##0 "đ"';
            footerRow2.getCell(10).numFmt = '#,##0 "đ"';
            footerRow2.getCell(11).numFmt = '#,##0 "đ"';
            footerRow2.getCell(8).alignment = { horizontal: 'right', vertical: 'middle' };
            footerRow2.getCell(9).alignment = { horizontal: 'right', vertical: 'middle' };
            footerRow2.getCell(10).alignment = { horizontal: 'right', vertical: 'middle' };
            footerRow2.getCell(11).alignment = { horizontal: 'right', vertical: 'middle' };
            formatDataRowsAndAutoWidth(ws2);
        }

        // --- SHEET 3: Kiểm kê Kho & Giá trị Vốn ---
        if (data.allProducts && data.allProducts.length > 0) {
            const ws3 = workbook.addWorksheet('3. Giá trị Kho hàng');
            const headers3 = ['STT', 'MÃ SKU', 'BARCODE', 'TÊN SẢN PHẨM', 'DANH MỤC', 'ĐƠN VỊ TÍNH', 'TỒN KHO', 'GIÁ VỐN (Đ)', 'GIÁ BÁN (Đ)', 'TỔNG GIÁ TRỊ VỐN (Đ)', 'TRẠNG THÁI'];
            styleSheetHeadersAndBorders(ws3, 'BÁO CÁO KIỂM KÊ TỒN KHO & TỔNG GIÁ TRỊ VỐN KHO HÀNG', headers3);

            let totalCap = 0;
            data.allProducts.forEach((p, idx) => {
                const val = (p.stock_quantity || 0) * (p.cost_price || 0);
                totalCap += val;
                const statusText = p.stock_quantity <= 0 ? 'Hết hàng' : (p.stock_quantity <= (p.min_stock || 5) ? 'Sắp hết' : 'Còn hàng');
                const row = ws3.addRow([
                    idx + 1,
                    p.sku || '',
                    p.barcode || '',
                    p.name,
                    p.category_name || 'Khác',
                    p.unit || 'Cái',
                    p.stock_quantity || 0,
                    p.cost_price || 0,
                    p.selling_price || 0,
                    val,
                    statusText
                ]);
                row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(4).alignment = { horizontal: 'left', vertical: 'middle' };
                row.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' };
                row.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(7).numFmt = '#,##0';
                row.getCell(8).numFmt = '#,##0 "đ"';
                row.getCell(9).numFmt = '#,##0 "đ"';
                row.getCell(10).numFmt = '#,##0 "đ"';
                row.getCell(7).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(8).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(9).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(10).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(11).alignment = { horizontal: 'center', vertical: 'middle' };
            });

            const footerRow = ws3.addRow(['', '', '', 'TỔNG GIÁ TRỊ VỐN KHO HÀNG:', '', '', '', '', '', totalCap, '']);
            footerRow.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
            footerRow.getCell(10).numFmt = '#,##0 "đ"';
            footerRow.getCell(10).alignment = { horizontal: 'right', vertical: 'middle' };
            formatDataRowsAndAutoWidth(ws3);
        }

        // --- SHEET 4: Top Sản phẩm Bán chạy ---
        if (data.bestSellers && data.bestSellers.length > 0) {
            const ws4 = workbook.addWorksheet('4. Top Sản phẩm bán chạy');
            const headers4 = ['XẾP HẠNG', 'MÃ SKU', 'BARCODE', 'TÊN SẢN PHẨM', 'DANH MỤC', 'ĐƠN VỊ TÍNH', 'SL ĐÃ BÁN', 'TỔNG DOANH THU (Đ)'];
            styleSheetHeadersAndBorders(ws4, 'DANH SÁCH TOP SẢN PHẨM BÁN CHẠY NHẤT', headers4);

            let totalTopQty = 0;
            let totalTopRevenue = 0;
            data.bestSellers.forEach((b, idx) => {
                totalTopQty += b.totalQty || 0;
                totalTopRevenue += b.totalAmount || 0;
                const row = ws4.addRow([
                    `Top ${idx + 1}`,
                    b.sku || '',
                    b.barcode || '',
                    b.name,
                    b.category_name || 'Khác',
                    b.unit || 'Cái',
                    b.totalQty || 0,
                    b.totalAmount || 0
                ]);
                row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(4).alignment = { horizontal: 'left', vertical: 'middle' };
                row.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' };
                row.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(7).numFmt = '#,##0';
                row.getCell(8).numFmt = '#,##0 "đ"';
                row.getCell(7).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(8).alignment = { horizontal: 'right', vertical: 'middle' };
            });

            const footerRow4 = ws4.addRow(['', '', '', 'TỔNG TOP BÁN CHẠY:', '', '', totalTopQty, totalTopRevenue]);
            footerRow4.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
            footerRow4.getCell(7).numFmt = '#,##0';
            footerRow4.getCell(8).numFmt = '#,##0 "đ"';
            footerRow4.getCell(7).alignment = { horizontal: 'right', vertical: 'middle' };
            footerRow4.getCell(8).alignment = { horizontal: 'right', vertical: 'middle' };
            formatDataRowsAndAutoWidth(ws4);
        }

        // --- SHEET 5: Doanh thu theo Danh mục ---
        if (data.categoryStats && data.categoryStats.length > 0) {
            const wsCat = workbook.addWorksheet('5. Doanh thu Danh mục');
            const headersCat = ['STT', 'TÊN DANH MỤC SẢN PHẨM', 'SỐ LƯỢNG BÁN', 'TỔNG DOANH THU (Đ)'];
            styleSheetHeadersAndBorders(wsCat, 'BÁO CÁO CƠ CẤU DOANH THU THEO DANH MỤC SẢN PHẨM', headersCat);

            let totalCatRev = 0;
            let totalCatQty = 0;
            data.categoryStats.forEach((c, idx) => {
                totalCatRev += c.totalRevenue || 0;
                totalCatQty += c.totalQty || 0;
                const row = wsCat.addRow([
                    idx + 1,
                    c._id || 'Khác',
                    c.totalQty || 0,
                    c.totalRevenue || 0
                ]);
                row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
                row.getCell(3).numFmt = '#,##0';
                row.getCell(4).numFmt = '#,##0 "đ"';
                row.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
            });

            const footerCat = wsCat.addRow(['', 'TỔNG DOANH THU TOÀN BỘ DANH MỤC:', totalCatQty, totalCatRev]);
            footerCat.getCell(2).alignment = { horizontal: 'right', vertical: 'middle' };
            footerCat.getCell(3).numFmt = '#,##0';
            footerCat.getCell(4).numFmt = '#,##0 "đ"';
            footerCat.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
            footerCat.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
            formatDataRowsAndAutoWidth(wsCat);
        }

        // --- SHEET 6: Danh sách Cần Gọi Hàng (NCC) ---
        if (data.allProducts) {
            const lowProducts = data.allProducts.filter(p => p.stock_quantity <= (p.min_stock || 5));
            if (lowProducts.length > 0) {
                const ws5 = workbook.addWorksheet('6. Cần gọi hàng');
                const headers5 = ['STT', 'MÃ SKU', 'BARCODE', 'TÊN SẢN PHẨM', 'DANH MỤC', 'ĐƠN VỊ', 'TỒN HT', 'TỒN MIN', 'SL ĐỀ XUẤT NHẬP', 'GIÁ NHẬP DỰ KIẾN (Đ)', 'DỰ TOÁN TIỀN NHẬP (Đ)'];
                styleSheetHeadersAndBorders(ws5, 'DANH SÁCH SẢN PHẨM HẾT / SẮP HẾT CẦN NHẬP THÊM (GỌI HÀNG)', headers5);

                let totalEstCost = 0;
                lowProducts.forEach((p, idx) => {
                    const minStock = p.min_stock || 5;
                    const suggestQty = Math.max(10, (minStock * 2) - Math.max(0, p.stock_quantity));
                    const costPrice = p.cost_price || 0;
                    const estCost = suggestQty * costPrice;
                    totalEstCost += estCost;

                    const row = ws5.addRow([
                        idx + 1,
                        p.sku || '',
                        p.barcode || '',
                        p.name,
                        p.category_name || 'Khác',
                        p.unit || 'Cái',
                        p.stock_quantity || 0,
                        minStock,
                        suggestQty,
                        costPrice,
                        estCost
                    ]);
                    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
                    row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
                    row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
                    row.getCell(4).alignment = { horizontal: 'left', vertical: 'middle' };
                    row.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' };
                    row.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
                    row.getCell(7).numFmt = '#,##0';
                    row.getCell(8).numFmt = '#,##0';
                    row.getCell(9).numFmt = '#,##0';
                    row.getCell(10).numFmt = '#,##0 "đ"';
                    row.getCell(11).numFmt = '#,##0 "đ"';
                    row.getCell(7).alignment = { horizontal: 'right', vertical: 'middle' };
                    row.getCell(8).alignment = { horizontal: 'right', vertical: 'middle' };
                    row.getCell(9).alignment = { horizontal: 'right', vertical: 'middle' };
                    row.getCell(10).alignment = { horizontal: 'right', vertical: 'middle' };
                    row.getCell(11).alignment = { horizontal: 'right', vertical: 'middle' };
                });

                const footerRow = ws5.addRow(['', '', '', 'TỔNG DỰ TOÁN TIỀN NHẬP:', '', '', '', '', '', '', totalEstCost]);
                footerRow.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
                footerRow.getCell(11).numFmt = '#,##0 "đ"';
                footerRow.getCell(11).alignment = { horizontal: 'right', vertical: 'middle' };
                formatDataRowsAndAutoWidth(ws5);
            }
        }

        // --- SHEET 7: Công nợ Khách hàng ---
        if (data.customerDebts && data.customerDebts.length > 0) {
            const wsDebt = workbook.addWorksheet('7. Công nợ Khách hàng');
            const headersDebt = ['STT', 'MÃ KHÁCH HÀNG', 'TÊN KHÁCH HÀNG', 'SỐ ĐIỆN THOẠI', 'ĐỊA CHỈ', 'TỔNG DƯ NỢ HIỆN TẠI (Đ)', 'TRẠNG THÁI'];
            styleSheetHeadersAndBorders(wsDebt, 'BÁO CÁO TỔNG HỢP CÔNG NỢ KHÁCH HÀNG THỦYR MART', headersDebt);

            let totalCustDebt = 0;
            data.customerDebts.forEach((c, idx) => {
                const debt = c.debt || 0;
                totalCustDebt += debt;
                const row = wsDebt.addRow([
                    idx + 1,
                    `KH-${c.id.slice(-6).toUpperCase()}`,
                    c.name,
                    c.phone || '---',
                    c.address || '---',
                    debt,
                    debt > 0 ? 'Còn nợ' : 'Không nợ'
                ]);
                row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(3).alignment = { horizontal: 'left', vertical: 'middle' };
                row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' };
                row.getCell(6).numFmt = '#,##0 "đ"';
                row.getCell(6).alignment = { horizontal: 'right', vertical: 'middle' };
                row.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };
            });

            const footerDebt = wsDebt.addRow(['', '', '', 'TỔNG CỘNG DƯ NỢ KHÁCH HÀNG:', '', totalCustDebt, '']);
            footerDebt.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
            footerDebt.getCell(6).numFmt = '#,##0 "đ"';
            footerDebt.getCell(6).alignment = { horizontal: 'right', vertical: 'middle' };
            formatDataRowsAndAutoWidth(wsDebt);
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const dateStr = new Date().toISOString().split('T')[0];
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `BaoCao_HTDS_ChiTiet_${dateStr}.xlsx`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    let allAuditProducts = [];
    async function loadInventoryAudit() {
        try {
            const res = await fetch('/api/products');
            allAuditProducts = await res.json();
            
            const searchInput = document.getElementById('audit-search');
            const statusFilter = document.getElementById('audit-status-filter');

            function applyAuditFilters() {
                const list = document.getElementById('audit-list');
                if (!list) return;

                const searchVal = searchInput?.value.trim().toLowerCase() || '';
                const statusVal = statusFilter?.value || '';

                const filtered = allAuditProducts.filter(p => {
                    const threshold = p.min_stock || 5;
                    const matchesSearch = searchVal === '' || 
                        p.name.toLowerCase().includes(searchVal) || 
                        (p.sku && p.sku.toLowerCase().includes(searchVal));

                    let matchesStatus = true;
                    if (statusVal === 'out') {
                        matchesStatus = p.stock_quantity <= 0;
                    } else if (statusVal === 'low') {
                        matchesStatus = p.stock_quantity > 0 && p.stock_quantity <= threshold;
                    }

                    return matchesSearch && matchesStatus;
                });

                paginateAdminTable('inventory-audit', filtered, list, (p) => {
                    return `
                        <tr data-id="${p.id}" data-stock="${p.stock_quantity}">
                            <td style="font-weight: 600;">${p.name}</td>
                            <td style="font-size: 12px; color: var(--text-muted);">${p.sku || ''}</td>
                            <td>${p.unit || 'Cái'}</td>
                            <td style="font-weight:bold;">${p.stock_quantity}</td>
                            <td><input type="number" class="form-control audit-input" style="width:100px; padding:6px; margin:0;" data-id="${p.id}" value="${p.stock_quantity}"></td>
                            <td class="audit-diff" style="font-weight:bold; color:var(--text-muted);">0</td>
                        </tr>
                    `;
                });

                // Rebind event listeners for inputs on current page
                document.querySelectorAll('.audit-input').forEach(input => {
                    input.addEventListener('input', (e) => {
                        const row = e.target.closest('tr');
                        const sysStock = parseFloat(row.getAttribute('data-stock'));
                        const realStock = parseFloat(e.target.value) || 0;
                        const diff = realStock - sysStock;
                        const diffEl = row.querySelector('.audit-diff');
                        if (diff > 0) {
                            diffEl.textContent = '+' + diff;
                            diffEl.style.color = '#10b981';
                        } else if (diff < 0) {
                            diffEl.textContent = diff;
                            diffEl.style.color = '#ef4444';
                        } else {
                            diffEl.textContent = '0';
                            diffEl.style.color = 'var(--text-muted)';
                        }
                    });
                });
            }

            if (searchInput) searchInput.oninput = applyAuditFilters;
            if (statusFilter) statusFilter.onchange = applyAuditFilters;

            applyAuditFilters();

            const btnSave = document.getElementById('btn-save-audit');
            if (btnSave) {
                btnSave.onclick = async () => {
                    const changes = [];
                    document.querySelectorAll('.audit-input').forEach(input => {
                        const row = input.closest('tr');
                        const sysStock = parseFloat(row.getAttribute('data-stock'));
                        const realStock = parseFloat(input.value);
                        if (!isNaN(realStock) && realStock !== sysStock) {
                            changes.push({
                                product_id: input.getAttribute('data-id'),
                                change_qty: realStock - sysStock
                            });
                        }
                    });

                    if (changes.length === 0) {
                        alert('Không có chênh lệch nào cần lưu.');
                        return;
                    }

                    if (!await confirm(`Bạn có chắc muốn lưu phiếu kiểm kê cho ${changes.length} sản phẩm?`)) return;

                    try {
                        for (const change of changes) {
                            const res = await fetch('/api/inventory/adjust', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    product_id: change.product_id,
                                    change_qty: change.change_qty,
                                    type: 'adjust',
                                    note: 'Kiểm kê kho ngày ' + new Date().toLocaleDateString('vi-VN')
                                })
                            });
                            if (!res.ok) {
                                const err = await res.json();
                                throw new Error(err.error || err.message || 'Lỗi điều chỉnh tồn kho');
                            }
                        }
                        alert('Lưu phiếu kiểm kê thành công!');
                        await loadInventoryAudit();
                    } catch (e) {
                        console.error(e);
                        alert('Có lỗi xảy ra khi lưu kiểm kê: ' + e.message);
                    }
                };
            }
        } catch (err) { console.error(err); }
    }

    window.resetSystemData = async function(mode) {
        const msg = mode === 'full' 
            ? 'CẢNH BÁO: Hành động này sẽ XÓA TOÀN BỘ DỮ LIỆU. Bạn có chắc chắn?' 
            : 'Xác nhận xóa lịch sử giao dịch? (Sản phẩm và danh mục được giữ nguyên)';
        if (!await confirm(msg)) return;
        
        if (mode === 'full' && !await confirm('CẢNH BÁO CUỐI: Toàn bộ dữ liệu không thể khôi phục. Tiếp tục?')) return;

        try {
            const res = await fetch('/api/system/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert(data.message);
                if (mode === 'full') {
                    window.location.href = '/login';
                } else {
                    window.location.reload();
                }
            } else {
                alert('Lỗi: ' + (data.error || 'Không thể reset dữ liệu'));
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi kết nối tới máy chủ');
        }
    };

    // Start - restore last page or go to dashboard
    const _startPage = sessionStorage.getItem('currentPage') || 'dashboard';
    switchPage(_startPage);

    // Handle Restore Backup
    window.handleRestoreBackup = async function() {
        const input = document.getElementById('restore-file-input');
        if (!input || !input.files || input.files.length === 0) {
            alert('Vui lòng chọn 1 file sao lưu dạng .json!');
            return;
        }
        const file = input.files[0];
        if (!confirm(`⚠️ XÁC NHẬN KHÔI PHỤC:\nToàn bộ dữ liệu hiện tại sẽ được thay thế bằng dữ liệu trong file "${file.name}". Bạn có chắc chắn muốn khôi phục không?`)) {
            return;
        }

        try {
            const text = await file.text();
            const json = JSON.parse(text);

            const res = await fetch('/api/system/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ backupData: json })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert('🎉 ' + data.message);
                window.location.reload();
            } else {
                alert('❌ Lỗi khôi phục: ' + (data.error || 'Dữ liệu không hợp lệ'));
            }
        } catch (e) {
            console.error(e);
            alert('❌ Đọc file thất bại: File không đúng định dạng JSON sao lưu!');
        }
    };

    // Show Sale Detail & Inline Return Modal (Single Unified UX)
    window.showSaleDetailModal = async function(saleId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        try {
            const res = await fetch(`/api/sales/${saleId}`);
            if (!res.ok) {
                alert('Không thể lấy thông tin hóa đơn!');
                return;
            }
            const sale = await res.json();
            const receiptCode = `#BL-${sale.id.slice(-6).toUpperCase()}`;
            const pmTextMap = { cash: 'Tiền mặt', transfer: 'Chuyển khoản', credit: 'Ghi nợ' };
            const pmText = pmTextMap[sale.payment_method] || 'Tiền mặt';
            const isCredit = sale.payment_method === 'credit';
            const remainingDebt = isCredit ? Math.max(0, sale.final_amount - sale.paid_amount) : 0;
            const canReturn = sale.status === 'completed' || sale.status === 'partially_returned';

            let statusBadgeHtml = '<span class="badge" style="background: #dcfce7; color: #15803d; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 12px;">Hoàn thành</span>';
            if (sale.status === 'cancelled') {
                statusBadgeHtml = '<span class="badge" style="background: #fee2e2; color: #b91c1c; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 12px;">Đã hủy</span>';
            } else if (sale.status === 'expired') {
                statusBadgeHtml = '<span class="badge" style="background: #f1f5f9; color: #64748b; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 12px;">Hết hạn</span>';
            } else if (sale.status === 'returned') {
                statusBadgeHtml = '<span class="badge" style="background: #fee2e2; color: #991b1b; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 12px;">Đã trả hết</span>';
            } else if (sale.status === 'partially_returned') {
                statusBadgeHtml = '<span class="badge" style="background: #fef3c7; color: #b45309; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 12px;">Trả 1 phần</span>';
            }

            // Map item return history
            const itemReturnMap = {};
            (sale.returned_items || []).forEach(r => {
                const key = r.product_id || r.product_name;
                itemReturnMap[key] = (itemReturnMap[key] || 0) + r.quantity;
            });

            // Build Items Table Rows with integrated Return input
            const itemsRows = sale.items.map((item, idx) => {
                const key = item.product_id || item.product_name;
                const alreadyReturned = itemReturnMap[key] || 0;
                const maxCanReturn = item.quantity - alreadyReturned;
                const isFullyReturned = maxCanReturn <= 0;

                const returnInputHtml = canReturn ? (isFullyReturned 
                    ? `<span style="color:#94a3b8; font-size:12px; font-style:italic;">Đã trả đủ</span>` 
                    : `<input type="number" class="form-control inline-return-qty" data-prod-id="${item.product_id}" data-price="${item.unit_price}" data-max="${maxCanReturn}" min="0" max="${maxCanReturn}" value="0" style="width: 70px; text-align: center; height: 30px; font-weight: 700; color: #d97706; margin: 0 auto; padding: 2px 4px;" oninput="window.updateInlineReturnTotal()">`
                ) : `<span style="color:#94a3b8;">-</span>`;

                return `
                    <tr style="${isFullyReturned ? 'background:#f8fafc; opacity:0.75;' : ''}">
                        <td style="text-align:center; padding:10px 8px;">${idx + 1}</td>
                        <td style="font-weight: 600; padding: 10px 12px;">
                            ${item.product_name}
                            ${alreadyReturned > 0 ? `<span style="font-size:11px; color:#d97706; margin-left:6px;">(Đã trả ${alreadyReturned}/${item.quantity})</span>` : ''}
                        </td>
                        <td style="text-align: right; padding: 10px 12px;">${item.unit_price.toLocaleString()}đ</td>
                        <td style="text-align: center; padding: 10px 6px; font-weight: 600;">${item.quantity}</td>
                        <td style="text-align: right; padding: 10px 12px; font-weight: 700;">${item.subtotal.toLocaleString()}đ</td>
                        ${canReturn ? `<td style="text-align: center; padding: 6px 8px; background: #fffbe6;">${returnInputHtml}</td>` : ''}
                    </tr>
                `;
            }).join('');

            // Returned history section if previously returned
            let returnedSection = '';
            if (sale.returned_items && sale.returned_items.length > 0) {
                const retRows = sale.returned_items.map((r) => `
                    <tr>
                        <td style="font-weight:600; color:#b45309; padding:8px 12px;">${r.product_name}</td>
                        <td style="text-align:right; padding:8px 12px;">${r.return_price.toLocaleString()}đ</td>
                        <td style="text-align:center; padding:8px 6px; font-weight:700; color:#dc2626;">${r.quantity}</td>
                        <td style="text-align:right; padding:8px 12px; font-weight:700; color:#dc2626;">${(r.quantity * r.return_price).toLocaleString()}đ</td>
                    </tr>
                `).join('');

                returnedSection = `
                    <div style="border: 1px solid #fed7aa; border-radius: 10px; overflow: hidden; margin-bottom: 20px; background: #fff7ed;">
                        <div style="padding: 10px 12px; font-weight: 700; color: #b45309; border-bottom: 1px solid #fed7aa; font-size: 13px;">
                            <i data-lucide="rotate-ccw" style="width:14px; height:14px; vertical-align:middle;"></i> Lịch sử sản phẩm đã trả lại
                        </div>
                        <table class="data-table" style="margin: 0; width: 100%;">
                            <thead style="background: #ffedd5;">
                                <tr>
                                    <th style="text-align: left; padding: 8px 12px;">Sản phẩm</th>
                                    <th style="text-align: right; padding: 8px 12px;">Giá hoàn</th>
                                    <th style="text-align: center; padding: 8px 6px;">SL Trả</th>
                                    <th style="text-align: right; padding: 8px 12px;">Tiền hoàn</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${retRows}
                            </tbody>
                        </table>
                    </div>
                `;
            }

            const modalHtml = `
                <div style="padding: 4px 0;">
                    <!-- Header Badges & Info Card -->
                    <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed var(--border-color);">
                            <div style="font-weight: 700; font-size: 16px; color: var(--primary-color);">${receiptCode}</div>
                            ${statusBadgeHtml}
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 13px;">
                            <div><span style="color: var(--text-muted);">Khách hàng:</span> <strong style="color: var(--text-main);">${sale.customer_name || 'Khách lẻ'}</strong></div>
                            <div><span style="color: var(--text-muted);">Thời gian mua:</span> <strong style="color: var(--text-main);">${new Date(sale.order_date).toLocaleString('vi-VN')}</strong></div>
                            <div><span style="color: var(--text-muted);">Thu ngân:</span> <strong style="color: var(--text-main);">${sale.user_name || 'Thu ngân'}</strong></div>
                        </div>
                    </div>

                    <!-- Items Table with Inline Return column -->
                    <div style="border: 1px solid var(--border-color); border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
                        <table class="data-table" style="margin: 0; width: 100%;">
                            <thead style="background: #f1f5f9;">
                                <tr>
                                    <th style="width: 40px; text-align: center; padding: 10px 6px;">STT</th>
                                    <th style="text-align: left; padding: 10px 12px;">Sản phẩm</th>
                                    <th style="width: 100px; text-align: right; padding: 10px 12px;">Đơn giá</th>
                                    <th style="width: 70px; text-align: center; padding: 10px 6px;">Đã mua</th>
                                    <th style="width: 110px; text-align: right; padding: 10px 12px;">Thành tiền</th>
                                    ${canReturn ? `<th style="width: 100px; text-align: center; padding: 10px 6px; background: #fef3c7; color: #b45309;">Trả lần này</th>` : ''}
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsRows}
                            </tbody>
                        </table>
                    </div>

                    ${returnedSection}

                    <!-- Summary & Action Footer Card -->
                    <div style="background: #fafafa; border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                        <div style="font-size: 13px; line-height: 1.6;">
                            <div>Phương thức: <strong style="color: var(--text-main);">${pmText}</strong></div>
                            ${sale.discount > 0 ? `<div style="color: #ef4444;">Giảm giá: <strong>-${sale.discount.toLocaleString()}đ</strong></div>` : ''}
                            ${sale.refunded_amount > 0 ? `<div style="color: #dc2626; font-weight: 700;">Đã hoàn trả các đợt trước: ${sale.refunded_amount.toLocaleString()}đ</div>` : ''}
                            ${isCredit && remainingDebt > 0 ? `<div style="color: #ea580c; font-weight: 700;">Còn nợ lại: ${remainingDebt.toLocaleString()}đ</div>` : ''}
                            ${canReturn ? `
                                <div id="inline-refund-summary" style="display:none; margin-top:6px; padding:6px 12px; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; color:#c2410c; font-weight:700;">
                                    Tiền hoàn lại khách đợt này: <span id="inline-refund-total-text" style="color:#dc2626; font-weight:800; font-size:16px;">0đ</span>
                                </div>
                            ` : ''}
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Tổng thanh toán đơn gốc</div>
                            <div style="font-size: 22px; font-weight: 800; color: var(--primary-color); margin-bottom: 8px;">${sale.final_amount.toLocaleString()}đ</div>
                            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                                <button class="btn btn-outline-primary" style="padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 13px;" onclick="printInvoice('${sale.id}')">In biên lai</button>
                                ${canReturn ? `
                                    <button id="btn-submit-inline-return" class="btn" style="background:#f59e0b; color:white; padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 13px; display:none;" onclick="window.submitInlineReturn('${sale.id}')">
                                        <i data-lucide="rotate-ccw"></i> XÁC NHẬN TRẢ HÀNG
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            showModal('Chi tiết biên lai bán hàng', modalHtml, null, 'modal-lg');
            if (window.lucide) window.lucide.createIcons();

            // Live Inline Return Calculation
            window.updateInlineReturnTotal = function() {
                let totalRefund = 0;
                let returnCount = 0;
                const modal = document.getElementById('app-modal');
                if (!modal) return;

                modal.querySelectorAll('.inline-return-qty').forEach(inp => {
                    let qty = parseInt(inp.value, 10) || 0;
                    const price = parseFloat(inp.getAttribute('data-price')) || 0;
                    const max = parseInt(inp.getAttribute('data-max'), 10) || 0;
                    
                    if (qty < 0) {
                        qty = 0;
                        inp.value = 0;
                    }
                    if (qty > max) {
                        qty = max;
                        inp.value = max;
                        alert(`Số lượng trả không thể vượt quá ${max}!`);
                    }
                    
                    if (qty > 0) {
                        totalRefund += qty * price;
                        returnCount += qty;
                    }
                });

                const summaryBox = modal.querySelector('#inline-refund-summary');
                const totalText = modal.querySelector('#inline-refund-total-text');
                const submitBtn = modal.querySelector('#btn-submit-inline-return');

                if (returnCount > 0) {
                    if (summaryBox) summaryBox.style.display = 'block';
                    if (totalText) totalText.textContent = totalRefund.toLocaleString() + 'đ';
                    if (submitBtn) submitBtn.style.display = 'inline-flex';
                } else {
                    if (summaryBox) summaryBox.style.display = 'none';
                    if (submitBtn) submitBtn.style.display = 'none';
                }
            };

            // Submit Return Handler
            window.submitInlineReturn = async function(sId) {
                const modal = document.getElementById('app-modal');
                if (!modal) return;

                const returnReqs = [];
                modal.querySelectorAll('.inline-return-qty').forEach(inp => {
                    const qty = parseInt(inp.value, 10) || 0;
                    const prodId = inp.getAttribute('data-prod-id');
                    if (qty > 0) {
                        returnReqs.push({
                            product_id: prodId,
                            quantity: qty,
                            reason: 'Khách trả hàng tại cửa hàng'
                        });
                    }
                });

                if (returnReqs.length === 0) {
                    alert('Vui lòng nhập số lượng sản phẩm muốn trả!');
                    return;
                }

                if (!await confirm('Xác nhận trả lại các sản phẩm đã chọn và hoàn tiền cho khách hàng?')) return;

                let response, result;
                try {
                    response = await fetch(`/api/sales/${sId}/return`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: returnReqs })
                    });
                    result = await response.json();
                } catch (err) {
                    console.error(err);
                    alert('❌ Lỗi kết nối máy chủ!');
                    return;
                }

                if (response && response.ok) {
                    alert(result.message);
                    await window.showSaleDetailModal(sId);
                    try { if (typeof loadSalesHistory === 'function') await loadSalesHistory(); } catch(e) {}
                    try { if (typeof loadReports === 'function' && currentPage === 'reports') await loadReports(); } catch(e) {}
                } else {
                    alert('Lỗi: ' + (result?.error || result?.message || 'Không thể trả hàng'));
                }
            };

        } catch (e) {
            console.error(e);
            alert('Lỗi tải chi tiết đơn hàng!');
        }
    };

    window.showReturnModal = window.showSaleDetailModal;

    // Live POS cart badge - updates on every page to show cart items in sidebar
    function updatePosCartBadge() {
        const badge = document.getElementById('pos-cart-badge');
        if (!badge) return;
        try {
            const saved = sessionStorage.getItem('pos_cart');
            const cart = saved ? JSON.parse(saved) : [];
            const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            if (totalQty > 0) {
                badge.textContent = totalQty > 99 ? '99+' : totalQty;
                badge.style.display = 'inline-flex';
            } else {
                badge.style.display = 'none';
            }
        } catch(e) { if (badge) badge.style.display = 'none'; }
    }
    // Update badge immediately and on any storage change
    updatePosCartBadge();
    window.addEventListener('storage', updatePosCartBadge);
    // Also poll every 2 seconds (sessionStorage doesn't fire storage events in same tab)
    setInterval(updatePosCartBadge, 2000);
});

