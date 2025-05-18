import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "prefix" | "presets" | "content" |"theme"> = {
  content: [
    "./src/**/*.tsx",
    "./node_modules/rizzui/dist/*.{js,ts,jsx,tsx}",
    '../../packages/isomorphic-core/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mainTextColor:"#003049",
        redColor:"#E84654"
      },
        fontFamily: {
        // rubik: ['Rubik', 'sans-serif'],
        elTajawal: ['var(--font-el-tajawal)', 'sans-serif'],
        elMessiri: ['var(--font-el-messiri)', 'sans-serif'],
      },
      backgroundImage: {
        'HeaderGradient': 'linear-gradient(to bottom, #fff , #FAD5D8 )',
        'Maingradient': 'linear-gradient(180deg, #ED6470 0%, #E63948 100%)',
      },

    }
  },
  presets: [sharedConfig],
};

export default config;
