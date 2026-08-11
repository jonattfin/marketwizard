import { mswLoader } from "msw-storybook-addon/csf3";
import { Preview } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// @ts-ignore
import { Provider } from "@/components/ui/provider";
import { Box, Theme } from "@chakra-ui/react";

const queryClient = new QueryClient();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  // Provide the MSW addon loader globally
  loaders: [mswLoader()],
  decorators: [
    (Story, {}) => {
      return (
        <Provider>
          <QueryClientProvider client={queryClient}>
            <Theme appearance={"light"}>
              <Box padding="50px">
                <Story />
              </Box>
            </Theme>
          </QueryClientProvider>
        </Provider>
      );
    },
  ],
};

export default preview;
