import "bootstrap/dist/css/bootstrap.css";
import Navbar from "@/components/navbar";
import { headers } from "next/headers";
import axios from "axios";
export const dynamic = "force-dynamic";

export const getUser = async function () {
  const headerList = headers();

  const res = await axios.get("http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/user/currentuser", {
    headers: {
      host: headerList.get("host"),
      cookie: headerList.get("cookie"),
    },
  });
  return res.data;
};

export const metadata = {
  title: "Ticketing",
  description: "Get tickets at cheap rates",
};

export default async function RootLayout({ children }) {
  const { currentUser } = await getUser();

  return (
    <html lang="en">
      <body>
        <Navbar isLogged={currentUser ? true : false} />
        <div>{children}</div>
      </body>
    </html>
  );
}
