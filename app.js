const personajes = ['Coronel Mostaza', 'Prof. Ciruela', 'Sra. Escarlata'];
const armas = ['Cuchillo', 'Revólver', 'Llave Inglesa'];
const habitaciones = ['Cocina', 'Salón de Baile', 'Biblioteca'];

let solucion;
let cartasJugador;
let habitacionActual;

function iniciarJuego() {
    // Seleccionar la solución aleatoriamente
    solucion = {
        personaje: personajes[Math.floor(Math.random() * personajes.length)],
        arma: armas[Math.floor(Math.random() * armas.length)],
        habitacion: habitaciones[Math.floor(Math.random() * habitaciones.length)]
    };

    // Distribuir las cartas restantes al jugador
    const todasLasCartas = [...personajes, ...armas, ...habitaciones].filter(carta => 
        carta !== solucion.personaje && carta !== solucion.arma && carta !== solucion.habitacion
    );
    cartasJugador = mezclar(todasLasCartas).slice(0, 6); // El jugador recibe 6 cartas

    actualizarCartasJugador();
    actualizarLibreta();
}

function mezclar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function actualizarCartasJugador() {
    const listaCartasJugador = document.getElementById('cartas-jugador');
    listaCartasJugador.innerHTML = '';
    cartasJugador.forEach(carta => {
        const li = document.createElement('li');
        li.textContent = carta;
        listaCartasJugador.appendChild(li);
    });
}

function actualizarLibreta() {
    const libreta = document.getElementById('libreta');
    libreta.innerHTML = '';
    
    [personajes, armas, habitaciones].forEach(categoria => {
        const tabla = document.createElement('table');
        const filaEncabezado = tabla.insertRow();
        const encabezado = filaEncabezado.insertCell();
        encabezado.colSpan = 2;
        encabezado.textContent = categoria === personajes ? 'Personajes' : categoria === armas ? 'Armas' : 'Habitaciones';
        
        categoria.forEach(item => {
            const fila = tabla.insertRow();
            const celdaNombre = fila.insertCell();
            const celdaCheck = fila.insertCell();
            celdaNombre.textContent = item;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    celdaNombre.style.textDecoration = 'line-through';
                } else {
                    celdaNombre.style.textDecoration = 'none';
                }
            });
            celdaCheck.appendChild(checkbox);
        });
        
        libreta.appendChild(tabla);
    });
}

function entrarHabitacion(habitacion) {
    habitacionActual = habitacion;
    document.getElementById('habitacion-actual').textContent = habitacion;
    document.getElementById('formulario-sugerencia').style.display = 'block';
}

function hacerSugerencia() {
    const personajeSugerido = document.getElementById('sospechoso').value;
    const armaSugerida = document.getElementById('arma').value;
    
    const sugerencia = `${personajeSugerido} con el/la ${armaSugerida} en el/la ${habitacionActual}`;
    
    let respuesta;
    if (cartasJugador.includes(personajeSugerido)) {
        respuesta = `Tienes a ${personajeSugerido} en tu mano.`;
    } else if (cartasJugador.includes(armaSugerida)) {
        respuesta = `Tienes el/la ${armaSugerida} en tu mano.`;
    } else if (cartasJugador.includes(habitacionActual)) {
        respuesta = `Tienes el/la ${habitacionActual} en tu mano.`;
    } else {
        respuesta = "Ninguna de las cartas sugeridas está en tu mano. ¡Esta podría ser la solución!";
    }
    
    document.getElementById('resultado-sugerencia').textContent = `Sugerencia: ${sugerencia}. Resultado: ${respuesta}`;
}

// Función para mostrar el modal con la solución
function mostrarModalSolucion(mensaje) {
    const modal = document.getElementById('modal-solucion');
    const mensajeSolucion = document.getElementById('mensaje-solucion');

    mensajeSolucion.textContent = mensaje;
    modal.style.display = 'block';  // Mostrar el modal

    document.getElementById('cerrar-modal').addEventListener('click', () => {
        modal.style.display = 'none';  // Cerrar el modal
    });
}

function hacerAcusacion() {
    const personajeAcusado = document.getElementById('sospechoso-final').value;
    const armaAcusada = document.getElementById('arma-final').value;
    const habitacionAcusada = document.getElementById('habitacion-final').value;
    
    if (personajeAcusado === solucion.personaje && 
        armaAcusada === solucion.arma && 
        habitacionAcusada === solucion.habitacion) {
        mostrarModalSolucion("¡Correcto! Has resuelto el caso: " + 
            `${solucion.personaje} con el/la ${solucion.arma} en el/la ${solucion.habitacion}`);
    } else {
        mostrarModalSolucion("Incorrecto. Has perdido el juego. La solución correcta era: " + 
            `${solucion.personaje} con el/la ${solucion.arma} en el/la ${solucion.habitacion}`);
    }
}

function solucionarConIA() {
    // Crear listas de posibles soluciones excluyendo las cartas que tiene el jugador
    const posiblesPersonajes = personajes.filter(p => !cartasJugador.includes(p));
    const posiblesArmas = armas.filter(a => !cartasJugador.includes(a));
    const posiblesHabitaciones = habitaciones.filter(h => !cartasJugador.includes(h));

    // Seleccionar una opción aleatoria de cada lista
    const personajeIA = posiblesPersonajes[Math.floor(Math.random() * posiblesPersonajes.length)];
    const armaIA = posiblesArmas[Math.floor(Math.random() * posiblesArmas.length)];
    const habitacionIA = posiblesHabitaciones[Math.floor(Math.random() * posiblesHabitaciones.length)];

    // Verificar la solución
    if (personajeIA === solucion.personaje && armaIA === solucion.arma && habitacionIA === solucion.habitacion) {
        mostrarModalSolucion("¡La IA ha resuelto el caso correctamente! La solución es: " + 
            `${solucion.personaje} con el/la ${solucion.arma} en el/la ${solucion.habitacion}`);
    } else {
        mostrarModalSolucion(`La IA ha fallado. La solución correcta era: ${solucion.personaje} con el/la ${solucion.arma} en el/la ${solucion.habitacion}`);
    }
}

// Inicializar el juego cuando se carga la página
window.onload = iniciarJuego;

// Añadir event listeners a los botones de las habitaciones
document.querySelectorAll('.boton-habitacion').forEach(btn => {
    btn.addEventListener('click', () => entrarHabitacion(btn.textContent));
});

document.getElementById('boton-sugerir').addEventListener('click', hacerSugerencia);
document.getElementById('boton-acusar').addEventListener('click', hacerAcusacion);
document.getElementById('boton-ia').addEventListener('click', solucionarConIA);  // Event listener para el botón de IA
