
const form = document.querySelector('form')

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const email = form.elements.email.value
  const password = form.elements.password.value

  // validation de l'email et du mot de passe
  if (!email || !password) {
    alert('Email et le mot de passe est requis.')
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
      alert('L\'email ou le mot de passe n\'est pas correct.')
    }
  } catch (error) {
    console.error(error)
    alert('Une erreur est survenue. Merci de réessayer.')
  }
})




