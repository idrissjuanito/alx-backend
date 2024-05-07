import kue from "kue";
import { expect, assert } from "chai";
import createPushNotificationsJobs from "./8-job";
import { jobs as jobList } from "./7-job_creator";

describe("Testing create push notifications jobs function", () => {
  const queue = kue.createQueue();

  before(function () {
    queue.testMode.enter(true);
  });

  afterEach(function () {
    queue.testMode.clear();
  });

  after(function () {
    queue.testMode.exit();
  });
  it("throws error when called with none array", () => {
    assert.throws(createPushNotificationsJobs, TypeError);
  });
  it("count number of jobs created", () => {
    createPushNotificationsJobs(jobList, queue);
    expect(queue.testMode.jobs.length).to.equal(jobList.length);
    // expect(queue.testMode.jobs[0].type).to.equal("myJob");
    // expect(queue.testMode.jobs[0].data).to.eql({ foo: "bar" });
  });
});
