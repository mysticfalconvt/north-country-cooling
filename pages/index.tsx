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
          content="North Country Cooling AC contractor in VT"
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
                      src="data:image/jpeg;base64,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"
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
