//Creamos constantes con las url que vayamos a usar
const urlUsuario = "http://localhost:3000/usuarios";
const urlAulas = "http://localhost:3000/aulas";

//Rescatamos todos los campos del formulario
const fecha = document.getElementById('fecha');
const email = document.getElementById('reportanteEmail');
const nombre = document.getElementById('reportanteNombre');
const telefono = document.getElementById('telefono');
const hora = document.getElementById('hora');
const aula = document.getElementById('aula');
const descripcion = document.getElementById('descripcion');

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
        const respuesta = await fetch(urlUsuario+'?email='+email);
    
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
                    nombre.id = data.id;
                    nombre.value = data.nombre;
                    emailIsValidated = true;
                }
            })
        }
        
    } catch (error) {
        console.error(error);
    }
    return emailIsValidated;
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
    if(descripcion.length >= 30){
        isDescriptionValidated = true;
    }
    return isDescriptionValidated;
}



