declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [props: string]: string;
    }
  }
}

export {};
