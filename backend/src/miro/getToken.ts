import { getEnvOrThrow } from "./../utils/config";
import axios from "axios";

export async function grabToken(req: any, res: any): Promise<any> {
  let access_token: string;
  let refresh_token: string;

  if (req.query.code) {
    // #3:
    // ---> Request `access_token` and `refresh_token` pair by making a request to Miro /oauth endpoint.
    // ---> Required parameters include `grant_type`, `client_id`, `client_secret`, `code`, and `redirect_uri`.
    // ---> See full details in Miro documentation here: https://developers.miro.com/docs/getting-started-with-oauth#step-3

    let url = `https://api.miro.com/v1/oauth/token?grant_type=authorization_code&client_id=${getEnvOrThrow(
      "MIRO_CLIENT_ID"
    )}&client_secret=${getEnvOrThrow("MIRO_CLIENT_SECRET")}&code=${
      req.query.code
    }&redirect_uri=${getEnvOrThrow("MIRO_REDIRECT_URL")}`;

    async function grabToken() {
      try {
        let oauthResponse = await axios.post(url);

        // Console log access_token and reference_token:
        console.log(`access_token: ${oauthResponse.data.access_token}`);
        console.log(`refresh_token: ${oauthResponse.data.refresh_token}`);

        // Set global variable for access_token and refresh_token values
        access_token = oauthResponse.data.access_token;
        refresh_token = oauthResponse.data.refresh_token;

        // #4:
        // ---> If `access_token` was successfully retrieved, send an API request to any Miro endpoint that contains the same permissions as your OAuth 2.0 app, with `access_token` as value for Bearer Token.
        // ---> (See permissions under user profile > apps: https://miro.com/app/settings/user-profile/apps)
        if (access_token) {
          return access_token;
        } else res.send(401);
      } catch (err) {
        console.log(`ERROR: ${err}`);
      }
    }
    return grabToken();
  }
  // ---> #2:
  // ---> If no authorization code is present, redirect to Miro OAuth to authorize retrieve new `code`.
  res.redirect(
    "https://miro.com/oauth/authorize?response_type=code&client_id=" +
      getEnvOrThrow("MIRO_CLIENT_ID") +
      "&redirect_uri=" +
      getEnvOrThrow("MIRO_REDIRECT_URL")
  );
}
