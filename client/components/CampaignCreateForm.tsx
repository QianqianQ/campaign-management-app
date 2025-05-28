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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Campaign</h2>
          <p className="text-muted-foreground">Set up a new advertising campaign with payouts</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Campaign Information
            </CardTitle>
            <CardDescription>Enter the basic details for your campaign</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* Title  */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter campaign title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            {/* Landing Page URL */}
            <div className="space-y-2">
              <Label htmlFor="landingPageUrl">
                Landing Page URL <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Link className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="landingPageUrl"
                  {...register("landing_page_url")}
                  placeholder="https://example.com/landing"
                  className={`pl-9 ${errors.landing_page_url ? "border-red-500" : ""}`}
                />
              </div>
              {errors.landing_page_url && <p className="text-sm text-red-500">{errors.landing_page_url.message}</p>}
            </div>

            {/* Start Campaign option */}
            <div className="flex items-center space-x-2">
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
              <Label htmlFor="isRunning" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Start Campaign once created (You could start it later)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Payouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payouts
            </CardTitle>
            <CardDescription>
              Set payout amounts for different countries. At least one payout is required.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* No payouts added yet */}
            {fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No payouts added yet</p>
                <p className="text-sm">{"Click \"Add Payout\" to get started"}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((payout, index) => (
                  <div key={payout.id} className="flex items-end gap-3 p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`country-${payout.id}`}>Country</Label>
                      <Controller
                        name={`payouts.${index}.country`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value === null ? 'Worldwide' : field.value || 'Worldwide'}
                            onValueChange={(value) => field.onChange(value === 'Worldwide' ? null : value)}
                          >
                            <SelectTrigger className={errors.payouts?.[index]?.country ? "border-red-500" : ""}>
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
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`amount-${payout.id}`}>Amount (USD)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input
                          id={`amount-${payout.id}`}
                          type="number"
                          step="0.01"
                          min="0"
                          {...register(`payouts.${index}.amount`, { valueAsNumber: true })}
                          placeholder="0.00"
                          className={`pl-7 ${errors.payouts?.[index]?.amount ? "border-red-500" : ""}`}
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
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button type="button" variant="outline" onClick={addPayout} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Payout
            </Button>

            {errors.payouts?.message && <p className="text-sm text-red-500">{errors.payouts.message}</p>}
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              {fields.length} payout{fields.length !== 1 ? "s" : ""} configured
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
