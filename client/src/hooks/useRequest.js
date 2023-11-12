import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default ({ method, url, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const router = useRouter();
  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](`https://ticketing.dev/${url}`, { ...body, ...props });
      if (onSuccess) {
        onSuccess(response.data);
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setErrors(
        error.response.data.length > 0 ? (
          <ul className="list-group">
            {error.response.data.map((err, id) => (
              <li key={id} className="list-group-item list-group-item-danger my-1">
                {err.message}
              </li>
            ))}
          </ul>
        ) : (
          ""
        )
      );
    }
  };
  return { doRequest, errors };
};
