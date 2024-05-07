import kue from "kue";

const queue = kue.createQueue();
const qData = {
  phoneNumber: "+238484934201",
  message: "Some message yea",
};
const job = queue.create("push_notification_code", qData).save();
job.on("enqueue", () => console.log("Notification job created: " + job.id));
job.on("complete", () => console.log("Notification job completed"));
job.on("failed", () => console.log("Notification job failed"));
