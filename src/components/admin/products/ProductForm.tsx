"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "@/lib/validations/product";
import { createProduct, updateProduct } from "@/actions/product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { IProduct } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  Save,
  Loader2,
  ImagePlus,
  DollarSign,
  Package,
  Settings,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Constants
const FISH_TYPES = [
  "Pangas",
  "Tilapia",
  "Rui",
  "Katla",
  "Hilsha",
  "Prawn",
  "Koi",
  "Shing",
  "Magur",
];
const SOURCES = ["River", "Pond", "Sea", "Haor"];
const QUALITY_LEVELS = ["Premium", "Standard", "Export Quality"];
const PACKAGING_TYPES = ["Vaccum Seal", "Airtight Box", "Poly Bag"] as const;

// ✅ Props Interface
interface ProductFormProps {
  initialData?: IProduct | null; // Optional: If present => Edit Mode, else => Add Mode
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine Mode
  const isEditMode = !!initialData;
  const actionLabel = isEditMode ? "Update Product" : "Save Product";
  const toastMessage = isEditMode
    ? "Product updated successfully"
    : "Product created successfully";

  // ✅ Initialize Form with Default Values (Handle Edit vs Create)
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: initialData
      ? {
          // Edit Mode: Map existing data
          title: initialData.title,
          name_en: initialData.name_en,
          slug: initialData.slug,
          category: initialData.category,
          basePrice: initialData.basePrice,
          discountPercentage: initialData.discountPercentage,
          stockKg: initialData.stockKg,
          minOrderKg: initialData.minOrderKg,
          maxOrderKg: initialData.maxOrderKg,
          fishType: initialData.fishType,
          availableSource: initialData.availableSource,
          quality: initialData.quality,
          isWildCaught: initialData.isWildCaught,
          published: initialData.published,
          isFeatured: initialData.isFeatured,
          isHeadAvailable: initialData.isHeadAvailable,
          isFragile: initialData.isFragile,
          // Type casting for Enums (Ensure DB values match Zod Enums)
          packagingType: initialData.packagingType as any,
          cookDifficulty: initialData.cookDifficulty as any,
          texture: initialData.texture as any,
          fatContent: initialData.fatContent as any,
          smellIntensity: initialData.smellIntensity as any,
          mainImage: initialData.mainImage,
          // Convert Arrays -> Comma Separated Strings
          cuttingSizes: initialData.cuttingSizes?.join(", ") || "",
          headCutOptions: initialData.headCutOptions?.join(", ") || "",
          description: initialData.description || "",
          shortDescription: initialData.shortDescription || "",
        }
      : {
          // Create Mode: Empty defaults
          title: "",
          name_en: "",
          slug: "",
          category: "River Fish",
          basePrice: 0,
          discountPercentage: 0,
          stockKg: 0,
          minOrderKg: 1,
          maxOrderKg: 10,
          fishType: "",
          availableSource: "",
          quality: "Premium",
          isWildCaught: false,
          published: true,
          isFeatured: false,
          isHeadAvailable: true,
          isFragile: false,
          packagingType: "Poly Bag",
          cookDifficulty: "সহজ",
          texture: "নরম",
          fatContent: "মাঝারি",
          smellIntensity: "সাধারণ গন্ধ",
          mainImage: "",
          cuttingSizes: "",
          cuttingStyles: "",
          headCutOptions: "",
          fishSize: "",
          description: "",
          shortDescription: "",
        },
  });

  // ✅ Unified Submit Handler
  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);
    try {
      let result;

      if (isEditMode && initialData) {
        // Update Action
        result = await updateProduct(initialData.productId, data);
      } else {
        // Create Action
        result = await createProduct(data);
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/dashboard/products");
        router.refresh();
      } else {
        if (result.errors) {
          Object.keys(result.errors).forEach((key) => {
            const fieldKey = key as keyof ProductFormValues;
            // @ts-ignore
            const message = result.errors[fieldKey]?.[0];
            if (message) form.setError(fieldKey, { type: "server", message });
          });
        }
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const generateSlug = (value: string) => {
    // Only generate slug if creating new product or slug field is empty
    if (!isEditMode || !form.getValues("slug")) {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  };

  // --- STYLES ---
  const inputStyle =
    "bg-background border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 h-11";
  const selectTriggerStyle = "bg-background border-2 border-border/60 h-11";
  const selectContentStyle =
    "bg-popover border border-border shadow-xl z-50 max-h-[300px]";
  const cardStyle =
    "bg-card/50 backdrop-blur-xl border border-border/60 shadow-sm rounded-xl overflow-hidden";
  const labelStyle = "text-sm font-bold mb-1.5 block text-foreground/90";
  const groupStyle =
    "bg-accent/20 p-5 rounded-lg border border-border/40 space-y-4";
  const checkboxStyle =
    "h-5 w-5 border-2 border-slate-400 bg-white data-[state=checked]:bg-primary data-[state=checked]:border-primary";

  return (
    <div className="max-w-6xl mx-auto pb-32 space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-40 bg-background/95 backdrop-blur-md py-3 border-b border-border/40 -mx-4 px-4 sm:mx-0 sm:px-0 sm:static sm:bg-transparent sm:border-0">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="rounded-full h-9 w-9"
          >
            <Link href="/dashboard/products">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isEditMode ? "Edit Product" : "Add Product"}
          </h2>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
          className="h-9 sm:h-10 px-4 sm:px-6 font-bold shadow-md rounded-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> {actionLabel}
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-6 lg:grid-cols-3"
        >
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className={cardStyle}>
              <CardHeader className="border-b border-border/40 pb-3 bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-5">
                <div className={groupStyle}>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>
                          Product Title (Bangla) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. তাজা রুই মাছ"
                            {...field}
                            className={inputStyle}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyle}>
                            English Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Fresh Rui"
                              {...field}
                              className={inputStyle}
                              onChange={(e) => {
                                field.onChange(e);
                                generateSlug(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyle}>Slug</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="fresh-rui"
                              {...field}
                              className={inputStyle}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyle}>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Details..."
                          className={cn(
                            inputStyle,
                            "min-h-[120px] pt-3 h-auto"
                          )}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card className={cardStyle}>
              <CardHeader className="border-b border-border/40 pb-3 bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Pricing & Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-5">
                <div className={groupStyle}>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="basePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyle}>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className={inputStyle}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discountPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyle}>
                            Discount (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className={inputStyle}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="stockKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className={inputStyle}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minOrderKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>Min Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className={inputStyle}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxOrderKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>Max Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className={inputStyle}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Attributes */}
            <Card className={cardStyle}>
              <CardHeader className="border-b border-border/40 pb-3 bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Package className="h-5 w-5 text-primary" />
                  Attributes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fishType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyle}>Fish Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={selectTriggerStyle}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={selectContentStyle}>
                          {FISH_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availableSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyle}>Source</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={selectTriggerStyle}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={selectContentStyle}>
                          {SOURCES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyle}>Quality</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={selectTriggerStyle}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={selectContentStyle}>
                          {QUALITY_LEVELS.map((q) => (
                            <SelectItem key={q} value={q}>
                              {q}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="packagingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyle}>Packaging</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={selectTriggerStyle}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={selectContentStyle}>
                          {PACKAGING_TYPES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="space-y-6">
            {/* Status */}
            <Card className={cardStyle}>
              <CardHeader className="border-b px-4 py-3 bg-muted/30">
                <CardTitle className="text-base sm:text-lg">
                  Visibility
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border bg-card p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Published</FormLabel>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={checkboxStyle}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border bg-card p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Featured</FormLabel>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={checkboxStyle}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isWildCaught"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border bg-card p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Wild Caught</FormLabel>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={checkboxStyle}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Media */}
            <Card className={cardStyle}>
              <CardHeader className="border-b px-4 py-3 bg-muted/30">
                <CardTitle className="text-base sm:text-lg">Image</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <FormField
                  control={form.control}
                  name="mainImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyle}>Image URL *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          {...field}
                          className={inputStyle}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="aspect-video w-full rounded-md border border-dashed flex items-center justify-center bg-muted/50 relative overflow-hidden">
                  {form.watch("mainImage") ? (
                    <Image
                      src={form.watch("mainImage")}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ImagePlus className="h-8 w-8 mb-1 opacity-50" />
                      <span className="text-xs">Preview</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card className={cardStyle}>
              <CardHeader className="border-b px-4 py-3 bg-muted/30">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Settings className="h-4 w-4 text-primary" />
                  Options
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <FormField
                  control={form.control}
                  name="cuttingSizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyle}>
                        Cutting Sizes
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Small, Medium"
                          {...field}
                          value={field.value || ""}
                          className={inputStyle}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Comma separated
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headCutOptions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyle}>Head Options</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="2, 4, 6"
                          {...field}
                          value={field.value || ""}
                          className={inputStyle}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Numbers only
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
