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
            const response = await fetch(`/api/products/${prodId}`, { method: 'DELETE' });
            if(response.ok !== true || response.status !== 200) throw new Error("¡No se pudo eliminar el producto!");
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