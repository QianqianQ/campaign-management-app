"use client";
import { useState } from "react";
import { Plus, Trash2, Link, Megaphone, DollarSign, Globe, MapPin } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// TODO: Get countries and currencies from backend
const countries = [
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
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "USD", name: "US Dollar", symbol: "$" },
]

interface CampaignCreateFormProps {
    onSubmit: (formData: Partial<Campaign>) => Promise<void>;
    initialData?: Campaign;
    isEditMode?: boolean;
  }

export default function CampaignForm({ onSubmit, initialData, isEditMode = false }: CampaignCreateFormProps) {
    const router = useRouter();
    // Check if initial data has any countries other than Worldwide
    // TODO: Improve country field representation in the backend and frontend
    const hasSpecificCountries = initialData?.payouts?.some(
      payout => payout.country !== null && payout.country !== "Worldwide") || false;
    const [isWorldwide, setIsWorldwide] = useState(!hasSpecificCountries);

    const {
      register,
      handleSubmit,
      control,
      watch,
      setValue,
      formState: { errors, isSubmitting },
      reset } = useForm<CampaignFormData>(
        {
            resolver: zodResolver(campaignSchema),
            defaultValues: initialData ? {
                title: initialData.title,
                landing_page_url: initialData.landing_page_url,
                is_running: initialData.is_running,
                payouts: initialData.payouts.map(payout => ({
                    // If country is Worldwide, set to Worldwide, otherwise set to the country name
                    country: payout.country === "Worldwide" || payout.country === null ?
                    'Worldwide' :
                    payout.country?.includes('(') ?
                    payout.country.match(/\(([^)]+)\)/)?.[1] || payout.country :
                    payout.country,
                    amount: payout.amount,
                    currency: payout.currency,
                })),
            } : {
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

    // Watch all payouts to get currency values
    const watchedPayouts = watch("payouts");

    // Debug: Log form errors when they change
    // useEffect(() => {
    //   console.log('Form validation errors:', errors);
    //   console.log('Form is submitting:', isSubmitting);
    //   console.log('Current payouts:', watchedPayouts);
    // }, [errors, isSubmitting, watchedPayouts]);

    // Function to get currency symbol
    const getCurrencySymbol = (currencyCode: string) => {
        const currency = currencies.find(c => c.code === currencyCode);
        return currency?.symbol || "$";
    };

    const addPayout = () => {
        append({
            // If worldwide, set country to Worldwide, otherwise set to US
            country: isWorldwide ? 'Worldwide' : 'US',
            amount: 0,
            currency: 'EUR',
        });
    }

    // Handle worldwide toggle
    const handleWorldwideToggle = (checked: boolean) => {
        setIsWorldwide(checked);
        if (checked) {
            // If switching to worldwide, keep only the first payout and set it to worldwide
            while (fields.length > 1) {
                remove(fields.length - 1);
            }
            setValue('payouts.0.country', 'Worldwide');
        } else {
            // If switching to specific countries, set the first payout to a specific country
            setValue('payouts.0.country', 'US');
        }
    };

    // Handle form submission with error validation
    const onFormSubmit = handleSubmit(
        async (data: CampaignFormData) => {
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
        },
        (errors) => {
            // Show toast for root errors
            // console.log('Form validation failed:', errors);

            const errMessage = errors.payouts?.root?.message || errors.payouts?.message ||
            "Please fix the form errors before submitting";

            toast.error(errMessage, {
                position: "top-right",
                duration: 5000,
                style: {
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                },
                className: 'border-l-4 border-l-red-500',
            });
        }
    );

  return (
      <form onSubmit={onFormSubmit} className="space-y-8 h-full">
        <Card className="shadow-lg">
          {/* Form title */}
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Megaphone className="h-6 w-6" />
              {isEditMode ? 'Edit Campaign' : 'Campaign Information'}
            </CardTitle>
            <CardDescription className="text-base">{isEditMode ? 'Update campaign details' : 'Enter the basic details for your campaign'}</CardDescription>
          </CardHeader>

          {/* Form content */}
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

            {/* Worldwide/Specific Countries Toggle */}
            {/* <div className="flex items-center space-x-3 py-4 border-t">
              <Switch
                id="isWorldwide"
                checked={isWorldwide}
                onCheckedChange={handleWorldwideToggle}
              />
              <Label htmlFor="isWorldwide" className="text-base font-medium">
                {isWorldwide ? "Worldwide" : "Country-Specific"}
              </Label>
              <span className="text-sm text-muted-foreground">
                {isWorldwide ? "One payout applies globally" : "Specific payouts for countries"}
              </span>
            </div> */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="isWorldwide" className="text-sm font-medium">
                    Worldwide Campaign
                  </Label>
                  <p className="text-xs text-muted-foreground">Target all countries with the same payout</p>
                </div>
              </div>
              <Switch id="isWorldwide" checked={isWorldwide} onCheckedChange={handleWorldwideToggle} />
            </div>
            {isWorldwide && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>This campaign will be available worldwide</span>
              </div>
            )}
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

                    {/* Country Field */}
                    <div className="flex-1">
                      <Label className="text-sm font-medium mb-2 block">
                        {isWorldwide ? "Target" : "Country"}
                      </Label>
                      {isWorldwide ? (
                        <div className="h-10 px-3 border rounded-md bg-gray-50 flex items-center text-sm text-muted-foreground">
                          <Globe className="h-4 w-4 mr-2" />
                          Worldwide
                        </div>
                      ) : (
                        <Controller
                          name={`payouts.${index}.country`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value || 'US'}
                              onValueChange={(value) => field.onChange(value)}
                            >
                              <SelectTrigger className={`w-full h-10 ${errors.payouts?.[index]?.country ? "border-red-500" : ""}`}>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      )}
                      {errors.payouts?.[index]?.country && (
                        <p className="text-xs text-red-500 mt-1">{errors.payouts[index]?.country?.message}</p>
                      )}
                    </div>

                    {/* Currency Field */}
                    <div className="flex-1">
                      <Label className="text-sm font-medium mb-2 block">Currency</Label>
                      <Controller
                        name={`payouts.${index}.currency`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className={`w-full h-10 ${errors.payouts?.[index]?.currency ? "border-red-500" : ""}`}>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                  {currency.symbol} {currency.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.payouts?.[index]?.currency && (
                        <p className="text-xs text-red-500 mt-1">{errors.payouts[index]?.currency?.message}</p>
                      )}
                    </div>

                    {/* Amount Field */}
                    <div className="flex-1">
                      <Label className="text-sm font-medium mb-2 block">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">
                          {getCurrencySymbol(watchedPayouts[index]?.currency || '')}
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register(`payouts.${index}.amount`, { valueAsNumber: true })}
                          placeholder="0.00"
                          className={`pl-8 h-10 ${errors.payouts?.[index]?.amount ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.payouts?.[index]?.amount && (
                        <p className="text-xs text-red-500 mt-1">{errors.payouts[index]?.amount?.message}</p>
                      )}
                    </div>

                    {/* Delete Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={isWorldwide || fields.length === 1}
                      className="text-red-500 hover:text-red-700 h-10 w-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Payout button - hidden in worldwide mode */}
            {!isWorldwide && (
              <Button type="button" variant="outline" onClick={addPayout} className="w-full h-12 text-base">
                <Plus className="h-5 w-5 mr-2" />
                Add Payout
              </Button>
            )}
          </CardContent>

          {/* Form footer */}
          <CardFooter className="flex justify-between border-t px-8 py-6">
            <div className="text-base text-muted-foreground">
              {fields.length} payout{fields.length !== 1 ? "s" : ""} added
              {isWorldwide && <span className="ml-2 text-blue-600">(Worldwide)</span>}
            </div>
            <div className="flex gap-3">
              {/* Cancel button */}
              <Button type="button" variant="outline" className="h-12 px-6 text-base" onClick={() => router.push('/')}>
                Cancel
              </Button>
              {/* Submit button */}
              <Button type="submit" disabled={isSubmitting} className="h-12 px-8 text-base">
                {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Campaign" : "Create Campaign")}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
  )
}
