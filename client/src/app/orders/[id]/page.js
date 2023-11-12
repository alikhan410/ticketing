import Timer from "@/components/timer";
import axios from "axios";
export const dynamic = "force-dynamic";
import { headers } from "next/headers";
import React from "react";

async function getTicket(id) {
  const headerList = headers();

  const res = await axios.get(`http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/orders/${id}`, {
    headers: {
      host: headerList.get("host"),
      cookie: headerList.get("cookie"),
    },
  });
  return res.data;
}

export default async function Page({ params }) {
  const order = await getTicket(params.id);
  const timeLeft = Math.round((new Date(order.expiresAt) - new Date()) / 1000);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  //   const status = order.status ? (
  //     <span className="badge text-bg-warning">Reserved</span>
  //   ) : (
  //     <span className="badge text-bg-success">Available</span>
  //   );

  return (
    <div className="container mt-5">
      <div className="card w-25">
        <div className="card-body">
          <h5 className="card-title">Order:{order.id}</h5>
          <p>Amount: {order.ticket.price}</p>
          <Timer date={order.expiresAt} id={params.id} />
        </div>
      </div>
    </div>
  );
}
