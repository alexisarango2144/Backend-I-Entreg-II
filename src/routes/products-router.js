import { Router } from "express";
import { productsManager } from "../managers/ProductManager.js";

const router = Router();


/**
 * GET Product by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productsManager.getProductById(id);
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * POST Crear producto
 */
router.post("/", async (req, res) => {
  try {
    const newProduct = await productsManager.addProduct(req.body);
    res.json(newProduct);
  } catch (error) {
    res.status(500).send(error.message + " " + req.body);
  }
});

/**
 * DELETE Eliminar producto
 */
router.delete("/:id", async (req, res) => {
  try {
    const {id} = req.params;
    
    /* Hard Delete */
    const response = await productsManager.hardDeleteProduct(id); 
    res.json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;