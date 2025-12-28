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
} from "lucide-react";
import Link from "next/link";
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
    number: "01700000000",
    type: "Personal",
    iconColor: "text-[#e2136e]",
  },
  nagad: {
    name: "Nagad",
    number: "01800000000",
    type: "Personal",
    iconColor: "text-[#f6921e]",
  },
  rocket: {
    name: "Rocket",
    number: "01900000000",
    type: "Personal",
    iconColor: "text-[#8c3494]",
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

  // State
  const [paymentTab, setPaymentTab] = useState<PaymentTab>("mobile");
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
    <div className="container mx-auto px-4 py-8 pb-32 lg:pb-12">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="size-4" />
        কার্টে ফিরে যান
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Form Sections */}
        <section className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Billing & Shipping */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                  ১
                </span>
                বিলিং এবং শিপিং
              </h2>

              <div className="grid gap-5 sm:grid-cols-2 rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    পুরো নাম <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={cn(
                      "h-11 text-base",
                      errors.name && "border-destructive"
                    )}
                    placeholder="আপনার নাম লিখুন"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    ফোন নম্বর <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={cn(
                      "h-11 text-base",
                      errors.phone && "border-destructive"
                    )}
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area" className="text-sm font-medium">
                    এলাকা <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.area}
                    onValueChange={(value) => handleInputChange("area", value)}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11 text-base",
                        errors.area && "border-destructive"
                      )}
                    >
                      <SelectValue placeholder="সিলেক্ট করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {DHAKA_AREAS.map((area) => (
                        <SelectItem
                          key={area}
                          value={area}
                          className="text-base py-2"
                        >
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    বিস্তারিত ঠিকানা <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={cn(
                      "min-h-25 text-base resize-none",
                      errors.address && "border-destructive"
                    )}
                    placeholder="বাড়ি নং, রোড নং, ফ্ল্যাট নং..."
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Options */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                  ২
                </span>
                ডেলিভারি সময়
              </h2>

              <div className="grid gap-6 rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm">
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Delivery Date (Shadcn Calendar) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      তারিখ <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-11 pl-3 text-left font-normal text-base",
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
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium">
                      স্পেশাল ইনস্ট্রাকশন (অপশনাল)
                    </Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      className="h-11 text-base"
                      placeholder="যেমন: মাছ ছোট পিস করবেন..."
                    />
                  </div>
                </div>

                {/* Time Slots (Visual Selection) */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    সময় <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TIME_SLOTS.map((slot) => {
                      const Icon = slot.icon;
                      const isSelected = formData.timeSlot === slot.id;
                      return (
                        <div
                          key={slot.id}
                          onClick={() => handleInputChange("timeSlot", slot.id)}
                          className={cn(
                            "cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200",
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-border/60 hover:border-border hover:bg-muted/40"
                          )}
                        >
                          <Icon
                            className={cn(
                              "size-6 mb-2",
                              isSelected
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <span
                            className={cn(
                              "font-medium text-sm",
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

            {/* 3. Payment Method */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                  ৩
                </span>
                পেমেন্ট মেথড
              </h2>

              <div className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm space-y-6">
                {/* Main Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile Payment (Default) */}
                  <div
                    onClick={() => setPaymentTab("mobile")}
                    className={cn(
                      "cursor-pointer flex items-center gap-4 p-5 rounded-xl border transition-all duration-200",
                      paymentTab === "mobile"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/60 hover:border-border hover:bg-muted/40"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center size-6 rounded-full border",
                        paymentTab === "mobile"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground"
                      )}
                    >
                      {paymentTab === "mobile" && (
                        <div className="size-2.5 rounded-full bg-current" />
                      )}
                    </div>
                    <Smartphone className="size-6 text-muted-foreground" />
                    <span className="font-semibold text-base">
                      Mobile Payment
                    </span>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentTab("cod")}
                    className={cn(
                      "cursor-pointer flex items-center gap-4 p-5 rounded-xl border transition-all duration-200",
                      paymentTab === "cod"
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/60 hover:border-border hover:bg-muted/40"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center size-6 rounded-full border",
                        paymentTab === "cod"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground"
                      )}
                    >
                      {paymentTab === "cod" && (
                        <div className="size-2.5 rounded-full bg-current" />
                      )}
                    </div>
                    <Banknote className="size-6 text-muted-foreground" />
                    <span className="font-semibold text-base">
                      Cash on Delivery
                    </span>
                  </div>
                </div>

                {/* Mobile Payment Details */}
                {paymentTab === "mobile" && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-6">
                    {/* Provider Tabs */}
                    <div className="flex gap-4">
                      {(["bkash", "nagad", "rocket"] as const).map(
                        (provider) => (
                          <button
                            key={provider}
                            type="button"
                            onClick={() => setMobileProvider(provider)}
                            className={cn(
                              "flex-1 py-3 rounded-lg text-sm font-medium border transition-all shadow-sm",
                              mobileProvider === provider
                                ? "border-primary/40 bg-background text-foreground ring-1 ring-primary/10"
                                : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted"
                            )}
                          >
                            {PAYMENT_ACCOUNTS[provider].name}
                          </button>
                        )
                      )}
                    </div>

                    {/* Instruction Box (Minimal Dark) */}
                    <div className="rounded-xl border border-border bg-slate-900 text-slate-200 p-6 shadow-md">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-400">
                            এই নাম্বারে{" "}
                            <span className="text-yellow-400 font-bold uppercase tracking-wide">
                              Send Money
                            </span>{" "}
                            করুন:
                          </p>
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "font-mono text-2xl font-bold tracking-wider",
                                PAYMENT_ACCOUNTS[mobileProvider].iconColor
                              )}
                            >
                              {PAYMENT_ACCOUNTS[mobileProvider].number}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 bg-slate-800 w-fit px-2 py-0.5 rounded">
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
                          className="h-10 px-5 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          {copied ? (
                            <Check className="size-4 mr-2 text-green-400" />
                          ) : (
                            <Copy className="size-4 mr-2" />
                          )}
                          {copied ? "Copied" : "Copy Number"}
                        </Button>
                      </div>
                    </div>

                    {/* Verification Inputs */}
                    <div className="grid gap-5 sm:grid-cols-2 bg-muted/20 p-5 rounded-xl border border-border/40">
                      <div className="space-y-2">
                        <Label
                          htmlFor="senderNumber"
                          className="text-sm text-muted-foreground"
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
                            "h-11 bg-background",
                            errors.senderNumber && "border-destructive"
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="trxId"
                          className="text-sm text-muted-foreground"
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
                            "h-11 bg-background",
                            errors.trxId && "border-destructive"
                          )}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <div className="flex items-start gap-2.5">
                          <ShieldCheck className="size-4 text-muted-foreground mt-0.5" />
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            * টাকা পাঠানোর পর ফিরতি এসএমএস থেকে TrxID টি কপি করে
                            উপরের বক্সে বসান।
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="hidden lg:flex w-full rounded-full h-14 text-lg font-bold shadow-lg transition-transform hover:scale-[1.01]"
            >
              {isSubmitting
                ? "অর্ডার প্রসেস হচ্ছে..."
                : `অর্ডার কনফার্ম করুন • ${formatPrice(totalAmount)}`}
            </Button>
          </form>
        </section>

        {/* Right: Summary */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-[20px] p-6 shadow-lg space-y-6">
            <h2 className="text-lg font-bold">অর্ডার সারাংশ</h2>

            <div className="space-y-4 max-h-75 overflow-y-auto scrollbar-hide pr-1">
              {cart.items.map((item) => (
                <div
                  key={item.product.productId}
                  className="flex justify-between items-start text-sm group"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.product.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.quantity} kg
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatPrice(item.product.salePrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">সাবটোটাল</span>
                <span className="font-medium">{formatPrice(cart.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                <span className="font-medium">
                  {formatPrice(DELIVERY_CHARGE)}
                </span>
              </div>
              <Separator className="bg-border/50 my-2" />
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>সর্বমোট</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-2 items-center justify-center p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              তথ্য ১০০% সুরক্ষিত
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/90 backdrop-blur-xl border-t border-border/40 p-4 shadow-2xl">
        <div className="container mx-auto flex gap-4 items-center">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium">সর্বমোট</p>
            <p className="text-lg font-bold text-primary">
              {formatPrice(totalAmount)}
            </p>
          </div>
          <Button
            type="submit"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-full px-8 h-12 text-base font-bold shadow-md"
          >
            কনফার্ম করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
