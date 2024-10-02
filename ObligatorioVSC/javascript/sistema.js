class Sistema {
  constructor() {
    this.productos = [];
    this.compradores = [];
    this.administradores = [];
    this.todasLasCompras = [];
    this.comprasPendientes = [];
    this.comprasCanceladas = [];
    this.comprasAprobadas = [];
    this.informeGanancias = [];
  }

  //METODOS GENERICOS//

  buscarObjetoPor1Parametro(lista, parametro, valor) {
    for (let i = 0; i < lista.length; i++) {
      let unObjeto = lista[i];

      if (unObjeto[parametro] === valor) {
        return unObjeto;
      }
    }
  }

  //TERMINAN METODOS GENERICOS

  precargarAdministradores() {
    this.nuevoAdministrador("antonio", "Antonio123");
    this.nuevoAdministrador("carla", "Carla123");
    this.nuevoAdministrador("marta", "Marta123");
    this.nuevoAdministrador("javier", "Javier123");
    this.nuevoAdministrador("manuela", "Manuela123");
  }

  precargarCompradores() {
    this.nuevoComprador(
      "mathias",
      "torres",
      "mathias",
      "Ort1234",
      "5506255981334939",
      "532"
    );
    this.nuevoComprador(
      "joaquin",
      "perez",
      "joaquin",
      "Joaquin123",
      "5506255981334939",
      "245"
    );
    this.nuevoComprador(
      "Carlos",
      "Maciel",
      "Carlos",
      "Carlos321",
      "4539371567070872",
      "994"
    );
    this.nuevoComprador(
      "Pedro",
      "Garrido",
      "Pedrito",
      "Pedro2002",
      "5506255981334939",
      "232"
    );
    this.nuevoComprador(
      "Santiago",
      "Gomez",
      "Santi",
      "Santi222",
      "4539371567070872",
      "545"
    );
  }

  precargarProducto() {
    this.nuevoProducto("pelota", "130", "pelota", "./assets/pelota.jpg", "2");
    this.nuevoProducto(
      "campera",
      "800",
      "campera",
      "./assets/campera.jpg",
      "22"
    );
    this.nuevoProducto(
      "colchoneta",
      "250",
      "colchoneta",
      "./assets/colchoneta.jpg",
      "5"
    );
    this.nuevoProducto(
      "lentes",
      "300",
      "Lentes de Agua",
      "./assets/lentes.jpeg",
      "4"
    );
    this.nuevoProducto("vendas", "100", "vendas", "./assets/vendas.jpg", "50");
    this.nuevoProducto(
      "guantes",
      "190",
      "guantes de golero",
      "./assets/guantes.jpeg",
      "12"
    );
    this.nuevoProducto(
      "casco",
      "340",
      "casco de bicicleta",
      "./assets/casco.jpeg",
      "3"
    );
    this.nuevoProducto(
      "paleta",
      "560",
      "paleta de padel",
      "./assets/paleta.jpeg",
      "3"
    );
    this.nuevoProducto(
      "rodilleras",
      "260",
      "rodilleras acolchonadas",
      "./assets/rodilleras.jpeg",
      "9"
    );
    this.nuevoProducto(
      "pelota",
      "380",
      "pelota de basquetbol",
      "./assets/pelotabasquet.jpeg",
      "9"
    );
  }

  precargarCompras() {
    let usuario1 = new Comprador(
      "federica",
      "martinez",
      "fede",
      "Martinez234",
      "5506255981334939",
      "532"
    );
    let usuario2 = new Comprador(
      "lea",
      "nion",
      "lea",
      "Lea123",
      "5506255981334939",
      "245"
    );
    let usuario3 = new Comprador(
      "Santiago",
      "Maciel",
      "Santi",
      "Santi321",
      "4539371567070872",
      "994"
    );

    this.nuevaCompra("PROD_ID_0", "3", usuario3);

    this.nuevaCompra("PROD_ID_2", "2", usuario1);

    this.nuevaCompra("PROD_ID_6", "5", usuario2);

    this.nuevaCompra("PROD_ID_8", "4", usuario2);

    this.nuevaCompra("PROD_ID_1", "1", usuario1);
  }

  existeComprador(user) {
    for (let i = 0; i < this.compradores.length; i++) {
      let unComprador = this.compradores[i];
      if (user == unComprador.nombreUsuario) {
        return true;
      }
    }
    return false;
  }

  nuevoComprador(nombre, apellido, user, password, tarjeta, nroCvc) {
    let comprador = new Comprador(
      nombre,
      apellido,
      user,
      password,
      tarjeta,
      nroCvc
    );
    this.compradores.push(comprador);
    console.log(`Comprador ${user} creado con éxito.`);
  }

  validarPassword(password) {
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

  nuevoAdministrador(user, password) {
    if (user.length > 4) {
      let validada = this.validarPassword(password);
      if (validada == true) {
        let administrador = new Administrador(user, password);
        this.administradores.push(administrador);
        console.log(`Administrador ${user} creado con éxito.`);
      } else {
        console.log(
          "La contraseña debe contener al menos 5 caracteres, una mayúscula, una minúscula y un número."
        );
      }
    } else {
      console.log("El nombre de usuario debe tener más de 4 caracteres.");
    }
  }

  login(user, pass) {
    for (let i = 0; i < this.administradores.length; i++) {
      let unAdministrador = this.administradores[i];

      if (
        unAdministrador.nombreUsuario == user &&
        unAdministrador.passwordUsuario === pass
      ) {
        return unAdministrador;
      }
    }

    for (let i = 0; i < this.compradores.length; i++) {
      let unComprador = this.compradores[i];

      if (user === unComprador.nombreUsuario && pass === unComprador.password) {
        return unComprador;
      }
    }
    return null;
  }

  nuevoProducto(nombre, precio, descripcion, imagen, stock, estado) {
    let unProducto = new Producto(
      nombre,
      precio,
      descripcion,
      imagen,
      stock,
      estado
    );
    this.productos.push(unProducto);
  }

  nuevaCompra(idProducto, cantidad, usuarioLogueado) {
    let productoComprado = this.buscarObjetoPor1Parametro(
      this.productos,
      "id",
      idProducto
    );

    let nuevaCompra = new Compra(
      productoComprado,
      productoComprado.nombre,
      cantidad,
      usuarioLogueado
    );

    this.comprasPendientes.push(nuevaCompra);
    this.todasLasCompras.push(nuevaCompra);
    usuarioLogueado.misCompras.push(nuevaCompra);
  }

  cambiarEstadoCompra(idCompra) {
    let compra = this.buscarObjetoPor1Parametro(
      this.comprasPendientes,
      "id",
      idCompra
    );
    let cancelada = "cancelada";
    compra.estado = cancelada;
    for (let i = 0; i < this.comprasPendientes.length; i++) {
      if (this.comprasPendientes[i].id == compra.id) {
        this.comprasPendientes.splice(i, 1);
        this.comprasCanceladas.push(compra);
        return;
      }
    }
  }

  cambiarEstadoAprobada(idCompra) {
    let parrafoMensaje = document.querySelector("#pMensajeComprasUsuario");
    let compra = this.buscarObjetoPor1Parametro(
      this.comprasPendientes,
      "id",
      idCompra
    );
    let aprobada = "aprobada";
    for (let i = 0; i < this.comprasPendientes.length; i++) {
      if (
        this.comprasPendientes[i].id == compra.id &&
        this.comprasPendientes[i].producto.estado === "activo"
      ) {
        if (
          compra.usuario.saldoInicial >= compra.montoTotal &&
          compra.cantidadVendida <= this.comprasPendientes[i].producto.stock
        ) {
          this.comprasPendientes.splice(i, 1);
          this.comprasAprobadas.push(compra);
          compra.estado = aprobada;
          compra.usuario.saldoInicial =
            compra.usuario.saldoInicial - compra.montoTotal;
          compra.producto.stock =
            compra.producto.stock - compra.cantidadVendida;
          return;
        } else {
          parrafoMensaje.innerHTML = "Saldo insuficiente o stock no disponible";
          compra.estado = "cancelada";
          this.comprasPendientes.splice(i, 1);
          this.comprasCanceladas.push(compra);
          return;
        }
      } else if (this.comprasPendientes[i].producto.estado === "pausado") {
        compra.estado = "cancelada";
        this.comprasPendientes.splice(i, 1);
        this.comprasCanceladas.push(compra);
        parrafoMensaje.innerHTML =
          "Compra cancelada por inactividad del producto";
        return;
      }
    }
  }
}

let idProducto = 0;
class Producto {
  constructor(nombre, precio, descripcion, imagen, stock, estado) {
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.stock = stock;
    this.estado = "activo";
    this.oferta = false;
    this.id = `PROD_ID_${idProducto++}`;
  }
}

let idComprador = 0;
class Comprador {
  constructor(nombre, apellido, user, password, tarjeta, nroCvc) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.nombreUsuario = user;
    this.password = password;
    this.tarjeta = tarjeta;
    this.nroCvc = nroCvc;
    this.id = `COMPRADOR_ID_${++idComprador}`;
    this.saldoInicial = 3000;
    this.misCompras = [];
  }
}

class Administrador {
  constructor(user, password) {
    this.nombreUsuario = user;
    this.passwordUsuario = password;
  }
}

let idCompra = 0;
class Compra {
  constructor(producto, nombre, cantidadVendida, usuario) {
    this.producto = producto;
    this.nombre = nombre;
    this.cantidadVendida = cantidadVendida;
    this.usuario = usuario;
    this.estado = "pendiente";
    this.montoTotal = this.producto.precio * this.cantidadVendida;
    this.id = `COMPRA_ID_${++idCompra}`;
  }

  calcularCosto() {
    this.montoTotal = this.producto.precio * this.cantidadVendida;
  }
}

class Informe {
  constructor() {
    this.Compra.nombre = nombre;
    this.Compra.cantidadVendida = cantidadVendida;
    this.ganancia = gananciaTotal();
  }

  gananciaTotal() {
    return (ganancias += this.Compra.montoTotal);
  }
}

// mostrarArrays() {
//   console.log("Productos:", this.productos);
//   console.log("Compradores:", this.compradores);
//   console.log("Administradores:", this.administradores);
//   console.log("Compras Pendientes:", this.comprasPendientes);
//   console.log("Compras Canceladas:", this.comprasCanceladas);
//   console.log("Compras Aprobadas:", this.comprasAprobadas);
//   console.log("Todas las Compras:", this.todasLasCompras);
//   console.log("Informe de Ganancias:", this.informeGanancias);
// }
