import { checkAuthentication } from "./log.js"
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
    scrWorksElement.src = figure.imageUrl
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

checkAuthentication()

// Recuperation de la modale
var modal = document.getElementById("myModal");
// Recuperation du button pour ouvrir la modale
var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Fonction pour ouvrir la modale au clique sur la croix
btn.onclick = function () {
  modal.style.display = "block";
}

// fonction pour fermer la modale
span.onclick = function () {
  modal.style.display = "none";
}

// fonction pour fermer la modale au clique en dehors de celle ci 
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
//fonction pour générer les images dans la modale 
const galleryModal = document.querySelector('.galleryModal')
function genererWorksModal(works) {
  for (let i = 0; i < works.length; i++) {
    const figure = works[i]

    const worksModalElement = document.createElement('figure')
    worksModalElement.dataset.id = works[i].id
    const scrWorksModalElement = document.createElement('img')
    scrWorksModalElement.src = figure.imageUrl
    scrWorksModalElement.crossOrigin = 'anonymous'
    const figcaptionModalElement = document.createElement('figcaption')
    figcaptionModalElement.innerText = 'éditer'

    //Ajout des icones corbeille aux images 
    const deleteBtnElement = document.createElement('i');
    deleteBtnElement.classList.add('fas', 'fa-trash-alt', 'btnSupprimer');
    figcaptionModalElement.appendChild(deleteBtnElement);

    galleryModal.appendChild(worksModalElement)
    worksModalElement.appendChild(scrWorksModalElement)
    worksModalElement.appendChild(figcaptionModalElement)

  }
}
genererWorksModal(works)
console.log(genererWorksModal);

const worksModalElement = document.querySelector('.galleryModal [data-id="${works[i].id}"] ');

if (worksModalElement) {
  worksModalElement.querySelector('.fa-trash-alt').addEventListener('click', () => {
    deleteImage(works[i].id);
  });
}

const API_URL = "http://localhost:5678/api/works";
// Fonction pour supprimer les images 
function deleteImage(id, index) {
  fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  }).then(() => {
    // Supprime l'élément du DOM
    const worksModalElement = galleryModal.querySelector(`[data-id="${id}"]`);
    if (worksModalElement && worksModalElement.parentNode) {
      worksModalElement.parentNode.removeChild(worksModalElement);
    }

    const worksElement = divGallery.querySelector(`[data-id="${id}"]`);
    if (worksElement && worksElement.parentNode) {
      worksElement.parentNode.removeChild(worksElement);
    }
    // Supprime l'élément du tableau
    works.splice(index, 1);
    window.localStorage.setItem('works', JSON.stringify(works));
  }).catch((error) => {
    console.error(`Une erreur est survenue lors de la suppression de l'image avec l'ID ${id} :`, error);
  });
}
// Ajouter un gestionnaire d'événements pour chaque icône de corbeille
const deleteBtns = document.querySelectorAll('.btnSupprimer');
deleteBtns.forEach((btn, index) => {
  const id = btn.parentNode.parentNode.dataset.id;
  btn.addEventListener('click', () => {
    deleteImage(id, index);
  });
});

const btnAjoutPhoto = document.querySelector('.btnAjoutPhoto');
const modalContent = document.querySelector('.modal-content')
btnAjoutPhoto.addEventListener('click', function () {
  // Récupérez la modale
  // const modal = document.getElementsByClassName('.modal-content');

  // Effacez le contenu de la modale
  modalContent.innerHTML = '';
  modalContent.setAttribute('id', 'modalContent2');
  // Titre de la modal 
  const titleModal = document.createElement('h1');
  titleModal.innerText = 'Ajout Photo';
  // Créez un formulaire, un selecteur et un bouton pour ajouter une photo
  const form = document.createElement('form');
  form.setAttribute('class', 'formModal')

  const input = document.createElement('input');
  input.type = 'file';
  const titreAjout = document.createElement('input');
  titreAjout.type = 'text';
  const labelTitreAjout = document.createElement('label');
  labelTitreAjout.setAttribute('for', 'titre');
  labelTitreAjout.setAttribute('class', 'labelTitreAjout');
  labelTitreAjout.innerHTML = "Titre";
  const select = document.createElement('select');
  const optionInit = document.createElement('optionInit');
  optionInit.value = "";
  optionInit.innerText = "Veuillez choisir une catégorie";

  //boucle sur les catégories 
  for (let i = 0; i < categories.length; i++) {
    const article = categories[i];
    //cree des options à ajouter au select
    const option = document.createElement('option');
    option.value = article.name;
    option.innerText = article.name;
    select.add(option);
  }
  const button = document.createElement('button');
  button.innerText = 'Ajouter';

  // Ajoutez le formulaire, le selecteur et le bouton à la modale
  modalContent.appendChild(titleModal);
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
  if (checkAuthentication()) {
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
    checkAuthentication()
    checkModal()
  })
}
logOut()

console.log(logOut)
