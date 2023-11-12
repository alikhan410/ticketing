"use client";

import useRequest from "@/hooks/useRequest";
import { useRouter } from "next/navigation";

export default function PurchaseButton({ ticketId }) {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    method: "post",
    url: "api/orders",
    body: { ticketId },
    onSuccess: (order) => {
      router.push(`/orders/${order.id}`);
      // window.location.href = "/";
    },
  });
  const purchase = async function () {
    doRequest();
  };
  return (
    <div>
      <button className="btn btn-primary btn-rounded" onClick={purchase}>
        <strong>Purchase</strong>
      </button>
      {errors ? errors : ""}
    </div>
  );
}
