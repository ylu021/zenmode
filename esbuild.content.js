import esbuild from "esbuild";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import postcss from "postcss";
import postcssPlugin from "esbuild-style-plugin";

const postCSSProcessor = postcss([tailwindcss, autoprefixer]);

esbuild
  .build({
    entryPoints: ["src/content.tsx"],
    bundle: true,
    outfile: "dist/content.js",
    format: "iife",
    jsx: "automatic",
    plugins: [
      postcssPlugin({
        postcss: postCSSProcessor,
      }),
    ],
    loader: {
      ".css": "css",
    },
    logLevel: "info",
  })
  .catch(() => process.exit(1));
