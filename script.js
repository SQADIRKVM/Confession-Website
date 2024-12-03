const form = document.getElementById('confessionForm');
const confessionList = document.getElementById('confessionList');

// Add this function at the top of your script
function animateCounter(element, targetValue) {
    const duration = 1000; // Animation duration in milliseconds
    const steps = 50; // Number of steps in the animation
    const stepDuration = duration / steps;
    const increment = targetValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            clearInterval(timer);
            element.textContent = targetValue;
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepDuration);
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData.entries());
    formDataObj.timestamp = new Date().toISOString();

    // First, reset the form
    form.reset();

    // Send confession
    fetch('https://script.google.com/macros/s/AKfycbyA56Plp0_RIBE7IDDYvZfAWiOXvan9YVeKSYu8k22Dgg6NfAPst7BMaBOsZCzjTL5l5A/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObj)
    })
    .then(() => {
        // Show success message
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            width: '300px',
            customClass: {
                popup: 'animated-toast',
                title: 'toast-title'
            },
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: `<i class="fas fa-heart heart-icon"></i> Confession shared`
        }).then(() => {
            window.location.reload();
        });
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong while sharing your confession',
            confirmButtonColor: '#6c5ce7'
        }).then(() => {
            // Also refresh page if error occurs and user clicks OK
            window.location.reload();
        });
    });
});

// Add this function to handle sharing
function shareConfession(name, confession, timestamp) {
    // Create a unique identifier for the confession using timestamp
    const confessionId = new Date(timestamp).getTime();
    
    // Create the website URL with the confession ID
    const websiteURL = `${window.location.origin}${window.location.pathname}?confession=${confessionId}`;
    
    // Create share text with the formatted message
    const shareText = `Confession by ${name}:\n"${confession}"\nShared from Modern Confessions\ncheck it out: ${websiteURL}`;
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: 'Modern Confessions',
            text: shareText,
            url: websiteURL
        })
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                width: '300px',
                customClass: {
                    popup: 'animated-toast',
                    title: 'toast-title'
                }
            });

            Toast.fire({
                icon: 'success',
                title: `<i class="fas fa-copy"></i> Copied to clipboard`
            });
        });
    }
}

function displayConfessions() {
    fetch('https://script.google.com/macros/s/AKfycbyA56Plp0_RIBE7IDDYvZfAWiOXvan9YVeKSYu8k22Dgg6NfAPst7BMaBOsZCzjTL5l5A/exec')
    .then(response => response.text())
    .then(text => {
        try {
            const data = JSON.parse(text);
            confessionList.innerHTML = '';
            
            // Update total confessions counter with animation
            if (Array.isArray(data)) {
                const totalConfessionsElement = document.getElementById('totalConfessions');
                const currentValue = parseInt(totalConfessionsElement.textContent) || 0;
                const newValue = data.length;
                
                if (currentValue !== newValue) {
                    animateCounter(totalConfessionsElement, newValue);
                }

                // Sort data array in reverse chronological order
                data.reverse();
            }

            if (Array.isArray(data) && data.length > 0) {
                data.forEach(confession => {
                    const confessionItem = document.createElement('div');
                    confessionItem.className = 'confession-item';
                    
                    const name = confession.name ? 
                        confession.name.replace(/[<>]/g, '') : 'Anonymous';
                    const confessionText = confession.confession ? 
                        confession.confession.replace(/[<>]/g, '') : '';
                    
                    // Create unique IDs for both buttons
                    const shareButtonId = `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    const downloadButtonId = `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    
                    confessionItem.innerHTML = `
                        <p><strong><i class="fas fa-user"></i> ${name}</strong></p>
                        <p>${confessionText}</p>
                        <div class="confession-footer">
                            <small class="timestamp">
                                <i class="fas fa-clock"></i> 
                                ${new Date(confession.timestamp || Date.now()).toLocaleString()}
                            </small>
                            <div class="button-group">
                                <button id="${shareButtonId}" class="share-btn" title="Share Link">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                                <button id="${downloadButtonId}" class="share-btn" title="Download Image">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    
                    confessionList.appendChild(confessionItem);
                    
                    // Add click event listener for sharing link
                    document.getElementById(shareButtonId).addEventListener('click', () => {
                        shareConfessionLink(name, confessionText, confession.timestamp);
                    });
                    
                    // Add click event listener for downloading image
                    document.getElementById(downloadButtonId).addEventListener('click', () => {
                        downloadConfessionImage(name, confessionText, confession.timestamp);
                    });
                });
            } else {
                confessionList.innerHTML = `
                    <div class="no-confessions">
                        <p><i class="fas fa-comment-slash"></i> No confessions yet. Be the first to share!</p>
                    </div>
                `;
            }
        } catch (e) {
            console.error('Parsing error:', e);
            confessionList.innerHTML = `
                <div class="error-message">
                    <p><i class="fas fa-exclamation-circle"></i> Unable to load confessions. Please try again later.</p>
                </div>
            `;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        confessionList.innerHTML = `
            <div class="error-message">
                <p><i class="fas fa-exclamation-circle"></i> Failed to load confessions. Please try again later.</p>
            </div>
        `;
    });
}

// Initial load
document.addEventListener('DOMContentLoaded', displayConfessions);

// Refresh every 30 seconds
const refreshInterval = setInterval(displayConfessions, 30000);

// Function to manually refresh confessions
window.refreshConfessions = function() {
    displayConfessions();
};

// Cleanup interval on page unload
window.addEventListener('unload', () => {
    clearInterval(refreshInterval);
});

// Add this code at the start of your script to handle confession links
document.addEventListener('DOMContentLoaded', function() {
    // Check for confession ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const confessionId = urlParams.get('confession');
    
    if (confessionId) {
        // Fetch and scroll to the specific confession
        fetch('https://script.google.com/macros/s/AKfycbyA56Plp0_RIBE7IDDYvZfAWiOXvan9YVeKSYu8k22Dgg6NfAPst7BMaBOsZCzjTL5l5A/exec')
        .then(response => response.text())
        .then(text => {
            const data = JSON.parse(text);
            if (Array.isArray(data)) {
                // Find the confession with matching timestamp
                const targetConfession = data.find(c => new Date(c.timestamp).getTime() == confessionId);
                if (targetConfession) {
                    // Highlight the shared confession
                    setTimeout(() => {
                        const elements = document.querySelectorAll('.confession-item');
                        elements.forEach(el => {
                            const timestamp = el.querySelector('.timestamp').textContent;
                            if (timestamp.includes(new Date(targetConfession.timestamp).toLocaleString())) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                el.style.animation = 'highlight 2s ease';
                            }
                        });
                    }, 1000);
                }
            }
        });
    }
});

// Add this CSS for highlighting shared confession
const style = document.createElement('style');
style.textContent = `
    @keyframes highlight {
        0% { background-color: var(--primary-color); }
        100% { background-color: var(--card-color); }
    }
`;
document.head.appendChild(style);

// Add these new functions for sharing and downloading
async function shareConfessionLink(name, confession, timestamp) {
    try {
        const confessionId = timestamp ? new Date(timestamp).getTime() : Date.now();
        const websiteURL = `${window.location.origin}${window.location.pathname}?confession=${confessionId}`;
        const shareText = `${name} shared new confession check it out: ${websiteURL}`;

        if (navigator.share) {
            await navigator.share({
                text: shareText
            });
        } else {
            await navigator.clipboard.writeText(shareText);
            
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                width: '300px',
                customClass: {
                    popup: 'animated-toast',
                    title: 'toast-title'
                }
            });

            Toast.fire({
                icon: 'success',
                title: `<i class="fas fa-copy"></i> Link copied to clipboard`
            });
        }
    } catch (error) {
        console.error('Error sharing:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to share confession',
            timer: 2000,
            showConfirmButton: false
        });
    }
}

async function downloadConfessionImage(name, confession, timestamp) {
    try {
        // Create unique URL for this specific confession
        const confessionId = timestamp ? new Date(timestamp).getTime() : Date.now();
        const websiteURL = `${window.location.origin}${window.location.pathname}?confession=${confessionId}`;
        
        // Create a temporary div for the confession card
        const card = document.createElement('div');
        card.className = 'confession-card-for-image';
        
        // Format the date properly
        const formattedDate = timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString();
        
        card.innerHTML = `
            <div class="card-content">
                <h3><i class="fas fa-user"></i> ${name}</h3>
                <p class="confession-text">"${confession}"</p>
                <div class="card-footer">
                    <span>Modern Confessions</span>
                    <span><i class="fas fa-clock"></i> ${formattedDate}</span>
                </div>
                <div class="card-link">
                    <span>Visit: ${websiteURL}</span>
                </div>
            </div>
        `;
        document.body.appendChild(card);

        // Generate image
        const canvas = await html2canvas(card, {
            backgroundColor: '#fff0f3',
            scale: 2,
            logging: false,
            allowTaint: true,
            useCORS: true
        });

        document.body.removeChild(card);

        // Download image
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'confession.png';
        link.click();
        
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            width: '300px',
            customClass: {
                popup: 'animated-toast',
                title: 'toast-title'
            }
        });

        Toast.fire({
            icon: 'success',
            title: `<i class="fas fa-download"></i> Image downloaded`
        }).then(() => {
            Swal.close(); // Force close after timer completes
        });

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to generate image',
            timer: 2000,
            showConfirmButton: false
        });
    }
}

