const viewPhotosBtn = document.querySelector('.view-photos-btn');
const modal = document.getElementById('imageModal');
const closeModal = document.querySelector('.close-modal');
const galleryContainer = document.getElementById('gallery-container');

// 1. Fetch images from your /images endpoint
async function loadGallery() {
    try {
        const response = await fetch('/images');
        const images = await response.json();
        
        galleryContainer.innerHTML = images.map(imgSrc => 
            `<img src="${imgSrc}" class="gallery-img">`
        ).join('');
    } catch (error) {
        console.error("Error fetching images:", error);
    }
}

// 2. Open Modal Event
viewPhotosBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    loadGallery(); // Call the function to get images from Express
});

// 3. Close Modal Event
closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = 'none';
};