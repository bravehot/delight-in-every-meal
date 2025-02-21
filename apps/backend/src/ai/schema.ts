import { z } from 'zod';

export const FoodItemSchema = z.object({
  name: z.string().describe('食物的中文名称'),
  weight: z.union([z.string(), z.number()]).describe('食物的重量(克)'),
  calories: z.union([z.string(), z.number()]).describe('食物的卡路里含量'),
});

export const FoodAnalysisSchema = z.object({
  foods: z.array(FoodItemSchema).describe('食物列表'),
});

export type FoodAnalysis = z.infer<typeof FoodAnalysisSchema>;
