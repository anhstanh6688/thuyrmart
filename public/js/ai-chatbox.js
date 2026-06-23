// AI Chatbox - Unified Virtual Assistant for ThuyR Mart (Customer & Admin)
document.addEventListener('DOMContentLoaded', () => {
    // Detect if we are on the admin panel
    const isAdmin = window.location.pathname.startsWith('/admin');

    // State for AI Ordering & Chat History
    let draftCart = [];
    let chatHistory = [];

    // 1. Create and Inject Soft Premium Chatbox Styles
    const style = document.createElement('style');
    style.innerHTML = `
        /* Floating Chat Button */
        .ai-chat-launcher {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--primary, #004ac6);
            border-radius: 50%;
            box-shadow: 0 8px 30px rgba(0, 74, 198, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            animation: ai-pulse 2s infinite;
        }
        .ai-chat-launcher:hover {
            transform: scale(1.1) rotate(10deg);
            box-shadow: 0 12px 35px rgba(0, 74, 198, 0.5);
        }
        .ai-chat-launcher i {
            font-size: 28px;
        }
        .ai-chat-launcher-badge {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 14px;
            height: 14px;
            background: #10b981;
            border: 2px solid white;
            border-radius: 50%;
        }

        /* Chatbox Container */
        .ai-chatbox {
            position: fixed;
            bottom: 105px;
            right: 30px;
            width: 400px;
            height: 600px;
            background: var(--surface-container-lowest, #ffffff);
            border: 1px solid var(--outline-variant, #c3c6d7);
            border-radius: 20px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 1000;
            transform: scale(0.9) translateY(20px);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .ai-chatbox.active {
            transform: scale(1) translateY(0);
            opacity: 1;
            pointer-events: all;
        }
        .ai-chatbox.maximized {
            width: 750px;
            height: 650px;
        }

        /* Chatbox Header - Soft Design */
        .ai-chat-header {
            background: var(--surface-container-high, #dee8ff);
            border-bottom: 1px solid var(--outline-variant, #c3c6d7);
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: var(--on-surface, #111c2d);
        }
        .ai-chat-header-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .ai-chat-header-avatar {
            width: 42px;
            height: 42px;
            background: var(--surface-container-lowest, #ffffff);
            border: 1.5px solid var(--outline-variant, #c3c6d7);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .ai-chat-header-avatar img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
        }
        .ai-chat-header-avatar-status {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 12px;
            height: 12px;
            background: #10b981;
            border: 2px solid var(--surface-container-high, #dee8ff);
            border-radius: 50%;
        }
        .ai-chat-header-title {
            display: flex;
            flex-direction: column;
        }
        .ai-chat-header-title h4 {
            margin: 0;
            font-size: 15px;
            font-weight: 750;
            font-family: 'Manrope', sans-serif;
            color: var(--on-surface, #111c2d);
            letter-spacing: 0.1px;
        }
        .ai-chat-header-title span {
            font-size: 11px;
            color: var(--on-surface-variant, #434655);
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: 1px;
        }
        .ai-chat-header-controls {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .ai-chat-header-ctrl-btn {
            background: none;
            border: none;
            color: var(--on-surface-variant, #434655);
            opacity: 0.8;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .ai-chat-header-ctrl-btn:hover {
            opacity: 1;
            transform: scale(1.15);
            color: var(--primary, #004ac6);
        }

        /* Message Area */
        .ai-chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: var(--surface-container-lowest, #ffffff);
        }
        
        /* Messages styling */
        .ai-msg-row {
            display: flex;
            align-items: flex-end;
            gap: 10px;
            max-width: 85%;
        }
        .ai-msg-row.user-msg {
            align-self: flex-end;
            flex-direction: row-reverse;
        }
        .ai-msg-row.bot-msg {
            align-self: flex-start;
        }
        
        .ai-msg-avatar {
            width: 32px;
            height: 32px;
            background: var(--surface-container-low, #f0f3ff);
            border: 1px solid var(--outline-variant, #c3c6d7);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .ai-msg-avatar img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            object-fit: cover;
        }

        .ai-msg-bubble {
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
            word-break: break-word;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
            white-space: pre-wrap;
        }
        .user-msg .ai-msg-bubble {
            background: var(--primary, #004ac6);
            color: white;
            border-radius: 18px 18px 4px 18px;
        }
        .bot-msg .ai-msg-bubble {
            background: var(--surface-container-low, #f0f3ff);
            color: var(--on-surface, #111c2d);
            border: 1px solid var(--outline-variant, #c3c6d7);
            border-radius: 18px 18px 18px 4px;
        }
        .ai-msg-time {
            font-size: 10px;
            color: var(--on-surface-variant, #434655);
            margin-top: 4px;
            margin-left: 6px;
        }
        .user-msg .ai-msg-time {
            text-align: right;
            margin-right: 6px;
        }

        /* Message Options/Quick Replies */
        .ai-quick-replies-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            width: 100%;
            margin-top: 12px;
        }
        .ai-chatbox.maximized .ai-quick-replies-grid {
            grid-template-columns: repeat(3, 1fr);
        }
        .ai-quick-btn {
            background: var(--surface-container-lowest, #ffffff);
            border: 1px solid var(--outline-variant, #c3c6d7);
            border-radius: 12px;
            padding: 12px 14px;
            font-size: 13px;
            font-weight: 600;
            color: var(--on-surface, #111c2d);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
            text-align: left;
        }
        .ai-quick-btn:hover {
            border-color: var(--primary, #004ac6);
            color: var(--primary, #004ac6);
            background: var(--surface-container-low, #f0f3ff);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 74, 198, 0.08);
        }
        .ai-quick-btn i {
            color: var(--primary, #004ac6);
            font-size: 16px;
        }

        /* Bottom Input Area */
        .ai-chat-input-area {
            padding: 16px 20px;
            background: var(--surface-container-lowest, #ffffff);
            border-top: 1px solid var(--outline-variant, #c3c6d7);
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .ai-chat-input-wrapper {
            flex: 1;
            background: var(--surface-container-low, #f0f3ff);
            border-radius: 24px;
            padding: 6px 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            border: 1px solid transparent;
            transition: all 0.2s;
        }
        .ai-chat-input-wrapper:focus-within {
            background: var(--surface-container-lowest, #ffffff);
            border-color: var(--primary, #004ac6);
            box-shadow: 0 0 0 3px rgba(0, 74, 198, 0.12);
        }
        .ai-chat-input {
            flex: 1;
            border: none;
            background: none;
            padding: 8px 0;
            font-size: 14px;
            color: var(--on-surface, #111c2d);
            outline: none;
        }
        .ai-chat-input::placeholder {
            color: var(--outline, #737686);
        }
        
        .ai-chat-action-btn {
            background: none;
            border: none;
            color: var(--on-surface-variant, #434655);
            cursor: pointer;
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
        }
        .ai-chat-action-btn:hover {
            color: var(--primary, #004ac6);
            background: var(--surface-container-low, #f0f3ff);
        }
        .ai-chat-send-btn {
            width: 40px;
            height: 40px;
            background: var(--primary, #004ac6);
            color: white;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 10px rgba(0, 74, 198, 0.15);
        }
        .ai-chat-send-btn:hover {
            background: #003fa6;
            transform: scale(1.05);
            box-shadow: 0 6px 14px rgba(0, 74, 198, 0.25);
        }

        /* Animations */
        @keyframes ai-pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(0, 74, 198, 0.35);
            }
            70% {
                box-shadow: 0 0 0 15px rgba(0, 74, 198, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(0, 74, 198, 0);
            }
        }
        
        /* Markdown / HTML links inside bubbles */
        .ai-msg-bubble a {
            color: var(--primary, #004ac6);
            font-weight: 600;
            text-decoration: underline;
        }
        .ai-msg-bubble a:hover {
            color: #003fa6;
        }

        /* AI Cart Preview */
        .ai-chat-cart-preview {
            padding: 10px 20px;
            background: var(--surface-container-low, #f0f3ff);
            border-top: 1px solid var(--outline-variant, #c3c6d7);
            font-size: 13px;
            color: var(--on-surface, #111c2d);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Manrope', sans-serif;
            animation: ai-slide-up 0.2s ease-out;
        }
        @keyframes ai-slide-up {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // 2. Prepare Config and Content based on Role (Admin vs Customer)
    const titleText = isAdmin ? 'Trợ lý ảo Admin - ThuyR Mart' : 'Trợ lý ảo ThuyR Mart';
    const welcomeText = isAdmin 
        ? 'Chào Sếp! Em là trợ lý ảo AI quản trị của <strong>ThuyR Mart</strong>. Em có thể báo cáo doanh thu, thống kê tồn kho hoặc sản phẩm bán chạy. Hãy chọn các nút nhanh dưới đây hoặc hỏi em nhé!'
        : 'Chào Anh/Chị! Em là trợ lý ảo AI thông minh của <strong>ThuyR Mart</strong>. Mời Anh/Chị bấm vào các nút bên dưới để khám phá tính năng, gõ câu hỏi bất kỳ hoặc chọn <strong>Liên hệ nhân viên</strong> để gặp hỗ trợ trực tiếp nhé!';

    const menuGridHTML = isAdmin 
        ? `<div class="ai-quick-replies-grid">
            <button class="ai-quick-btn" data-query="Doanh thu hôm nay">
                <i data-lucide="line-chart"></i> Doanh thu hôm nay
            </button>
            <button class="ai-quick-btn" data-query="Sản phẩm sắp hết">
                <i data-lucide="alert-triangle"></i> Hàng sắp hết kho
            </button>
            <button class="ai-quick-btn" data-query="Sản phẩm bán chạy nhất">
                <i data-lucide="sparkles"></i> Top bán chạy
            </button>
            <button class="ai-quick-btn" data-query="Trò chuyện AI">
                <i data-lucide="message-square"></i> Trò chuyện tự do
            </button>
            <button class="ai-quick-btn" data-query="Thống kê khách hàng">
                <i data-lucide="users"></i> Hồ sơ khách hàng
            </button>
            <button class="ai-quick-btn" data-query="Liên hệ hỗ trợ kỹ thuật">
                <i data-lucide="phone"></i> Hỗ trợ kỹ thuật
            </button>
          </div>`
        : `<div class="ai-quick-replies-grid">
            <button class="ai-quick-btn" data-query="Trò chuyện AI">
                <i data-lucide="message-square"></i> Trò chuyện AI
            </button>
            <button class="ai-quick-btn" data-query="Tra cứu đơn hàng">
                <i data-lucide="search"></i> Tra cứu đơn hàng
            </button>
            <button class="ai-quick-btn" data-query="sản phẩm bán chạy">
                <i data-lucide="sparkles"></i> Sản phẩm hot
            </button>
            <button class="ai-quick-btn" data-query="Chính sách đổi trả">
                <i data-lucide="refresh-cw"></i> Đổi trả hàng
            </button>
            <button class="ai-quick-btn" data-query="Khuyến mãi HOT">
                <i data-lucide="tag"></i> Khuyến mãi HOT
            </button>
            <button class="ai-quick-btn" data-query="Liên hệ nhân viên">
                <i data-lucide="phone"></i> Liên hệ nhân viên
            </button>
          </div>`;

    // 3. HTML template for Floating Button and Chatbox
    const container = document.createElement('div');
    container.innerHTML = `
        <!-- Floating Launcher Button -->
        <div class="ai-chat-launcher" id="ai-chat-launcher" title="Chat với Trợ lý ảo AI">
            <i data-lucide="bot"></i>
            <div class="ai-chat-launcher-badge"></div>
        </div>

        <!-- Chatbox Container -->
        <div class="ai-chatbox" id="ai-chatbox">
            <!-- Header -->
            <div class="ai-chat-header">
                <div class="ai-chat-header-info">
                    <div class="ai-chat-header-avatar">
                        <img src="/img/logo.png" alt="Mascot">
                        <div class="ai-chat-header-avatar-status"></div>
                    </div>
                    <div class="ai-chat-header-title">
                        <h4>${titleText}</h4>
                        <span><span style="display:inline-block; width:8px; height:8px; background:#10b981; border-radius:50%; margin-right:4px;"></span>Đang hoạt động</span>
                    </div>
                </div>
                <div class="ai-chat-header-controls">
                    <button class="ai-chat-header-ctrl-btn" id="ai-chat-maximize-btn" title="Phóng to/Thu nhỏ">
                        <i data-lucide="maximize-2" style="width: 16px; height: 16px;"></i>
                    </button>
                    <button class="ai-chat-header-ctrl-btn" id="ai-chat-close-btn" title="Đóng">
                        <i data-lucide="x" style="width: 18px; height: 18px;"></i>
                    </button>
                </div>
            </div>

            <!-- Messages Area -->
            <div class="ai-chat-messages" id="ai-chat-messages">
                <!-- Welcome greeting -->
                <div class="ai-msg-row bot-msg">
                    <div class="ai-msg-avatar">
                        <img src="/img/logo.png" alt="Mascot">
                    </div>
                    <div>
                        <div class="ai-msg-bubble">
                            ${welcomeText}
                        </div>
                        <div class="ai-msg-time">${getCurrentTime()}</div>
                    </div>
                </div>

                <!-- Menu grid -->
                ${menuGridHTML}
            </div>

            <!-- Cart Preview Banner -->
            <div class="ai-chat-cart-preview" id="ai-chat-cart-preview" style="display: none;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <i data-lucide="shopping-cart" style="width:16px; height:16px; color:var(--primary, #004ac6);"></i>
                    <span>Giỏ nháp: <strong id="ai-cart-items-count">0</strong> sp</span>
                </div>
                <div>Tổng: <strong id="ai-cart-total-amount" style="color:var(--primary, #004ac6);">0đ</strong></div>
            </div>

            <!-- Bottom Input bar -->
            <div class="ai-chat-input-area">
                <button class="ai-chat-action-btn" id="ai-chat-clear" title="Xóa lịch sử chat">
                    <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                </button>
                <div class="ai-chat-input-wrapper">
                    <input type="text" class="ai-chat-input" id="ai-chat-input" placeholder="Nhập nội dung cần hỗ trợ...">
                    <button class="ai-chat-action-btn" id="ai-chat-send-icon" title="Gửi tin nhắn">
                        <i data-lucide="send" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // Refresh Lucide icons for the injected DOM elements
    lucide.createIcons();

    // 4. Elements selector
    const launcher = document.getElementById('ai-chat-launcher');
    const chatbox = document.getElementById('ai-chatbox');
    const closeBtn = document.getElementById('ai-chat-close-btn');
    const maxBtn = document.getElementById('ai-chat-maximize-btn');
    const sendBtn = document.getElementById('ai-chat-send-icon');
    const clearBtn = document.getElementById('ai-chat-clear');
    const input = document.getElementById('ai-chat-input');
    const messagesContainer = document.getElementById('ai-chat-messages');

    // 5. Toggle Chatbox Visibility
    launcher.addEventListener('click', () => {
        chatbox.classList.toggle('active');
        scrollToBottom();
    });

    closeBtn.addEventListener('click', () => {
        chatbox.classList.remove('active');
    });

    // Maximize/Resize Chatbox
    maxBtn.addEventListener('click', () => {
        chatbox.classList.toggle('maximized');
        const icon = maxBtn.querySelector('i');
        if (chatbox.classList.contains('maximized')) {
            icon.setAttribute('data-lucide', 'minimize-2');
        } else {
            icon.setAttribute('data-lucide', 'maximize-2');
        }
        lucide.createIcons();
    });

    // Helper function to update cart preview banner
    function updateCartIndicator() {
        const preview = document.getElementById('ai-chat-cart-preview');
        const countEl = document.getElementById('ai-cart-items-count');
        const totalEl = document.getElementById('ai-cart-total-amount');
        if (!preview || !countEl || !totalEl) return;

        if (draftCart && draftCart.length > 0) {
            let totalQty = draftCart.reduce((sum, item) => sum + item.quantity, 0);
            let totalAmount = draftCart.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0);
            
            countEl.textContent = totalQty;
            totalEl.textContent = totalAmount.toLocaleString('vi-VN') + 'đ';
            preview.style.display = 'flex';
        } else {
            preview.style.display = 'none';
        }
        lucide.createIcons();
    }

    // 6. Clear Chat History
    clearBtn.addEventListener('click', () => {
        if (confirm('Bạn có muốn xóa toàn bộ lịch sử trò chuyện?')) {
            messagesContainer.innerHTML = `
                <div class="ai-msg-row bot-msg">
                    <div class="ai-msg-avatar">
                        <img src="/img/logo.png" alt="Mascot">
                    </div>
                    <div>
                        <div class="ai-msg-bubble">${welcomeText}</div>
                        <div class="ai-msg-time">${getCurrentTime()}</div>
                    </div>
                </div>
                ${menuGridHTML}
            `;
            draftCart = [];
            chatHistory = [];
            updateCartIndicator();
            lucide.createIcons();
            wireMenuButtons();
        }
    });

    // 7. Get headers dynamically with x-user-id if user is logged in
    const getHeaders = () => {
        const headers = {
            'Content-Type': 'application/json'
        };
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const u = JSON.parse(userStr);
                if (u && u.id) {
                    headers['x-user-id'] = u.id;
                }
            } catch (e) {
                console.error('Error parsing user from localStorage', e);
            }
        }
        return headers;
    };

    // Sending Messages to Backend (Fixed Fetch Path to /api/ai/query)
    const sendMessage = async (text) => {
        if (!text.trim()) return;

        // Render User message
        appendMessage(text, 'user');
        chatHistory.push({ sender: 'user', text: text });
        input.value = '';
        scrollToBottom();

        // Render Loading Indicator
        const loadingId = appendLoading();
        scrollToBottom();

        // Send to Backend (Correct Endpoint /api/ai/query)
        try {
            const res = await fetch('/api/ai/query', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ 
                    query: text,
                    history: chatHistory,
                    draftCart: draftCart
                })
            });
            const data = await res.json();
            
            // Remove Loading and Render Response
            removeLoading(loadingId);
            
            if (data.response) {
                appendMessage(data.response, 'bot');
                chatHistory.push({ sender: 'bot', text: data.response });
                if (data.draftCart) {
                    draftCart = data.draftCart;
                    updateCartIndicator();
                }
            } else {
                appendMessage('Xin lỗi, tôi đã gặp trục trặc kỹ thuật. Vui lòng thử lại sau!', 'bot');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            removeLoading(loadingId);
            appendMessage('Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra lại kết nối mạng!', 'bot');
        }
        
        scrollToBottom();
    };

    sendBtn.addEventListener('click', () => {
        sendMessage(input.value);
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(input.value);
        }
    });

    // 8. Dynamic quick responses menu wiring (Enhanced search & soft handling)
    const handleQuickReply = async (query) => {
        // First append user action
        appendMessage(query, 'user');
        chatHistory.push({ sender: 'user', text: query });
        scrollToBottom();

        const loadingId = appendLoading();
        scrollToBottom();

        // Custom local menu logics or backend delegation
        setTimeout(async () => {
            removeLoading(loadingId);
            const q = query.toLowerCase();

            if (isAdmin) {
                // Admin specific quick triggers (Call /api/ai/query directly!)
                try {
                    const res = await fetch('/api/ai/query', {
                        method: 'POST',
                        headers: getHeaders(),
                        body: JSON.stringify({ 
                            query: query,
                            history: chatHistory,
                            draftCart: draftCart
                        })
                    });
                    const data = await res.json();
                    appendMessage(data.response, 'bot');
                    chatHistory.push({ sender: 'bot', text: data.response });
                } catch (e) {
                    appendMessage('Có lỗi xảy ra khi kết nối máy chủ AI để lập báo cáo.', 'bot');
                }
            } else {
                // Customer specific quick triggers
                let reply = "";
                if (q.includes('trò chuyện ai')) {
                    reply = 'Chào bạn! Hãy gõ câu hỏi bất kỳ (như: "sản phẩm bán chạy", "tồn kho mặt hàng", hoặc các tư vấn mua sắm...) vào ô chat để em giải đáp ngay nhé!';
                } else if (q.includes('tra cứu đơn hàng')) {
                    reply = 'Chào bạn! Để tra cứu thông tin và lịch sử đơn hàng của bạn nhanh nhất, vui lòng truy cập mục <a href="/account-orders">Đơn hàng của tôi</a> tại trang quản lý Tài khoản cá nhân.';
                } else if (q.includes('đổi trả')) {
                    reply = '<strong>ThuyR Mart</strong> cam kết hỗ trợ khách hàng đổi trả hàng miễn phí trong vòng <strong>7 ngày</strong> kể từ khi nhận sản phẩm nếu sản phẩm bị lỗi kỹ thuật hoặc hư hỏng do vận chuyển. Vui lòng mang theo hóa đơn và giữ nguyên tem mác sản phẩm!';
                } else if (q.includes('khuyến mãi')) {
                    reply = 'Khuyến mãi đặc biệt mừng hè 2026: Nhập mã giảm giá <strong>THUYRMART2026</strong> để được chiết khấu ngay 10% tổng giá trị đơn hàng khi thanh toán trực tuyến! Đặt hàng ngay thôi!';
                } else if (q.includes('liên hệ') || q.includes('nhân viên')) {
                    reply = 'Dạ, để liên hệ trực tiếp với nhân viên hỗ trợ của **ThuyR Mart**, quý khách vui lòng chọn một trong các kênh sau ạ:\n\n' +
                            '📞 **Hotline gọi nhanh**: [0399.501.846](tel:0399501846)\n' +
                            '💬 **Chat Zalo trực tiếp**: [Nhắn tin Zalo](https://zalo.me/0399501846)\n' +
                            '✉️ **Email hỗ trợ**: support@thuyrmart.vn\n\n' +
                            'Nhân viên ThuyR Mart luôn sẵn sàng hỗ trợ quý khách!';
                }

                if (reply) {
                    appendMessage(reply, 'bot');
                    chatHistory.push({ sender: 'bot', text: reply });
                } else {
                    // Delegate all other queries (like "sản phẩm bán chạy") to backend
                    try {
                        const res = await fetch('/api/ai/query', {
                            method: 'POST',
                            headers: getHeaders(),
                            body: JSON.stringify({ 
                                query: query,
                                history: chatHistory,
                                draftCart: draftCart
                            })
                        });
                        const data = await res.json();
                        appendMessage(data.response, 'bot');
                        chatHistory.push({ sender: 'bot', text: data.response });
                        if (data.draftCart) {
                            draftCart = data.draftCart;
                            updateCartIndicator();
                        }
                    } catch (e) {
                        appendMessage('Có lỗi xảy ra khi kết nối máy chủ AI.', 'bot');
                    }
                }
            }
            scrollToBottom();
        }, 500); // Softer humanlike delay
    };

    function wireMenuButtons() {
        document.querySelectorAll('.ai-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.getAttribute('data-query');
                handleQuickReply(query);
            });
        });
    }

    wireMenuButtons();

    // 9. Helper Functions
    function appendMessage(text, sender) {
        const row = document.createElement('div');
        row.className = `ai-msg-row ${sender}-msg`;

        const formattedText = formatLinksAndBold(text);

        if (sender === 'bot') {
            row.innerHTML = `
                <div class="ai-msg-avatar">
                    <img src="/img/logo.png" alt="Mascot">
                </div>
                <div>
                    <div class="ai-msg-bubble">${formattedText}</div>
                    <div class="ai-msg-time">${getCurrentTime()}</div>
                </div>
            `;
        } else {
            row.innerHTML = `
                <div>
                    <div class="ai-msg-bubble">${formattedText}</div>
                    <div class="ai-msg-time">${getCurrentTime()}</div>
                </div>
            `;
        }

        // Add row before quick replies if they exist, else append at end
        const grid = messagesContainer.querySelector('.ai-quick-replies-grid');
        if (grid) {
            messagesContainer.insertBefore(row, grid);
        } else {
            messagesContainer.appendChild(row);
        }
    }

    function appendLoading() {
        const loadingId = 'ai-loading-' + Date.now();
        const row = document.createElement('div');
        row.className = 'ai-msg-row bot-msg';
        row.id = loadingId;
        row.innerHTML = `
            <div class="ai-msg-avatar">
                <img src="/img/logo.png" alt="Mascot">
            </div>
            <div>
                <div class="ai-msg-bubble" style="display:flex; align-items:center; gap:6px; padding: 12px 20px;">
                    <span style="width:6px; height:6px; background:#64748b; border-radius:50%; animation:ai-loading-dot 1.2s infinite 0s;"></span>
                    <span style="width:6px; height:6px; background:#64748b; border-radius:50%; animation:ai-loading-dot 1.2s infinite 0.2s;"></span>
                    <span style="width:6px; height:6px; background:#64748b; border-radius:50%; animation:ai-loading-dot 1.2s infinite 0.4s;"></span>
                </div>
            </div>
        `;
        
        const grid = messagesContainer.querySelector('.ai-quick-replies-grid');
        if (grid) {
            messagesContainer.insertBefore(row, grid);
        } else {
            messagesContainer.appendChild(row);
        }

        // Add loading dot styling if not already added
        if (!document.getElementById('ai-loading-style')) {
            const lStyle = document.createElement('style');
            lStyle.id = 'ai-loading-style';
            lStyle.innerHTML = `
                @keyframes ai-loading-dot {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
            `;
            document.head.appendChild(lStyle);
        }

        return loadingId;
    }

    function removeLoading(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getCurrentTime() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        return `${hrs}:${mins}`;
    }

    function formatLinksAndBold(text) {
        // Replace markdown bold **text** with HTML <strong>text</strong>
        let formatted = text.replace(/\*\*(.*?)\*\//g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace markdown links [text](url) with HTML anchor
        formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        return formatted;
    }
});
