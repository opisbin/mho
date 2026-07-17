import SocialLinks from "./social-links";

export default function Footer() {
  return (
    <footer className="border-t bd-cute mt-16 pt-8 pb-8 max-w-[720px] mx-auto px-4 sm:px-6 flex items-center justify-between">
      <p className="text-xs tx-muted-darker">© {new Date().getFullYear()} Meherab Hossain</p>
      <SocialLinks />
    </footer>
  );
}
