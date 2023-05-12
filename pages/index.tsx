import Head from "next/head";
import Image from "next/image";
import { Nav } from "@/components/nav";
import React from "react";
import { getSheetsData } from "@/utils/api";
import { Footer } from "@/components/footer";
import { Phone } from "@/components/phone";
import Link from "next/link";

export type HomeProps = {
  startingQuote?: string;
  sheetsData: Record<string, string>;
};

export default function Home({ startingQuote, sheetsData }: HomeProps) {
  const [quote, setQuote] = React.useState(startingQuote);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newQuote =
        sheetsData.quotes[Math.floor(Math.random() * sheetsData.quotes.length)];
      setQuote(newQuote);
    }, 5000);
    return () => clearInterval(interval);
  }, [sheetsData]);

  return (
    <>
      <Head>
        <title>{sheetsData.title}</title>
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
                  <figure>
                    <Image
                      src="/images/photo-3.jpg"
                      alt="Shoes"
                      width={500}
                      height={200}
                    />
                  </figure>
                  <div className="card-body">
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
                <div className="card mx-auto w-96 bg-base-200 p-4 shadow-xl">
                  <iframe
                    src={sheetsData.facebookPost}
                    width="350"
                    height="450"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    className="mx-auto"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const sheetsData = await getSheetsData();
  // @ts-ignore - this is a hack to get the quotes into the props
  const quotes = sheetsData.quotes as string[];
  const startingQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return {
    props: {
      startingQuote,
      sheetsData,
    },
    revalidate: 30,
  };
}
