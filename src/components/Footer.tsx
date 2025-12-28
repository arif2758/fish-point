// src/components/Footer.tsx
import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, MapPin, Fish } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/20 backdrop-blur-[20px] mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground font-bold shadow-lg shadow-primary/20">
                <Fish className="size-6" />
              </div>
              <span className="text-xl font-bold">FishPoint</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ঢাকার সেরা তাজা মাছের অনলাইন মার্কেট। প্রিমিয়াম কোয়ালিটি, দ্রুত
              ডেলিভারি।
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">দ্রুত লিংক</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/products"
                  className="hover:text-primary transition-colors"
                >
                  সব পণ্য
                </Link>
              </li>
              <li>
                <Link
                  href="/products?offer=true"
                  className="hover:text-primary transition-colors"
                >
                  অফার
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  যোগাযোগ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">কাস্টমার সার্ভিস</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/help"
                  className="hover:text-primary transition-colors"
                >
                  সাহায্য
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-primary transition-colors"
                >
                  ডেলিভারি পলিসি
                </Link>
              </li>
              <li>
                <Link
                  href="/return"
                  className="hover:text-primary transition-colors"
                >
                  রিটার্ন পলিসি
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">যোগাযোগ</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="size-4 shrink-0 mt-0.5 text-primary" />
                <div>
                  <a
                    href="tel:01700000000"
                    className="hover:text-primary transition-colors"
                  >
                    01700-000000
                  </a>
                  <p className="text-xs">সকাল ৮টা - রাত ১০টা</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="size-4 shrink-0 mt-0.5 text-primary" />
                <a
                  href="mailto:info@fishpoint.com"
                  className="hover:text-primary transition-colors"
                >
                  info@fishpoint.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 mt-0.5 text-primary" />
                <span>মিরপুর, ঢাকা-১২১৬</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FishPoint. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
