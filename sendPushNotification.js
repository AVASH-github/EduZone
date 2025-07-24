
const expoPushToken = "ExponentPushToken[0gGT1nBSKNh5e7jb3PO_1a]";

async function sendTestPush() {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Test Notification",
    body: "Hello from direct test!",
    data: { test: true },
  };

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const data = await response.json();
  console.log("Push response:", data);
}

sendTestPush().catch(console.error);
