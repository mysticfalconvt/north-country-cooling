import { AiFillFacebook } from "react-icons/ai";
import { HiOutlineMailOpen } from "react-icons/hi";
import { BiPhoneCall } from "react-icons/bi";
export function Footer() {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <div className="flex flex-wrap justify-around gap-5 w-full items-center">
        <p className="text-center">
          <a href="tel:802-249-4858" className="flex gap-2 items-center">
            <BiPhoneCall size={32} />
            802-249-4858
          </a>
        </p>
        <p className="flex">
          <a
            href="mailto:sales@northcounty.cool"
            className="flex gap-2 items-center"
          >
            <HiOutlineMailOpen size={32} /> sales@northcountry.cool
          </a>
        </p>
        <p>
          <a
            href="https://www.facebook.com/NorthCountryCooling/"
            className="flex gap-2 items-center"
          >
            <AiFillFacebook size={32} />
          </a>
        </p>
      </div>
    </footer>
  );
}
