import axios from "axios";
export const dynamic = "force-dynamic";
import { headers } from "next/headers";

async function getTickets() {
  const headerList = headers();
  const res = await axios.get("http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets", {
    headers: {
      host: headerList.get("host"),
      cookie: headerList.get("cookie"),
    },
  });
  return res.data;
}

export default async function Page() {
  const tickets = await getTickets();

  return (
    <div className="container mt-5">
      <div className="row row-cols-3">
        {tickets.map((item) => (
          <div key={item.id} className="card col">
            <div className="card-body">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <h6 className="card-subtitle mb-2 text-body-secondary">${item.price}</h6>
                <a href={`/tickets/show/${item.id}`} className="btn btn-primary">
                  View Ticket
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// [
//   {
//     title: 'concert',
//     price: 12,
//     userId: '654bd04276b8858b15f31aa1',
//     version: 0,
//     id: '654be54356b49ec1c645e8cc'
//   }
// ]
