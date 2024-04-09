const d = document;
const cities = [
  { id: 1, city: "Lima - Huacho", tnm: 81.91 },
  { id: 2, city: "Barranca", tnm: 90.06 },
  { id: 3, city: "Huaral", tnm: 71.98 },
  { id: 4, city: "Huarmey", tnm: 107.15 },
  { id: 5, city: "Cañete", tnm: 81.26 },
  { id: 8, city: "Casma", tnm: 121.38 },
  { id: 10, city: "Ica", tnm: 109.23 },
  { id: 11, city: "Nazca", tnm: 133.93 },
  { id: 12, city: "Pativilca", tnm: 91.32 },
  { id: 13, city: "Chimbote", tnm: 131.26 },
  { id: 14, city: "Chincha Alta", tnm: 90.71 },
  { id: 15, city: "Trujillo", tnm: 160.35 },
];

cities.sort((a, b) => {
  if (a.city < b.city) return -1;
  if (a.city > b.city) return 1;
  return 0;
});

cities.unshift({ id: 0, city: "Seleccionar...", tnm: 0 });


const $selectCiudades = d.getElementById("selectCiudades"),
  $valorRef = d.getElementById("valorRef"),
  $cargaReal = d.getElementById("cargaReal"),
  $totalValRef = d.getElementById("totalValRef"),
  $totalCarga = d.getElementById("totalCarga"),
  $detraccion = d.getElementById("detraccion"),
  $facturacion = d.getElementById("facturacion"),
  $valorRefServ = d.getElementById("valorRefServ"),
  $valorRefCarEfect = d.getElementById("valorRefCarEfect"),
  $valorRefCarUtil = d.getElementById("valorRefCarUtil"),
  $btnAddNewCity = d.getElementById("btnaddcity"),
  $firstRow = d.getElementById("rowCity"),
  $tbody = d.getElementById("tbodyContenedor"),
  $trAddCity = d.getElementById("traddcity"),
  indexNum = d.querySelector("td").textContent,
  $btnLimpiar = d.getElementById("btnLimpiar");

let sumaValoresRefTotal = 0,
  decimales = 3;

function updateValues() {
  totalAmount();
  getRefValEfLoad();
  getRefValNomLoad();
  getRefValServ();
  getDetraction();
}

function totalAmount() {
  sumaValoresRefTotal = 0;
  $valoresNodos = d.querySelectorAll(".valoresReferenciales");
  for (const value of $valoresNodos.values()) {
    sumaValoresRefTotal += parseFloat(value.value);
  }
  $totalCarga.value = $cargaReal.value;
  $totalValRef.value = Number(sumaValoresRefTotal.toFixed(decimales));
}

function getDetraction() {
  let detraccion = Number(
    (Math.max(getRefValServ(), $facturacion.value) * 0.04).toFixed(decimales)
  );
  $detraccion.value = detraccion;
}

function getRefValServ() {
  let servValue = Math.max(getRefValEfLoad(), getRefValNomLoad());
  $valorRefServ.value = servValue;
  return servValue;
}

function getRefValEfLoad() {
  let refLoad = Number(
    (sumaValoresRefTotal * $cargaReal.value).toFixed(decimales)
  );
  $valorRefCarEfect.value = refLoad;
  return refLoad;
}

function getRefValNomLoad() {
  let refNominalLoad = sumaValoresRefTotal * 30 * 0.7,
    refNominalLoadF = 0;
  refNominalLoadF = Number(refNominalLoad.toFixed(decimales));
  $valorRefCarUtil.value = refNominalLoadF;
  return refNominalLoadF;
}

function addNewRowCity() {
  let tr = document.createElement("tr");
  let ciudadesDinamicas = d.createElement("select");
  let td = document.createElement("td");
  let input = document.createElement("input");
  let btnDelete = document.createElement("button");
  //seleccionar todos los indices
  let lastIndex = document.querySelectorAll(".indices");

  tr.classList.add("filaDinamica");

  td.classList.add("indices");
  td.innerText = lastIndex.length + 1;
  tr.appendChild(td);

  td = document.createElement("td");
  cities.forEach((city) => {
    let opt = document.createElement("option");
    opt.value = city.id;
    opt.innerText = city.city;
    ciudadesDinamicas.appendChild(opt);
  });
  ciudadesDinamicas.classList.add("selectCiudadesDinamico");
  td.appendChild(ciudadesDinamicas);
  tr.appendChild(td);

  td = document.createElement("td");
  input.type = "text";
  input.disabled = true;
  input.value = "0";
  input.classList.add("valorRefDinamico");
  input.classList.add("valoresReferenciales");
  td.appendChild(input);
  tr.appendChild(td);

  td = document.createElement("td");
  btnDelete.innerText = "X";
  td.appendChild(btnDelete);
  tr.appendChild(td);

  $trAddCity.insertAdjacentElement("beforebegin", tr);
  //agregando logica boton eliminar
  btnDelete.addEventListener("click", (e) => {
    e.target.parentNode.parentNode.remove();
    updateValues();
  });
}

function clearAll() {
  $selectCiudades.value = 0;
  $valorRef.value = 0;
  $cargaReal.value = "";
  $facturacion.value = "";

  const $filasDinamicas = d.querySelectorAll(".filaDinamica");
  $filasDinamicas.forEach((fila) => {
    fila.remove();
  });

  updateValues();
}

d.addEventListener("change", (e) => {
  if (e.target === $selectCiudades) {
    //Optener value del select
    const ciudadElegida = parseInt($selectCiudades.value);
    //
    const indiceBuscado = cities.findIndex((obj) => obj.id === ciudadElegida);
    $valorRef.value = cities[indiceBuscado].tnm;
    updateValues();
  }

  // Set valor dinamicamente en text input
  if (e.target.classList.contains("selectCiudadesDinamico")) {
    const ciudadElegidaDinamica = parseInt(e.target.value),
      $valorRefDinamico = e.target
        .closest("tr")
        .querySelector(".valorRefDinamico");

    const indiceBuscado = cities.findIndex(
      (obj) => obj.id === ciudadElegidaDinamica
    );
    $valorRefDinamico.value = cities[indiceBuscado].tnm;
    updateValues();
  }
});

d.addEventListener("input", (e) => {
  if (e.target === $cargaReal) {
    updateValues();
  }

  if (e.target === $facturacion) {
    updateValues();
  }
});

d.addEventListener("click", (e) => {
  if (e.target === $btnAddNewCity) addNewRowCity();
  if (e.target === $btnLimpiar) clearAll();
});

d.addEventListener("DOMContentLoaded", (e) => {
  // Recorre y imprime el array de objetos "cities"
  cities.forEach((city) => {
    let opt = document.createElement("option");
    opt.value = city.id;
    opt.innerText = city.city;
    $selectCiudades.appendChild(opt);
  });

  // Elige la primera option del select al iniciar
  $valorRef.value = $selectCiudades.value;
  updateValues();
});
