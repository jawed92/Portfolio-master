import { checkAuthentication} from "./log.js"
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

function genererCategories (categories) {
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

function genererWorks (works) {
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

const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

function toggleModal(){
  modalContainer.classList.toggle("active")
}

// verifier si login pour afficher le button ouvrir modal
export function  checkModal() {
  const openDialog = document.getElementById('openDialog')
if( checkAuthentication()) {
  openDialog.style.display = 'block' 
} else {
  openDialog.style.display = 'none'
}
}

checkModal()

function logOut() {
  let logoutElement = document.getElementById('logout');

  logoutElement.addEventListener('click', () => {
    console.log("jawed");
    localStorage.removeItem('authToken')
    checkAuthentication()
    checkModal()
   })
}
logOut()