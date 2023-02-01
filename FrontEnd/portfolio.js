let categories = window.localStorage.getItem('categories')

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

function genererCategories (categories) {
  for (let i = 0; i < categories.length; i++) {
    const article = categories[i]
    // Récupération de l'élément du DOM qui accueillera les categories
    const sectionCategories = document.querySelector('.categoriesNav')
    // Création d’une balise dédiée à une categorie
    const categoriesElement = document.createElement('article')
    categoriesElement.dataset.id = categories[i].id
    // Création des balises
    const nomsCategoriesElement = document.createElement('button')
    nomsCategoriesElement.innerText = article.name

    sectionCategories.appendChild(categoriesElement)
    categoriesElement.appendChild(nomsCategoriesElement)
  }
}
genererCategories(categories)

let images = window.localStorage.getItem('images')

if (images === null) {
  // Recuperation des images de l'API
  const reponse = await fetch('http://localhost:5678/api/works')

  images = await reponse.json()
  // Transformation des pièces en JSON
  const valeurimages = JSON.stringify(images)
  // Stockage des informations dans le localStorage
  window.localStorage.setItem('images', valeurimages)
} else {
  images = JSON.parse(images)
}
console.log(images)

function genererimages (images) {
  for (let i = 0; i < images.length; i++) {
    const figure = images[i]
    const divGallery = document.querySelector('.gallery')
    const imagesElement = document.createElement('figure')
    imagesElement.dataset.id = images[i].id
    const scrImagesElement = document.createElement('img')
    scrImagesElement.src = figure.imageUrl
    scrImagesElement.crossOrigin = 'anonymous'
    const figcaptionElement = document.createElement('figcaption')
    figcaptionElement.innerText = figure.title

    divGallery.appendChild(imagesElement)
    imagesElement.appendChild(scrImagesElement)
    imagesElement.appendChild(figcaptionElement)
  }
}
genererimages(images)
console.log(genererimages)
