import { useEffect, useState } from "react";
import { Switch, Card, Text, Title, Container, MantineProvider } from "@mantine/core";

import { getAvailableUserscripts, setEnabledSetting, Userscript } from "../../../lib/settings";

export function Settings() {
    const [userscripts, setUserscripts] = useState([] as Userscript[]);

    useEffect(() => {
        async function fetchUserscripts() {
            const dirEntry: DirectoryEntry = await new Promise((resolve) => {
                chrome.runtime.getPackageDirectoryEntry(resolve);
            });
            const scripts = await getAvailableUserscripts(dirEntry);
            setUserscripts(scripts);
        }

        console.log("fetching userscripts");

        fetchUserscripts();
    }, []);

    return (
        <MantineProvider>
            <Container>
                <Title order={1}>Settings</Title>
                <Text>拡張機能の設定ができます！</Text>
                <div>
                    {userscripts.map((userscript) => (
                        <Card
                            key={userscript.id}
                            shadow="sm"
                            padding="lg"
                            style={{ marginBottom: "10px" }}
                        >
                            <Title order={3}>{userscript.manifest.name}</Title>
                            <Text>{userscript.manifest.description}</Text>
                            <Switch
                                checked={userscript.enabled}
                                onChange={(event) =>
                                    setEnabledSetting(userscript.id, event.currentTarget.checked)
                                }
                                label="有効"
                            />
                        </Card>
                    ))}
                </div>
            </Container>
        </MantineProvider>
    );
}
