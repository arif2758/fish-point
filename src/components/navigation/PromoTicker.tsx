import Link from "next/link";

export default function PromoTicker() {
  return (
    <aside className="bg-destructive/10 backdrop-blur-[20px] border-y border-destructive/10 px-4 py-1.5 text-xs font-medium text-destructive">
      <div className="container mx-auto flex items-center justify-center sm:justify-between">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
          </span>
          <span className="hidden xs:inline">লাইভ স্টক: </span>পাঙ্গাস এখন ২০%
          ছাড়ে!
        </span>
        <Link
          href="tel:01700000000"
          className="hidden sm:inline-block font-bold hover:underline underline-offset-2 transition-all"
        >
          অর্ডার করুন: 01700-000000
        </Link>
      </div>
    </aside>
  );
}
