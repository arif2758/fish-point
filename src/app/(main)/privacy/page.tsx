"use client";

import {
  ShieldCheck,
  Lock,
  Eye,
  Bell,
  Database,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
      <header className="relative space-y-6 mb-16 p-6 md:p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-sm hover:border-primary/20 transition-all duration-300">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 border border-primary/30 shadow-sm mb-8">
          <ShieldCheck className="size-7 text-primary" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
            প্রাইভেসি <span className="text-primary">পলিসি</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            ফিশপয়েন্ট (FishPoint) আপনার তথ্যের গোপনীয়তা রক্ষা করতে
            প্রতিশ্রুতিবদ্ধ। আমরা কিভাবে আপনার তথ্য সংগ্রহ এবং ব্যবহার করি তা
            এখানে বিস্তারিত আলোচনা করা হলো।
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
        {/* 1. Information Collection */}
        <section className="group p-6 md:p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-sm hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <Database className="size-6" />
            </div>
            <h2 className="text-2xl font-bold">তথ্য সংগ্রহ</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              যখন আপনি আমাদের প্ল্যাটফর্ম থেকে কোনো পণ্য অর্ডার করেন, তখন আমরা
              আপনার অর্ডারটি সফলভাবে সম্পন্ন করার জন্য কিছু প্রয়োজনীয় তথ্য
              সংগ্রহ করি:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none pl-0">
              {[
                { label: "আপনার নাম", icon: "•" },
                { label: "মোবাইল নম্বর", icon: "•" },
                { label: "ডেলিভারি ঠিকানা", icon: "•" },
                { label: "ইমেইল (ঐচ্ছিক)", icon: "•" },
                { label: "পেমেন্ট ডিটেইলস (বিকাশ/নগদ)", icon: "•" },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 bg-muted/30 p-3 rounded-xl border border-transparent hover:border-primary/20 transition-colors"
                >
                  <span className="text-primary font-bold">{item.icon}</span>
                  <span className="text-foreground font-medium">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. Usage of Information */}
        <section className="group p-6 md:p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-sm hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <UserCheck className="size-6" />
            </div>
            <h2 className="text-2xl font-bold">তথ্যের ব্যবহার</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            আপনার প্রদত্ত তথ্য আমরা মূলত নিচের উদ্দেশ্যগুলোতে ব্যবহার করি:
          </p>
          <div className="grid gap-3">
            {[
              "অর্ডার প্রসেসিং এবং ডেলিভারি সম্পন্ন করতে।",
              "অর্ডার সংক্রান্ত কোনো প্রয়োজনে সরাসরি যোগাযোগ করতে।",
              "নতুন অফার বা সার্ভিস সম্পর্কে আপনাকে অবহিত করতে।",
              "মানসম্মত কাস্টমার সাপোর্ট নিশ্চিত করতে।",
            ].map((text, idx) => (
              <div
                key={idx}
                className="flex gap-3 p-4 rounded-2xl bg-muted/20 border border-border/20"
              >
                <div className="size-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <p className="text-foreground/80 font-medium">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Data Security */}
        <section className="group p-6 md:p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-sm hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
              <Lock className="size-6" />
            </div>
            <h2 className="text-2xl font-bold">তথ্যের নিরাপত্তা</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            আমরা আপনার তথ্যের সর্বোচ্চ নিরাপত্তা নিশ্চিত করি। আপনার ব্যক্তিগত
            তথ্য আমরা কোনো থার্ড পার্টি বা অন্য কোনো প্রতিষ্ঠানের কাছে বিক্রি বা
            লিজ প্রদান করি না। আমাদের পেমেন্ট গেটওয়ে এবং ডেটাবেস সম্পূর্ণ
            এনক্রিপ্টেড এবং সুরক্ষিত।
          </p>
        </section>

        {/* 4. Cookies */}
        <section className="group p-6 md:p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-sm hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
              <Eye className="size-6" />
            </div>
            <h2 className="text-2xl font-bold">কুকিজ (Cookies)</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            ইউজার এক্সপেরিয়েন্স উন্নত করার জন্য আমরা কুকিজ ব্যবহার করি। এটি
            আমাদের বুঝতে সাহায্য করে যে আপনি আমাদের ওয়েবসাইট কিভাবে ব্যবহার
            করছেন এবং পরবর্তীতে আপনাকে আরও দ্রুত সার্ভিস প্রদান করতে সাহায্য
            করে।
          </p>
        </section>

        {/* Footer Contact Callout */}
        <div className="mt-12 p-8 rounded-3xl bg-linear-to-br from-primary/10 via-background to-primary/5 border border-primary/20 text-center space-y-4">
          <Bell className="size-10 text-primary mx-auto opacity-70 animate-bounce" />
          <h3 className="text-2xl font-bold">আপনার কি কোনো প্রশ্ন আছে?</h3>
          <p className="text-muted-foreground">
            প্রাইভেসি পলিসি নিয়ে আপনার কোনো জিজ্ঞাসা থাকলে আমাদের সাথে যোগাযোগ
            করুন।
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <button className="px-8 h-12 rounded-full bg-primary text-primary-foreground font-bold shadow-lg hover:shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                যোগাযোগ করুন
              </button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
