import Table from "@/components/table";
import axios from "axios";
export const dynamic = "force-dynamic";
import { headers } from "next/headers";

async function getOrders() {
  const headerList = headers();
  const res = await axios.get("http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/orders", {
    headers: {
      host: headerList.get("host"),
      cookie: headerList.get("cookie"),
    },
  });
  return res.data;
}

export default async function Page() {
  const orders = await getOrders();

  return (
    <div className="container">
      <Table data={orders} />;
    </div>
  );
}
