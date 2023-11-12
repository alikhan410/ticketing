import axios from "axios";
export const dynamic = "force-dynamic";
import { headers } from "next/headers";
async function getUser() {
  const headerList = headers();
  const res = await axios.get("http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/user/currentuser", {
    headers: {
      host: headerList.get("host"),
      cookie: headerList.get("cookie"),
    },
  });
  return res.data;
  // const res = await fetch("http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/user/currentuser", {
  //   cache: "no-store",
  //   method: "GET",
  //   headers: headerList,
  // });
  // if (!res.ok) {
  //   throw new Error(`Failed to fetch data, ${res.status}`);
  // }
  // return res.json();
}

export default async function Home() {
  const { currentUser } = await getUser();
  return <h1>{currentUser ? "User is signed in" : "User is not signed in"}</h1>;
}
// const res = await axios.get("http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/user/currentuser", {
//   headers: {
//     host: headersList.get("host"),
//     cookie: headersList.get("cookie"),
//   },
// });
// return res.data;
