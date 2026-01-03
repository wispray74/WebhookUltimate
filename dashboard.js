function openChangePasswordModal() {
    document.getElementById('changePasswordModal').classList.add('active');
    document.getElementById('currentPassword').focus();
}

function closeModal() {
    document.getElementById('changePasswordModal').classList.remove('active');
    document.getElementById('changePasswordForm').reset();
}

document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPwd = document.getElementById('currentPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmPassword').value;
    
    if (newPwd !== confirmPwd) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (newPwd.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/user/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentPassword: currentPwd,
                newPassword: newPwd
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Password changed successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard?password=' + encodeURIComponent(newPwd);
            }, 2000);
        } else {
            showToast(data.error || 'Failed to change password', 'error');
        }
    } catch (error) {
        showToast('Connection error. Please try again.', 'error');
    }
});

function copyUrl(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('URL copied to clipboard!', 'success');
    }).catch(() => {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('URL copied to clipboard!', 'success');
    });
}

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
document.getElementById('changePasswordModal').addEventListener('click', (e) => {
    if (e.target.id === 'changePasswordModal') {
        closeModal();
    }
});
