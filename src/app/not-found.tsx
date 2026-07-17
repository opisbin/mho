import Link from "next/link";
import Navbar from "@/components/navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="max-w-[720px] mx-auto px-4 sm:px-6 pt-32 pb-16 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-xs tx-muted mb-4">404</p>
        <h1 className="text-4xl tx-main mb-4 font-serif-display">Page not found</h1>
        <p className="text-sm tx-muted mb-8 max-w-sm">
          Either this page never existed, or it has been moved. Either way, let's get you back.
        </p>
        <Link href="/" className="inline-flex items-center px-6 py-2.5 rounded-full border border-current tx-main text-sm font-medium hover:bg-current hover:text-[var(--bg)] transition-all duration-200">
          Back home
        </Link>
      </main>
    </>
  );
}
