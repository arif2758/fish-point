"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PackageCard from "@/components/products/PackageCard";
import { Zap, ShieldCheck, Truck, RefreshCcw, Boxes } from "lucide-react";
import { IPackage } from "@/models/PackageCollection";

export default function PackagesClient({ packages }: { packages: IPackage[] }) {
  const weeklyPackages = packages.filter((pkg) => pkg.frequency === "weekly");
  const monthlyPackages = packages.filter((pkg) => pkg.frequency === "monthly");

  return (
    <main className="container mx-auto px-4 py-8 pb-12">
      {/* Header Section */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
          <Zap className="size-3" />
          সাবস্ক্রিপশন প্যাকেজ
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          সাপ্তাহিক ও মাসিক <span className="text-primary italic">বাজার</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          বাজার করার ঝামেলা আর না! আমরা দিচ্ছি সপ্তাহের বা মাসের ফ্রেশ মাছের
          গ্যারান্টি। সব প্যাকেজ সাবস্ক্রিপশন করুন আর উপভোগ করুন আকর্ষণীয়
          ডিসকাউন্ট। ডিসকাউন্ট।
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {[
          {
            icon: ShieldCheck,
            title: "১০০% ফ্রেশ",
            desc: "সেরা কোয়ালিটির তাজা মাছ",
          },
          {
            icon: Truck,
            title: "ফ্রি হোম ডেলিভারি",
            desc: "সরাসরি আপনার কাছে",
          },
          {
            icon: RefreshCcw,
            title: "সহজ রিপ্লেসমেন্ট",
            desc: "কোনো প্রশ্ন ছাড়াই",
          },
          { icon: Boxes, title: "কাস্টম প্যাক", desc: "আপনার পছন্দ মত" },
        ].map((item, idx) => (
          <div
            key={`benefit-${idx}`}
            className="p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl text-center space-y-2"
          >
            <div className="flex justify-center">
              <item.icon className="size-6 text-primary" />
            </div>
            <h4 className="text-sm font-bold">{item.title}</h4>
            <p className="text-[10px] text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="weekly" className="space-y-12">
        <div className="flex flex-col items-center gap-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold">পছন্দসই ফ্রিকোয়েন্সি বেছে নিন</h2>
            <p className="text-xs text-muted-foreground">
              সাপ্তাহিক নাকি মাসিক? আপনার প্রয়োজন অনুযায়ী।
            </p>
          </div>
          <TabsList className="grid w-full max-w-[420px] grid-cols-2 h-14 bg-card/60 backdrop-blur-3xl p-1.5 rounded-2xl border border-primary/20 shadow-xl shadow-primary/5">
            <TabsTrigger
              value="weekly"
              className="rounded-xl text-sm font-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              সাপ্তাহিক বাজার
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="rounded-xl text-sm font-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              মাসিক প্যাকেজ{" "}
              {monthlyPackages.length > 0 && `(${monthlyPackages.length})`}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="weekly"
          className="animate-in fade-in slide-in-from-bottom-5 duration-500 outline-none"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {weeklyPackages.map((pkg) => (
              <PackageCard key={pkg.packageId} pkg={pkg} />
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="monthly"
          className="animate-in fade-in slide-in-from-bottom-5 duration-500 outline-none"
        >
          {monthlyPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {monthlyPackages.map((pkg) => (
                <PackageCard key={pkg.packageId} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-border/60 bg-muted/20">
              <Boxes className="size-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">
                কোনো মাসিক প্যাকেজ পাওয়া যায়নি
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                দুঃখিত, বর্তমানে কোনো মাসিক প্যাকেজ উপলব্ধ নেই। অনুগ্রহ করে
                শীঘ্রই আবার চেক করুন।
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dynamic CTA */}
      <div className="mt-20 p-8 rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-background to-primary/5 text-center space-y-4">
        <h3 className="text-2xl font-bold">নিজের মত প্যাকেজ বানাতে চান?</h3>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          আপনার যদি নিজের কোনো লিস্ট থেকে থাকে, আমাদের কল করুন অথবা সরাসরি
          ইনবক্সে ম্যসেজ দিন। আমরা আপনার জন্য কাস্টম প্যাকেজ বানিয়ে দেব।
        </p>
        <div className="pt-2">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 h-12 font-bold border-primary text-primary hover:bg-primary/10"
          >
            আমাদের সাথে কথা বলুন
          </Button>
        </div>
      </div>
    </main>
  );
}
