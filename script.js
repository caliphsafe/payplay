// Stripe configuration
const stripe = Stripe('pk_live_51Q50Z4FKbtuhfoOaTmS6Jk8kHeFoAD3yAfWSBAExSovZ9YxC20zfn15Bx9ODmwHIV69X5gC7JHdlHqyeYwFI57mB00o3fcHtsh');
const elements = stripe.elements();

const cardElement = elements.create('card');
cardElement.mount('#card-element');

const musicList = ['music/song1.mp3', 'music/song2.mp3', 'music/song3.mp3'];
let currentTrackIndex = 0;

// Payment form handling
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Request a payment intent from the server
    const response = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Error creating payment intent:', error);
        return;
    }

    const { clientSecret } = await response.json();

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
        }
    });

    const paymentResultDiv = document.getElementById('payment-result');

    if (error) {
        // Show error message to your customer
        paymentResultDiv.innerText = `Payment failed: ${error.message}`;
        paymentResultDiv.style.color = 'red'; // Set error text color to red
    } else {
        // Payment succeeded
        if (paymentIntent.status === 'succeeded') {
            paymentResultDiv.innerText = 'Payment succeeded! Thank you for your purchase.';
            paymentResultDiv.style.color = 'green'; // Set success text color to green
            document.getElementById('paywall').style.display = 'none';
            document.getElementById('music-player').style.display = 'block';
            loadTrack();
        }
    }
});

// Music player functionality
document.getElementById('play-button').addEventListener('click', () => {
    const audio = document.getElementById('audio');
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

document.getElementById('next-button').addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % musicList.length;
    loadTrack();
});

document.getElementById('favorite-button').addEventListener('click', () => {
    const currentTrack = musicList[currentTrackIndex];
    const ipAddress = getUserIP(); // Implement a way to get user IP
    if (!userFavorites.has(ipAddress)) {
        userFavorites.set(ipAddress, []);
    }
    userFavorites.get(ipAddress).push(currentTrack);
    alert(`Favorited: ${currentTrack}`);
});

function loadTrack() {
    const audio = document.getElementById('audio');
    audio.src = musicList[currentTrackIndex];
    audio.play();
}

function getUserIP() {
    // Simulate getting user IP (in real case, this would be obtained server-side)
    return '192.168.1.1'; // Example IP
}
