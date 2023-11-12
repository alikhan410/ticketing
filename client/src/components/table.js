import Link from "next/link";
import React from "react";

export default function Table({ data }) {
  return (
    <table className="table table-striped">
      <thead className="thead-dark">
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>
              <span className="badge text-bg-warning">{item.status}</span>
            </td>
            <td>
              <Link href={`/orders/${item.id}`} className="btn btn-link">
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
