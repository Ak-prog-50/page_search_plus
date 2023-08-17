export enum NODE_ENVS {
  dev = "dev",
  prod = "prod",
}

export const GET_DB_URL = (): string => {
  const { NODE_ENV, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (NODE_ENV === NODE_ENVS.prod) {
    return `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.wdk122r.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
  } else if (NODE_ENV === NODE_ENVS.dev) {
    return "mongodb://localhost:27017/jetzi_local_db";
  }
  throw new Error("NODE_ENV should be dev or prod");
};

export const GET_FRONTEND_URL = () => {
  if (process.env.NODE_ENV_SECONDARY === NODE_ENVS.dev) {
    return "http://localhost:5173";
  } else return "prod_url";
};

export const winston_format = (key: string, msg: string): string =>
  `key => ${key} *msg: ${msg}`;
