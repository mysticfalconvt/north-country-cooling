import { getSiteDataDirect, getLinksDataDirect } from "@/lib/data";
import { getLinkPreview } from "link-preview-js";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
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
          <Image
            src={linkPreview.images[currentImage]}
            alt={`thumbnail image for ${linkPreview.title}`}
            width={384}
            height={200}
            className="object-cover"
          />
        </figure>
      ) : null}
      <div className="card-body">
        <h2 className="card-title">{linkPreview.title}</h2>
        <p>{linkPreview.description}</p>
        <div className="tooltip tooltip-secondary" data-tip={linkPreview.url}>
          <Link className="btn btn-accent flex" href={linkPreview.url}>
            {linkPreview.favicons?.length && (
              <Image
                src={linkPreview.favicons[0]}
                alt="favicon"
                width={32}
                height={32}
                className="mr-2"
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
        <title>{Array.isArray(sheetsData.title) ? sheetsData.title.join(' ') : sheetsData.title || 'North Country Cooling'}</title>
        <meta
          name="description"
          content="North Country Cooling more information about air conditioning and heat pump"
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
  const sheetsData = await getSiteDataDirect();
  const links = await getLinksDataDirect();
  // @ts-ignore - this is a hack to get the quotes into the props
  const quotes = sheetsData.quotes as string[];
  const startingQuote = quotes && quotes.length > 0 
    ? quotes[0] // Use first quote for consistent server-side rendering
    : "Quality HVAC service you can trust."; // Default quote
  const linkPreviews = await Promise.all(
    links.map(async (linkData) => {
      // Handle both string (old format) and object (new format) link data
      const link: { url: string; title: string | null; description: string | null; images: string[] | null } = typeof linkData === 'string' 
        ? { url: linkData, title: null, description: null, images: null } 
        : linkData;
      
      try {
        const preview: any = await getLinkPreview(link.url, {
          followRedirects: "follow",
          headers: {
            "User-Agent": "googlebot",
          },
        });

        // Use custom data from database if provided
        if (link.title) {
          preview.title = link.title;
        }
        if (link.description) {
          preview.description = link.description;
        }
        if (link.images && Array.isArray(link.images) && link.images.length > 0) {
          preview.images = link.images;
        }
        
        return preview;
      } catch (error) {
        console.error(`Error getting preview for ${link.url}:`, error);
        // Return a fallback preview if link preview fails
        return {
          url: link.url,
          title: link.title || link.url,
          description: link.description || 'Click to visit this resource',
          images: link.images || [],
          favicons: []
        };
      }
    })
  );

  return {
    props: {
      startingQuote,
      sheetsData,
      linkPreviews: JSON.stringify(linkPreviews),
    },
    revalidate: 5,
  };
}
