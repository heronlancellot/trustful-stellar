import type { Preview } from "@storybook/react";
import "@/styles/globals.css";
import "@/styles/card-link.css";
import "@/styles/content-tabs.css";
import "@/styles/custom-table.css";
import "tailwindcss/tailwind.css";
import { withWagmiProvider } from "./decorators";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withWagmiProvider],
};

export default preview;
