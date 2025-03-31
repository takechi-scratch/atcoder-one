import { useEffect, useState } from "react";
import { Switch, Card, Text, Title, Container, TextInput } from "@mantine/core";

import { getAvailableUserscripts, setEnabledSetting, Userscript } from "../../../lib/settings";

export function Settings() {
    const [userscripts, setUserscripts] = useState([] as Userscript[]);
    const [searchQuery, setSearchQuery] = useState(""); // 検索クエリの状態を追加

    useEffect(() => {
        async function fetchUserscripts() {
            try {
                const dirEntry: FileSystemDirectoryEntry = await new Promise((resolve) => {
                    chrome.runtime.getPackageDirectoryEntry(resolve);
                });
                const scripts = await getAvailableUserscripts(dirEntry);
                setUserscripts(scripts);
            } catch (error) {
                console.error("Failed to fetch userscripts:", error);
            }
        }

        console.log("fetching userscripts");

        fetchUserscripts();
    }, []);

    const filteredUserscripts = userscripts.filter((userscript) =>
        userscript.manifest.name.toLowerCase().includes(searchQuery.toLowerCase())
    ); // 検索クエリでフィルタリング

    return (
        <Container>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Title order={1}>Settings</Title>
                <TextInput
                    placeholder="検索..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    style={{ marginBottom: "20px", marginTop: "20px", width: "300px" }}
                />
            </div>
            <div>
                {filteredUserscripts.map((userscript) => (
                    <Card
                        key={userscript.id}
                        shadow="sm"
                        padding="lg"
                        style={{ marginBottom: "10px" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                <Title order={3}>{userscript.manifest.name}</Title>
                                <Text>{userscript.manifest.description}</Text>
                                <Text size="xs" c="dimmed">
                                    製作者:{" "}
                                    <a
                                        href={userscript.manifest.credits.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {userscript.manifest.credits.author}
                                    </a>
                                    ライセンス: {userscript.manifest.credits.license}
                                </Text>
                            </div>
                            <Switch
                                checked={userscript.enabled}
                                onChange={async (event) => {
                                    try {
                                        const checked = event.currentTarget.checked;
                                        await setEnabledSetting(userscript.id, checked);
                                        userscript.enabled = checked;
                                        setUserscripts([...userscripts]);
                                    } catch (error) {
                                        console.error("Failed to update setting:", error);
                                    }
                                }}
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </Container>
    );
}
