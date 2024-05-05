//Creamos constantes con las url que vayamos a usar
const urlUsuario = "http://localhost:3000/usuarios";
const urlAulas = "http://localhost:3000/aulas";
const urlIncidencias = "http://localhost:3000/incidencias";

//Rescatamos todos los campos del formulario
const fecha = document.getElementById('fecha');
const email = document.getElementById('reportanteEmail');
const nombre = document.getElementById('reportanteNombre');
const telefono = document.getElementById('telefono');
const hora = document.getElementById('hora');
const aula = document.getElementById('aula');
const descripcion = document.getElementById('descripcion');

//Rescatamos boton y formulario
const form = document.querySelector('form');
const boton = document.getElementById('button');

//En primer lugar validamos la fecha
function validateDate(fecha){

    let res = false;
    const fechaSeleccionada = new Date(fecha);
    const fechaInicioCurso = new Date(2023/9/1);
    const fechaActual = new Date();

    if(fechaSeleccionada <= fechaActual && fechaSeleccionada >= fechaInicioCurso){
        res = true;
    }
    return res;
}

//En segundo lugar tenemos que validar el email
//Para validar el email, aparte de tener en cuenta su forma con una expresion regular, tenemos que controlar
//que ese email este en la API
//Para ello tenemos que hacer una funcion asincrona que haga la peticion
async function validateEmail(email){
    try {
        emailIsValidated = false;
        //La validacion de este campo consiste en saber si existe en la base de datos o no entonces:
        //Dentro del fetch metemos la url y le asignamos al campo email el introducido para ver la respuesta de la API
        const respuesta = await fetch(`${urlUsuario}?email=${email}`);
    
        //Si la respuesta no es ok
        if(!respuesta.ok){
            console.log('Error, no se ha encontrado ese email en la API');
        }else{
            //Si la respuesta devuelve un ok guardaremos la respuesta en una constante.
            //Debemos tener en cuenta que estamos trabajando con json asique habra que convertir la respuesta a json
            const usuario = await respuesta.json();

            //Recorremos el usuario para validar el email asociar el nombre
            usuario.forEach(data => {
                //Cuando coincida el email extraeremos el nombre
                if(data.email === email){
                    //.value almacena el id
                    nombre.id = data.id;
                    //Almacenamos el nombre del usuario
                    nombre.value = data.nombre;
                    emailIsValidated = true;
                }
            })
        }

        return emailIsValidated;

    } catch (error) {
        console.error(error);
    }
}

//En tercer lugar, validamos el telefono
function validateTelephone(telephone){
    isTelephoneValidated = false;
    const validateTelephone = /^\d{9}$/;
    //Para validar el telefono vamos a usar una expresion regular que confirme que tiene 9 digitos
    //Si a la expresion regular le aplicamos la funcion .test devolvera true/false si cumple las condiciones
    if(validateTelephone.test(telephone)){
        isTelephoneValidated = true;
    }
    return isTelephoneValidated;
}

//En cuarto lugar, debemos validar la hora en la que ocurrio la incidencia

function validateHour(hour){

    isHourValidated = false;
    const validatedNumber = /^[1-6]$/;
    //En primer lugar comprobamos si la hora es R
    if(hour.toUpperCase() === 'R'){
        isHourValidated = true;
    }else{
        const number = parseInt(hour);
        if(validatedNumber.test(number)){
            isHourValidated = true;
        }
    }   
    return isHourValidated;
}

//En el caso de selecionar el aula, esto no es validacion, debemos hacer una peticion a la API para extraerlas
//y mostrarlas en un campo select
async function getClassroom(){
    //Metemos todos el codigo en un bloque try/catch para que en caso de error nos lo muestre
    try {
        //Cuando hacemos peticiones a la API siempre se trata de funciones asicronas en las cuales vamos a trabajar,
        //con promesas. Por lo tanto, el uso de async/await para las peticiones es fundamental
        const response = await fetch(urlAulas);

        if(!response.ok){
            console.log("No se ha podido extraer las aulas de la API");
        }else{
            const classroom = await response.json();
            //Una vez que tenemos todas las clases almacenadas en una constante debemos recorrerlas e ir creando campos de opciones para el select
            classroom.forEach(data => {
                const option = document.createElement('option');
                option.value = data.id;
                option.textContent = data.nombre;
                aula.append(option);
            })
        }
    } catch (error) {
        console.error(error);   
    }
}

//Una vez finalizada la funcion la llamamos
getClassroom();

//Validaremos la descripcion teniendo en cuenta que debe superar los 30 caracteres
function validateDescription(description){
    isDescriptionValidated = false;
    if(description.length >= 30){
        isDescriptionValidated = true;
    }
    return isDescriptionValidated;
}


//Una vez que tenemos todas las validaciones hechas tenemos que hacer la funcion añadir incidencia
boton.addEventListener("click", async(e) =>{
    e.preventDefault();
    
    //Inicializamos variables de todos los campos para llevar un control de validacion
    validatedFecha = false;
    validatedEmail = false;
    validatedTelefono = false;
    validatedHora = false;
    validatedDescripcion = false;

    //Validamos la fecha
    if(validateDate(fecha.value)){
        validatedFecha = true;
        const msgError = document.getElementById("errorFecha");
        msgError.innerHTML = "";
   
    }else{
        const msgError = document.getElementById("errorFecha");
        msgError.innerHTML = "ERROR, la fecha no puede ser posterior al día actual ni anterior al inicio del curso (01/09/2023)";
    }
    //Validamos el email
    const emailValido = await validateEmail(email.value);
    if(emailValido){
        validatedEmail = true;
        const msgError = document.getElementById("errorEmail");
        msgError.innerHTML = "";
    }else{
        const msgError = document.getElementById("errorEmail");
        msgError.innerHTML = "ERROR, el email no se encuentra en la API";
    }
    //Validamos el telefono
    if(validateTelephone(telefono.value)){
        validatedTelefono = true;
        const msgError = document.getElementById("errorTelefono");
        msgError.innerHTML = "";
    }else{
        const msgError = document.getElementById("errorTelefono");
        msgError.innerHTML = "ERROR, el telefono no tiene 9 caracteres";
    }
    //Validamos la hora
    if(validateHour(hora.value)){
        validatedHora = true;
        const msgError = document.getElementById("errorHora");
        msgError.innerHTML = "";
  
    }else{
        const msgError = document.getElementById("errorHora");
        msgError.innerHTML = "ERROR, la hora debe estar comprendida entre 1-6 o R en caso de que fuese recreo";
    }
    //Validamos la descripcion
    if(validateDescription(descripcion.value)){
        validatedDescripcion = true;
        const msgError = document.getElementById("errorDescripcion");
        msgError.innerHTML = "";
    }else{
        const msgError = document.getElementById("errorDescripcion");
        msgError.innerHTML = "ERROR, la descripcion debe tener más de 30 caracteres";
    }
    //Una vez todo validado comprobamos que todos las varibles sean true para poder hacer un post valido de una incindencia
    if(validatedFecha && validatedEmail && validatedTelefono && validatedHora && validatedDescripcion){
        //Una vez dentro creamos una variable respuesta
        /*
        Cuando hacemos una peticion POST aparte de llamar al await para procesar la promesa, en el fetch debemos
        poner la url a la que hacemos la peticion seguido del encabezado y el cuerpo del objeto que vamos a añadir
        */
        const respuesta = await fetch (urlIncidencias, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //JSON.stringify --> convierte un objeto de JavaScript en una cadena JSON
            body: JSON.stringify({
                "fecha_incidente": fecha.value,
                "id_reportante": nombre.id,
                "telefono_contacto": telefono.value,
                "hora_incidente": hora.value.toUpperCase(),
                "id_aula": aula.value,
                "descripcion": descripcion.value,
                "estado": "Abierta"
            })
        })
    }
})


