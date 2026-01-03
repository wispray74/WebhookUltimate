* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: #0a0e27;
    color: #ffffff;
    min-height: 100vh;
    padding: 20px;
}
.container { max-width: 1200px; margin: 0 auto; }
.header {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 32px;
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
}
.header-left h1 {
    font-size: 32px;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.header-left p { color: #94a3b8; font-size: 14px; }
.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
}
.stat-card {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    padding: 24px;
    backdrop-filter: blur(10px);
}
.stat-card h3 {
    color: #94a3b8;
    font-size: 14px;
    margin-bottom: 12px;
    font-weight: 500;
}
.stat-card .value {
    font-size: 36px;
    font-weight: 700;
    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.card {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
}
.card h2 {
    color: #8b5cf6;
    font-size: 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.table-container {
    overflow-x: auto;
}
table {
    width: 100%;
    border-collapse: collapse;
}
thead {
    background: rgba(139, 92, 246, 0.1);
}
th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
}
th {
    color: #8b5cf6;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
td {
    color: #cbd5e1;
    font-size: 14px;
}
tbody tr {
    transition: background 0.2s;
}
tbody tr:hover {
    background: rgba(139, 92, 246, 0.05);
}
.badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}
.badge-success {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
}
.badge-active {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
}
.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
    color: white;
}
.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}
.btn-danger {
    background: linear-gradient(135deg, #ef4444, #dc2626);
}
.btn-secondary {
    background: rgba(139, 92, 246, 0.2);
    border: 1px solid rgba(139, 92, 246, 0.4);
}
.success-toast, .error-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 12px;
    font-weight: 600;
    display: none;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1000;
}
.success-toast {
    background: rgba(16, 185, 129, 0.9);
    color: white;
}
.error-toast {
    background: rgba(239, 68, 68, 0.9);
    color: white;
}
@keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: 1000;
    justify-content: center;
    align-items: center;
    padding: 20px;
}
.modal.active {
    display: flex;
}
.modal-content {
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 20px;
    padding: 32px;
    max-width: 500px;
    width: 100%;
    animation: modalFadeIn 0.3s ease-out;
}
@keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}
.modal-header h2 {
    color: #8b5cf6;
    font-size: 24px;
}
.close-btn {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.3s;
}
.close-btn:hover {
    background: rgba(139, 92, 246, 0.2);
    color: #8b5cf6;
}
.form-group {
    margin-bottom: 20px;
}
.form-group label {
    display: block;
    color: #cbd5e1;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
}
.form-group input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(15, 23, 42, 0.6);
    border: 2px solid rgba(139, 92, 246, 0.2);
    border-radius: 10px;
    color: #ffffff;
    font-size: 15px;
    transition: all 0.3s;
    outline: none;
}
.form-group input:focus {
    border-color: #8b5cf6;
    background: rgba(15, 23, 42, 0.9);
}
.modal-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
}
.loading {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
