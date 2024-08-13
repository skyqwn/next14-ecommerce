import { z } from "zod";

export const DeleteProductSchema = z.object({
  id: z.number(),
});

export type zdeleteProductSchema = z.infer<typeof DeleteProductSchema>;
