import { db, collection, getDocs } from "./firebase-config.js";
import { addDoc, onSnapshot, query, orderBy, Timestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// --- CREAR PRODUCTO ---
if (document.body.classList.contains('create-product-page')) {
  const form = document.querySelector('.product-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const precioRegular = parseFloat(form["precio-regular"].value);
    const precio = parseFloat(form.precio.value);
    const descripcion = form.descripcion.value.trim();
    const estado = form.estado.value;
    // No subimos imagen por ahora
    if (!nombre || isNaN(precioRegular) || isNaN(precio) || !descripcion || !estado) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    try {
      await addDoc(collection(db, 'productos'), {
        nombre,
        precioRegular,
        precio,
        descripcion,
        estado,
        creado: Timestamp.now()
      });
      form.reset();
      alert('¡Producto creado exitosamente!');
    } catch (err) {
      alert('Error al guardar el producto.');
      console.error(err);
    }
  });
}

// --- MOSTRAR PRODUCTOS EN TIEMPO REAL ---
if (document.body.classList.contains('products-page')) {
  const productsList = document.querySelector('.products-list');
  productsList.innerHTML = '<p>Cargando productos...</p>';
  const q = query(collection(db, 'productos'), orderBy('creado', 'desc'));
  onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      productsList.innerHTML = '<p style="text-align:center;color:#b25c2a;font-size:1.2rem;">No hay productos aún.</p>';
      return;
    }
    productsList.innerHTML = '';
    // Eliminar placeholders si existen
    const placeholders = document.querySelectorAll('.product-card.placeholder');
    placeholders.forEach(el => el.remove());
    snapshot.forEach(doc => {
      const data = doc.data();
      productsList.innerHTML += `
        <div class="product-card">
          <div class="product-image"><!-- Imagen futura --></div>
          <div class="product-info">
            <h2>${data.nombre}</h2>
            <p class="price">$${data.precio.toFixed(2)} <span class="regular-price">$${data.precioRegular.toFixed(2)}</span></p>
            <p class="description">${data.descripcion}</p>
            <span class="status ${data.estado}">${data.estado.charAt(0).toUpperCase() + data.estado.slice(1)}</span>
          </div>
        </div>
      `;
    });
  });
}
