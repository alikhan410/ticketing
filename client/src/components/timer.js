"use client";

import useRequest from "@/hooks/useRequest";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

export default function Timer({ date, id }) {
  const [timeLeft, setTimeLeft] = useState("");

  const { doRequest, errors } = useRequest({
    method: "post",
    url: "api/payments",
    body: {
      orderId: id,
    },
    onSuccess: () => {
      // router.push("/");
      window.location.href = "/";
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(date) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, []);

  if (timeLeft < 0) {
    return (
      <div className="alert alert-danger" role="alert">
        Order Expired
      </div>
    );
  }

  return (
    <div>
      <p className="card-text mt-3">You have {timeLeft} seconds to pay</p>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51OAMLgJlzKJeJaWJR0Io6NyvMyVIOfTQg3mIUYiQAAgfTetMgeQnZlgUWy8wFBtxRAssiY390waQYuS2QUTTDcB700wqd9Fgm4"
      />
    </div>
  );
}
