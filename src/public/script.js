const socket = io() || null;

const form = document.getElementById('createProductForm');
let productsContainer = document.getElementById('productsContainer');

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const prodData = new FormData(e.target);

  const product = {...Object.fromEntries(prodData.entries())};
  console.log(product);
  product.thumbnails = [product.thumbnail];
  console.log(product);

  socket.emit('newProduct', {product});
  e.target.reset();
})

function addDeleteEvents(){
  const deleteBtns = document.getElementsByClassName("delete-button");

  Array.from(deleteBtns).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const prodId = e.target.dataset.id;
        
      Swal.fire({
          title: "¿Desea eliminar el producto?",
          text: "¡Esta acción no se puede deshacer!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar!",
          cancelButtonText: "No, cancelar!",
          reverseButtons: true,
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger mx-2",
          },
          buttonsStyling: false,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              socket.emit('deleteProduct', {prodId});
              Swal.fire({
                title: "¡Eliminado!",
                text: "El producto se ha eliminado con éxito, actualiza la página para ver la información actualizada.",
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success",
                  cancelButton: "btn btn-danger",
                },
                buttonsStyling: false,
              });
            } catch (error) {
              Swal.fire({
                title: "¡Ooops!",
                text: "Ocurrió un error al eliminar el producto.",
                icon: "error",
                customClass: {
                  confirmButton: "btn btn-success",
                  cancelButton: "btn btn-danger",
                },
                buttonsStyling: false,
              });
            }
          } else if (
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire({
              title: "Cancelado",
              text: "Cancelaste la eliminación del producto.",
              icon: "info",
              customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
              },
              buttonsStyling: false,
            });
          }
        });
    });
  });
}

socket.on('products', (products)=>{
  productsContainer.innerHTML = '';
  console.log(products);

  const productsRender = products.map((prod)=>{
    const thumbnails = prod.thumbnails.map((thumb)=>{
      return `<div class="carousel-item active">
        <img src="${thumb}" class="d-block w-100" alt="${prod.title}" />
      </div>`
    })
    return `
      <div id="card-${prod.id}" class="col-3 p-0">
        <div class="card mb-4" style="width: 18rem;">
          <div id="prod-${prod.id}" class="carousel slide">
            <div class="carousel-inner">
              ${thumbnails.join(' ')}
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#prod-${prod.id}"
              data-bs-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#prod-${prod.id}"
              data-bs-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
          <div class="card-body">
            <h5 class="card-title">${prod.title}</h5>
            <p class="card-text">${prod.description}</p>
            <button
              class="btn btn-danger delete-button"
              data-id="${prod.id}"
            ><i class="lni lnib-trash-3"></i> Eliminar</button>
          </div>
        </div>
      </div>
    `
  });

  productsContainer.innerHTML = productsRender;
  addDeleteEvents();
})
