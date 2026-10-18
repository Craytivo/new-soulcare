import type { Metadata } from 'next'

import Script from 'next/script'

import './globals.css'

import Header from '../components/Header'

import Footer from '../components/Footer'
import BackToTop from '@/components/ui/BackToTop'
import { fontVariables } from '@/lib/fonts'

const gtmId = process.env.NEXT_PUBLIC_GTM_ID

export const metadata: Metadata = {
  metadataBase: new URL('https://thesoulcarecounsellor.ca'),

  title: {
    default: 'Soul Care Christian Counselling — Home',

    template: '%s | Soul Care Christian Counselling',
  },

  description: 'Faith-centered, culturally sensitive therapy. Virtual across Canada.',

  keywords: [
    'Christian counselling',
    'therapy',
    'mental health',
    'faith-based',
    'virtual counselling',
    'Canada',
  ],

  authors: [{ name: 'Soul Care Counselling' }],

  creator: 'Soul Care Counselling',

  publisher: 'Soul Care Counselling',

  formatDetection: {
    email: false,

    address: false,

    telephone: false,
  },

  verification: {
    google: 'I46F2T5WNf56MEhLHRDB3fqOl3oLXSj_UJgHt4A0SH4',
  },

  openGraph: {
    type: 'website',

    locale: 'en_CA',

    url: 'https://thesoulcarecounsellor.ca',

    title: 'Soul Care Christian Counselling',

    description: 'Faith-centered, culturally sensitive therapy. Virtual across Canada.',

    siteName: 'Soul Care Christian Counselling',

    images: [
      {
        url: 'https://thesoulcarecounsellor.ca/icon.png',

        width: 32,

        height: 32,

        alt: 'Soul Care Counselling Logo',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'Soul Care Christian Counselling',

    description: 'Faith-centered, culturally sensitive therapy. Virtual across Canada.',

    images: ['https://thesoulcarecounsellor.ca/icon.png'],
  },

  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: '32x32', type: 'image/x-icon' },

      { url: '/icon.png?v=2', sizes: '32x32', type: 'image/png' },
    ],

    shortcut: '/favicon.ico?v=2',

    apple: [{ url: '/apple-icon.png?v=2', sizes: '180x180', type: 'image/png' }],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',

  '@type': 'Organization',

  name: 'Soul Care Counselling',

  url: 'https://thesoulcarecounsellor.ca',

  email: 'info@thesoulcarecounsellor.com',

  logo: 'https://thesoulcarecounsellor.ca/icon.png',

  sameAs: ['https://www.instagram.com/heybelovedhey'],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',

  '@type': 'WebSite',

  name: 'Soul Care Christian Counselling',

  url: 'https://thesoulcarecounsellor.ca',

  description: 'Faith-centered, culturally sensitive therapy. Virtual across Canada.',

  potentialAction: {
    '@type': 'SearchAction',

    target: 'https://thesoulcarecounsellor.ca/services?search={search_term_string}',

    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        {gtmId && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':

new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],

j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=

'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);

})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}
      </head>

      <body className="overflow-x-clip bg-cream font-body text-charcoal antialiased">
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <Script id="org-jsonld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(organizationJsonLd)}
        </Script>

        <Script id="website-jsonld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(websiteJsonLd)}
        </Script>

        <Header />

        <main className="content-block mx-auto min-h-[60vh] max-w-7xl px-4 py-12">{children}</main>

        <Footer />

        <BackToTop />
      </body>
    </html>
  )
}
