//*******************************Gestion de display des messages flash************************
document.addEventListener('DOMContentLoaded', function() {
    const flashMessage = document.getElementById('flash-message');
    
    if (flashMessage) {
    // Disparaît après 5 secondes (5000ms)
    setTimeout(() => {
        flashMessage.classList.add('opacity-0');
        
        // Supprime l'élément après la transition
        setTimeout(() => {
        flashMessage.remove();
        }, 500);
    }, 3000);
    }
});