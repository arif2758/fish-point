"use client";

import {
  FileText,
  Gavel,
  RefreshCcw,
  Truck,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <article className="container mx-auto px-4 py-12 md:py-20 max-w-4xl pb-32">
      {/* Breadcrumb/Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
        হোম পেজে ফিরে যান
      </Link>

      {/* Header Section */}
      <header className="relative space-y-6 mb-16 p-6 md:p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-sm hover:border-primary/20 transition-all duration-300  ">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 border border-primary/30 shadow-sm mb-8">
          <FileText className="size-7 text-primary" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
            টার্মস অফ <span className="text-primary">সার্ভিস</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            ফিশপয়েন্ট (FishPoint) ব্যবহারের নিয়মাবলী এবং পেমেন্ট ও ডেলিভারি
            সংক্রান্ত শর্তাবলী নিচে বিস্তারিত আলোচনা করা হলো।
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            সর্বশেষ আপডেট: ৩০ ডিসেম্বর ২০২৫
          </span>
        </div>
      </header>

      {/* Content Sections */}
      <div className="grid gap-8">
        {/* 1. General Conditions */}
        <section className="group p-6 md:p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-sm hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <Gavel className="size-6" />
            </div>
            <h2 className="text-2xl font-bold">সাধারণ শর্তাবলী</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            ফিশপয়েন্ট প্লাটফর্মটি ব্যবহারের মাধ্যমে আপনি আমাদের সকল শর্তাবলীতে
            সম্মত হচ্ছেন বলে গণ্য হবে। আমাদের সাইটে অর্ডার করার জন্য অবশ্যই সঠিক
            তথ্য প্রদান করতে হবে। অসম্পূর্ণ বা ভুল তথ্যের কারণে ডেলিভারিতে
            বিলম্ব বা অর্ডার বাতিল হয়ে গেলে ফিশপয়েন্ট দায়ী থাকবে না।
          </p>
        </section>

        {/* 2. Delivery & Timeline */}
        <section className="group p-6 md:p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-sm hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
              <Truck className="size-6" />
            </div>
            <h2 className="text-2xl font-bold">ডেলিভারি এবং টাইমলাইন</h2>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              মাছের ফ্রেশনেস বজায় রাখতে আমরা সরাসরি ডেলিভারি নিশ্চিত করি:
            </p>
            <div className="grid gap-3">
              {[
                "সাধারণত অর্ডারের ২৪-৪৮ ঘন্টার মধ্যে ডেলিভারি প্রদান করা হয়।",
                "নির্দিষ্ট এরিয়ার জন্য ডেলিভারি চার্জ ৩০ টাকা প্রযোজ্য।",
                "অপ্রিয় কোনো পরিস্থিতি বা প্রাকৃতিক দুর্যোগের কারণে ডেলিভারি বিলম্ব হতে পারে।",
              ].map((text, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-center p-3 rounded-xl bg-muted/30 border border-border/20"
                >
                  <div className="size-1.5 rounded-full bg-orange-500 shrink-0" />
                  <p className="text-foreground/80 font-medium text-sm">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Refund & Return */}
        <section className="group p-6 md:p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-sm hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
              <RefreshCcw className="size-6" />
            </div>
            <h2 className="text-2xl font-bold">রিফান্ড এবং রিটার্ন পলিসি</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              মাছ যেহেতু একটি পচনশীল পণ্য, তাই ডেলিভারির সময় অবশ্যই পণ্য চেক করে
              নেওয়ার অনুরোধ করা হলো।
            </p>
            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
              <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
                <AlertCircle className="size-4" />
                <span>মাস্ট জানুন:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  ডেলিভারি ম্যান থাকাকালীন কোনো গুণগত মান বা ওজন নিয়ে সমস্যা
                  থাকলে তৎক্ষণাৎ জানাতে হবে।
                </li>
                <li>
                  ডেলিভারি ম্যান চলে যাওয়ার পর কোনো ক্লেইম গ্রহণ করা সম্ভব নয়।
                </li>
                <li>
                  যৌক্তিক কারণে রিটার্ন হলে আমরা পূর্ণ রিফান্ড বা পণ্য
                  রিপ্লেসমেন্ট প্রদান করি।
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Payment Rules */}
        <section className="group p-6 md:p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-sm hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <ShieldAlert className="size-6" />
            </div>
            <h2 className="text-2xl font-bold">পেমেন্ট সংক্রান্ত নিয়ম</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            আমরা ক্যাশ অন ডেলিভারি (COD) এবং মোবাইল পেমেন্ট (বিকাশ, নগদ, রকেট)
            সমর্থন করি। মোবাইল পেমেন্টের ক্ষেত্রে ট্রানজেকশন আইডি প্রদান করা
            বাধ্যতামূলক। কোনো পেমেন্ট সংক্রান্ত তথ্য ভুল হলে অর্ডার বাতিল করার
            অধিকার ফিশপয়েন্ট সংরক্ষণ করে।
          </p>
        </section>

        {/* Closing Callout */}
        <div className="mt-12 p-8 rounded-3xl bg-slate-950 text-slate-50 border border-slate-800 text-center space-y-4">
          <h3 className="text-2xl font-bold">শর্তাবলী পরিবর্তন</h3>
          <p className="text-slate-400">
            ফিশপয়েন্ট কোনো পূর্ব ঘোষণা ছাড়াই টার্মস অফ সার্ভিস পরিবর্তন বা
            পরিমার্জন করার অধিকার রাখে।
          </p>
        </div>
      </div>
    </article>
  );
}
