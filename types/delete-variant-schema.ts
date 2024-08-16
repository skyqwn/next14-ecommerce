import { z } from "zod";

export const DeleteVariantSchema = z.object({
  id: z.number(),
});

export type zDeleteVairantSchema = z.infer<typeof DeleteVariantSchema>;
