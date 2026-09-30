import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable dev-mode Server Function argument logging.
  // Next.js 16 logs every Server Action call (name + arguments) by default in
  // development. Because auth actions receive passwords and confirmPassword we
  // must turn this off so credentials are never printed to the terminal.
  logging: {
    serverFunctions: false,
  },
};

export default nextConfig;
