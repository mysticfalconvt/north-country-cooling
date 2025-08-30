import { getSheetsData } from '@/utils/api';
import Head from 'next/head';
import { FaFacebookSquare } from 'react-icons/fa';

export default function index({
  sheetsData,
  contactLinks = [],
}: {
  sheetsData: any;
  contactLinks?: any[];
}) {
  return (
    <>
      <Head>
        <title>{sheetsData.title}: Contact</title>
        <meta
          name="description"
          content="North Country Cooling AC air conditioning contractor contact info"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="container mx-auto px-4 sm:px-8 bg-neutral-content text-neutral-content rounded-lg shadow-lg p-10 mb-10">
        <h1 className="text-4xl text-center text-neutral">Contact Me!</h1>
        <p className="text-center text-neutral text-lg p-10">
          {sheetsData.contactMeContent}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 place-items-center items-stretch w-full">
          {contactLinks.length > 0 ? (
            contactLinks.map((contact) => (
              <div
                key={contact.id}
                className="card w-96 bg-primary text-primary-content shadow-xl"
              >
                <div className="card-body">
                  <div className="flex items-center gap-3">
                    {contact.linkImage && (
                      <span className="text-2xl">{contact.linkImage}</span>
                    )}
                    <h2 className="card-title">{contact.linkName}</h2>
                  </div>
                  <p>{contact.text}</p>
                  <p className="font-mono text-sm">
                    {contact.linkType === 'call' && contact.linkValue}
                    {contact.linkType === 'email' && (
                      <a href={`mailto:${contact.linkValue}`}>
                        {contact.linkValue}
                      </a>
                    )}
                    {contact.linkType === 'url' && (
                      <a
                        href={contact.linkValue}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {contact.linkValue}
                      </a>
                    )}
                  </p>
                  <div className="card-actions justify-end">
                    <button className="btn">
                      <a
                        href={
                          contact.linkType === 'call'
                            ? `tel:${contact.linkValue}`
                            : contact.linkType === 'email'
                              ? `mailto:${contact.linkValue}`
                              : contact.linkValue
                        }
                        {...(contact.linkType === 'url'
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {contact.linkName}
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback to original hardcoded contact info if no database contact links
            <>
              <div className="card w-96 bg-primary text-primary-content shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Call Me!</h2>
                  <p>{sheetsData.callMe}</p>
                  <p>802-249-4858</p>
                  <div className="card-actions justify-end">
                    <button className="btn">
                      <a href="tel:802-249-4858">Call Now</a>
                    </button>
                  </div>
                </div>
              </div>
              <div className="card w-96 bg-primary text-primary-content shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Email Me!</h2>
                  <p>{sheetsData.emailMe}</p>
                  <p>
                    <a href="mailto:sales@northcountry.cool">
                      sales@northcountry.cool
                    </a>
                  </p>
                  <div className="card-actions justify-end">
                    <button className="btn">
                      <a href="mailto:sales@northcountry.cool">Email Now</a>
                    </button>
                  </div>
                </div>
              </div>
              <div className="card w-96 bg-primary text-primary-content shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Check out my Facebook Page</h2>
                  <p>{sheetsData.facebookMe}</p>
                  <div className="card-actions justify-end">
                    <button className="btn ">
                      <a
                        href="https://www.facebook.com/NorthCountryCooling"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaFacebookSquare size={34} />
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const sheetsData = await getSheetsData();
  // @ts-ignore - this is a hack to get the quotes into the props
  const quotes = sheetsData.quotes as string[];
  const startingQuote =
    quotes && quotes.length > 0
      ? quotes[0] // Use first quote for consistent server-side rendering
      : 'Quality HVAC service you can trust.'; // Default quote

  // Fetch contact links
  let contactLinks = [];
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/contact-links`,
    );
    if (response.ok) {
      contactLinks = await response.json();
    }
  } catch (error) {
    console.error('Error fetching contact links:', error);
  }

  return {
    props: {
      startingQuote,
      sheetsData,
      contactLinks,
    },
    revalidate: 30,
  };
}
