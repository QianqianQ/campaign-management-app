"use client";

import type React from "react";
import { Plus, Trash2, Globe, Link, Megaphone, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { campaignSchema, CampaignFormData } from "@/schemas/campaignSchema";
import { Campaign } from "@/types/campaign";

const countries = [
  { code: null, name: "Worldwide" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "AU", name: "Australia" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
  { code: "RU", name: "Russia" },
  { code: "KR", name: "South Korea" },
]

const currencies = [
  { code: "EUR", name: "Euro" },
  { code: "USD", name: "US Dollar" },
]

interface CampaignCreateFormProps {
    onSubmit: (formData: Partial<Campaign>) => Promise<void>;
  //   onCancel: () => void;
  }

export default function CampaignCreateForm({ onSubmit }: CampaignCreateFormProps) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<CampaignFormData>(
        {
            resolver: zodResolver(campaignSchema),
            defaultValues: {
                title: '',
                landing_page_url: '',
                is_running: true,
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
            country: 'Worldwide',
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
    <div className="container mx-auto p-6 space-y-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 h-full">
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Megaphone className="h-6 w-6" />
              Campaign Information
            </CardTitle>
            <CardDescription className="text-base">Enter the basic details for your campaign</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-8">

            {/* Title  */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter campaign title"
                className={`h-12 text-base ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            {/* Landing Page URL */}
            <div className="space-y-3">
              <Label htmlFor="landingPageUrl" className="text-base font-medium">
                Landing Page URL <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Link className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="landingPageUrl"
                  {...register("landing_page_url")}
                  placeholder="https://example.com/landing"
                  className={`pl-12 h-12 text-base ${errors.landing_page_url ? "border-red-500" : ""}`}
                />
              </div>
              {errors.landing_page_url && <p className="text-sm text-red-500">{errors.landing_page_url.message}</p>}
            </div>

            {/* Start Campaign option */}
            <div className="flex items-center space-x-3 py-2">
              <Controller
                name="is_running"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="isRunning"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="isRunning" className="flex items-center gap-3 text-base font-medium">
                Start Campaign immediately
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Payouts */}
        <Card className="shadow-lg flex-1">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <DollarSign className="h-6 w-6" />
              Payouts
            </CardTitle>
            <CardDescription className="text-base">
              Set payout amounts for different countries. At least one payout is required.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-8 flex-1">
            {/* No payouts added yet */}
            {fields.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-16 w-16 mx-auto mb-6 opacity-50" />
                <p className="text-lg">No payouts added yet</p>
                <p className="text-base">{"Click \"Add Payout\" to get started"}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((payout, index) => (
                  <div key={payout.id} className="flex items-end gap-4 p-6 border rounded-lg bg-white shadow-sm">

                    <div className="flex-1 space-y-3">
                      <Label htmlFor={`country-${payout.id}`} className="text-base font-medium">Country</Label>
                      <Controller
                        name={`payouts.${index}.country`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value === null ? 'Worldwide' : field.value || 'Worldwide'}
                            onValueChange={(value) => field.onChange(value === 'Worldwide' ? null : value)}
                          >
                            <SelectTrigger className={`w-full h-12 text-base ${errors.payouts?.[index]?.country ? "border-red-500" : ""}`}>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country.code || 'Worldwide'} value={country.code || 'Worldwide'}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.payouts?.[index]?.country && (
                        <p className="text-sm text-red-500">{errors.payouts[index]?.country?.message}</p>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <Label htmlFor={`currency-${payout.id}`} className="text-base font-medium">Currency</Label>
                      <Controller
                        name={`payouts.${index}.currency`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className={`w-full h-12 text-base ${errors.payouts?.[index]?.currency ? "border-red-500" : ""}`}>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                  {currency.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.payouts?.[index]?.currency && (
                        <p className="text-sm text-red-500">{errors.payouts[index]?.currency?.message}</p>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <Label htmlFor={`amount-${payout.id}`} className="text-base font-medium">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-muted-foreground text-base">$</span>
                        <Input
                          id={`amount-${payout.id}`}
                          type="number"
                          step="0.01"
                          min="0"
                          {...register(`payouts.${index}.amount`, { valueAsNumber: true })}
                          placeholder="0.00"
                          className={`pl-8 h-12 text-base ${errors.payouts?.[index]?.amount ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.payouts?.[index]?.amount && (
                        <p className="text-sm text-red-500">{errors.payouts[index]?.amount?.message}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 h-12 w-12"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button type="button" variant="outline" onClick={addPayout} className="w-full h-12 text-base">
              <Plus className="h-5 w-5 mr-2" />
              Add Payout
            </Button>

            {errors.payouts?.message && <p className="text-sm text-red-500">{errors.payouts.message}</p>}
          </CardContent>
          <CardFooter className="flex justify-between border-t px-8 py-6">
            <div className="text-base text-muted-foreground">
              {fields.length} payout{fields.length !== 1 ? "s" : ""} added
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="h-12 px-6 text-base">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="h-12 px-8 text-base">
                {isSubmitting ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
