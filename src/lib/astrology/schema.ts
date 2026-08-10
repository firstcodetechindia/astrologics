import { z } from "zod";

export const kundliRequestSchema = z.object({
  name: z.string().min(2).max(80),
  gender: z.enum(["male", "female", "other"]).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  place: z.string().min(2).max(100),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
  timezoneOffsetMinutes: z.number().min(-720).max(840).optional(),
});

export type KundliRequest = z.infer<typeof kundliRequestSchema>;
