import { Inter, Source_Serif_4 } from "next/font/google";
import "./nata.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-nata-inter", display: "swap" });
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-nata-serif",
  display: "swap",
});

// Satoshi tidak ada di Google Fonts; dimuat dari Fontshare seperti di proyek aslinya.
export default function NataLayout({ children }: LayoutProps<"/nataku">) {
  return (
    <>
      <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        precedence="default"
      />
      <div id="top" className={`nata-lp ${inter.variable} ${sourceSerif.variable}`}>
        {children}
      </div>
    </>
  );
}
