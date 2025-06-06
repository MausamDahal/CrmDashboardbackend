import { Router } from "express";
import { CustomerController } from "../controllers/customerController";

export const customerRoutes = Router();

customerRoutes.post("/", CustomerController.saveCustomer);
customerRoutes.get("/", CustomerController.getCustomers);
customerRoutes.get("/lookup", CustomerController.getCustomerByIdOrEmail);
