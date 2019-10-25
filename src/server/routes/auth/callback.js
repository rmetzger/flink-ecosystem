import qs from "querystring";
import axios from "axios";

exports.get = async ctx => {
  const { code, state } = qs.decode(ctx.request.querystring);

  // We saved the crypto value in a cookie when we made the request, check to
  // see that it matches the response from github
  if (ctx.cookies.get("state") !== state) {
    ctx.throw(406);
  }

  const data = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code,
    redirect_uri: `${process.env.SITE_DOMAIN}/auth/callback`,
    state,
  };

  const headers = {
    Accept: "application/json",
  };

  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      data,
      { headers }
    );

    ctx.cookies.set("github-token", response.data.access_token, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
      httpOnly: false,
    });

    ctx.cookies.set("state", null);
    ctx.body = `
      <!DOCTYPE html><html><head><script>
        window.opener.postMessage('github-login-success', window.location.origin);
      </script></head><body></body></html>
    `;
  } catch (e) {
    ctx.throw(500);
  }
};
