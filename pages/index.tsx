import { Phone } from '@/components/phone';
import { getFacebookPostsDirect, getSiteDataDirect } from '@/lib/data';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export type HomeProps = {
  startingQuote?: string;
  sheetsData: Record<string, string>;
  facebookPosts?: any[];
};

const imageList = [
  '/images/Photo-1.jpg',
  '/images/Photo-3.jpg',
  '/images/Photo-13.jpg',
  '/images/Photo-20.jpg',
  '/images/Photo-22.jpg',
  '/images/Photo-23.jpg',
];

export default function Home({
  startingQuote,
  sheetsData,
  facebookPosts = [],
}: HomeProps) {
  const [quote, setQuote] = React.useState(startingQuote);
  const [image, setImage] = React.useState(0); // Start with first image, not random
  const [currentFacebookPost, setCurrentFacebookPost] = React.useState(0);
  React.useEffect(() => {
    // Set initial random values after component mounts (client-side only)
    const initialImage = Math.floor(Math.random() * imageList.length);
    setImage(initialImage);

    const interval = setInterval(() => {
      // Safely handle quotes
      if (
        sheetsData.quotes &&
        Array.isArray(sheetsData.quotes) &&
        sheetsData.quotes.length > 0
      ) {
        const newQuote =
          sheetsData.quotes[
            Math.floor(Math.random() * sheetsData.quotes.length)
          ];
        setQuote(newQuote);
      }

      const newImage = Math.floor(Math.random() * imageList.length);
      setImage(newImage);

      // Rotate Facebook posts if there are multiple
      if (facebookPosts.length > 1) {
        setCurrentFacebookPost((prev) => (prev + 1) % facebookPosts.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sheetsData, facebookPosts]);

  return (
    <>
      <Head>
        <title>{Array.isArray(sheetsData.title) ? sheetsData.title.join(' ') : sheetsData.title || 'North Country Cooling'}</title>
        <meta
          name="description"
          content="North Country Cooling AC air conditioning and heat pump contractor in northern VT"
        />
        <meta
          name="keywords"
          content="AC, air conditioning, cooling, heating, heat pump, heat pumps, Vermont, VT, contractor, service, repair, installation, maintenance, North Country Cooling,
           Derby, Orleans, Barton, Newport, St. Johnsbury, Lyndonville, Lyndon, Irasburg, Sutton, Glover, Craftsbury, Greensboro, East Burke, Burke, West Burke, Lyndonville,
           Johnson, Hardwick, Greensboro, East Hardwick, West Hardwick, East Charleston, West Charleston, East Calais, West Calais, East Montpelier, West Montpelier, East Barre,"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="min-h-fit h-fit">
        <main>
          <div className="container sm:mx-auto p-5 text-base-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 prose md:prose-lg lg:prose-xl flex flex-col">
                <h1 className="text-5xl font-bold ">{sheetsData.title}</h1>
                <h2 className="text-3xl font-bold">{sheetsData.subTitle}</h2>
                <p className="text-xl">{sheetsData.mainContent1}</p>
                <p className="text-xl">{sheetsData.mainContent2}</p>
                <div className="flex flex-row justify-center">
                  <Link href="/learnMore" className="btn btn-accent m-2">
                    Want to Learn More?
                  </Link>
                </div>
                <Phone />
              </div>
              <div className="col-span-1">
                <div className="card w-64 lg:w-96 bg-base-200 shadow-xl mx-auto z-0 mb-10">
                  <figure className="w-full aspect-[3/2]">
                    <Image
                      src={imageList[image]}
                      alt="Photo of John Rowe - Owner of North Country Cooling"
                      width={400}
                      height={200}
                    />
                  </figure>
                  <div className="card-body aspect-[3/2]">
                    <h2 className="card-title">John Rowe</h2>
                    <p>{quote}</p>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary">
                        <a
                          href={`tel:${sheetsData.callMe}`}
                          className="text-primary-content"
                        >
                          Call Me
                        </a>
                      </button>
                    </div>
                  </div>
                </div>
                {facebookPosts.length > 0 && (
                  <div className="card mx-auto w-96 bg-base-200 p-4 shadow-xl">
                    <iframe
                      src={
                        facebookPosts[currentFacebookPost]?.embedUrl ||
                        sheetsData.facebookPost
                      }
                      width="350"
                      height="450"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      className="mx-auto"
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const sheetsData = await getSiteDataDirect();
  // @ts-ignore - this is a hack to get the quotes into the props
  const quotes = sheetsData.quotes as string[];
  const startingQuote =
    quotes && quotes.length > 0
      ? quotes[0] // Always use the first quote for consistent server-side rendering
      : 'Quality HVAC service you can trust.'; // Default quote

  // Fetch Facebook posts directly from database
  const facebookPosts = await getFacebookPostsDirect();

  return {
    props: {
      startingQuote,
      sheetsData,
      facebookPosts,
    },
    revalidate: 5,
  };
}
