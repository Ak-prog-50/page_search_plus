namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "dev" | "prod";
    PORT: string;
    MONGO_URI: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
  }
}
