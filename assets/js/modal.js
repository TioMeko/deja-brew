const modal = document.querySelector('#modal');
const overlay = document.querySelector('.overlay');
const buttonCloseModal = document.querySelector('#close-modal');
const buttonShowModal = document.querySelector('#favorites-button');

// Open Modal
const openModal = function () {
  modal.classList.remove('hidden');
  modal.classList.add('visible');
  overlay.classList.remove('hidden');
  overlay.classList.add('visible');
};

buttonShowModal.addEventListener('click', openModal)

// Close Modal
const closeModal = function () {
  modal.classList.add('hidden');
  modal.classList.remove('visible');
  overlay.classList.add('hidden');
  overlay.classList.remove('visible');
};

buttonCloseModal.addEventListener('click', closeModal); // Pressing X Button closes Modal

overlay.addEventListener('click', closeModal); // Clicking outside Modal closes Modal
document.addEventListener('keydown', function (k) {
  if (k.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
