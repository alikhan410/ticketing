"use client";

import useRequest from "@/hooks/useRequest";
// import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTicket() {
  // const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    method: "post",
    url: "api/tickets",
    body: { title, price },
    onSuccess: () => {
      // router.push("/");
      window.location.href = "/tickets/index";
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    doRequest();
  };
  return (
    <form className="container col-md-6 shadow p-3 mb-5 bg-body-tertiary rounded my-5" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title">Create a new Ticket</label>
        <input
          type="title"
          className="form-control "
          onChange={(e) => setTitle(e.currentTarget.value)}
          name="title"
          id="title"
          placeholder="Enter your title"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="price">Set your ticket price</label>
        <input
          onChange={(e) => setPrice(e.currentTarget.value)}
          type="price"
          className="form-control"
          name="price"
          id="price"
          placeholder="Enter your price"
          required
        />
      </div>
      {errors ? errors : ""}
      <div className="container col-md-6">
        <button className="btn btn-primary container my-2" type="submit">
          Create a ticket
        </button>
      </div>
    </form>
  );
}
