document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const promptInput = document.getElementById('prompt');
    const imageCountSelect = document.getElementById('imageCount');
    const generatedImageContainer = document.getElementById('generatedImageContainer');
    const loader = document.getElementById('loader');
    const styleSelect = document.getElementById('styleSelect');
    const colorSelect = document.getElementById('colorSelect');

    let currentImageBlobs = [];

    // Set permanent background image
    document.body.style.backgroundImage = "url('bg.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";

    generateBtn.addEventListener('click', generateImages);

    async function generateImages() {
        const prompt = promptInput.value.trim();
        const imageCount = parseInt(imageCountSelect.value);
        const style = styleSelect.value;
        const color = colorSelect.value;

        if (!prompt) {
            alert('Please enter a description');
            return;
        }

        showLoader();
        generatedImageContainer.innerHTML = '';
        generatedImageContainer.classList.remove('hidden');
        currentImageBlobs = [];

        try {
            for (let i = 0; i < imageCount; i++) {
                const form = new FormData();
                form.append('prompt', `${prompt}, ${style} style, ${color} color scheme`);

                const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
                    method: 'POST',
                    headers: {
                        'x-api-key': '14852ece00528781efaac684f3225b2d6c6ad2be39c5e11279e2251d724320321ec2b62a44c7e75dc0271a643c1b76a2',
                    },
                    body: form,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const buffer = await response.arrayBuffer();
                const blob = new Blob([buffer], { type: 'image/png' });
                currentImageBlobs.push(blob);
                const imageUrl = URL.createObjectURL(blob);
                
                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-with-download';
                
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = 'Generated Image';
                imgElement.className = 'generated-image';
                
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'download-btn';
                downloadBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                `;
                downloadBtn.addEventListener('click', () => downloadImage(blob, i));
                
                imgContainer.appendChild(imgElement);
                imgContainer.appendChild(downloadBtn);
                generatedImageContainer.appendChild(imgContainer);
            }
        } catch (error) {
            console.error('Error generating image:', error);
            alert(`An error occurred while generating the image(s): ${error.message}`);
        } finally {
            hideLoader();
        }
    }

    function downloadImage(blob, index) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `generated_image_${index + 1}.png`;
        link.click();
    }

    function showLoader() {
        loader.classList.remove('hidden');
    }

    function hideLoader() {
        loader.classList.add('hidden');
    }
});

// Remove the background cycling code as it conflicts with the permanent background