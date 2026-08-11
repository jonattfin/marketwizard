import { Stack, Blockquote, Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";

import { Logo } from "@/shared/logo";
import { LuLinkedin, LuTwitter, LuYoutube } from "react-icons/lu";

export default function Footer() {
  return (
    <Stack>
      <div>&nbsp;</div>
      <Flex gap="6" justify="space-evenly" wrap="wrap">
        <Stack>
          <Blockquote.Root colorPalette={"orange"}>
            <Blockquote.Content>Markets</Blockquote.Content>
          </Blockquote.Root>
          <div>&nbsp;</div>
          <div>
            <Link href={"#"}>US: NYSE and NASDAQ</Link>
          </div>
          <div>
            <Link href={"#"}>UK: FTSE</Link>
          </div>
          <div>
            <Link href={"#"}>Japan: NIKKEI</Link>
          </div>
          <div>
            <Link href={"#"}>Germany: DAX</Link>
          </div>
        </Stack>

        <Stack>
          <Blockquote.Root colorPalette={"orange"}>
            <Blockquote.Content>Guides</Blockquote.Content>
          </Blockquote.Root>
          <div>&nbsp;</div>
          <div>
            <Link href={"#"}>{"What is a lazy portfolio?"}</Link>
          </div>
          <div>
            <Link href={"#"}>{"How to invest?"}</Link>
          </div>
        </Stack>

        <Stack>
          <Blockquote.Root colorPalette={"orange"}>
            <Blockquote.Content>Market Wizard</Blockquote.Content>
          </Blockquote.Root>
          <div>&nbsp;</div>
          <div>
            <Link href={"#"}>Plans and pricing</Link>
          </div>
          <div>
            <Link href={"#"}>About us</Link>
          </div>
          <div>
            <Link href={"#"}>Our people</Link>
          </div>
          <div>
            <Link href={"#"}>Contact us</Link>
          </div>
        </Stack>
      </Flex>
      <div>&nbsp;</div>
      <Flex gap="6" justify="flex-start" wrap="wrap">
        <Stack>
          <Logo />
          <Stack direction={"row"}>
            <Link href={"#"}>
              <Icon fontSize="2xl" color="orange.300">
                <LuLinkedin />
              </Icon>
            </Link>
            <Link href={"#"}>
              <Icon fontSize="2xl" color="orange.300">
                <LuYoutube />
              </Icon>
            </Link>

            <Link href={"#"}>
              <Icon fontSize="2xl" color="orange.300">
                <LuTwitter />
              </Icon>
            </Link>
          </Stack>
          <div>
            <Text textStyle={"sm"} color={"gray.500"}>
              The data presented here is fictitious and intended solely for
              demonstration purposes. We are currently integrating multiple APIs
              to provide actual data in the future.
            </Text>
          </div>
        </Stack>
      </Flex>
      <div>&nbsp;</div>
      <Stack>
        <div>
          <div>DISCLAIMER</div>
          <div>&nbsp;</div>
          Market Wizard is not a financial advisor. The information provided on
          this website is for educational purposes only. We do not provide
          investment advice. Please consult a professional before making any
          financial decisions.
        </div>
        <div>
          <div>&nbsp;</div>© 2025 Market Wizard
        </div>
      </Stack>
    </Stack>
  );
}
