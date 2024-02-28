
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:8000/graphql",
  documents: "./graphql/**/*.{tsx,ts}",
  generates: {
    "gql/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
