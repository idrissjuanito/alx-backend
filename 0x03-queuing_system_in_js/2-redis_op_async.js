import redis from "redis";
import { promisify } from "util";

const client = redis
  .createClient()
  .on("error", (err) =>
    console.log("Redis client not connected to the server: " + err),
  )
  .on("ready", () => console.log("Redis client connected to the server"));

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redis.print);
}

function displaySchoolValue(schoolName) {
  const getter = promisify(client.get).bind(client);
  getter(schoolName)
    .then((reply) => console.log(reply))
    .catch((err) => console.log(err));
}

displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");
