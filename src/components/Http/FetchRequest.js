import auth from "../../auth";

const FetchRequest = async (requestConfig) => {
  const headers = { "x-auth-token": auth.getJwt() };

  if (requestConfig.method === "POST") {
    headers["Accept"] = "application/json";
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(requestConfig.url, {
    method: requestConfig.method ? requestConfig.method : "GET",
    headers,
    body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
  });
  const data = await res.json();
  return data;
};

export default FetchRequest;
