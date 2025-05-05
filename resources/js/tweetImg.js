document.getElementById('media-upload').addEventListener('change', function(e) {
    const files = e.target.files;
    const previewContainer = document.getElementById('media-previews');
    previewContainer.innerHTML = ''; // Efface les aperçus précédents
    
    if (files.length > 0) {
      Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const reader = new FileReader();
          
          reader.onload = function(event) {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200';
            
            if (file.type.startsWith('image/')) {
              previewDiv.innerHTML = `
                <img src="${event.target.result}" alt="Preview" class="w-full h-full object-cover">
                <button class="remove-preview absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center" data-index="${index}">×</button>
              `;
            } else {
              previewDiv.innerHTML = `
                <video class="w-full h-full object-cover">
                  <source src="${event.target.result}" type="${file.type}">
                </video>
                <button class="remove-preview absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center" data-index="${index}">×</button>
              `;
            }
            
            previewContainer.appendChild(previewDiv);
            
            // Gestion de la suppression d'un aperçu
            previewDiv.querySelector('.remove-preview').addEventListener('click', function(e) {
              e.preventDefault();
              removeFileFromInput(index);
              previewDiv.remove();
            });
          };
          
          reader.readAsDataURL(file);
        }
      });
    }
  });
  
  function removeFileFromInput(index) {
    const input = document.getElementById('media-upload');
    const files = Array.from(input.files);
    files.splice(index, 1);
    
    // Crée un nouveau DataTransfer pour mettre à jour les fichiers
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    input.files = dataTransfer.files;
  }