import redis from "redis";

const client = redis
  .createClient()
  .on("error", (err) =>
    console.log("Redis client not connected to the server: " + err),
  )
  .on("ready", () => console.log("Redis client connected to the server"));

client.on("message", (channel, message) => {
  console.log(message);
  if (message === "KILL_SERVER") {
    client.unsubscribe();
    client.quit();
    return;
  }
});

client.subscribe("holberton school channel");
