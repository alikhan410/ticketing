import PurchaseButton from "@/components/purchaseButton";
import axios from "axios";
export const dynamic = "force-dynamic";
import { headers } from "next/headers";

async function getTicket(id) {
  const headerList = headers();

  const res = await axios.get(`http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets/${id}`, {
    headers: {
      host: headerList.get("host"),
      cookie: headerList.get("cookie"),
    },
  });
  return res.data;
}

export default async function Page({ params }) {
  const ticket = await getTicket(params.id);

  const status = ticket.orderId ? (
    <span className="badge text-bg-warning">Reserved</span>
  ) : (
    <span className="badge text-bg-success">Available</span>
  );

  return (
    <div className="container mt-5">
      <div className="card w-25">
        <div className="card-body">
          <h5 className="card-title">{ticket.title}</h5>
          {status}
          <p className="card-text mt-3">Price: {ticket.price}</p>
          <PurchaseButton ticketId={params.id} />
        </div>
      </div>
    </div>
  );
}
