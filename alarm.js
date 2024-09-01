const alarms = [];

class Alarm {
  constructor(id, title, time, message, job) {
    this.id = id;
    this.title = title;
    this.time = time;
    this.message = message;
    this.job = job;
  }
}

const daysOfWeek = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// 알람 추가
function addAlarm(id, title, day, time, message, channel) {
  const dayOfWeek = daysOfWeek[day.toLowerCase()];
  if (dayOfWeek === undefined) {
    throw new Error("Invalid day of the week");
  }

  const cronTime = createCronTime(dayOfWeek, time);
  const job = new CronJob(cronTime, () => {
    channel.send(`**${title}**\n${message}`);
  });

  job.start();

  const alarm = new Alarm(id, title, cronTime, message, job);
  alarms.push(alarm);
  return alarm;
}

// 알람 수정
function updateAlarm(id, newTitle, newDay, newTime, newMessage, channel) {
  const alarm = alarms.find((alarm) => alarm.id === id);
  if (!alarm) {
    throw new Error(`Alarm with id ${id} not found`);
  }

  alarm.job.stop(); // 기존 잡 멈추기

  const dayOfWeek = daysOfWeek[newDay.toLowerCase()];
  if (dayOfWeek === undefined) {
    throw new Error("Invalid day of the week");
  }

  const cronTime = createCronTime(dayOfWeek, newTime);

  alarm.title = newTitle;
  alarm.time = cronTime;
  alarm.message = newMessage;

  const job = new CronJob(cronTime, () => {
    channel.send(`**${newTitle}**\n${newMessage}`);
  });

  job.start();
  alarm.job = job;
  return alarm;
}

// 알람 삭제
function deleteAlarm(id) {
  const alarmIndex = alarms.findIndex((alarm) => alarm.id === id);
  if (alarmIndex === -1) {
    throw new Error(`Alarm with id ${id} not found`);
  }

  alarms[alarmIndex].job.stop();
  alarms.splice(alarmIndex, 1);
  return true;
}

// 알람 목록 조회
function listAlarms() {
  return alarms.map(({ id, title, time, message }) => ({
    id,
    title,
    time,
    message,
  }));
}

// 유틸리티 함수: 크론 시간 생성
function createCronTime(dayOfWeek, time) {
  const [hour, minute] = time.split(":").map(Number);

  if (
    isNaN(hour) ||
    isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error("Invalid time format. Please use HH:MM format.");
  }

  return `${minute} ${hour} * * ${dayOfWeek}`;
}
