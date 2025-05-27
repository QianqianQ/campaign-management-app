'use client';

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Campaign } from "@/types/campaign";
import { useCampaigns } from "@/hooks/useCampaigns";
import { CampaignFormData, campaignSchema } from "@/schemas/campaignSchema";
import { zodResolver } from "@hookform/resolvers/zod";

interface CampaignCreateFormProps {
  onSubmit: (formData: Partial<Campaign>) => Promise<void>;
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
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<CampaignFormData>(
        {
            resolver: zodResolver(campaignSchema),
            defaultValues: {
                title: '',
                landing_page_url: '',
                is_running: false,
                payouts: [
                    {
                    country: 'Worldwide',
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
            // Transform "Worldwide" to null for backend
            const transformedData = {
                ...data,
                payouts: data.payouts.map(payout => ({
                    ...payout,
                    country: payout.country === 'Worldwide' ? null : payout.country
                }))
            };
            await onSubmit(transformedData as Partial<Campaign>);
            reset();
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-2xl mx-auto space-y-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Campaign</h3>

        <div className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                <input
                    type="text"
                    placeholder="Enter campaign title"
                    {...register("title")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
                <label htmlFor="landing_page_url" className="block text-sm font-medium text-gray-700 mb-1">Landing Page URL</label>
                <input
                    type="text"
                    placeholder="https://example.com"
                    {...register("landing_page_url")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.landing_page_url && <p className="text-red-500 text-sm mt-1">{errors.landing_page_url.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
                <input type="checkbox" {...register("is_running")} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="is_running" className="text-sm font-medium text-gray-700">Start campaign immediately</label>
            </div>
        </div>

        {/* Payouts */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Payouts</label>
                <button
                    type="button"
                    onClick={() => addPayout()}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Add Payout
                </button>
            </div>

            <div className="space-y-3">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
                                <select
                                    {...register(`payouts.${index}.country`)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    {COUNTRIES.map((country) => (
                                        <option key={country.code || 'Worldwide'} value={country.code || 'Worldwide'}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register(`payouts.${index}.amount`)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
                                <select
                                    {...register(`payouts.${index}.currency`)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    {CURRENCIES.map((currency) => (
                                        <option key={currency} value={currency}>{currency}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                    className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="pt-4">
            <button
                type="submit"
                className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
                Create Campaign
            </button>
        </div>
    </form>
  );
}
