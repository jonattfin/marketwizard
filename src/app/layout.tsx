"use client";

import { Provider } from "@/components/ui/provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import { ThemeContext } from "@emotion/react";
import { AppThemeContext } from "@/shared/context/theme-context";
import { Center, Container, Flex, Separator, Theme } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "@/shared/header";
import Footer from "@/shared/footer";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>
          <AppThemeContext.Provider value={theme}>
            <ThemeContext value={theme}>
              <Theme appearance={theme}>
                <main>
                  <Container>
                    <QueryClientProvider client={queryClient}>
                      <Flex
                        gap="10"
                        direction="column"
                        justify="flex-start"
                        minHeight={"100vh"}
                      >
                        <div>
                          <div>&nbsp;</div>
                          <Header
                            theme={theme}
                            setTheme={(theme) => setTheme(theme)}
                          />
                          <div>&nbsp;</div>
                          <Separator />
                        </div>
                        <Center>
                          <Flex width={"95%"} direction={"column"}>
                            {children}
                          </Flex>
                        </Center>
                        <Toaster />
                        <>
                          <Separator />
                          <Footer />
                          <div>&nbsp;</div>
                        </>
                      </Flex>
                      <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                  </Container>
                </main>
                <Analytics />
                <SpeedInsights />
              </Theme>
            </ThemeContext>
          </AppThemeContext.Provider>
        </Provider>
      </body>
    </html>
  );
}
