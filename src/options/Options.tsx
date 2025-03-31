import browser from "webextension-polyfill";

import { AppShell, Burger, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Settings } from "../app/features/settings";

const Options = () => {
    const [opened, { toggle }] = useDisclosure();
    const iconURL = browser.runtime.getURL("icons/128x128.png");

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header style={{ display: "flex", alignItems: "center" }}>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <img
                    src={iconURL}
                    alt="AtCoder One"
                    style={{ width: "30px", height: "30px", marginRight: "10px" }}
                />
                <Text fw="bold" size="xl">
                    atcoder-one
                </Text>
            </AppShell.Header>

            <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

            <AppShell.Main>
                <Settings />
            </AppShell.Main>
        </AppShell>
    );
};

export default Options;
