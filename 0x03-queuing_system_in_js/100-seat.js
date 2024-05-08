import { createClient } from "redis";
import { promisify } from "util";
import kue from "kue";
import express from "express";

const redisClient = createClient();
const queue = kue.createQueue();
const app = express();
const reservationEnabled = true;

function reserveSeat(number) {
  redisClient.set("available_seats", number);
}

async function getCurrentAvailableSeats() {
  const getter = promisify(redisClient.get).bind(redisClient);
  const seats = await getter("available_seats");
  return Number(seats);
}

reserveSeat(50);

app.get("/available_seats", async (request, response) => {
  const seatsAvailable = await getCurrentAvailableSeats();
  return response.json({ numberOfAvailableSeats: seatsAvailable });
});

app.get("/reserve_seat", (request, response) => {
  if (!reservationEnabled)
    return response.json({ status: "Reservation are blocked" });
  const job = queue.create("reserve_seat").save((err) => {
    if (err) return response.json({ status: "Reservation failed" });
  });
  job.on("enqueue", () => {
    return response.json({ status: "Reservation in Process" });
  });
  job.on("failed", (err) =>
    console.log("Seat reservation job " + job.id + " failed: " + err),
  );
  job.on("complete", () =>
    console.log("Seat reservation job " + job.id + " completed"),
  );
});

app.get("/process", async (request, response) => {
  queue.process("reserve_seat", async (job, done) => {
    const seatsAvailable = await getCurrentAvailableSeats();
    const newAvailbleSeats = seatsAvailable - 1;
    if (newAvailbleSeats == 0) reservationEnabled = false;
    if (newAvailbleSeats >= 0) {
      reserveSeat(newAvailbleSeats);
      done();
      return;
    }
    done(new Error("Not enough seats available"));
  });
  response.json({ status: "Queue processing" });
});
app.listen(1245);
