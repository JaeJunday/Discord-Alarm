client.on("messageCreate", (message) => {
  if (message.content.startsWith("!add")) {
    const [_, id, title, time, ...messageBody] = message.content.split(" ");
    const alarmMessage = messageBody.join(" ");

    const alarm = addAlarm(id, title, time, alarmMessage, message.channel);
    message.channel.send(`Alarm "${alarm.title}" has been added!`);
  }

  if (message.content.startsWith("!updatealarm")) {
    const [_, id, newTitle, newTime, ...messageBody] =
      message.content.split(" ");
    const newMessage = messageBody.join(" ");

    const alarm = updateAlarm(
      id,
      newTitle,
      newTime,
      newMessage,
      message.channel
    );
    if (alarm) {
      message.channel.send(`Alarm "${alarm.title}" has been updated!`);
    } else {
      message.channel.send(`Alarm with id "${id}" not found!`);
    }
  }

  if (message.content.startsWith("!delete")) {
    const [_, id] = message.content.split(" ");
    const success = deleteAlarm(id);

    if (success) {
      message.channel.send(`Alarm with id "${id}" has been deleted!`);
    } else {
      message.channel.send(`Alarm with id "${id}" not found!`);
    }
  }

  if (message.content.startsWith("!list")) {
    const alarmsList = listAlarms();
    if (alarmsList.length > 0) {
      alarmsList.forEach((alarm) => {
        message.channel.send(
          `**ID:** ${alarm.id}\n**Title:** ${alarm.title}\n**Time:** ${alarm.time}\n**Message:** ${alarm.message}`
        );
      });
    } else {
      message.channel.send("No alarms found!");
    }
  }
});
