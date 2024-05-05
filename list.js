//En primer lugar rescatamos la lista del html
const ul = document.querySelector('ul');
//Almacenamos en una variable la url de las incidencias
const urlIncidencias = "http://localhost:3000/incidencias";
const urlUsuarios = "http://localhost:3000/usuarios";
const urlAulas = "http://localhost:3000/aulas";

//Creamos una funcion asincrona que haga la peticion a la API para obtener todas las incidencias
async function getAllIncidencias(){
    try {
        //Guardamos la respuesta en una variable
        const respuesta = await fetch(urlIncidencias);

        if(!respuesta.ok){
            console.error("Error al obtener respuesta de la API");
        }
        //Si la API da una respuesta la devolvemos cambiada a json
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener los datos de las incidencias", error); 
    }
}

//Creamos una funcion para obtener el nombre del reportante atraves de su id
async function getUsuarioById(idUsuario){
    try {
        const respuesta = await fetch(`${urlUsuarios}/${idUsuario}`);

        if(!respuesta.ok){
            console.error("Error al obtener respuesta de la API");
        }
        //Si la API obtiene respuesta devolvemos el usuario completo
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener el usuario", error);
    }
}

//Creamos una funcion para obtener el nombre del aula
async function getAulasById(idAula){
    try {
        const respuesta = await fetch(`${urlAulas}/${idAula}`);

        if(!respuesta.ok){
            console.error("Error al obtener respuestad de la API");
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener el aula", error);
    }
}

//Creamos una funcion asicrona para mostrar los datos en el html
async function cargarIncidencias(){
    //En primer lugar llamamos a la funcion obtener incidencia
    const incidencias = await getAllIncidencias();

    //Las recorremos
    for(const incidencia of incidencias){
        //Por cada elemento creamos un li y un boton editar
        const li = document.createElement('li');
        const botonEditar = document.createElement('button');

        //Le asingamos estilo con bootstrap al boton
        botonEditar.innerHTML = "Editar";
        botonEditar.className = "btn btn-warning";
        
        //Rescatamos el usuario completo y lo almacenamos en una variable
        const usuario = await getUsuarioById(incidencia.id_reportante);
        //Rescatamos el aula completa y los almacenamos en una variable
        const aula = await getAulasById(incidencia.id_aula);

        //Ahora creamos el contenido del li
        li.innerHTML = `Id: ${incidencia.id}, Fecha: ${incidencia.fecha_incidente}, Aula: ${aula.nombre}, Usuario: ${usuario.nombre} `;

        //Añadimos al li el boton editar
        li.append(botonEditar);
        //Añadimos a la lista el li
        ul.append(li);
    }
}
cargarIncidencias();
