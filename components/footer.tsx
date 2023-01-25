import { AiFillFacebook } from "react-icons/ai";
export function Footer() {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <div className="grid sm:grid-cols-2 w-full items-center">
        <p className="text-center">
          <a href="tel:802-249-4858">802-249-4858</a>
        </p>
        <p className="text-center">
          <a href="sales@northcounty.cool">
            Email:
            <span className="text-primary-content">
              {" "}
              sales@northcountry.cool
            </span>
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
