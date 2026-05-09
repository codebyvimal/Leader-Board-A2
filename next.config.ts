import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid incorrect root inference when multiple lockfiles exist on the machine.
    root: path.join(__dirname),
  },
};

export default nextConfig;
