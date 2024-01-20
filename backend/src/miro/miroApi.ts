import { getEnvOrDefault, getEnvOrThrow } from "./../utils/config";
// Import the 'Miro' object
import { Miro, MiroApi, MiroOptions } from "@mirohq/miro-api";

// Create a new instance of the Miro object
const options: MiroOptions = {
  clientId: getEnvOrDefault("MIRO_CLIENT_ID", ""),
  clientSecret: getEnvOrDefault("MIRO_CLIENT_SECRET", ""),
  redirectUrl: getEnvOrThrow("MIRO_REDIRECT_URL")
};

const miro = new Miro(options);

export const getApi = (userId: string, code: string): MiroApi => {
  miro.exchangeCodeForAccessToken(getEnvOrDefault("MIRO_USER_ID", ""), code);

  return miro.as(userId);
};
