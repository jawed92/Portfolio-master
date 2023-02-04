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
let images = window.localStorage.getItem('images')
//Initilisation de la variable pour recuperer la liste des projets
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

function genererCategories (categories) {
    const buttonAll = document.getElementById("btn_all")
    buttonAll.addEventListener('click', function () {
        divGallery.innerText = "";
        genererImages(images)
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
        
       let worksFiltered = images.filter(function(work)
        {
         if( work.categoryId == categories[i].id){
            return work;
         }
            
        });
        console.log(worksFiltered)
        divGallery.innerText = "";
        genererImages(worksFiltered)
        })
  }
}
genererCategories(categories)



function genererImages (images) {
  for (let i = 0; i < images.length; i++) {
    const figure = images[i]
    
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
genererImages(images)
console.log(genererImages)
/*
const boutonObjets = document.querySelector('.categoriesNav article button')
 boutonObjets.addEventListener('click', function () {
  const objetsFiltrees = images.filter(function (images) {
    return images.categoryId[1]
  })
  console.log(boutonObjets)
  document.querySelector('.gallery').innerHTML = ''
  genererImages(objetsFiltrees)
  console.log(objetsFiltrees)
 })
 function ajoutListenersObjets () {
    const objetsElements = document.querySelectorAll('.categoriesNav article button')
  
    for (let i = 0; i < objetsElements.length; i++) {
      objetsElements[i].addEventListener('click', async function (event) {
        const id = event.target.dataset.id
        const reponse = await fetch('http://localhost:5678/api/works')
        const objets = await reponse.json()
        window.localStorage.setItem(`objets-${id}`, JSON.stringify(avis))
        const objetElement = event.target.parentElement
        afficherObjets(objetElement, objets)
      })
      console.log(afficherObjets)
    }
  }
 function afficherObjets (objetElement, objets) {
 for (let i = 0; i < objets.length; i++) {
   avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire} <br>`
 }
 pieceElement.appendChild(avisElement)
 }*/
/* const boutonTous = document.querySelector('.btn_tous')

boutonTous.addEventListener('click', function () {
  const tousFiltrees = images.filter(function (images) {
    return images.categoryId
  })
  document.querySelector('.gallery').innerHTML = ''
  genererImages(tousFiltrees)
})
console.log(boutonTous)
*/
// const categori = ["Nature", "Animals", "Cities"];
/*
// Create a function to fetch the pictures from the API and render them based on the selected category
function fetchAndRenderPictures(objets) {
  fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
      // Filter the data to get only the pictures with the selected category
      const filteredPictures = data.filter( images => images.categoryId === objets);

      // Clear the previous pictures from the gallery
      document.getElementById(".gallery").innerHTML = "";
        console.log(filteredPictures)
      // Loop through the filtered pictures
      for (const picture of filteredPictures) {
        // Create a new img element for the picture
        const pictureImg = document.createElement("img");
        pictureImg.src = picture.src;
        pictureImg.alt = picture.name;

        // Create a new div for the picture
        const pictureDiv = document.createElement("div");
        pictureDiv.appendChild(pictureImg);

        // Add the picture div to the gallery
        document.getElementById(".gallery").appendChild(pictureDiv);
      }
      
    });console.log(fetchAndRenderPictures)
}*/