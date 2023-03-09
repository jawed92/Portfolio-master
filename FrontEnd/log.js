
const form = document.querySelector('form')

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const email = form.elements.email.value
  const password = form.elements.password.value

  // validation de l'email et du mot de passe
  if (!email || !password) {
    alert('Email and password are required.')
    return
  }

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    const json = await response.json()

    if (json.token) {
      localStorage.setItem('authToken', json.token)
      window.location.replace('index.html')
    } else {
      alert('Login failed. Please try again.')
    }
  } catch (error) {
    console.error(error)
    alert('An error occurred. Please try again later.')
  }
})
export function checkAuthentification() {
  let loginElement = document.getElementById('login');
  let logoutElement = document.getElementById('logout');
  if (localStorage.getItem('authToken')) {
    console.log('connecté');
    loginElement.style.display = 'none'
    logoutElement.style.display = 'block'
    console.log('fgsdfdsd')
    return true
  } else {
    console.log('not connected');
    loginElement.style.display = 'block';
    logoutElement.style.display = 'none'
    return false
  }
}

// // Fonction pour que l'utilisateur soit déconnecté par desfaut
// export function deconnecte() {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     // Si un token est présent, supprimer le token
//     localStorage.removeItem('authToken');
//   }
// }

