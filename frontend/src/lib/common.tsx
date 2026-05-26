const user_api_url = `${import.meta.env.VITE_API_URL}/users`;
const post_api_url = `${import.meta.env.VITE_API_URL}/posts`;

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

export async function getLanguages(repoGithubUrl: string) {
  const url = `https://api.github.com/repos/${repoGithubUrl}/languages`;
  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}

export async function getProjects() {
  const url = post_api_url;
  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}

export async function getProjectById(id: string) {
  const response = await fetch(`${post_api_url}/${id}`, { method: "GET" });
  const data = await response.json();
  return data;
}

export async function addProject(data: {
  title: string;
  url: string;
  description: string;
  repoGithubUrl: string;
}) {
  const userId = localStorage.getItem("userId");
  const project = {
    userId,
    title: data.title,
    url: data.url,
    description: data.description,
    repoGithubUrl: data.repoGithubUrl,
  };
  const bodyFormData = new FormData();
  bodyFormData.append("post", JSON.stringify(project));

  try {
    return await fetch(post_api_url, {
      method: "POST",
      body: bodyFormData,
      credentials: "include",
    });
  } catch (error) {
    console.error(error);
    return { error: true, message: error };
  }
}
