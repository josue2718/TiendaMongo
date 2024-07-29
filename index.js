const ip = 'localhost';
localStorage.setItem('serverIp', ip);

document.getElementById('correo').addEventListener('input', async function(event) {
    event.preventDefault();
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;
    
    fetch(`http://${ip}:3003/usuario/${encodeURIComponent(correo)}`)
            .then(res => res.json())
            .then(res => {
                res.forEach(item => {
                    console.log(JSON.stringify(res, null, 2));
                    console.log(item.correo);
                }
            )   
        })
    .catch(err => console.error(err));
})
document.getElementById('login').addEventListener('submit', async function(event) {
    event.preventDefault();
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;
    
    fetch('http://'+ip+':3003/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, password })
    })
    .then(res => {
        if (res.ok) {
            alert("Bienvenido ");
            window.location.href = 'ventas.html';
        return res.text(); 
        } else {
        alert('Correo o contraseña incorrectos.');
        }
    })
    .then(responseText => {
        
    })
    .catch(err => console.error(err));
});

document.getElementById('newuser').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const correo = document.getElementById('newcorreo').value;
    const password = document.getElementById('newpassword').value;
    const nombre = document.getElementById('newnombre').value;
    const fechainicio = new Date();
  
    try {
      const response = await fetch('http://'+ip+':3003/insertarusuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, correo, password, fechainicio })
      });
  
      if (response.ok) {
        alert("Bienvenido " + nombre);
        location.reload()
      } else {
        const errorData = await response.json();
        console.error('Error al insertar usuario:', errorData);
        alert('Error al insertar usuario: ' + (errorData.message || response.statusText));
      }
    } catch (err) {
      console.error('Error de red:', err);
      alert('Error de red: ' + err.message);
    }
  });
  
      