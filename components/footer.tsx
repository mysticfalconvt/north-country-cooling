import { AiFillFacebook } from "react-icons/ai";
import { HiOutlineMailOpen } from "react-icons/hi";
import { BiPhoneCall } from "react-icons/bi";
export function Footer() {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <div className="grid sm:grid-cols-2 w-full items-center">
        <p className="text-center">
          <a href="tel:802-249-4858">
            <BiPhoneCall size={32} />
            802-249-4858
          </a>
        </p>
        <p className="text-center">
          <a href="mailto:sales@northcounty.cool">
            <HiOutlineMailOpen size={32} /> sales@northcountry.cool
          </a>
        </p>
        <p>
          <a href="https://www.facebook.com/NorthCountryCooling/">
            <AiFillFacebook size={32} />
          </a>
        </p>
      </div>
    </footer>
  );
}
