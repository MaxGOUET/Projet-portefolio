export async function getAuthUser() {
  const url = "http://localhost:4000/api/users/isAuth";
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const url = "http://localhost:4000/api/users/login";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

export async function logoutUser() {
  const url = "http://localhost:4000/api/users/logout";
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
  });
  const data = await response.json();
  return data;
}
