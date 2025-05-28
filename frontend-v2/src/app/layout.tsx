import './globals.css';

export const metadata = {
  title: 'AutoBooks',
  description: 'Professional Bookkeeping Solution',
};

// Root layout must include html and body tags
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
