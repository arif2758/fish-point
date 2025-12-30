// src/app/(main)/checkout/CheckoutPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/priceUtils";
import { format } from "date-fns";
import {
  Smartphone,
  ArrowLeft,
  Copy,
  Check,
  Banknote,
  ShieldCheck,
  Calendar as CalendarIcon,
  Sun,
  CloudSun,
  Moon,
  User,
  MapPin,
  Truck,
  Loader2,
  CornerRightDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DELIVERY_CHARGE = 30;

// Payment Config
const PAYMENT_ACCOUNTS = {
  bkash: {
    name: "bKash",
    number: "01540505122",
    type: "Personal",
    iconColor: "text-[#D12053]",
    logo: "/payment-method-logo/bkash.svg",
  },
  nagad: {
    name: "Nagad",
    number: "01540505122",
    type: "Personal",
    iconColor: "text-[#EF4136]",
    logo: "/payment-method-logo/nagad.svg",
  },
  rocket: {
    name: "Rocket",
    number: "01540505122",
    type: "Personal",
    iconColor: "text-[#8C3494]",
    logo: "/payment-method-logo/rocket.png",
  },
};

const DHAKA_AREAS = [
  "Mirpur",
  "Dhanmondi",
  "Gulshan",
  "Banani",
  "Uttara",
  "Mohammadpur",
  "Bashundhara",
  "Badda",
  "Rampura",
  "Malibagh",
  "Motijheel",
  "Shahbag",
  "Tejgaon",
  "Farmgate",
  "Kawran Bazar",
  "Paltan",
  "Shyamoli",
  "Adabor",
  "Mohakhali",
  "Banasree",
];

const TIME_SLOTS = [
  { id: "morning", label: "সকাল (৮-১২)", icon: Sun },
  { id: "afternoon", label: "দুপুর (১২-৫)", icon: CloudSun },
  { id: "evening", label: "সন্ধ্যা (৫-৯)", icon: Moon },
];

type PaymentTab = "mobile" | "cod";
type MobileProvider = "bkash" | "nagad" | "rocket";

export default function CheckoutPageClient() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // State
  const [paymentTab, setPaymentTab] = useState<PaymentTab>("cod");
  const [mobileProvider, setMobileProvider] = useState<MobileProvider>("bkash");

  // Date State
  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    address: "",
    timeSlot: "morning",
    notes: "",
    senderNumber: "",
    trxId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/products");
    }
  }, [cart.items, router]);

  const totalAmount = cart.total + DELIVERY_CHARGE;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      alert("আপনার ব্রাউজার লোকেশন সাপোর্ট করে না");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();

          if (data.address) {
            const road = data.address.road || data.address.pedestrian || "";
            const houseNumber = data.address.house_number
              ? `${data.address.house_number}, `
              : "";
            const suburb =
              data.address.suburb ||
              data.address.neighbourhood ||
              data.address.residential ||
              "";
            const city =
              data.address.city ||
              data.address.city_district ||
              data.address.state_district ||
              "";

            // Build more precise address string
            const fullAddress = `${houseNumber}${road}${
              road ? ", " : ""
            }${suburb}`
              .trim()
              .replace(/^, |, $/g, "");

            handleInputChange("address", fullAddress);

            // Try to match area with DHAKA_AREAS
            const detectedArea = DHAKA_AREAS.find(
              (area) =>
                suburb.toLowerCase().includes(area.toLowerCase()) ||
                city.toLowerCase().includes(area.toLowerCase()) ||
                data.display_name.toLowerCase().includes(area.toLowerCase())
            );

            if (detectedArea) {
              handleInputChange("area", detectedArea);
            }
          }
        } catch (error) {
          console.error("Geocoding error:", error);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsGettingLocation(false);
      }
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "নাম আবশ্যক";
    if (!formData.phone.trim()) {
      newErrors.phone = "ফোন নম্বর আবশ্যক";
    } else if (!/^01[3-9]\d{8}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "সঠিক নম্বর দিন";
    }
    if (!formData.area) newErrors.area = "এলাকা সিলেক্ট করুন";
    if (!formData.address.trim()) newErrors.address = "ঠিকানা আবশ্যক";
    if (!date) newErrors.date = "তারিখ সিলেক্ট করুন";

    if (paymentTab === "mobile") {
      if (!formData.senderNumber.trim())
        newErrors.senderNumber = "সেন্ডার নম্বর আবশ্যক";
      if (!formData.trxId.trim()) newErrors.trxId = "TrxID আবশ্যক";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const finalPaymentMethod = paymentTab === "cod" ? "cod" : mobileProvider;

      const order = {
        orderId: `ORD-${Date.now()}`,
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: `${formData.address}, ${formData.area}`,
        },
        delivery: {
          date: date,
          timeSlot: formData.timeSlot,
          notes: formData.notes,
        },
        payment: {
          method: finalPaymentMethod,
          status: paymentTab === "cod" ? "pending" : "verification_needed",
          details:
            paymentTab === "mobile"
              ? {
                  senderNumber: formData.senderNumber,
                  trxId: formData.trxId,
                  targetNumber: PAYMENT_ACCOUNTS[mobileProvider].number,
                }
              : null,
        },
        items: cart.items,
        total: totalAmount,
        createdAt: new Date(),
      };

      console.log("Order placed:", order);
      clearCart();
      alert(`অর্ডার সফল হয়েছে! ID: ${order.orderId}`);
      router.push("/");
    } catch (error) {
      console.error("Order failed:", error);
      alert("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-6 pb-28 lg:pb-8">
      {/* Back Link */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="size-4" />
        কার্টে ফিরে যান
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Form Sections */}
        <section className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Billing & Shipping - Liquid Glass */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/10 border border-primary/30">
                  <User className="size-3.5 text-primary" />
                </div>
                <h2 className="text-lg font-bold">বিলিং এবং শিপিং</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-5 shadow-sm">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label
                    htmlFor="name"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    পুরো নাম <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={cn(
                      "h-10 text-sm bg-background/50 backdrop-blur-sm",
                      errors.name && "border-destructive"
                    )}
                    placeholder="আপনার নাম লিখুন"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    ফোন নম্বর <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={cn(
                      "h-10 text-sm bg-background/50 backdrop-blur-sm",
                      errors.phone && "border-destructive"
                    )}
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="area"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    এলাকা <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.area}
                    onValueChange={(value) => handleInputChange("area", value)}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-10 text-sm bg-background/50 backdrop-blur-sm",
                        errors.area && "border-destructive"
                      )}
                    >
                      <SelectValue placeholder="সিলেক্ট করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {DHAKA_AREAS.map((area) => (
                        <SelectItem key={area} value={area} className="text-sm">
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="address"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      বিস্তারিত ঠিকানা{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleGetLocation}
                      disabled={isGettingLocation}
                      className={cn(
                        "h-8 px-3 text-xs gap-1.5 font-bold transition-all rounded-full",
                        isGettingLocation
                          ? "bg-primary/10 text-primary animate-pulse"
                          : formData.address
                          ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                          : "text-primary hover:text-primary hover:bg-primary/10"
                      )}
                    >
                      {isGettingLocation ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          লোকেশন খুঁজছি...
                        </>
                      ) : formData.address ? (
                        <>
                          <Check className="size-3.5" />
                          লোকেশন পাওয়া গেছে
                        </>
                      ) : (
                        <>
                          <MapPin className="size-3.5" />
                          আমার লোকেশন দিন
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={cn(
                      "min-h-20 text-sm resize-none bg-background/50 backdrop-blur-sm",
                      errors.address && "border-destructive"
                    )}
                    placeholder="বাড়ি নং, রোড নং, ফ্ল্যাট নং..."
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Options - Liquid Glass */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/10 border border-primary/30">
                  <Truck className="size-3.5 text-primary" />
                </div>
                <h2 className="text-lg font-bold">ডেলিভারি সময়</h2>
              </div>

              <div className="grid gap-5 rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-5 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Delivery Date */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      তারিখ <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-10 pl-3 text-left font-normal text-sm bg-background/50 backdrop-blur-sm",
                            !date && "text-muted-foreground",
                            errors.date && "border-destructive"
                          )}
                        >
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>তারিখ সিলেক্ট করুন</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="notes"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      স্পেশাল নোট (অপশনাল)
                    </Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      className="h-10 text-sm bg-background/50 backdrop-blur-sm"
                      placeholder="যেমন: মাছ ছোট পিস করবেন..."
                    />
                  </div>
                </div>

                {/* Time Slots - Compact */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    সময় <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TIME_SLOTS.map((slot) => {
                      const Icon = slot.icon;
                      const isSelected = formData.timeSlot === slot.id;
                      return (
                        <div
                          key={slot.id}
                          onClick={() => handleInputChange("timeSlot", slot.id)}
                          className={cn(
                            "cursor-pointer flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-all duration-300",
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                              : "border-border/40 hover:border-border hover:bg-muted/30"
                          )}
                        >
                          <Icon
                            className={cn(
                              "size-4 sm:size-5 mb-1",
                              isSelected
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <span
                            className={cn(
                              "font-bold text-[10px] sm:text-xs",
                              isSelected
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          >
                            {slot.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method - Liquid Glass */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/10 border border-primary/30">
                  <Banknote className="size-3.5 text-primary" />
                </div>
                <h2 className="text-lg font-bold">পেমেন্ট মেথড</h2>
              </div>

              <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-5 shadow-sm space-y-5">
                {/* Main Tabs - Compact */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentTab("cod")}
                    className={cn(
                      "flex-1 cursor-pointer flex items-center gap-3 p-4 sm:p-3.5 rounded-xl border transition-all duration-300",
                      paymentTab === "cod"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                        : "border-border/40 hover:border-border hover:bg-muted/30"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center size-5 rounded-full border transition-colors",
                        paymentTab === "cod"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {paymentTab === "cod" && (
                        <div className="size-2 rounded-full bg-current" />
                      )}
                    </div>
                    <Banknote
                      className={cn(
                        "size-5",
                        paymentTab === "cod"
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "font-bold text-sm",
                        paymentTab === "cod"
                          ? "text-primary"
                          : "text-foreground"
                      )}
                    >
                      ক্যাশ অন ডেলিভারি(COD)
                    </span>
                  </div>

                  {/* Mobile Payment */}
                  <div
                    onClick={() => setPaymentTab("mobile")}
                    className={cn(
                      "flex-1 cursor-pointer flex items-center gap-3 p-4 sm:p-3.5 rounded-xl border transition-all duration-300",
                      paymentTab === "mobile"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                        : "border-border/40 hover:border-border hover:bg-muted/30"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center size-5 rounded-full border transition-colors",
                        paymentTab === "mobile"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {paymentTab === "mobile" && (
                        <div className="size-2 rounded-full bg-current" />
                      )}
                    </div>
                    <Smartphone
                      className={cn(
                        "size-5",
                        paymentTab === "mobile"
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "font-bold text-sm",
                          paymentTab === "mobile"
                            ? "text-primary"
                            : "text-foreground"
                        )}
                      >
                        মোবাইল পেমেন্ট
                      </span>
                      <CornerRightDown
                        className={cn(
                          "size-4",
                          paymentTab === "mobile"
                            ? "text-primary"
                            : "text-muted-foreground/50"
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Payment Details */}
                {paymentTab === "mobile" && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                    {/* Provider Selection List - Matching Image */}
                    <div className="space-y-2 mb-6">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-3">
                        পেমেন্ট মাধ্যম বেছে নিন
                      </p>
                      {(["bkash", "nagad", "rocket"] as const).map(
                        (provider) => {
                          const isSelected = mobileProvider === provider;
                          return (
                            <button
                              key={provider}
                              type="button"
                              onClick={() => setMobileProvider(provider)}
                              className={cn(
                                "w-full flex items-center gap-3 p-2 rounded-xl border transition-all duration-300 group",
                                isSelected
                                  ? "border-primary bg-primary/5 ring-1 ring-primary/10 shadow-sm"
                                  : "border-transparent bg-muted/20 hover:bg-muted/40"
                              )}
                            >
                              <div
                                className={cn(
                                  "flex items-center justify-center size-5 rounded-full border-2 transition-all ml-1",
                                  isSelected
                                    ? "border-primary bg-primary shadow-[0_0_8px_rgba(var(--primary),0.3)]"
                                    : "border-muted-foreground/20 bg-background group-hover:border-muted-foreground/40"
                                )}
                              >
                                {isSelected && (
                                  <div className="size-2 rounded-full bg-white shadow-sm" />
                                )}
                              </div>

                              <div className="relative size-10 flex items-center justify-center overflow-hidden">
                                <Image
                                  src={PAYMENT_ACCOUNTS[provider].logo}
                                  alt={PAYMENT_ACCOUNTS[provider].name}
                                  width={36}
                                  height={36}
                                  className="object-contain filter transition-transform group-hover:scale-110"
                                />
                              </div>

                              <div className="flex flex-1 items-center justify-between pr-2">
                                <span
                                  className={cn(
                                    "font-bold text-base transition-colors",
                                    isSelected
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {PAYMENT_ACCOUNTS[provider].name}
                                </span>
                                <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                                  {PAYMENT_ACCOUNTS[provider].type}
                                </span>
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>

                    {/* Instruction Box - Compact Dark */}
                    <div className="rounded-lg border border-border bg-slate-900 text-slate-200 p-4 shadow-md">
                      <div className="flex flex-row justify-between items-center gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-400">
                            এই নাম্বারে{" "}
                            <span className="text-yellow-400 font-bold uppercase tracking-wide">
                              Send Money
                            </span>{" "}
                            করুন:
                          </p>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "font-mono text-xl font-bold tracking-wider",
                                PAYMENT_ACCOUNTS[mobileProvider].iconColor
                              )}
                            >
                              {PAYMENT_ACCOUNTS[mobileProvider].number}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 bg-slate-800 w-fit px-2 py-0.5 rounded">
                            Personal Account
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          onClick={() =>
                            handleCopyNumber(
                              PAYMENT_ACCOUNTS[mobileProvider].number
                            )
                          }
                          className="h-9 px-4 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                        >
                          {copied ? (
                            <Check className="size-3.5 mr-1.5 text-green-400" />
                          ) : (
                            <Copy className="size-3.5 mr-1.5" />
                          )}
                          {copied ? "Copied" : "Copy"}
                        </Button>
                      </div>
                    </div>

                    {/* Verification Inputs - Compact */}
                    <div className="grid gap-4 sm:grid-cols-2 bg-muted/20 p-4 rounded-lg border border-border/40">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="senderNumber"
                          className="text-xs text-muted-foreground"
                        >
                          সেন্ডার নম্বর
                        </Label>
                        <Input
                          id="senderNumber"
                          placeholder="01XXXXXXXXX"
                          value={formData.senderNumber}
                          onChange={(e) =>
                            handleInputChange("senderNumber", e.target.value)
                          }
                          className={cn(
                            "h-9 bg-background text-sm",
                            errors.senderNumber && "border-destructive"
                          )}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="trxId"
                          className="text-xs text-muted-foreground"
                        >
                          TrxID
                        </Label>
                        <Input
                          id="trxId"
                          placeholder="Example: 9G71C..."
                          value={formData.trxId}
                          onChange={(e) =>
                            handleInputChange(
                              "trxId",
                              e.target.value.toUpperCase()
                            )
                          }
                          className={cn(
                            "h-9 bg-background text-sm",
                            errors.trxId && "border-destructive"
                          )}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <div className="flex items-start gap-2">
                          <ShieldCheck className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            টাকা পাঠানোর পর ফিরতি এসএমএস থেকে TrxID টি কপি করে
                            উপরের বক্সে বসান।
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button - Desktop */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="hidden lg:flex w-full rounded-full h-12 text-base font-bold shadow-lg transition-transform hover:scale-[1.01]"
            >
              {isSubmitting
                ? "অর্ডার প্রসেস হচ্ছে..."
                : `অর্ডার কনফার্ম করুন • ${formatPrice(totalAmount)}`}
            </Button>
          </form>
        </section>

        {/* Right: Summary - Liquid Glass */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-5 shadow-lg space-y-5">
            <h2 className="text-lg font-bold">অর্ডার সারাংশ</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide pr-1">
              {cart.items.map((item) => (
                <div
                  key={item.product.productId}
                  className="flex justify-between items-start text-base group"
                >
                  <div className="flex-1 mr-2">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-base">
                      {item.product.title}
                      <span className="text-muted-foreground font-normal ml-1.5 text-[15px]">
                        × {item.quantity} kg
                      </span>
                    </p>
                  </div>
                  <span className="font-bold text-lg">
                    {formatPrice(item.product.salePrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-2.5 text-base">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-[15px]">
                  সাবটোটাল
                </span>
                <span className="font-medium text-base">
                  {formatPrice(cart.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-[15px]">
                  ডেলিভারি চার্জ
                </span>
                <span className="font-medium text-base">
                  {formatPrice(DELIVERY_CHARGE)}
                </span>
              </div>
              <Separator className="bg-border/50 my-2" />
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>সর্বমোট</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-2 items-center justify-center p-2.5 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              তথ্য ১০০% সুরক্ষিত
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Bar - Improved */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/90 backdrop-blur-xl border-t border-border/40 p-3 shadow-2xl">
        <div className="container mx-auto">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-semibold">
                সর্বমোট
              </p>
              <p className="text-xl font-black text-primary">
                {formatPrice(totalAmount)}
              </p>
            </div>
            <Button
              type="submit"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-full px-7 h-12 text-base font-black shadow-lg"
            >
              {isSubmitting ? "প্রসেস হচ্ছে..." : "কনফার্ম করুন"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
