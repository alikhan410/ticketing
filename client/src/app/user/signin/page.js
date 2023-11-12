"use client";

import useRequest from "@/hooks/useRequest";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  // const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, errors } = useRequest({
    method: "post",
    url: "api/user/signin",
    body: { email, password },
    onSuccess: () => {
      // router.push("/");
      window.location.href = "/";
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    doRequest();
  };
  return (
    <form className="container col-md-6 shadow p-3 mb-5 bg-body-tertiary rounded my-5" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email">Create a new Username</label>
        <input
          type="email"
          className="form-control "
          onChange={(e) => setEmail(e.currentTarget.value)}
          name="email"
          id="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="passwrod">Create a new Password</label>
        <input
          onChange={(e) => setPassword(e.currentTarget.value)}
          type="password"
          className="form-control"
          name="password"
          id="password"
          placeholder="Enter your password"
          required
        />
      </div>
      {errors ? errors : ""}
      <div className=" d-flex justify-content-center">
        <button className="btn btn-primary mx-1" type="submit">
          Sign in
        </button>
        <Link href="/user/signup" className="btn btn-outline-primary mx-1">
          Sign up
        </Link>
      </div>
    </form>
  );
}
