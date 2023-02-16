import { checkAuthentication } from "./log.js"
let categories = window.localStorage.getItem('categories')
const divGallery = document.querySelector('.gallery')

if (categories === null) {
  // Récupération des pièces depuis l'API
  const reponse = await fetch('http://localhost:5678/api/categories')
  categories = await reponse.json()
  // Transformation des pièces en JSON
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

// const modalContainer = document.querySelector(".modal-container");
// const modalTriggers = document.querySelectorAll(".modal-trigger");

// modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

// function toggleModal() {
//   modalContainer.classList.toggle("active")
// }

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
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
    deleteBtnElement.classList.add('fas', 'fa-trash-alt');
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
  deleteImage();
  });
  }
  genererWorksModal(works)
  console.log(genererWorksModal);
  
  //Fonction pour supprimer les images de la galerie
  function deleteImage() {
  let worksToDelete = document.querySelector(['data - id = "${ worksId }"']);
  
  const deleteIcon = worksToDelete.querySelector('.fa-trash-alt');
  
  deleteIcon.addEventListener('click', () => {
  fetch(galerieUrl, {
  method: "DELETE",
  headers: {
  "Content-Type": "application/json"
  },
  body: JSON.stringify({works: [id]}) // liste des IDs des images a supprimer
  }).then(res => {
  worksToDelete.remove(); // supprime l'élément de la page
  })
  });
  }


// // Appelle la fonction deleteImage() lorsque le bouton de corbeille est cliqué
// if (worksModalElement) {
//   worksModalElement.querySelector('.fa-trash-alt').addEventListener('click', () => {
//     deleteImage(works[i].id);
//   });
// }
// // verifier si login pour afficher le button ouvrir modal
// function checkModal() {
//   const openDialog = document.getElementById('myBtn')
//   if (checkAuthentication()) {
//     openDialog.style.display = 'block'
//   } else {
//     openDialog.style.display = 'none'
//   }
// }
// checkModal()

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
console.log(logOut);
// //Fonction pour supprimer les images de la gelerie dans la modale 
// function supprimerImagesModal(works) {
//   const galerieUrl = 'http://localhost:5678/api/works/';

//   // Récupérer la liste des images à supprimer
//   const imagesASupprimer = document.querySelectorAll(".galleryModal:checked");
//   const imagesIds = [];

//   // Ajouter les identifiants des images à supprimer dans un tableau
//   imagesASupprimer.forEach(work => imagesIds.push(image.dataset.worksId));

//   if (imagesIds.length === 0) {
//     alert("Veuillez sélectionner au moins une image à supprimer.");
//     return;
//   }

//   // Confirmer la suppression des images
//   const confirmationModal = document.querySelector(".galleryModal");
//   const confirmationButton = confirmationModal.querySelector(".supprimer");

  // confirmationButton.addEventListener("click", () => {
  //   // Envoyer une requête DELETE pour supprimer les images sélectionnées
  //   fetch(galerieUrl, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ images: imagesIds })
  //   })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error("Une erreur est survenue lors de la suppression des images.");
//         }
//         return response.json();
//       })
//       .then(data => {
//         // Si la suppression a réussi, recharger la page pour afficher les changements
//         window.location.reload();
//       })
//       .catch(error => {
//         console.error(error);
//         // Afficher un message d'erreur à l'utilisateur
//         alert("Une erreur est survenue lors de la suppression des images.");
//       });
//   });

//   // Ouvrir la modale de confirmation
//   confirmationModal.style.display = "block";
// }
// supprimerImagesModal()
// console.log(supprimerImagesModal);