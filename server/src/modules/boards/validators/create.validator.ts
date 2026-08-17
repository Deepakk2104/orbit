import { z } from "zod";

export const createBoardSchema = z.object({});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;