import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "যোগাযোগ করুন | Fish Point",
  description:
    "আমাদের সাথে যোগাযোগ করুন। ফোন, ইমেইল বা ফর্মের মাধ্যমে আপনার প্রশ্ন জানান।",
};

export default function ContactPage() {
  return <ContactClient />;
}
