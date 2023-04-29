// Variables globales
let categories = JSON.parse(localStorage.getItem('categories') || 'null');
const divGallery = document.querySelector('.gallery');
let works = JSON.parse(localStorage.getItem('works') || 'null');


//Recuperation du localStorage pour y mettre la valeur associée à la clé 'authToken'.
function getToken() {
  return localStorage.getItem('authToken');
}

// Fonction pour récupérer les données depuis l'API et les stocker dans le localStorage
async function fetchData(url, key) {
  const response = await fetch(url);
  const data = await response.json();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

// Fonction pour filtrer les differentes categories
function removeFromLocalStorage(idWork) {
  let works = JSON.parse(localStorage.getItem("works"));
  let worksFiltered = works.filter(work => {
    if (work.id != idWork) {
      return work;
    }
  });
  localStorage.setItem("works", JSON.stringify(worksFiltered));
}

// Fonction pour générer les catégories et leurs boutons associés
function generateCategories(categories) {
  const buttonAll = document.getElementById('btnAll');
  buttonAll.addEventListener('click', function () {
    divGallery.innerText = '';
    generateWorks(works);
  });

  for (const category of categories) {
    const categoriesElement = document.createElement('article');
    categoriesElement.dataset.id = category.id;
    const boutonCategorie = document.createElement('button');
    boutonCategorie.innerText = category.name;
    boutonCategorie.dataset.id = category.id;
    categoriesElement.appendChild(boutonCategorie);
    document.querySelector('.categoriesNav').appendChild(categoriesElement);
    boutonCategorie.addEventListener('click', function () {
      const worksFiltered = works.filter((work) => work.categoryId === category.id);
      divGallery.innerText = '';
      generateWorks(worksFiltered);
    });
  }
}

// Vérifie si l'utilisateur est connecté pour afficher ou non certaines fonctionnalitées
function checkAuthentification() {
  const loginElement = document.getElementById('login');
  const logoutElement = document.getElementById('logout');
  const publier = document.querySelector('.publier');
  const categoriesNav = document.querySelector('.categoriesNav');
  const btnModal = document.getElementById('myBtn');
  const authToken = localStorage.getItem('authToken');
  const btntModifierPhoto = document.querySelector('.modifierSpan');
  if (authToken) {
    categoriesNav.classList.remove('show');
    publier.classList.add('show');
    btntModifierPhoto.style.display = 'block';
    btnModal.style.display = 'block';
    loginElement.style.display = 'none';
    logoutElement.style.display = 'block';
    genererModal(works);
    return true;
  } else {
    categoriesNav.classList.add('show');
    publier.classList.remove('show');
    btntModifierPhoto.style.display = 'none';
    btnModal.style.display = 'none';
    loginElement.style.display = 'block';
    logoutElement.style.display = 'none';
    return false;
  }
}

// Fonction pour générer les images à partir des données récupérées depuis l'API
function generateWorks(works) {
  for (const work of works) {
    const worksElement = document.createElement('figure');
    worksElement.dataset.id = work.id;
    const scrWorksElement = document.createElement('img');
    scrWorksElement.src = work.imageUrl + '?random=' + Math.random();
    scrWorksElement.crossOrigin = 'anonymous';
    const figcaptionElement = document.createElement('figcaption');
    figcaptionElement.innerText = work.title;
    worksElement.appendChild(scrWorksElement);
    worksElement.appendChild(figcaptionElement);
    divGallery.appendChild(worksElement);
  }
}

// Fonction principale qui appelle les autres fonctions
async function main() {
  categories = await fetchData('http://localhost:5678/api/categories', 'categories');
  works = await fetchData(API_URL, 'works');
  generateCategories(categories);
  generateWorks(works);
  checkAuthentification();
}

// Appelle la fonction principale
main();

// Récupérer la balise parent pour la modale
const modalContent = document.querySelector('.modal-content');
const modalContainer = document.getElementById("myModal");

// Fonction qui crée et que génère la modale
function genererModal(works) {

  // Créer l'en-tête de la modale
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modalHeader');

  const modalTitle = document.createElement('h1');
  modalTitle.classList.add('modalTitle');
  modalTitle.textContent = 'Galerie photo';

  const closeBtn = document.createElement('span');
  closeBtn.innerHTML = '<i class="fas fa-times close"></i>';
  closeBtn.classList.add('close');
  closeBtn.addEventListener('click', () => {
    modalContainer.style.display = 'none';
  });
  modalHeader.appendChild(closeBtn);
  modalHeader.appendChild(modalTitle);


  // Créer le contenu de la modale
  const galleryModal = document.createElement('div');
  galleryModal.classList.add('galleryModal');
  for (let i = 0; i < works.length; i++) {
    const figure = works[i];

    const worksModalElement = document.createElement('figure');
    worksModalElement.dataset.id = figure.id;

    const scrWorksModalElement = document.createElement('img');
    scrWorksModalElement.src = figure.imageUrl;
    scrWorksModalElement.crossOrigin = 'anonymous';

    const figcaptionModalElement = document.createElement('figcaption');
    figcaptionModalElement.innerText = 'éditer';

    const deleteBtnElement = document.createElement('i');
    deleteBtnElement.classList.add('fas', 'fa-trash-alt', 'btnSupprimer');
    figcaptionModalElement.appendChild(deleteBtnElement);

    galleryModal.appendChild(worksModalElement);
    worksModalElement.appendChild(scrWorksModalElement);
    worksModalElement.appendChild(figcaptionModalElement);

    deleteBtnElement.addEventListener('click', (function (id) {
      return function (event) {
        event.preventDefault();
        deleteImage(id);
      }
    })(works[i].id));
  }


  // Créer le séparateur
  const separator = document.createElement('hr');
  separator.classList.add('separateur');

  // Créer les boutons
  const btnModal = document.createElement('div');
  btnModal.classList.add('btnModal');

  const btnAjoutPhoto = document.createElement('button');
  btnAjoutPhoto.classList.add('btnAjoutPhoto');
  btnAjoutPhoto.setAttribute('type', 'button');
  btnAjoutPhoto.textContent = 'Ajouter une photo';

  // Ajoutez un gestionnaire d'événements pour le clic sur le bouton Ajout Photo
  btnAjoutPhoto.addEventListener('click', function () {

    genererForm();

  });

  const supprimerBtn = document.createElement('button');
  supprimerBtn.classList.add('supprimer');
  supprimerBtn.setAttribute('type', 'button');
  supprimerBtn.textContent = 'Supprimer la galerie';

  btnModal.appendChild(btnAjoutPhoto);
  btnModal.appendChild(supprimerBtn);

  // Ajouter les éléments à la modale
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(galleryModal);
  modalContent.appendChild(separator);
  modalContent.appendChild(btnModal);

  // Ajouter la modale à la balise parent
  modalContainer.appendChild(modalContent);
}



// Fonction pour la deuxieme modale
function genererForm() {
  // Effacez le contenu de la modale
  modalContent.innerHTML = '';

  const closeBtn = document.createElement('span');
  closeBtn.innerHTML = '<i class="fas fa-times close"></i>';
  closeBtn.classList.add('close');
  closeBtn.addEventListener('click', () => {
    modalContainer.style.display = 'none';
    modalContent.innerHTML = ''
    genererModal(works);
  });

  // Créer l'en-tête de la modale
  const modal2Header = document.createElement('div');
  modal2Header.classList.add('modal2Header');

  // Créez un conteneur pour l'input
  const container = document.createElement('div');
  container.classList.add('input-file-container');

  // Créez un label pour l'input
  const label = document.createElement('label');
  label.setAttribute('for', 'file-input');
  label.classList.add('input-file-label');

  // Créez un bouton pour remplacer le span "Ajouter photo"
  const buttonAjoutFile = document.createElement('button');
  buttonAjoutFile.classList.add('input-file-button');
  buttonAjoutFile.textContent = 'Ajouter photo';
  label.appendChild(buttonAjoutFile);

  // Ajoutez un gestionnaire d'événements pour le bouton
  buttonAjoutFile.addEventListener('click', function (event) {
    event.preventDefault();
    input.click();
  });

  // Créez une icône pour le label
  const icon = document.createElement('i');
  icon.classList.add('far', 'fa-sharp', 'fa-light', 'fa-image', 'input-file-icon');
  label.appendChild(icon);

  // Créez l'input
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('id', 'file-input');
  input.classList.add('input-file');
  input.setAttribute('accept', '.jpg,.png');
  input.setAttribute('max-size', '4');
  input.style.display = 'none';

  // Créez une phrase pour le conteneur
  const hint = document.createElement('p');
  hint.classList.add('input-file-hint');
  hint.textContent = 'jpg, png : 4 Mo max';

  // Ajoutez tous les éléments au conteneur
  container.appendChild(label);
  container.appendChild(input);
  container.appendChild(hint);

  // Titre de la modal 
  const titleModal = document.createElement('h1');
  titleModal.innerText = 'Ajout Photo';

  // Créez un formulaire, un selecteur et un bouton pour ajouter une photo
  const form = document.createElement('form');
  form.setAttribute('class', 'formModal')


  // Créez un conteneur pour l'aperçu de l'image
  const previewContainer = document.createElement('div');
  previewContainer.classList.add('input-file-preview');
  previewContainer.style.display = 'none';

  // Créez un élément pour l'aperçu de l'image
  const preview = document.createElement('img');
  preview.style.maxWidth = '50%';
  previewContainer.appendChild(preview);


  // Ajoutez un gestionnaire d'événements pour la prévisualisation de l'image
  input.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        preview.src = reader.result;
        previewContainer.style.display = 'block';
        container.style.display = 'none';
      });
      reader.readAsDataURL(file);
    }
  });

  // Ajoutez tous les éléments au formulaire
  form.appendChild(container);
  form.appendChild(previewContainer);

  // Créez un champ de saisie pour le titre de la photo
  const titreAjout = document.createElement('input');
  titreAjout.type = 'text';
  titreAjout.setAttribute('name', 'titre');
  titreAjout.classList.add('titlePhotoUpload');

  // Créez un bouton pour revenir à la page précédente
  const backButton = document.createElement('span');
  backButton.setAttribute('class', 'backButton');
  backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';

  backButton.addEventListener('click', function () {
    modalContent.innerHTML = '';
    genererModal(works);

  });

  // Créez un label pour le champ de saisie du titre de la photo
  const labelTitreAjout = document.createElement('label');
  labelTitreAjout.setAttribute('for', 'titre');
  labelTitreAjout.setAttribute('class', 'labelTitreAjout');
  labelTitreAjout.innerHTML = "Titre";

  // Créez un selecteur pour choisir une catégorie de photo
  const select = document.createElement('select');
  select.setAttribute('name', 'category');
  select.classList.add('select');
  const labelSelect = document.createElement('label');
  labelSelect.setAttribute('for', 'category');
  labelSelect.setAttribute('class', 'labelSelect');
  labelSelect.innerHTML = "Catégorie";

  // Créez une option par défaut pour le selecteur
  const optionInit = document.createElement('option');
  optionInit.value = "";
  optionInit.text = "Veuillez choisir une catégorie";
  select.add(optionInit, 0);

  //boucle sur les catégories 
  for (let i = 0; i < categories.length; i++) {
    const article = categories[i];

    //cree des options à ajouter au select
    const option = document.createElement('option');
    option.value = article.id;
    option.innerText = article.name;
    select.add(option);
  }

  // Créer le séparateur
  const separator = document.createElement('hr');
  separator.classList.add('separateur2');

  const button = document.createElement('button');
  button.setAttribute('type', 'submit');
  button.setAttribute('class', 'btnAjout');
  button.innerText = 'Valider';

  // Ajoutez un gestionnaire d'événements au bouton d'ajout pour envoyer les données via une requête HTTP POST
  button.addEventListener('click', (event) => {
    event.preventDefault();

    const titreAjout = document.querySelector('input[name="titre"]');
    const select = document.querySelector('select[name="category"]');

    // Vérifiez si un fichier a été sélectionné
    if (!input.files[0]) {
      alert('Veuillez choisir un fichier');
      return;
    }
    // Vérifiez si le champ de saisie du titre est vide
    if (titreAjout.value.trim() === '') {
      alert('Veuillez saisir un titre pour la photo');
      return;
    }
    // Vérifiez si une catégorie a été sélectionnée
    if (select.value === '') {
      alert('Veuillez choisir une catégorie pour la photo');
      return;
    }

    // Créez un objet FormData pour envoyer les données du formulaire
    const formData = new FormData();
    formData.append('image', input.files[0]);
    formData.append('title', titreAjout.value);
    formData.append('category', select.value);
    formData.append('userId', 1);

    saveProject(formData);

  });


  // Ajoutez le formulaire, le selecteur et le bouton à la modale
  modal2Header.appendChild(backButton);
  modal2Header.appendChild(closeBtn);
  modalContent.appendChild(modal2Header);
  modalContent.appendChild(titleModal);
  modalContent.appendChild(form);
  form.appendChild(container);
  form.appendChild(labelTitreAjout);
  form.appendChild(titreAjout);
  form.appendChild(labelSelect);
  form.appendChild(select);
  select.appendChild(optionInit);
  form.appendChild(separator);
  form.appendChild(button);
}

// Fonction pour ajouter une image
async function saveProject(formData) {
  // Envoyez une requête HTTP POST pour ajouter l'image
  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    },
    body: formData,

  })
    .then(response => response.json())
    .then(async (data) => {
      works = await fetchData(API_URL, "works");
      modalContent.innerHTML = '';
      genererModal(works);
      divGallery.innerHTML = '';
      generateWorks(works);

    })
    .catch(error => {
      console.error(error);
    })
}

const btn = document.getElementById("myBtn");
btn.addEventListener('click', () => {
  modalContainer.style.display = 'block';
});

window.addEventListener('click', (event) => {
  if (event.target == modalContainer) {
    modalContainer.style.display = "none";
    modalContent.innerHTML = '';
    genererModal(works);

  }
});

const API_URL = "http://localhost:5678/api/works";


//Fonction pour supprimer les images 
function deleteImage(id) {
  const worksToDelete = document.querySelector(`[data-id="${id}"]`);
  fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      // "Content-Type": "application/json",
      'Authorization': `Bearer ${getToken()}`
    },
  }).then(() => {
    worksToDelete.remove(); // supprime l'élément de la page
    console.log('message');
  })
    .then(async () => {
      const imageGalerie = document.querySelector(`.gallery figure[data-id="${id}"]`);
      if (imageGalerie) {
        imageGalerie.remove();
      }
      removeFromLocalStorage(id);
      works = await fetchData(API_URL, "works");
      // Supprimer l'image de la modale
      const imageModale = document.querySelector(`.galleryModal figure[data-id="${id}"]`);
      if (imageModale) {
        imageModale.remove();
      }
    })
}

//fonction pour se déconnecter
function logOut() {
  let logoutElement = document.getElementById('logout');
  logoutElement.addEventListener('click', () => {
    localStorage.removeItem('authToken')
    checkAuthentification()
  })
}
logOut()

console.log(logOut);