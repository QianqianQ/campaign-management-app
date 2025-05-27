'use client';

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Campaign } from "@/types/campaign";
import { useCampaigns } from "@/hooks/useCampaigns";
import { CampaignFormData, campaignSchema } from "@/schemas/campaignSchema";
import { zodResolver } from "@hookform/resolvers/zod";

interface CampaignCreateFormProps {
  onSubmit: (formData: Campaign) => Promise<void>;
  onCancel: () => void;
}

// TODO: Move to a constants file, and use a library for the countries and currencies
const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
const COUNTRIES = [
  { code: null, name: 'Worldwide' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
];

export default function CampaignCreateForm({ onSubmit, onCancel }: CampaignCreateFormProps) {
    const { createCampaign } = useCampaigns();
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<CampaignFormData>(
        {
            resolver: zodResolver(campaignSchema),
            defaultValues: {
                title: '',
                landing_page_url: '',
                is_running: false,
                payouts: [
                    {
                    country: 'worldwide',
                    amount: 0,
                    currency: 'EUR',
                    }
                ],
            }
        }
    );
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "payouts"
    });

    const addPayout = () => {
        append({
            country: '',
            amount: 0,
            currency: 'EUR',
        });
    }

    const handleFormSubmit = async (data: CampaignFormData) => {
        console.log(data);
        try {
            await onSubmit(data as Campaign);
            reset();
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-4 border rounded-lg bg-gray-100 mb-6">
        <h3>Create Campaign</h3>
        <div>
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input type="text" placeholder="Title" {...register("title")} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
            <label htmlFor="landing_page_url">Landing Page URL</label>
            <input type="text" placeholder="Landing Page URL" {...register("landing_page_url")} />
            {errors.landing_page_url && <p className="text-red-500 text-sm">{errors.landing_page_url.message}</p>}
        </div>
        <div>
            <label htmlFor="is_running" className="block text-sm font-medium">Start campaign</label>
            <input type="checkbox" {...register("is_running")} />
        </div>
        {/* Payouts */}
        <div>
            <label htmlFor="payouts" className="block text-sm font-medium">Payouts</label>
            <button type="button" onClick={() => addPayout()} className="text-sm text-blue-600 hover:underline">Add Payout</button>
            {fields.map((field, index) => (
                <div key={field.id}>
                    <select {...register(`payouts.${index}.country`)}>
                        {COUNTRIES.map((country) => (
                            <option key={country.code || 'worldwide'} value={country.code || 'worldwide'}>{country.name}</option>
                        ))}
                    </select>
                    <input type="number" step="0.01" placeholder="Amount" {...register(`payouts.${index}.amount`)} className="w-1/2 px-3 py-2 border rounded" />
                    <select {...register(`payouts.${index}.currency`)}>
                        {CURRENCIES.map((currency) => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                    <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700" disabled={fields.length === 1}>Remove</button>
                </div>
            ))}
        </div>
        <button type="submit">Create Campaign</button>
    </form>
  );
}
