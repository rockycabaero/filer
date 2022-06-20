const { CronJob } = require("cron");

const Report = require("./Report");
const { deleteOldData, isScannedToday } = require("./api");
const { TIMEZONE } = require("../config");
const { Check } = require("./db");

let scanner = null;

const sendEmailCronFunction = async () => {
  try {
    const _check = await Check.findOne({
      where: { completed: true, email_sent: false },
      raw: true,
    });

    if (_check) {
      const report = new Report(_check);
      await report.fetchData();
      await report.generate();
      await report.send();
    }
  } catch (err) {
    console.log("Error: Could not send email");
  }
};

const deleteDataCronFunction = async () => {
  try {
    await deleteOldData();
  } catch (err) {}
};

let isRunning = false;

const scannerCronFunction = async () => {
  if (scanner.active && !scanner.scanning && !isRunning) {
    console.log("******************* RUNNING*************************");
    isRunning = true;
    try {
      const checked = await isScannedToday();

      if (checked) {
        const { checkId, total, done } = checked;

        if (total > 0 && total !== done) {
          console.log("******************* RESUME*************************");
          await scanner.resume({ checkId, total, done });
        }
      } else {
        console.log("******************* START*************************");
        await scanner.start();
      }
    } catch (err) {
      console.log(err);
    }
    isRunning = false;
  }
};

exports.createCronJobs = (_scanner) => {
  scanner = _scanner;

  // delete old data everyday
  new CronJob("0 0 * * *", deleteDataCronFunction, null, true, TIMEZONE);

  // check every hour if need to send report
  new CronJob("0 * * * *", sendEmailCronFunction, null, true, TIMEZONE);

  // check every minute if it needs to start scanning
  new CronJob("* * * * * *", scannerCronFunction, null, true);
};
