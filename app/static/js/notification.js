// WebSocket connection for real-time notifications
const socket = io.connect(window.location.origin);

socket.on('connect', () => {
    console.log('Connected to notification server');
});

socket.on('notification', (data) => {
    showNotification(data.message, data.type);
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
            <button onclick="this.parentElement.remove()">×</button>
        </div>
    `;
    document.getElementById('notification-container').appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Check for new notifications periodically
async function checkNotifications() {
    try {
        const response = await fetch('/api/notifications/check');
        const data = await response.json();
        
        if (data.notifications.length > 0) {
            data.notifications.forEach(notif => {
                showNotification(notif.message, notif.type);
            });
        }
    } catch (error) {
        console.error('Error checking notifications:', error);
    }
}

setInterval(checkNotifications, 30000); // Check every 30 seconds