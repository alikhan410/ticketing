"use client";

import useRequest from "@/hooks/useRequest";

export default function SignoutButton() {
  const { doRequest, errors } = useRequest({
    method: "get",
    url: "api/user/signout",
    onSuccess: () => {
      // router.push("/");
      window.location.href = "/";
    },
  });
  const signout = async function () {
    doRequest();
  };
  return (
    <button className="btn btn-black btn-rounded" onClick={signout}>
      <strong>Sign out</strong>
    </button>
  );
}
