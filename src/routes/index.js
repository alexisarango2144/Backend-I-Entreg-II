import { Router } from "express";
import { productsManager } from "../managers/ProductManager.js";

const router = Router();

router.get('/', (req, res)=>{
  const products = productsManager.getProducts();
  res.render('realTimeProducts', {products});
})

export default router;