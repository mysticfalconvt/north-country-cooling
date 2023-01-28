import { getSheetsData } from "@/utils/api";
import React from "react";
import { FaFacebookSquare } from "react-icons/fa";

export default function index({ sheetsData }: { sheetsData: any }) {
  return (
    <div className="container mx-auto px-4 sm:px-8 bg-neutral-content text-neutral-content rounded-lg shadow-lg p-10 mb-10">
      <h1 className="text-4xl text-center text-neutral">Contact Me!</h1>
      <p className="text-center text-neutral text-lg p-10">
        {sheetsData.contactMeContent}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 place-items-center items-stretch w-full">
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
      </div>
    </div>
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
