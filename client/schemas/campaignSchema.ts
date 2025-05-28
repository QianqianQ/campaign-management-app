import { z } from "zod";

const CampaignPayoutSchema = z.object({
    country: z.string().optional().nullable(),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    currency: z.string().min(1, "Currency is required"),
});

export const campaignSchema = z.object({
    title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .trim(),
    landing_page_url: z
    .string()
    .min(1, "Landing page URL is required")
    .url("Please enter a valid URL (e.g., https://example.com)")
    .trim(),
    is_running: z.boolean().optional(),
    payouts: z
    .array(CampaignPayoutSchema)
    .min(1, "At least one payout is required")
    .refine((payouts) => {
        const countries = payouts.map(p => p.country || 'worldwide');
        return new Set(countries).size === countries.length;
    }, {
        message: "Duplicated countries are not allowed",
    }),
});

export const campaignPayoutSchema = z.array(CampaignPayoutSchema);
export type CampaignFormData = z.infer<typeof campaignSchema>;
