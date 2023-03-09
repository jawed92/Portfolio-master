import { checkAuthentification } from "./log.js"

let categories = window.localStorage.getItem('categories')
const divGallery = document.querySelector('.gallery')

//Recuperation des categorie depuis l'api
if (categories === null) {
  const reponse = await fetch('http://localhost:5678/api/categories')
  categories = await reponse.json()
  // Transformation des catégories au format JSON
  const valeurCategories = JSON.stringify(categories)
  window.localStorage.setItem('categories', valeurCategories)
} else {
  categories = JSON.parse(categories)
}

let works = window.localStorage.getItem('works')
// Initilisation de la variable pour recuperer la liste des projets
if (works === null) {
  // Recuperation des images de l'API
  const reponse = await fetch('http://localhost:5678/api/works')
  works = await reponse.json()

  // Transformation des pièces en JSON
  const valeurWorks = JSON.stringify(works)

  // Stockage des informations dans le localStorage
  window.localStorage.setItem(works, valeurWorks)
} else {
  works = JSON.parse(works)
}
console.log(works)

function genererCategories(categories) {
  const buttonAll = document.getElementById('btnAll')
  buttonAll.addEventListener('click', function () {
    divGallery.innerText = ''
    genererWorks(works)
  })

  for (let i = 0; i < categories.length; i++) {
    const article = categories[i]
    // Récupération de l'élément du DOM qui accueillera les categories
    const sectionCategories = document.querySelector('.categoriesNav')
    // Création d’une balise dédiée à une categorie
    const categoriesElement = document.createElement('article')
    categoriesElement.dataset.id = categories[i].id
    // Création des balises
    const boutonCategorie = document.createElement('button')
    boutonCategorie.innerText = article.name
    boutonCategorie.dataset.id = article.id

    sectionCategories.appendChild(categoriesElement)
    categoriesElement.appendChild(boutonCategorie)
    boutonCategorie.addEventListener('click', function () {
      const worksFiltered = works.filter(function (work) {
        if (work.categoryId === categories[i].id) {
          return work
        }
      })
      console.log(worksFiltered)
      divGallery.innerText = ''
      genererWorks(worksFiltered)
    })
  }
}
genererCategories(categories)

//Fonction pour afficher les images de la galerie 
function genererWorks(works) {
  for (let i = 0; i < works.length; i++) {
    const figure = works[i]

    const worksElement = document.createElement('figure')
    worksElement.dataset.id = works[i].id
    const scrWorksElement = document.createElement('img')
    scrWorksElement.src = figure.imageUrl + '?random=' + Math.random()
    scrWorksElement.crossOrigin = 'anonymous'
    const figcaptionElement = document.createElement('figcaption')
    figcaptionElement.innerText = figure.title

    divGallery.appendChild(worksElement)
    worksElement.appendChild(scrWorksElement)
    worksElement.appendChild(figcaptionElement)
  }
}
genererWorks(works)
console.log(genererWorks)

checkAuthentification()

const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const btnClose = document.getElementsByClassName("close")[0];
const galleryModal = document.querySelector('.galleryModal');
const API_URL = "http://localhost:5678/api/works";
const token = localStorage.getItem('authToken');

btn.addEventListener('click', () => {
  modal.style.display = 'block';
});

btnClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

function genererWorksModal(works) {
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

    deleteBtnElement.addEventListener('click', (event) => {
      event.preventDefault();
      deleteImage(works[i].id);
    });
  }
}
genererWorksModal(works);

//Fonction pour supprimer les images 
function deleteImage(id) {
  const worksToDelete = document.querySelector(`[data-id="${id}"]`);

  fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
  }).then(() => {
    worksToDelete.remove(); // supprime l'élément de la page
  })
}

// Sélectionnez le bouton pour ajouter une photo et le contenu de la modale
const btnAjoutPhoto = document.querySelector('.btnAjoutPhoto');
const modalContent = document.querySelector('.modal-content');

// Ajoutez un gestionnaire d'événements pour le clic sur le bouton Ajout Photo
btnAjoutPhoto.addEventListener('click', function () {

  // Effacez le contenu de la modale
  modalContent.innerHTML = '';
  modalContent.setAttribute('id', 'modalContent2');
  // Créez un input de type "file" pour permettre la sélection d'un fichier image
  const input = document.createElement('input');
  input.type = 'file';

  // Titre de la modal 
  const titleModal = document.createElement('h1');
  titleModal.innerText = 'Ajout Photo';

  // Créez un formulaire, un selecteur et un bouton pour ajouter une photo
  const form = document.createElement('form');
  form.setAttribute('class', 'formModal')

  // Ajoutez un gestionnaire d'événements pour la prévisualisation de l'image
  input.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        const preview = document.createElement('img');
        preview.src = reader.result;
        preview.style.maxWidth = '50%';
        form.replaceChild(preview, input);
      });
      reader.readAsDataURL(file);
    }
  });

  // Créez un champ de saisie pour le titre de la photo
  const titreAjout = document.createElement('input');
  titreAjout.type = 'text';
  titreAjout.setAttribute('name', 'titre');

  // Créez un bouton pour revenir à la page précédente
  const backButton = document.createElement('button');
  backButton.setAttribute('class', 'backButton');
  backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
  backButton.addEventListener('click', function () {
    // modalContent.innerHTML = '';

  });

  // Créez un label pour le champ de saisie du titre de la photo
  const labelTitreAjout = document.createElement('label');
  labelTitreAjout.setAttribute('for', 'titre');
  labelTitreAjout.setAttribute('class', 'labelTitreAjout');
  labelTitreAjout.innerHTML = "Titre";

  // Créez un selecteur pour choisir une catégorie de photo
  const select = document.createElement('select');
  select.setAttribute('name', 'category');

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

  const button = document.createElement('button');
  button.setAttribute('type', 'submit');
  button.setAttribute('class', 'btnAjout');
  button.innerText = 'Ajouter';

  // Ajoutez un gestionnaire d'événements au bouton d'ajout pour envoyer les données via une requête HTTP POST
  button.addEventListener('click', (event) => {
    event.preventDefault();

    // Récupérez les éléments du formulaire
    const form = document.querySelector('form');

    const titreAjout = document.querySelector('input[name="titre"]');
    const select = document.querySelector('select[name="category"]');

    if (!input.files[0]) {
      alert('Veuillez choisir un fichier');
      return;
    }

    // Créez un objet FormData pour envoyer les données du formulaire
    const formData = new FormData();
    formData.append('image', input.files[0]);
    formData.append('title', titreAjout.value);
    formData.append('category', select.value);
    formData.append('userId', 1);
    // Ajouter un paramètre aléatoire à l'URL de l'image pour forcer le navigateur à la recharger
    const randomParam = Math.floor(Math.random() * 100000);
    const imageUrl = `http://localhost:5678/api/works/${formData.id}/image?random=${randomParam}`;
    const scrWorksElement = document.createElement('img');
    scrWorksElement.src = imageUrl;


    // Envoyez une requête HTTP POST pour ajouter l'image
    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,

    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })

      .catch(error => {
        console.error(error);
      });
  });

  // Ajoutez le formulaire, le selecteur et le bouton à la modale
  modalContent.appendChild(titleModal);
  modalContent.appendChild(backButton);
  modalContent.appendChild(form);
  form.appendChild(input);
  form.appendChild(labelTitreAjout);
  form.appendChild(titreAjout);
  form.appendChild(select);
  select.appendChild(optionInit);
  form.appendChild(button);

});

// verifier si login pour afficher le button ouvrir modal
function checkModal() {
  const openDialog = document.getElementById('myBtn')
  if (checkAuthentification()) {
    openDialog.style.display = 'block'
  } else {
    openDialog.style.display = 'none'
  }
}
checkModal()

//fonction pour se déconnecter
function logOut() {
  let logoutElement = document.getElementById('logout');

  logoutElement.addEventListener('click', () => {
    localStorage.removeItem('authToken')
    checkAuthentification()
    checkModal()
  })
}
logOut()

console.log(logOut);
