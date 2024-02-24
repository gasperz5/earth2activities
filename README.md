# earth2activities

### How to

If you want to run the script to log activity events yourself, you need to install Node.js and npm. Then you can install the required packages by running the following command in the terminal:
```shell
npm install centrifuge@2 ws
```
Adjust the absolute path for the file location and then run the script with:
```shell
node simple-log.js
```

You can also use the log files provided in the repository, but bear in mind that they don't contain the full activity history as some of the events are not logged, such as droid, civilian, and ether generation events.

### Reading the logs

Each log file contains a list of events, where each event is a JSON object. The events are ordered by the timestamp of the event. I will try to update the log files as often as possible, but the best way to get the most recent logs is to run the script yourself. Some of the logs might be missing some events, as the script might not have been running at the time.

### Parsing the logs

There are some starting scripts for parsing the logs in the [parsing-scripts](https://github.com/gasperz5/earth2activities/tree/master/parsing-scripts) directory. The scripts are written in javascript

### Contributing

If you want to contribute to the project, you can do so by forking the repository and then creating a pull request. You can also contribute by providing log files, as I can't run the script 24/7. If you have any questions, feel free to ask.

Support me by buying me a coffee ☕ [here](https://www.buymeacoffee.com/gasper) or by using my referral code **gasper** when buying T1 or T2 land on [app.earth2.io](https://app.earth2.io/).
