// "use client";
import Link from "next/link";
import SignoutButton from "./signout-button";
// export const dynamic = "force-dynamic";

export default async function Navbar({ isLogged }) {
  return (
    <nav className="navbar navbar-expand-lg  bg-light navbar-light ">
      <div className="container">
        <Link className="navbar-brand" href="/">
          <img
            id="MDB-logo"
            src="https://mdbcdn.b-cdn.net/wp-content/uploads/2018/06/logo-mdb-jquery-small.png"
            alt="MDB Logo"
            draggable="false"
            height="30"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-mdb-toggle="collapse"
          data-mdb-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link mx-2" href="/tickets/index">
                View Tickets
              </Link>
            </li>
            {isLogged ? (
              <li className="nav-item">
                <Link className="nav-link mx-2" href="/tickets/create">
                  Create Ticket
                </Link>
              </li>
            ) : (
              ""
            )}
            {isLogged ? (
              <li className="nav-item">
                <a className="nav-link mx-2" href="/orders/index">
                  Your Orders
                </a>
              </li>
            ) : (
              ""
            )}
            <li className="nav-item ms-3">
              {isLogged ? (
                <SignoutButton />
              ) : (
                <Link className="btn btn-black btn-rounded" href="/user/signin">
                  <strong>Sign in</strong>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
