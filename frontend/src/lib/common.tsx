const user_api_url = `${import.meta.env.VITE_API_URL}/users`;

export async function getAuthUser() {
  const url = `${user_api_url}/isAuth`;
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
  const url = `${user_api_url}/login`;
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
  const url = `${user_api_url}/logout`;
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

export async function signUpUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const url = `${user_api_url}/signup`;
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
