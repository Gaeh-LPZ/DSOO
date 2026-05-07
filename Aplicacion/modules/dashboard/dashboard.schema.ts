import { z } from "zod";

export const getTopProductsSchema = z.object({
  // Quitamos .uuid() para que acepte "store-central"
  storeId: z.string().min(1), 
  limit: z.number().optional(),
});

export const getTotalSalesSchema = z.object({
  // Quitamos .uuid() para que acepte "store-central"
  storeId: z.string().min(1), 
  startDate: z.date(),
  endDate: z.date(),
});