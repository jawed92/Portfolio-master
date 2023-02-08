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
      alert('Login successful!')
      window.location.replace('index.html');
    } else {
      alert('Login failed. Please try again.')
    }
  } catch (error) {
    console.error(error)
    alert('An error occurred. Please try again later.')
  }
})

const verifyToken = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    return false
  }

  try {
    const response = await fetch('http://localhost:5678/api/works/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })
    const json = await response.json()

    if (json.status === 'success') {
      window.location.replace('index.html');
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
    return false
  }
}
