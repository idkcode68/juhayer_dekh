// Auction Timer Functionality
function updateTimer(endTime, elementId) {
    const timerElement = document.getElementById(elementId);
    
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(endTime).getTime();
        const distance = end - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(timer);
            timerElement.innerHTML = "AUCTION ENDED";
            handleAuctionEnd(elementId);
        }
    }, 1000);
}

// Bid Placement
async function placeBid(auctionId) {
    const bidAmount = document.getElementById(`bid-amount-${auctionId}`).value;
    try {
        const response = await fetch('/api/place-bid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                auction_id: auctionId,
                bid_amount: bidAmount
            })
        });
        const data = await response.json();
        
        if (data.success) {
            showNotification('Bid placed successfully!', 'success');
            updateBidDisplay(auctionId, bidAmount);
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Error placing bid', 'error');
    }
}

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Wishlist Management
async function toggleWishlist(propertyId) {
    try {
        const response = await fetch('/api/toggle-wishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                property_id: propertyId
            })
        });
        const data = await response.json();
        
        const wishlistBtn = document.getElementById(`wishlist-${propertyId}`);
        wishlistBtn.classList.toggle('active');
        
        showNotification(data.message, 'success');
    } catch (error) {
        showNotification('Error updating wishlist', 'error');
    }
}

// Property Search
function initializeSearch() {
    const searchForm = document.getElementById('property-search');
    const resultsContainer = document.getElementById('search-results');
    
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(searchForm);
        const searchParams = new URLSearchParams(formData);
        
        try {
            const response = await fetch(`/api/search?${searchParams}`);
            const data = await response.json();
            
            displaySearchResults(data.results);
        } catch (error) {
            showNotification('Error performing search', 'error');
        }
    });
}

// Real-time Bid Updates using WebSocket (Socket.IO)
function initializeWebSocket() {
    const socket = io.connect('http://localhost:5000');

    socket.on('update_bid', (data) => {
        const auctionId = data.auction_id;
        const bidAmount = data.bid_amount;
        document.getElementById(`current-bid-${auctionId}`).innerText = `$${bidAmount}`;

        if (data.outbid) {
            showNotification('You have been outbid!', 'warning');
        }
    });

    socket.on('auction_end', (data) => {
        handleAuctionEnd(data.auction_id);
    });

    socket.on('connect_error', () => {
        showNotification('Connection to the server failed. Retrying...', 'error');
        setTimeout(initializeWebSocket, 5000);
    });
}

// Function to handle WebSocket messages
function handleAuctionEnd(auctionId) {
    const auctionElement = document.getElementById(`auction-${auctionId}`);
    auctionElement.innerHTML = "AUCTION ENDED";
}

// Utility function to update the bid display
function updateBidDisplay(auctionId, bidAmount) {
    const bidElement = document.getElementById(`current-bid-${auctionId}`);
    bidElement.innerText = `$${bidAmount}`;
}

// Initialize the WebSocket connection
initializeWebSocket();
