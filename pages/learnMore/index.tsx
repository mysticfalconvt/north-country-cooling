import { getLinksData, getSheetsData } from "@/utils/api";
import { getLinkPreview } from "link-preview-js";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const LinkCard = ({ linkPreview }: { linkPreview: any }) => {
  // check if image starts with wwww and replace with www
  if (linkPreview.images?.length) {
    linkPreview.images[0] = linkPreview.images[0].replace("wwww", "www");
  }
  const [currentImage, setCurrentImage] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (linkPreview.images?.length) {
        setCurrentImage((currentImage + 1) % linkPreview.images.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentImage, linkPreview.images]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="card w-96 bg-primary text-primary-content shadow-xl">
      {linkPreview.images?.length ? (
        <figure>
          <img
            src={linkPreview.images[currentImage]}
            alt={`thumbnail image for ${linkPreview.title}`}
          />
        </figure>
      ) : null}
      <div className="card-body">
        <h2 className="card-title">{linkPreview.title}</h2>
        <p>{linkPreview.description}</p>
        <div className="tooltip tooltip-secondary" data-tip={linkPreview.url}>
          <Link className="btn btn-accent flex" href={linkPreview.url}>
            {linkPreview.favicons?.length && (
              <img
                src={linkPreview.favicons[0]}
                alt="favicon"
                className="w-8 h-8 mr-2"
              />
            )}
            Visit Site
          </Link>
        </div>
        <div className="card-actions justify-end"></div>
      </div>
    </div>
  );
};

export default function index({
  sheetsData,
  linkPreviews,
}: {
  sheetsData: Record<string, string>;
  links: string[];
  linkPreviews: any;
}) {
  const linkPreviewJson = JSON.parse(linkPreviews);
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
      <div className="container mx-auto px-4 sm:px-8 bg-neutral-content text-neutral-content rounded-lg shadow-lg p-10 mb-10 flex flex-col place-content-center items-center">
        <h1 className="text-4xl text-center text-neutral">
          Links to learn more!!
        </h1>
        <div className="text-center prose prose-xl text-neutral-focus">
          <p>{sheetsData.learnMoreText}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 place-items-center items-stretch w-full">
          {linkPreviewJson.map((linkPreview: any) => (
            <LinkCard key={linkPreview.url} linkPreview={linkPreview} />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const sheetsData = await getSheetsData();
  const links = await getLinksData();
  // @ts-ignore - this is a hack to get the quotes into the props
  const quotes = sheetsData.quotes as string[];
  const startingQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const linkPreviews = await Promise.all(
    links.map(async (link) => {
      const preview = await getLinkPreview(link, {
        followRedirects: "follow",
        headers: {
          "User-Agent": "googlebot",
        },
      });
      if (preview.url.includes("financing/homes/home-energy-loan")) {
        console.log(preview);
        preview.title = "Efficiency Vermont Financing";
        preview.description = "Learn more about financing options";
        preview.images = [
          "https://www.efficiencyvermont.com/Media/Default/images/home-page/home-contractor.jpg?width=480&quality=90",
          "https://www.efficiencyvermont.com/Media/Default/images/home-page/channel-marketplace.jpg",
          "https://www.efficiencyvermont.com/Media/Default/blog/HowTo/EVT-Blog-HowTo-HeatPump-Header.jpg",
        ];
      }
      if (preview.url.includes("ont.com/find-contractor-retailer")) {
        preview.title = "Efficiency Vermont Contractor Listing";
        preview.description =
          "Efficiency Excellence Network Member.\n Trained and evaluated by Efficiency Vermont to provide the highest level of professional energy efficiency services. ";
        preview.images = [
          "https://www.efficiencyvermont.com/Media/Default/images/home-page/channel-marketplace.jpg",
          "https://www.efficiencyvermont.com/Media/Default/blog/HowTo/EVT-Blog-HowTo-HeatPump-Header.jpg",
          "https://www.efficiencyvermont.com/Media/Default/images/home-page/home-contractor.jpg?width=480&quality=90",
        ];
      }
      return preview;
    })
  );

  return {
    props: {
      startingQuote,
      sheetsData,
      linkPreviews: JSON.stringify(linkPreviews),
    },
    revalidate: 30,
  };
}
