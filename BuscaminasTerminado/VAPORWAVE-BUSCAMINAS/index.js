let sonido_ganador = new Audio("you win.mp3");
let sonido_win = new Audio("you win.mp3");
let sonido_perdedor = new Audio("you lose.mp3");
let sonido_gameover = new Audio("you lose.mp3");
let sonido_descubrir = new Audio("sonido_descubrir.ogg");
let sonido_juegonuevo = new Audio("castillo.mp3");
let sonido_abrirarea = new Audio("iglesia.mp3");
let sonido_marca = new Audio("sonido.mp3");
let isPlaying = false;

let filas = 20;
let columnas = 20;
let lado = 30;

let marcas = 0;

let minas = filas * columnas * 0.1;

let tablero = [];

let enJuego = true;
let juegoIniciado = false;

let tiempoInicio;
let intervalo;
let soundEnabled = false; // suponiendo que quieres que el sonido esté activado por defecto


window.onload = function () {
  let nombreJugador = prompt("Por favor, introduce tu nombre:");

  localStorage.removeItem("historialPartidas");
  
  if (nombreJugador) {
    document.querySelector("#nombre-del-jugador .nombre-del-jugador-message").innerText = nombreJugador;
  } else {
    document.querySelector("#nombre-del-jugador .nombre-del-jugador-message").innerText = "Jugador Anónimo";
  }
};

document.getElementById("toggleSound").addEventListener("click", function () {
  soundEnabled = !soundEnabled; 

  var soundTextElement = document.getElementById("soundText");

  if (soundEnabled) {
      soundTextElement.innerText = "Desactivar Sonido";
      sonido_juegonuevo.play();
  } else {
      soundTextElement.innerText = "Activar Sonido";
  }
});

function iniciarCronometro() {
  tiempoInicio = Date.now();
  intervalo = setInterval(function () {
    const tiempoTranscurrido = Date.now() - tiempoInicio;
    const segundos = Math.floor(tiempoTranscurrido / 1000) % 60;
    const minutos = Math.floor(tiempoTranscurrido / 60000);
    document.querySelector(".cronometro-title-bar").textContent =
      (minutos < 10 ? "0" : "") +
      minutos +
      ":" +
      (segundos < 10 ? "0" : "") +
      segundos;
  }, 1000);
}



function detenerCronometro() {
  clearInterval(intervalo);
  obtenerTiempoTranscurrido();
}
nuevoJuego();

function nuevoJuego() {
  reiniciarVariables();
  generarTableroHTML(); //Gernera la estructura visual de la matriz
  generarTableroJuego(); //Se encarla de generar las minas y los números para que sean descubiertos
  añadirEventos(); //se añaden los eventos de mouse para las celdas
  refrescarTablero(); //Se encarga del comportamiento lógico para mostrar los elementos
  setColorInicialTablero();
  iniciarCronometro();
  //sonido_juegonuevo.play()
}
async function ajustes() {
  const { value: ajustes } = await swal.fire({
    title: "Ajustes",
    html: `
              <label for="dificultad">Dificultad (minas/área)</label>
              <select id="dificultad">
                  <option value="1" ${
                    (100 * minas) / (filas * columnas) === 1 ? "selected" : ""
                  }>1%</option>
                  <option value="2" ${
                    (100 * minas) / (filas * columnas) === 2 ? "selected" : ""
                  }>2%</option>
                  <option value="5" ${
                    (100 * minas) / (filas * columnas) === 5 ? "selected" : ""
                  }>5%</option>
                  <option value="10" ${
                    (100 * minas) / (filas * columnas) === 10 ? "selected" : ""
                  }>10%</option>
                  <option value="20" ${
                    (100 * minas) / (filas * columnas) === 20 ? "selected" : ""
                  }>20%</option>
                  <option value="30" ${
                    (100 * minas) / (filas * columnas) === 30 ? "selected" : ""
                  }>30%</option>
                  <option value="40" ${
                    (100 * minas) / (filas * columnas) === 40 ? "selected" : ""
                  }>40%</option>
                  <option value="50" ${
                    (100 * minas) / (filas * columnas) === 50 ? "selected" : ""
                  }>50%</option>
                  <option value="60" ${
                    (100 * minas) / (filas * columnas) === 60 ? "selected" : ""
                  }>60%</option>
                  <option value="70" ${
                    (100 * minas) / (filas * columnas) === 70 ? "selected" : ""
                  }>70%</option>
              </select>
              <br><br>
              <label for="filas">Filas</label>
              <select id="filas">
                  
                  <option value="10" ${
                    filas === 10 ? "selected" : ""
                  }>10</option>
                  <option value="20" ${
                    filas === 20 ? "selected" : ""
                  }>20</option>
                  <option value="30" ${
                    filas === 30 ? "selected" : ""
                  }>30</option>
                  <option value="40" ${
                    filas === 40 ? "selected" : ""
                  }>40</option>
                  <option value="50" ${
                    filas === 50 ? "selected" : ""
                  }>50</option>
                  <option value="60" ${
                    filas === 60 ? "selected" : ""
                  }>60</option>
              </select>
              <br><br>
              <label for="columnas">Columnas</label>
              <select id="columnas">
                 
                  <option value="10" ${
                    columnas === 10 ? "selected" : ""
                  }>10</option>
                  <option value="20" ${
                    columnas === 20 ? "selected" : ""
                  }>20</option>
                  <option value="30" ${
                    columnas === 30 ? "selected" : ""
                  }>30</option>
                  <option value="40" ${
                    columnas === 40 ? "selected" : ""
                  }>40</option>
                  <option value="50" ${
                    columnas === 50 ? "selected" : ""
                  }>50</option>
                  <option value="60" ${
                    columnas === 60 ? "selected" : ""
                  }>60</option>
              </select>
              <br>
          `,
    confirmButtonText: "Establecer",
    cancelButtonText: "Cancelar",
    showCancelButton: true,
    confirmButtonColor: "rgb(31, 149, 199)",
    cancelButtonColor: "rgb(31, 149, 199)",
    preConfirm: () => {
      return {
        columnas: parseInt(document.getElementById("columnas").value),
        filas: parseInt(document.getElementById("filas").value),
        dificultad: parseInt(document.getElementById("dificultad").value),
      };
    },
  });

  if (!ajustes) {
    return;
  }

  // Validación
  if (
    ajustes.filas < 10 ||
    ajustes.filas > 60 ||
    ajustes.columnas < 10 ||
    ajustes.columnas > 60 ||
    ajustes.dificultad < 1 ||
    ajustes.dificultad > 70
  ) {
    swal.fire({
      title: "Error",
      text: "Valores inválidos. Por favor, selecciona opciones válidas.",
      icon: "error",
      confirmButtonColor: "#FF0000",
    });
    return;
  }

  filas = ajustes.filas;
  columnas = ajustes.columnas;
  minas = parseInt((columnas * filas * ajustes.dificultad) / 100);
  nuevoJuego();
}

function reiniciarVariables() {
  marcas = 0;
  enJuego = true;
  juegoIniciado = false;
}

function generarTableroHTML() {
  let html = "";
  for (let f = 0; f < filas; f++) {
    html += `<tr>`;
    for (let c = 0; c < columnas; c++) {
      /*
              Generación de cada uno de los elementos de la matriz
              y se les asignará una coordenada, para poder tratar estos elementos
              de forma matemática, siguiendo patrones que fácilitarán la 
              estructura de algoritmos

              id="celda-${c}-${f}"
              es la instrucción más importante, asigna una coordenada a cada elemento
          */
      html += `<td id="celda-${c}-${f}" style="width:${lado}px;height:${lado}px">`;
      html += `</td>`;
    }
    html += `</tr>`;
  }
  let tableroHTML = document.getElementById("tablero");
  tableroHTML.innerHTML = html;
  tableroHTML.style.width = columnas * lado + "px";
  tableroHTML.style.height = filas * lado + "px";
  tableroHTML.style.background = "slategray";
}

/*
        Una vez generado el tablero HTML se le añaden los eventos de clic
        a cada una de las celdas para que el usuario pueda interactuar con el juego
    */
function añadirEventos() {
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      let celda = document.getElementById(`celda-${c}-${f}`);
      celda.addEventListener("dblclick", function (me) {
        dobleClic(celda, c, f, me);
      });
      celda.addEventListener("mouseup", function (me) {
        clicSimple(celda, c, f, me);
      });
    }
  }
}

/*
        Está función se encargará de destapar las celdas que rodean a la celda
        a la que se le dio doble clic
    */
function dobleClic(celda, c, f, me) {
  if (!enJuego) {
    return;
  }
  abrirArea(c, f);
  refrescarTablero();
}

/*
        Esta función se encargará de los comportamientos de clic derecho y clic izquierdo
        para descubrir las celdas, o marcarlas para protegerlas de ser descubiertas
    */
function clicSimple(celda, c, f, me) {
  if (!enJuego) {
    return; //El juego ha finalizado
  }
  if (tablero[c][f].estado == "descubierto") {
    return; //Las celdas descubiertas no pueden ser redescubiertas o marcadas
  }
  switch (me.button) {
    case 0: //0 es el código para el clic izquierdo
      if (tablero[c][f].estado == "marcado") {
        //la celda está protegida
        break;
      }
      while (!juegoIniciado && tablero[c][f].valor == -1) {
        generarTableroJuego();
      }
      tablero[c][f].estado = "descubierto";
      if (soundEnabled) {
        sonido_descubrir.play();
      }
      juegoIniciado = true; //aquí se avisa que el jugador ha descubierto más de 1 celda
      if (tablero[c][f].valor == 0) {
        abrirArea(c, f);
      }
      break;
    case 1: //1 es el código para el clic medio o scroll
      break;
    case 2: //2 es el código para el clic derecho
      if (tablero[c][f].estado == "marcado") {
        tablero[c][f].estado = undefined;
        marcas--;
        if (soundEnabled) sonido_marca.play();
      } else {
        tablero[c][f].estado = "marcado";
        marcas++;
        if (soundEnabled) sonido_marca.play();
      }
      break;
    default:
      break;
  }
  refrescarTablero();
}

function abrirArea(c, f) {
  //Hay que abrir los demás números que están al rededor
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i == 0 && j == 0) {
        //Está condición es obligadoria para que no se encierre en un bucle infinito
        continue;
      }
      try {
        //Hay que cuidarse de las posiciones negativas
        if (tablero[c + i][f + j].estado != "descubierto") {
          if (tablero[c + i][f + j].estado != "marcado") {
            tablero[c + i][f + j].estado = "descubierto"; //aquí es donde se abren las celdas circundantes
            if (soundEnabled) {
              sonido_abrirarea.play();
            }
            if (tablero[c + i][f + j].valor == 0) {
              //si la celda que se abre es otro 0, se le pasa la responsabilidad
              abrirArea(c + i, f + j);
            }
          }
        }
      } catch (e) {}
    }
  }
}

/*
        Aquí nos encargaremos del comportamiento visual según el estado 
        lógico del tablero de juego
    */
function refrescarTablero() {
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      let celda = document.getElementById(`celda-${c}-${f}`);
      if (tablero[c][f].estado == "descubierto") {
        celda.style.boxShadow = "none";
        switch (tablero[c][f].valor) {
          case -1:
            celda.innerHTML = `<i class="fas fa-bomb"></i>`;
            celda.style.color = "black";
            celda.style.background = "white";
            break;
          case 0:
            break;
          default:
            celda.innerHTML = tablero[c][f].valor;
            break;
        }
      }
      if (tablero[c][f].estado == "marcado") {
        celda.innerHTML = `<i class="fas fa-flag"></i>`;
        celda.style.background = `cadetblue`;
      }
      if (tablero[c][f].estado == undefined) {
        celda.innerHTML = ``;
        celda.style.background = ``;
      }
    }
  }
  verificarGanador();
  verificarPerdedor();
  actualizarPanelMinas();
}

function actualizarPanelMinas() {
 
    let mensaje = document.querySelector("#minas .message");
    mensaje.textContent = minas - marcas;
  }
  


function verificarGanador() {
  for (let f = 0; f < filas; f++) {
      for (let c = 0; c < columnas; c++) {
          if (tablero[c][f].estado != `descubierto`) {
              // Si la celda está cubierta y es una mina
              if (tablero[c][f].valor == -1) {
                  continue;  // Entonces vamos bien
              } else {
                  // Si encuentra una celda cubierta que no es una mina, aún no se ha ganado
                  return;
              }
          }
      }
  }
  // Si todas las celdas cubiertas son minas, entonces se ha ganado
  let tableroHTML = document.getElementById("tablero");
  tableroHTML.style.background = "green";
  enJuego = false;
  if (soundEnabled) {
      sonido_ganador.play();
      sonido_win.play();
  }
  detenerCronometro();
  guardarPartida("ganó");  // Guardar directamente como "ganó"
}

function verificarPerdedor() {
  for (let f = 0; f < filas; f++) {
      for (let c = 0; c < columnas; c++) {
          // Si hay una mina descubierta, entonces se ha perdido
          if (tablero[c][f].valor == -1 && tablero[c][f].estado == `descubierto`) {
              let tableroHTML = document.getElementById("tablero");
              tableroHTML.style.background = "red";
              enJuego = false;
              if (soundEnabled) {
                  sonido_perdedor.play();
                  sonido_gameover.play();
              }
              detenerCronometro();
              guardarPartida("perdió");
              // Mostrar las demás minas ocultas
              for (let f = 0; f < filas; f++) {
                  for (let c = 0; c < columnas; c++) {
                      if (tablero[c][f].valor == -1) {
                          let celda = document.getElementById(`celda-${c}-${f}`);
                          celda.innerHTML = `<i class="fas fa-bomb"></i>`;
                          celda.style.color = "black";
                      }
                  }
              }
              return;  // Finaliza la función una vez se ha perdido
          }
      }
  }
}

/*
        Este servirá para dar un seguimiento lógico de 
        los elementos que el jugador no puede ver
    */
function generarTableroJuego() {
  vaciarTablero(); //para que no hayan interferencias con posibles partidas pasadas
  ponerMinas(); //representadas númericamente con el número -1
  contadoresMinas(); //son los números que dan pistas de las minas
}

/*
        Se encarga de poner el tablero en un estado inicial para insertar elementos
    */
function vaciarTablero() {
  tablero = [];
  for (let c = 0; c < columnas; c++) {
    tablero.push([]);
  }
}

function ponerMinas() {
  for (let i = 0; i < minas; i++) {
    let c;
    let f;

    do {
      c = Math.floor(Math.random() * columnas); //Genera una columna aleatoria en el tablero
      f = Math.floor(Math.random() * filas); //Genera una fila aleatoria en el tablero
    } while (tablero[c][f]); //Se encarga de verificar que en la celda no haya una mina

    tablero[c][f] = {
      valor: -1,
    }; //Se inserta la mina en la celda disponible
  }
}

function contadoresMinas() {
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      if (!tablero[c][f]) {
        let contador = 0;
        //Se van a recorrer todas las celdas que están al rededor de la misma, 8 en total
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) {
              continue;
            }
            try {
              //hay que evitar errores con las posiciones negativas
              if (tablero[c + i][f + j].valor == -1) {
                contador++;
              }
            } catch (e) {}
          }
        }
        tablero[c][f] = {
          valor: contador,
        };
      }
    }
  }
}
function mostrarInstrucciones() {
  Swal.fire({
    title: "Instrucciones del Buscaminas",
    html: `
            <p><b>Objetivo:</b> Despejar un campo de minas sin detonar ninguna.</p>
            <p><b>Cómo Jugar:</b><br>
            - Haz clic en una celda para revelar lo que contiene.<br>
            - Un número indica cuántas minas hay en las celdas adyacentes.<br>
            - Si crees que una celda contiene una mina, marca una bandera con clic derecho.</p>
            <p><b>Ganar el Juego:</b> Abre todas las celdas no minadas para ganar.</p>`,
    imageUrl: "bomba-removebg-preview.png",
    imageWidth: 50,
    imageHeight: 50,
    confirmButtonText: "Entendido",
    confirmButtonColor: "rgb(31, 149, 199)",
  });
}

function setColorInicialTablero() {
  let tableroHTML = document.getElementById("tablero");
  tableroHTML.style.background = "#877c82"; // remplaza "tuColorDeseado" con el color que prefieras, por ejemplo: "#E0E0E0"
}

document
  .getElementById("tablero")
  .addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  function mostrarCreditos() {
    Swal.fire({
      title: "Créditos",
      html: `
        <p>Desarrollador: Manu</p>
        <p>Diseño: JEFF APORTA DE YOUTUBE. </p>
        <p>Efectos de sonido: AGE OF EMPIRES 2 Y STREET FIGHTER 2</p>
        <p>Música:VAPORWAVE RADIO</p>
        <p>DEJEN SU LIKE Y APROBADO ✌️</p>
      `,
      imageUrl: "Youtube-removebg-preview.png",
      imageWidth: 70,
      imageHeight: 70,
      confirmButtonText: "Entendido",
      background: '#ffffff',
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        title: 'custom-title-class',
        popup: 'custom-popup-class'
      }
    });
}

  
  // ... tu CSS sigue igual ...
  
  

function mostrarHistorialModal() {
  let historial = JSON.parse(localStorage.getItem("historialPartidas")) || [];
  let mensajeHistorial = historial
    .map((partida, index) => {
      return `<b>${index + 1}.</b> Fecha: ${partida.fecha}, Resultado: ${
        partida.resultado
      }, Tiempo: ${partida.tiempo}`;
    })
    .join("<br>");

  Swal.fire({
    title: "Historial de Partidas",
    html: mensajeHistorial,
    confirmButtonText: "Cerrar",
    confirmButtonColor: "rgb(31, 149, 199)",
  });
}

// Añadiendo evento de clic al nombre del jugador

document
.getElementById("nombre-del-jugador")
.addEventListener("click", mostrarHistorialModal);


localStorage.removeItem("historialPartidas");

function guardarPartida(resultado) {
  // Obtener el historial existente
  let historial = JSON.parse(localStorage.getItem("historialPartidas")) || [];
  let fecha = new Date().toLocaleString(); // Guarda la fecha y hora actual
  let tiempo = obtenerTiempoTranscurrido(); // Obtiene el tiempo transcurrido

  // Añadir la nueva partida al historial
  historial.push({ fecha: fecha, resultado: resultado, tiempo: tiempo });

  // Guardar el historial actualizado
  localStorage.setItem("historialPartidas", JSON.stringify(historial));
}

function obtenerTiempoTranscurrido() {
  const tiempoTranscurrido = Date.now() - tiempoInicio;
  const segundos = Math.floor(tiempoTranscurrido / 1000) % 60;
  const minutos = Math.floor(tiempoTranscurrido / 60000);

  return (
    (minutos < 10 ? "0" : "") +
    minutos +
    ":" +
    (segundos < 10 ? "0" : "") +
    segundos
  );
}

function detenerCronometro() {
  clearInterval(intervalo);
}

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-audio', {
        height: '0',
        width: '0',
        videoId: '-XlY-jv7oHA',
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    // Aquí puedes configurar cosas adicionales si lo necesitas
    // Por ejemplo, si quieres que el audio comience automáticamente:
    // event.target.playVideo();
}

function toggleRadio() {
  if (player && typeof player.getPlayerState === 'function') {
      if (player.getPlayerState() === YT.PlayerState.PLAYING) {
          player.pauseVideo();
      } else {
          player.playVideo();
      }
  } else {
      console.error("El reproductor de YouTube aún no está listo o hubo un problema al cargarlo.");
  }
}

// Arreglo con las rutas de tus imágenes de fondo
let imagenesDeFondo = [
  'url("11.gif")',
  'url("12.gif")',
  'url("gif1.gif")',
  'url("gif3.gif")',
  'url("gif4.gif")',
  'url("gif5.gif")',
  'url("gif6.gif")',
  'url("gif7.gif")',
  'url("gif8.gif")',
  'url("gif9.gif")',
  'url("gif10.gif")',
  'url("vaporwave.gif")',
  
];

// Variable para saber qué imagen mostrar a continuación
let indiceImagenActual = 0;

// Función para cambiar el fondo
function cambiarFondo() {
  console.log("Changing background to:", imagenesDeFondo[indiceImagenActual]); // Log which image it's trying to set
  document.body.style.backgroundImage = imagenesDeFondo[indiceImagenActual];
  indiceImagenActual = (indiceImagenActual + 1) % imagenesDeFondo.length;
}


  document.body.style.backgroundImage = imagenesDeFondo[indiceImagenActual];
  
  // Actualizar el índice para la próxima imagen
  indiceImagenActual = (indiceImagenActual + 1) % imagenesDeFondo.length;


// Añadir evento de clic al elemento "minas" después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  var minasElement = document.getElementById("minas");
  if(minasElement) {
    minasElement.addEventListener("click", cambiarFondo);
  } else {
    console.error('Elemento con ID "minas" no fue encontrado en el DOM.');
  }
});
