"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", phone: "", email: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="container mx-auto px-4 py-8 pb-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">যোগাযোগ করুন</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          আপনার যেকোনো প্রশ্ন বা পরামর্শ আমাদের জানান। আমরা সর্বদা আপনার সেবায়
          প্রস্তুত।
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 space-y-4">
          {/* Phone */}
          <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Phone className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">ফোন</h3>
                <a
                  href="tel:01540505122"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  01540505122
                </a>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Mail className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">ইমেইল</h3>
                <a
                  href="mailto:info@fishpoint.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                >
                  info@fishpoint.com
                </a>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">ঠিকানা</h3>
                <p className="text-sm text-muted-foreground">
                  মিরপুর, ঢাকা-১২১৬
                </p>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Clock className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">ব্যবসায়িক সময়</h3>
                <p className="text-sm text-muted-foreground">
                  প্রতিদিন: সকাল ৮টা - রাত ৯টা
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">মেসেজ পাঠান</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="size-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">ধন্যবাদ!</h3>
                <p className="text-muted-foreground">
                  আপনার মেসেজ পাঠানো হয়েছে। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      নাম <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="h-11 bg-background/50 backdrop-blur-sm"
                      placeholder="আপনার নাম"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      ফোন নম্বর <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="h-11 bg-background/50 backdrop-blur-sm"
                      placeholder="01XXXXXXXXX"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    ইমেইল (ঐচ্ছিক)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-11 bg-background/50 backdrop-blur-sm"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    মেসেজ <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="min-h-32 resize-none bg-background/50 backdrop-blur-sm"
                    placeholder="আপনার প্রশ্ন বা মন্তব্য লিখুন..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    "পাঠানো হচ্ছে..."
                  ) : (
                    <>
                      <Send className="mr-2 size-4" />
                      মেসেজ পাঠান
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
