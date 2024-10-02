document.querySelector("#btnLogin").addEventListener("click", login);
document.querySelector("#btnLogin2").addEventListener("click", moverMenu);
document
  .querySelector("#btnRegistro")
  .addEventListener("click", registrarComprador);

document.querySelector("#btnIrRegistro").addEventListener("click", moverMenu);

document
  .querySelector("#btnCrearProducto")
  .addEventListener("click", crearProducto);
document
  .querySelector("#btnIrCrearProductos")
  .addEventListener("click", moverMenu);
document.querySelector("#btnLogout").addEventListener("click", moverMenu);
document.querySelector("#btnLogout2").addEventListener("click", moverMenu);

document
  .querySelector("#btnVolverDashboard")
  .addEventListener("click", moverMenu);

document
  .querySelector("#btnVolverDashboard2")
  .addEventListener("click", moverMenu);

document
  .querySelector("#btnVolverDashboard3")
  .addEventListener("click", moverMenu);

document
  .querySelector("#btnVolverDashboard4")
  .addEventListener("click", moverMenu);

document
  .querySelector("#btnComprasUsuario")
  .addEventListener("click", moverMenu);

document
  .querySelector("#btnVolverCompras")
  .addEventListener("click", moverMenu);

document
  .querySelector("#filtroCompras")
  .addEventListener("change", mostrarCompraFiltrada);

document
  .querySelector("#btnAdministrarCompras")
  .addEventListener("click", moverMenu);

document
  .querySelector("#btnAdministrarProductos")
  .addEventListener("click", moverMenu);
document
  .querySelector("#btnProductosEnOferta")
  .addEventListener("click", moverMenu);
document
  .querySelector("#btnTodosLosProductos")
  .addEventListener("click", moverMenu);

document.querySelector("#btnInforme").addEventListener("click", moverMenu);

let miSistema = new Sistema();
miSistema.precargarAdministradores();
miSistema.precargarCompradores();
miSistema.precargarProducto();
miSistema.precargarCompras();
let usuarioLogueado;

// miSistema.mostrarArrays();

function moverMenu() {
  let destino = this.getAttribute("data-menu");
  switch (destino) {
    case "login":
      usuarioLogueado = null;
      break;
    case "compras":
      mostrarCompraFiltrada();
      mostrarMontoUsuario();
      mostrarSaldoUsuario();
      break;
    case "comprasUsuarios":
      mostrarPendientes();
      mostrarAprobadas();
      mostrarCanceladas();
      break;
    case "administrarProductos":
      mostrarProductosAdministrar();
      break;
    case "informe":
      mostrarInforme();
      break;
    default:
      break;
  }
  destino = "#" + destino;
  cambiarPantalla(destino);
}

function cambiarPantalla(activa) {
  let pantallas = document.querySelectorAll(".ventana");
  for (let i = 0; i < pantallas.length; i++) {
    let unaPantalla = pantallas[i];
    unaPantalla.style.display = "none";
  }

  document.querySelector(activa).style.display = "block";
}

cambiarPantalla("#login");

//VALIDACION DE REGISTRO DE USUARIO Y CREACION

function registrarComprador() {
  let user = document.querySelector("#usuarioRegistro").value;
  let password = document.querySelector("#passwordRegistro").value;
  let nombre = document.querySelector("#nombreRegistro").value;
  let apellido = document.querySelector("#apellidoRegistro").value;
  let tarjeta = document.querySelector("#tarjetaRegistro").value;
  let nroCvc = document.querySelector("#cvcRegistro").value;
  let parrafoError = document.querySelector("#pErrorRegistro");
  let validacionUsuario = miSistema.existeComprador(user);
  let validacionPassword = validarPasswordMain(password);
  let validacionNumeroTarjeta = verificarTarjeta(tarjeta);
  let validacionCvc = validarCvc(nroCvc);
  if (
    !validacionUsuario &&
    validacionPassword &&
    validacionNumeroTarjeta &&
    validacionCvc
  ) {
    miSistema.nuevoComprador(nombre, apellido, user, password, tarjeta, nroCvc);
    cambiarPantalla("#login");
  } else {
    parrafoError.innerHTML = "Datos erroneos o nombre de usuario ya existente";
  }
}

//FUNCION PARA VALIDAR EL LOGIN DE USUARIOS

function login() {
  let user = document.querySelector("#txtUsuarioLogin").value;
  let password = document.querySelector("#txtPasswordLogin").value;
  let parrafoError = document.querySelector("#pErrorLogin");

  if (user.length > 4) {
    let unaMayuscula = 0;
    let unaMinuscula = 0;
    let unNumero = 0;

    for (let i = 0; i < password.length; i++) {
      let caracter = password[i];
      if (!isNaN(caracter)) {
        unNumero++;
      } else if (caracter == caracter.toLowerCase()) {
        unaMinuscula++;
      } else if (caracter == caracter.toUpperCase()) {
        unaMayuscula++;
      }
    }
    if (unaMayuscula == 0 || unaMinuscula == 0 || unNumero == 0) {
      parrafoError.innerHTML = "La contranseña no es correcta";
    } else {
      let usuario = miSistema.login(user, password);

      if (usuario == null) {
        parrafoError.innerHTML = "El usuario ingresado no existe";
      } else {
        usuarioLogueado = usuario;

        if (usuarioLogueado instanceof Administrador) {
          cambiarPantalla("#dashboardAdministradores");
        } else {
          cambiarPantalla("#productos");
          mostrarProductos();
        }
      }
    }
  } else {
    parrafoError.innerHTML = "Los datos ingresados son erróneos";
  }
}

//FUNCION QUE VALIDA PARA LA CREACION DE PRODUCTOS DESDE SISTEMA

function crearProducto() {
  let nombre = document.querySelector("#nombreCrearProducto").value;
  let precio = parseInt(document.querySelector("#precioCrearProducto").value);
  let descripcion = document.querySelector("#descripcionCrearProducto").value;
  let imagen = document.querySelector("#imagenCrearProducto").value;
  let stock = parseInt(document.querySelector("#stockCrearProducto").value);
  let parrafo = document.querySelector("#pErrorCrearProducto");
  if (
    nombre != "" &&
    precio > 0 &&
    !isNaN(precio) &&
    descripcion != "" &&
    imagen != "" &&
    stock > 0 &&
    !isNaN(stock)
  ) {
    miSistema.nuevoProducto(nombre, precio, descripcion, imagen, stock);
    parrafo.innerHTML = "Producto creado con exito";
  } else {
    parrafo.innerHTML = "Error en la creación del producto";
  }
}

//FUNCION PARA MOSTRAR LOS PRODUCTOS Y LOS PRODUCTOS EN OFERTA

function mostrarProductos() {
  let contenedorProductos = document.querySelector(".productosContenedor");
  contenedorProductos.innerHTML = "";

  let productosEnOfertaContenedor = document.querySelector(
    ".productosEnOfertaContenedor"
  );
  productosEnOfertaContenedor.innerHTML = "";

  for (let i = 0; i < miSistema.productos.length; i++) {
    let unProducto = miSistema.productos[i];

    if (unProducto.stock > 0 && unProducto.estado == "activo") {
      let unDiv = document.createElement("div");
      let unaImagen = document.createElement("img");
      let nombreH4 = document.createElement("h4");
      let descripcionP = document.createElement("p");
      let precioP = document.createElement("p");
      let ofertaP = document.createElement("p");
      let cantidadP = document.createElement("p");
      let seleccioneCantidadP = document.createElement("p");
      let inputCantidad = document.createElement("input");
      let inputComprar = document.createElement("input");

      unaImagen.src = unProducto.imagen;
      nombreH4.innerHTML = "Producto: " + unProducto.nombre;
      descripcionP.innerHTML =
        "Descripcion del producto: " + unProducto.descripcion;
      precioP.innerHTML = "Precio del producto: " + unProducto.precio;
      ofertaP.innerHTML = "Oferta: " + unProducto.oferta;
      cantidadP.innerHTML = "Cantidad disponible: " + unProducto.stock;
      seleccioneCantidadP.innerHTML = "Seleccione la cantidad a comprar: ";

      unDiv.setAttribute("class", "producto");
      unaImagen.setAttribute("src", unProducto.imagen);
      inputCantidad.setAttribute("type", "number");
      inputCantidad.setAttribute("id", "inputCantidad" + unProducto.id);
      inputComprar.setAttribute("type", "button");
      inputComprar.setAttribute("value", "Comprar");
      inputComprar.setAttribute("data-id", unProducto.id);
      inputComprar.setAttribute("class", "botonComprar");

      contenedorProductos.appendChild(unDiv);
      unDiv.appendChild(unaImagen);
      unDiv.appendChild(nombreH4);
      unDiv.appendChild(descripcionP);
      unDiv.appendChild(precioP);
      unDiv.appendChild(ofertaP);
      unDiv.appendChild(cantidadP);
      unDiv.appendChild(seleccioneCantidadP);
      unDiv.appendChild(inputCantidad);
      unDiv.appendChild(inputComprar);

      if (unProducto.oferta == true) {
        let unDiv = document.createElement("div");
        let unaImagen = document.createElement("img");
        let nombreH4 = document.createElement("h4");
        let descripcionP = document.createElement("p");
        let precioP = document.createElement("p");
        let ofertaP = document.createElement("p");
        let cantidadP = document.createElement("p");
        let seleccioneCantidadP = document.createElement("p");
        let inputCantidad = document.createElement("input");
        let inputComprar = document.createElement("input");

        unaImagen.src = unProducto.imagen;
        nombreH4.innerHTML = "Producto: " + unProducto.nombre;
        descripcionP.innerHTML =
          "Descripcion del producto: " + unProducto.descripcion;
        precioP.innerHTML = "Precio del producto: " + unProducto.precio;
        ofertaP.innerHTML = "Oferta: " + unProducto.oferta;
        cantidadP.innerHTML = "Cantidad disponible: " + unProducto.stock;
        seleccioneCantidadP.innerHTML = "Seleccione la cantidad a comprar: ";

        unDiv.setAttribute("class", "producto");
        unaImagen.setAttribute("src", unProducto.imagen);
        inputCantidad.setAttribute("type", "number");
        inputCantidad.setAttribute("id", "inputCantidadOferta" + unProducto.id);
        inputComprar.setAttribute("type", "button");
        inputComprar.setAttribute("value", "Comprar");
        inputComprar.setAttribute("data-id", unProducto.id);
        inputComprar.setAttribute("class", "botonComprar");

        productosEnOfertaContenedor.appendChild(unDiv);
        unDiv.appendChild(unaImagen);
        unDiv.appendChild(nombreH4);
        unDiv.appendChild(descripcionP);
        unDiv.appendChild(precioP);
        unDiv.appendChild(ofertaP);
        unDiv.appendChild(cantidadP);
        unDiv.appendChild(seleccioneCantidadP);
        unDiv.appendChild(inputCantidad);
        unDiv.appendChild(inputComprar);

        let botonesCompra = document.querySelectorAll(".botonComprar");
        for (let i = 0; i < botonesCompra.length; i++) {
          let unBotonCompra = botonesCompra[i];
          unBotonCompra.addEventListener("click", realizarCompraOferta);
        }
      }
    }
  }
  let botonesCompra = document.querySelectorAll(".botonComprar");
  for (let i = 0; i < botonesCompra.length; i++) {
    let unBotonCompra = botonesCompra[i];
    unBotonCompra.addEventListener("click", realizarCompra);
  }
}

//FUNCION PARA GENERAR ORDEN DE COMPRA

function realizarCompra() {
  let parrafoMensaje = document.querySelector("#pMensajeTodosLosProductos");
  let idProducto = this.getAttribute("data-id");
  let cantidad = parseInt(
    document.querySelector("#inputCantidad" + idProducto).value
  );
  if (cantidad >= 0) {
    miSistema.nuevaCompra(idProducto, cantidad, usuarioLogueado);
    mostrarProductos();
  } else {
    parrafoMensaje.innerHTML = "La cantidaad no puede ser menor a 0";
  }
}

//FUNCION PARA GENERAR ORDEN DE COMPRA DESDE LA VISTA DE OFERTAS

function realizarCompraOferta() {
  let parrafoMensaje = document.querySelector("#pMensajeTodosLosProductos");
  let idProducto = this.getAttribute("data-id");
  let cantidad = parseInt(
    document.querySelector("#inputCantidadOferta" + idProducto).value
  );
  if (cantidad >= 0) {
    miSistema.nuevaCompra(idProducto, cantidad, usuarioLogueado);
    mostrarProductos();
  } else {
    parrafoMensaje.innerHTML = "La cantidaad no puede ser menor a 0";
  }
}

//FUNCION PARA MOSTRAR LOS PRODUCTOS Y BOTONES PARA MODIFICARLOS

function mostrarProductosAdministrar() {
  let parrafoError = document.querySelector("#pErrorModificarProductos");
  parrafoError.innerHTML = "";
  let contenedorProductosAdministrar = document.querySelector(
    ".administrarProductosContenedor"
  );
  contenedorProductosAdministrar.innerHTML = "";

  for (let i = 0; i < miSistema.productos.length; i++) {
    let todos = miSistema.productos[i];

    let losTR = document.createElement("tr");
    let tdNombre = document.createElement("td");
    let tdDescripcion = document.createElement("td");
    let tdOferta = document.createElement("td");
    let tdEstado = document.createElement("td");
    let tdModificarEstado = document.createElement("td");
    let tdModificarStock = document.createElement("td");
    let tdModificarOferta = document.createElement("td");
    let tdModificarProducto = document.createElement("td");

    let inputModificarEstado = document.createElement("input");
    let inputModificarStock = document.createElement("input");
    inputModificarStock.setAttribute("value", todos.stock);
    let inputModificarOferta = document.createElement("input");
    let inputModificarProducto = document.createElement("input");

    tdNombre.innerHTML = todos.nombre;
    tdDescripcion.innerHTML = todos.descripcion;
    tdOferta.innerHTML = todos.oferta;
    tdEstado.innerHTML = todos.estado;

    inputModificarEstado.setAttribute("type", "checkbox");
    let estadoAux = false;
    if (todos.estado == "activo") {
      estadoAux = true;
    }
    inputModificarEstado.checked = estadoAux;
    inputModificarStock.setAttribute("type", "number");
    inputModificarOferta.setAttribute("type", "checkbox");
    inputModificarOferta.checked = todos.oferta;
    inputModificarProducto.setAttribute("type", "button");
    inputModificarProducto.setAttribute("value", "Modificar");
    inputModificarProducto.setAttribute("class", "botonModificar");
    inputModificarProducto.setAttribute("data-id", todos.id);

    inputModificarEstado.setAttribute("id", "inputEstado" + todos.id);
    inputModificarStock.setAttribute("id", "inputStock" + todos.id);
    inputModificarOferta.setAttribute("id", "inputOferta" + todos.id);

    tdModificarEstado.appendChild(inputModificarEstado);
    tdModificarStock.appendChild(inputModificarStock);
    tdModificarOferta.appendChild(inputModificarOferta);
    tdModificarProducto.appendChild(inputModificarProducto);

    losTR.appendChild(tdNombre);
    losTR.appendChild(tdDescripcion);
    losTR.appendChild(tdOferta);
    losTR.appendChild(tdEstado);
    losTR.appendChild(tdModificarEstado);
    losTR.appendChild(tdModificarStock);
    losTR.appendChild(tdModificarOferta);
    losTR.appendChild(tdModificarProducto);

    contenedorProductosAdministrar.appendChild(losTR);
  }

  let botonesModificar = document.querySelectorAll(".botonModificar");
  for (let i = 0; i < botonesModificar.length; i++) {
    let unBotonModificar = botonesModificar[i];
    unBotonModificar.addEventListener("click", modificarProducto);
  }
}

//FUNCION QUE VALIDA Y REALIZA LA MODIFICACION DE LOS PRODUCTOS

function modificarProducto() {
  let parrafoError = document.querySelector("#pErrorModificarProductos");
  let idProducto = this.getAttribute("data-id");
  let estado = document.querySelector("#inputEstado" + idProducto).checked;
  let stock = parseInt(
    document.querySelector("#inputStock" + idProducto).value
  );
  let oferta = document.querySelector("#inputOferta" + idProducto).checked;
  for (let i = 0; i < miSistema.productos.length; i++) {
    if (isNaN(stock)) {
      mostrarProductosAdministrar();
      parrafoError.innerHTML = "No se pueden dejar campos vacios";
      return;
    } else if (miSistema.productos[i].id == idProducto) {
      miSistema.productos[i].stock = stock;
      miSistema.productos[i].oferta = oferta;
      if (estado == false) {
        miSistema.productos[i].estado = "pausado";
      } else {
        miSistema.productos[i].estado = "activo";
      }
      if (miSistema.productos[i].stock <= 0) {
        miSistema.productos[i].estado = "pausado";
      }

      mostrarProductosAdministrar();
      parrafoError.innerHTML = "Modificaciones realizadas";
      return;
    }
  }
}

//MOSTRAR TODAS LAS COMPRAS PARA ADMINISTRADOR

function mostrarTodas() {
  let contenedorCompras = document.querySelector(".listaDeComprasContenedor");
  contenedorCompras.innerHTML = "";

  for (let i = 0; i < miSistema.todasLasCompras.length; i++) {
    let todas = miSistema.todasLasCompras[i];

    let losTR = document.createElement("tr");
    let tdNombre = document.createElement("td");
    let tdCantidadUnidades = document.createElement("td");
    let tdMontoTotal = document.createElement("td");
    let tdEstado = document.createElement("td");
    tdNombre.innerHTML = todas.nombre;
    tdCantidadUnidades.innerHTML = todas.cantidadVendida;
    tdMontoTotal.innerHTML = todas.montoTotal;
    tdEstado.innerHTML = todas.estado;

    if (todas.estado == "pendiente") {
      let botonEstado = document.createElement("input");
      botonEstado.setAttribute("type", "button");
      botonEstado.setAttribute("value", "Cancelar");
      botonEstado.setAttribute("data-id", todas.id);
      botonEstado.setAttribute("class", "botonesEstado");
      tdEstado.appendChild(botonEstado);
    }

    losTR.appendChild(tdNombre);
    losTR.appendChild(tdCantidadUnidades);
    losTR.appendChild(tdMontoTotal);
    losTR.appendChild(tdEstado);
    contenedorCompras.appendChild(losTR);
  }

  let botonesEstado = document.querySelectorAll(".botonesEstado");
  for (let i = 0; i < botonesEstado.length; i++) {
    let unBoton = botonesEstado[i];
    unBoton.addEventListener("click", cambiarEstado);
  }
}

//MOSTRAR TODAS LAS COMPRAS PARA COMPRADOR

function mostrarTodasComprador() {
  let contenedorCompras = document.querySelector(".listaDeComprasContenedor");
  contenedorCompras.innerHTML = "";

  for (let i = 0; i < usuarioLogueado.misCompras.length; i++) {
    let todas = usuarioLogueado.misCompras[i];

    let losTR = document.createElement("tr");
    let tdNombre = document.createElement("td");
    let tdCantidadUnidades = document.createElement("td");
    let tdMontoTotal = document.createElement("td");
    let tdEstado = document.createElement("td");
    tdNombre.innerHTML = todas.nombre;
    tdCantidadUnidades.innerHTML = todas.cantidadVendida;
    tdMontoTotal.innerHTML = todas.montoTotal;
    tdEstado.innerHTML = todas.estado;

    if (todas.estado == "pendiente") {
      let botonEstado = document.createElement("input");
      botonEstado.setAttribute("type", "button");
      botonEstado.setAttribute("value", "Cancelar");
      botonEstado.setAttribute("data-id", todas.id);
      botonEstado.setAttribute("class", "botonesEstado");
      tdEstado.appendChild(botonEstado);
    }

    losTR.appendChild(tdNombre);
    losTR.appendChild(tdCantidadUnidades);
    losTR.appendChild(tdMontoTotal);
    losTR.appendChild(tdEstado);
    contenedorCompras.appendChild(losTR);
  }

  let botonesEstado = document.querySelectorAll(".botonesEstado");
  for (let i = 0; i < botonesEstado.length; i++) {
    let unBoton = botonesEstado[i];
    unBoton.addEventListener("click", cambiarEstado);
  }
}

//MOSTRAR TODAS LAS PENDIENTES PARA ADMINISTRADOR

function mostrarPendientes() {
  let contenedorCompras = document.querySelector(".listaDeComprasContenedor");
  let contenedorComprasAdministrador = document.querySelector(
    ".comprasUsuariosContenedor"
  );
  contenedorCompras.innerHTML = "";
  contenedorComprasAdministrador.innerHTML = "";

  for (let i = 0; i < miSistema.comprasPendientes.length; i++) {
    let unaPendiente = miSistema.comprasPendientes[i];

    let losTR = document.createElement("tr");
    let tdNombre = document.createElement("td");
    let tdCantidadUnidades = document.createElement("td");
    let tdMontoTotal = document.createElement("td");
    let tdEstado = document.createElement("td");
    tdNombre.innerHTML = unaPendiente.nombre;
    tdCantidadUnidades.innerHTML = unaPendiente.cantidadVendida;
    tdMontoTotal.innerHTML = unaPendiente.montoTotal;
    tdEstado.innerHTML = unaPendiente.estado;

    if (unaPendiente.estado === "pendiente") {
      let botonEstado = document.createElement("input");
      botonEstado.setAttribute("type", "button");
      botonEstado.setAttribute("value", "Aprobar");
      botonEstado.setAttribute("data-id", unaPendiente.id);
      botonEstado.setAttribute("class", "botonesEstado");
      tdEstado.appendChild(botonEstado);
    }

    losTR.appendChild(tdNombre);
    losTR.appendChild(tdCantidadUnidades);
    losTR.appendChild(tdMontoTotal);
    losTR.appendChild(tdEstado);

    contenedorComprasAdministrador.appendChild(losTR);
  }

  let botonesEstado = document.querySelectorAll(".botonesEstado");
  for (let i = 0; i < botonesEstado.length; i++) {
    let unBoton = botonesEstado[i];
    unBoton.addEventListener("click", aprobarCompra);
  }
}

//MOSTRAR TODAS LAS PEDNIENTES PARA COMPRADOR

function mostrarPendientesComprador() {
  let contenedorCompras = document.querySelector(".listaDeComprasContenedor");
  contenedorCompras.innerHTML = "";

  for (let i = 0; i < usuarioLogueado.misCompras.length; i++) {
    let unaPendiente = usuarioLogueado.misCompras[i];

    let losTR = document.createElement("tr");
    let tdNombre = document.createElement("td");
    let tdCantidadUnidades = document.createElement("td");
    let tdMontoTotal = document.createElement("td");
    let tdEstado = document.createElement("td");

    if (unaPendiente.estado === "pendiente") {
      tdNombre.innerHTML = unaPendiente.nombre;
      tdCantidadUnidades.innerHTML = unaPendiente.cantidadVendida;
      tdMontoTotal.innerHTML = unaPendiente.montoTotal;
      tdEstado.innerHTML = unaPendiente.estado;

      let botonEstado = document.createElement("input");
      botonEstado.setAttribute("type", "button");
      botonEstado.setAttribute("value", "Cancelar");
      botonEstado.setAttribute("data-id", unaPendiente.id);
      botonEstado.setAttribute("class", "botonesEstado");
      tdEstado.appendChild(botonEstado);
    }

    losTR.appendChild(tdNombre);
    losTR.appendChild(tdCantidadUnidades);
    losTR.appendChild(tdMontoTotal);
    losTR.appendChild(tdEstado);
    contenedorCompras.appendChild(losTR);
  }

  let botonesEstado = document.querySelectorAll(".botonesEstado");
  for (let i = 0; i < botonesEstado.length; i++) {
    let unBoton = botonesEstado[i];
    unBoton.addEventListener("click", cambiarEstado);
  }
}

//MOSTRAR TODAS LAS CANCELADAS PARA ADMINISTRADOR

function mostrarCanceladas() {
  let contenedorCompras = document.querySelector(".listaDeComprasContenedor");
  contenedorCompras.innerHTML = "";
  let contenedroComprasAdministrador = document.querySelector(
    ".comprasCanceladasUsuariosContenedor"
  );
  contenedroComprasAdministrador.innerHTML = "";

  for (let i = 0; i < miSistema.comprasCanceladas.length; i++) {
    let cancelada = miSistema.comprasCanceladas[i];

    let losTR = document.createElement("tr");
    let tdNombre = document.createElement("td");
    let tdCantidadUnidades = document.createElement("td");
    let tdMontoTotal = document.createElement("td");
    let tdEstado = document.createElement("td");
    tdNombre.innerHTML = cancelada.nombre;
    tdCantidadUnidades.innerHTML = cancelada.cantidadVendida;
    tdMontoTotal.innerHTML = cancelada.montoTotal;
    tdEstado.innerHTML = cancelada.estado;

    losTR.appendChild(tdNombre);
    losTR.appendChild(tdCantidadUnidades);
    losTR.appendChild(tdMontoTotal);
    losTR.appendChild(tdEstado);

    contenedroComprasAdministrador.appendChild(losTR);
  }
}

//MOSTRAR TODAS LAS CANCELADAS PARA COMPRADOR

function mostrarCanceladasComprador() {
  let contenedorCompras = document.querySelector(".listaDeComprasContenedor");
  contenedorCompras.innerHTML = "";

  for (let i = 0; i < usuarioLogueado.misCompras.length; i++) {
    let cancelada = usuarioLogueado.misCompras[i];

    if (cancelada.estado === "cancelada") {
      let losTR = document.createElement("tr");
      let tdNombre = document.createElement("td");
      let tdCantidadUnidades = document.createElement("td");
      let tdMontoTotal = document.createElement("td");
      let tdEstado = document.createElement("td");
      tdNombre.innerHTML = cancelada.nombre;
      tdCantidadUnidades.innerHTML = cancelada.cantidadVendida;
      tdMontoTotal.innerHTML = cancelada.montoTotal;
      tdEstado.innerHTML = cancelada.estado;

      losTR.appendChild(tdNombre);
      losTR.appendChild(tdCantidadUnidades);
      losTR.appendChild(tdMontoTotal);
      losTR.appendChild(tdEstado);
      contenedorCompras.appendChild(losTR);
    }
  }
}

//MOSTRAR TODAS LAS APROBADAS PARA ADMINISTRADOR

function mostrarAprobadas() {
  let contenedorCompras = document.querySelector(".listaDeComprasContenedor");
  contenedorCompras.innerHTML = "";
  let comprasAprobadasContenedor = document.querySelector(
    ".comprasAprobadasUsuariosContenedor"
  );
  comprasAprobadasContenedor.innerHTML = "";

  for (let i = 0; i < miSistema.comprasAprobadas.length; i++) {
    let aprobada = miSistema.comprasAprobadas[i];

    let losTR = document.createElement("tr");
    let tdNombre = document.createElement("td");
    let tdCantidadUnidades = document.createElement("td");
    let tdMontoTotal = document.createElement("td");
    let tdEstado = document.createElement("td");
    tdNombre.innerHTML = aprobada.nombre;
    tdCantidadUnidades.innerHTML = aprobada.cantidadVendida;
    tdMontoTotal.innerHTML = aprobada.montoTotal;
    tdEstado.innerHTML = aprobada.estado;

    losTR.appendChild(tdNombre);
    losTR.appendChild(tdCantidadUnidades);
    losTR.appendChild(tdMontoTotal);
    losTR.appendChild(tdEstado);

    comprasAprobadasContenedor.appendChild(losTR);
  }
}

//MOSTRAR TODAS LAS APROBADAS PARA COMPRADOR

function mostrarAprobadasComprador() {
  let contenedorCompras = document.querySelector(".listaDeComprasContenedor");
  contenedorCompras.innerHTML = "";

  for (let i = 0; i < usuarioLogueado.misCompras.length; i++) {
    let aprobada = usuarioLogueado.misCompras[i];
    if (aprobada.estado === "aprobada") {
      let losTR = document.createElement("tr");
      let tdNombre = document.createElement("td");
      let tdCantidadUnidades = document.createElement("td");
      let tdMontoTotal = document.createElement("td");
      let tdEstado = document.createElement("td");
      tdNombre.innerHTML = aprobada.nombre;
      tdCantidadUnidades.innerHTML = aprobada.cantidadVendida;
      tdMontoTotal.innerHTML = aprobada.montoTotal;
      tdEstado.innerHTML = aprobada.estado;

      losTR.appendChild(tdNombre);
      losTR.appendChild(tdCantidadUnidades);
      losTR.appendChild(tdMontoTotal);
      losTR.appendChild(tdEstado);
      contenedorCompras.appendChild(losTR);
    }
  }
}

function mostrarMontoUsuario() {
  let parrafoMensajeMonto = document.querySelector("#pMensajeMonto");
  parrafoMensajeMonto.innerHTML = "";
  let montoTotal = 0;

  for (let i = 0; i < usuarioLogueado.misCompras.length; i++) {
    if (usuarioLogueado.misCompras[i].estado === "aprobada") {
      let montoUnaCompra = usuarioLogueado.misCompras[i].montoTotal;
      montoTotal += montoUnaCompra;
    }
  }

  parrafoMensajeMonto.innerHTML =
    "El monto total de tus compras aprobadas hasta el momento es de $" +
    montoTotal;

  miSistema.mostrarArrays();
}

function mostrarSaldoUsuario() {
  let parrafoMensajeSaldo = document.querySelector("#pMensajeSaldo");
  parrafoMensajeSaldo.innerHTML =
    "Su saldo es de $" + usuarioLogueado.saldoInicial;
  return;
}

//FILTRAR COMPRAS PARA EL COMPRADOR

function mostrarCompraFiltrada() {
  let valorSelect = document.querySelector("#filtroCompras").value;
  let contenedorCompras = document.querySelector(".listaDeComprasContenedor");
  if (valorSelect === "todas") {
    contenedorCompras.innerHTML = "";
    mostrarTodasComprador();
  } else if (valorSelect === "pendientes") {
    contenedorCompras.innerHTML = "";
    mostrarPendientesComprador();
  } else if (valorSelect === "canceladas") {
    contenedorCompras.innerHTML = "";
    mostrarCanceladasComprador();
  } else if (valorSelect === "aprobadas") {
    contenedorCompras.innerHTML = "";
    mostrarAprobadasComprador();
  }
}

//ADMINISTRACION DE COMPRAS

function cambiarEstado() {
  let miCompra = this.getAttribute("data-id");
  miSistema.cambiarEstadoCompra(miCompra);
  mostrarCompraFiltrada();
}

function aprobarCompra() {
  let miCompra = this.getAttribute("data-id");
  miSistema.cambiarEstadoAprobada(miCompra);
  mostrarPendientes();
  mostrarAprobadas();
  mostrarCanceladas();
}

//INFORME DE GANANCIAS

function mostrarInforme() {
  let contenedorGanancias = document.querySelector("#ventasTotalesContenedor");
  contenedorGanancias.innerHTML = "";

  let contenedorMontoTotal = document.querySelector("#gananciaTotal");
  contenedorMontoTotal.innerHTML = "";

  let montoTotal = 0;

  for (let i = 0; i < miSistema.comprasAprobadas.length; i++) {
    let cantidadVendida = 0;

    cantidadVendida += miSistema.comprasAprobadas[i].cantidadVendida;

    montoTotal += miSistema.comprasAprobadas[i].montoTotal;

    let unDiv = document.createElement("div");
    let producto = document.createElement("p");
    let unidadesVendidas = document.createElement("p");

    producto.innerHTML = "Producto: " + miSistema.comprasAprobadas[i].nombre;
    unidadesVendidas.innerHTML = "Cantidad vendida: " + cantidadVendida;

    contenedorGanancias.appendChild(unDiv);
    unDiv.appendChild(producto);
    unDiv.appendChild(unidadesVendidas);
  }

  contenedorMontoTotal.innerHTML = "El monto total vendido es $" + montoTotal;
}

//FUNCIONES DE VALIDACION DE TARJETA Y PASSWORD

function validarPasswordMain(password) {
  let validada = false;
  let unaMayuscula = 0;
  let unaMinuscula = 0;
  let unNumero = 0;

  for (let i = 0; i < password.length; i++) {
    let caracter = password[i];
    if (!isNaN(caracter)) {
      unNumero++;
    } else if (caracter === caracter.toLowerCase()) {
      unaMinuscula++;
    } else if (caracter === caracter.toUpperCase()) {
      unaMayuscula++;
    }
  }

  if (
    unaMayuscula === 0 ||
    unaMinuscula === 0 ||
    unNumero === 0 ||
    password.length <= 5
  ) {
    return validada;
  } else {
    return (validada = true);
  }
}

function verificarTarjeta(tarjeta) {
  let resultado = false;
  let acumulador = 0;
  let digitoVerificar = tarjeta.charAt(tarjeta.length - 1);
  for (let i = 0; i < tarjeta.length - 1; i++) {
    if (i % 2 === 0) {
      let duplicado = Number(tarjeta.charAt(i)) * 2;
      if (duplicado >= 10) {
        let duplicadoStr = String(duplicado);
        let resultado =
          Number(duplicadoStr.charAt(0)) + Number(duplicadoStr.charAt(1));
        acumulador += resultado;
      } else {
        acumulador += duplicado;
      }
    } else {
      acumulador += Number(tarjeta.charAt(i));
    }
  }

  let verificadorMultiplicado = acumulador * 9;
  let verifMultStr = String(verificadorMultiplicado);
  let verificadorReal = verifMultStr.charAt(verifMultStr.length - 1);
  if (verificadorReal === digitoVerificar) {
    resultado = true;
  }
  return resultado;
}

function validarCvc(nroCvc) {
  return !isNaN(nroCvc) && nroCvc.length == 3;
}
