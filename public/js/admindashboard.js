async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users?token=' + encodeURIComponent(token));
        const data = await response.json();
        
        if (data.success) {
            const users = data.users;
            document.getElementById('totalUsers').textContent = users.length;
            document.getElementById('activeGames').textContent = users.length;
            
            const tbody = document.getElementById('usersTableBody');
            tbody.innerHTML = '';
            
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #64748b;">No users found</td></tr>';
                return;
            }
            
            users.forEach(user => {
                const lastActive = user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Never';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="badge badge-active">${user.id}</span></td>
                    <td><strong>${user.name}</strong></td>
                    <td style="font-family: monospace; font-size: 12px;">${user.universeId}</td>
                    <td style="font-size: 12px;">${lastActive}</td>
                    <td><span class="badge badge-success">✓ Active</span></td>
                    <td>
                        <button class="btn btn-danger" onclick="openResetModal('${user.id}', '${user.name}')">
                            🔑 Reset Password
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showToast('Failed to load users', 'error');
    }
}

function openResetModal(gameId, gameName) {
    document.getElementById('resetGameId').value = gameId;
    document.getElementById('resetGameName').value = gameName;
    document.getElementById('resetNewPassword').value = '';
    document.getElementById('resetPasswordModal').classList.add('active');
    document.getElementById('resetNewPassword').focus();
}

function closeModal() {
    document.getElementById('resetPasswordModal').classList.remove('active');
    document.getElementById('resetPasswordForm').reset();
}

document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const gameId = document.getElementById('resetGameId').value;
    const newPassword = document.getElementById('resetNewPassword').value;
    
    if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/admin/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
                gameId: gameId,
                newPassword: newPassword
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Password reset successfully!', 'success');
            closeModal();
            loadUsers(); // Reload users
        } else {
            showToast(data.error || 'Failed to reset password', 'error');
        }
    } catch (error) {
        showToast('Connection error. Please try again.', 'error');
    }
});

function showToast(message, type = 'success') {
    const toastId = type === 'success' ? 'successToast' : 'errorToast';
    const toast = document.getElementById(toastId);
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Close modal on outside click
document.getElementById('resetPasswordModal').addEventListener('click', (e) => {
    if (e.target.id === 'resetPasswordModal') {
        closeModal();
    }
});

// Load users on page load
loadUsers();

// Auto refresh every 30 seconds
setInterval(loadUsers, 30000);
