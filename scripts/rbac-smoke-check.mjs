const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";

async function login(email, password = "admin123") {
  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
  const csrfJson = await csrfRes.json();
  const csrfCookie = (csrfRes.headers.get("set-cookie") || "").split(";")[0];

  const form = new URLSearchParams({
    csrfToken: csrfJson.csrfToken,
    email,
    password,
    callbackUrl: `${baseUrl}/dashboard`,
    redirect: "false",
  });

  const loginRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      cookie: csrfCookie,
    },
    body: form,
    redirect: "manual",
  });

  const authCookieRaw = loginRes.headers.get("set-cookie") || "";
  const authCookie = authCookieRaw
    .split(",")
    .map((chunk) => chunk.split(";")[0])
    .join("; ");

  return `${csrfCookie}; ${authCookie}`;
}

async function checkPath(cookie, path) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { cookie },
    redirect: "manual",
  });
  return {
    path,
    status: res.status,
    location: res.headers.get("location"),
  };
}

async function main() {
  const adminCookie = await login("admin.produksi@blacksherpa.id");
  const qcCookie = await login("qc@blacksherpa.id");

  const checks = await Promise.all([
    checkPath(adminCookie, "/dashboard/reports"),
    checkPath(adminCookie, "/dashboard/users"),
    checkPath(qcCookie, "/dashboard/qc"),
    checkPath(qcCookie, "/dashboard/production"),
    checkPath(qcCookie, "/dashboard/settings"),
  ]);

  console.log(JSON.stringify({ baseUrl, checks }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
