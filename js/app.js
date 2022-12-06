

//Variables
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas{
    constructor(){
        this.citas = []
    }
    agregarCita(cita){
        this.citas = [...this.citas, cita];
        console.log(this.citas);
    }
    eliminarCitas(id){
        this.citas = this.citas.filter( cita => cita.id !== id);
    }
    editandocitas(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
}

class UI{
    mostrarAlerta(mensaje, tipo){
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('alert', 'text-center', 'd-block','col-12');
        divMensaje.textContent = mensaje;
        //validar campos
        if (tipo === 'err') {
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        //agregando al DOM
        document.querySelector('#contenido').insertBefore
        (divMensaje, document.querySelector('.agregar-cita'));

        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }
    imprimirAlerta({citas}){
        this.limpiarHtml();

        citas.forEach(cita => {
            const{mascota,propietario,telefono,hora,fecha,sintomas, id}= cita;
            //crear Div
            const divCitas = document.createElement('div');
            divCitas.classList.add('cita', 'p-3');
            divCitas.dataset.id = id ;

            //scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            //agregar los parrafos al div
            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
            <span class="font-weight-bolder">Propietario: </span> ${propietario}  `

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class="font-weight-bolder">Telefono: </span> ${telefono}  `

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class="font-weight-bolder">Hora: </span> ${hora}  `

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class="font-weight-bolder">Fecha: </span> ${fecha}  `

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
            <span class="font-weight-bolder">Sintomas: </span> ${sintomas}  `
            //boton para Eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-3')
            btnEliminar.innerHTML = 'Eliminar ';
            btnEliminar.onclick = () => eliminarCitas(id);
            //BOTON DE EDITAR   
            const btnEditar = document.createElement('button')
            btnEditar.classList.add('btn', 'btn-info', 'mr-3')
            btnEditar.innerHTML = 'Editar ';
            btnEditar.onclick = ()=> editarCitas(cita);

     
            divCitas.appendChild(mascotaParrafo);
            divCitas.appendChild(propietarioParrafo);
            divCitas.appendChild(telefonoParrafo);
            divCitas.appendChild(horaParrafo);
            divCitas.appendChild(fechaParrafo);
            divCitas.appendChild(sintomasParrafo);
            
            //agregar btn al html
            divCitas.appendChild(btnEliminar);
            divCitas.appendChild(btnEditar);
            contenedorCitas.appendChild(divCitas);


        });
    }
    
    limpiarHtml(){
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
    
        
          
}

const administarCitas = new Citas();
const ui = new UI();

//eventos
eventListener();
function eventListener(){
    mascotaInput.addEventListener('input',datosCita);
    propietarioInput.addEventListener('input',datosCita);
    telefonoInput.addEventListener('input',datosCita);
    fechaInput.addEventListener('input',datosCita);
    horaInput.addEventListener('input',datosCita);
    sintomasInput.addEventListener('input',datosCita);
    formulario.addEventListener('submit', nuevaCita);
}

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

//funciones
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

function nuevaCita(e) {
    e.preventDefault();
    //Extraer la informacion del objeto
    const{mascota,propietario,telefono,hora,fecha,sintomas}= citaObj
    //validar
    if (mascota === '' || propietario === '' || telefono === ''
    || hora === '' ||fecha ==='' || sintomas === '') {
        ui.mostrarAlerta('Todos los campos son obligatorios', 'err');
        return;
    } 
    if (editando) {
        formulario.querySelector('button[type="submit"]').textContent = 'crear cita';
           //modificando citas al recuperar el objeto
        administarCitas.editandocitas({...citaObj})
        // quitar modo edicion
        editando = false;
    }else{
        citaObj.id = Date.now();
        //creando nueva cita
        administarCitas.agregarCita({...citaObj});
        ui.mostrarAlerta('La cita fue gurdada con éxito');
        
    }
    //reniciar el objeto
    reiniciarObjeto();

    //reinicarFormulario
    formulario.reset();
    // muestra el htm en el UI
    ui.imprimirAlerta(administarCitas);
    
}
function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}
function eliminarCitas(id) {
    administarCitas.eliminarCitas(id)

    ui.imprimirAlerta(administarCitas);
}
function editarCitas(cita) {
    const{mascota,propietario,telefono,hora,fecha,sintomas, id}= cita;

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    horaInput.value = hora;
    fecha.value = fecha;
    sintomasInput.value = sintomas;

    //lenar los inputs
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.hora = hora;
    citaObj.fecha = fecha;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

   // modificar el boton submit
   formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
   editando = true;
}