// src/stories/AppUI.stories.js

import React from 'react';
import AppUI from '../AppUI';

const appUIStory = {
  title: 'AppUI',
  component: AppUI,
};

const mockHandlers = {
  handleClearTimers: () => alert("Clearing timers..."),
  handleSetTimers: () => alert("Setting timers..."),
  handleOptimize: () => alert("Optimizing..."),
  handleStartCharging: () => alert("Starting charging..."),
  handleStopCharging: () => alert("Stopping charging..."),
  handleSetHcaptchaToken: () => alert("Setting hCaptcha token..."),
};

const Template = (args) => <AppUI {...args} {...mockHandlers} />;

// Story: No car
export const NoCar = Template.bind({});
NoCar.args = {
  vin: '',
  startTime: '',
  stopTime: '',
  message: '',
  connected: false,
  charging: false,
  batteryLevel: 0,
  schedule: { startTime: '', stopTime: '' },
  imageSrc: '',
  prices: [],
  hcaptchaToken: '',
  loggedIn: true,
};

// Story: Car Not Connected
export const CarNotConnected = Template.bind({});
CarNotConnected.args = {
  vin: '123456789',
  startTime: '',
  stopTime: '',
  message: '',
  connected: false,
  charging: false,
  batteryLevel: 0,
  schedule: { startTime: '', stopTime: '' },
  imageSrc: 'https://via.placeholder.com/300',
  prices: [],
  hcaptchaToken: '',
  loggedIn: true,
};

// Story: Car Not Connected, Battery Level available
export const CarNotConnectedWithLevel = Template.bind({});
CarNotConnectedWithLevel.args = {
  vin: '123456789',
  startTime: '',
  stopTime: '',
  message: '',
  connected: false,
  charging: false,
  batteryLevel: 50,
  schedule: { startTime: '', stopTime: '' },
  imageSrc: 'https://via.placeholder.com/300',
  prices: [],
  hcaptchaToken: '',
  loggedIn: true,
};

// Story: Car Charging with Schedule
export const CarChargingWithSchedule = Template.bind({});
CarChargingWithSchedule.args = {
  vin: '123456789',
  startTime: '08:00',
  stopTime: '12:00',
  message: '',
  connected: true,
  charging: true,
  batteryLevel: 80,
  schedule: { startTime: '', stopTime: '12:00' },
  imageSrc: 'https://via.placeholder.com/300',
  prices: [],
  hcaptchaToken: '',
  loggedIn: true,
};

// Story: Car Connected, Not Charging
export const CarConnectedNotCharging = Template.bind({});
CarConnectedNotCharging.args = {
  vin: '123456789',
  startTime: '',
  stopTime: '',
  message: '',
  connected: true,
  charging: false,
  batteryLevel: 60,
  schedule: { startTime: '', stopTime: '' },
  imageSrc: 'https://via.placeholder.com/300',
  prices: [],
  hcaptchaToken: '',
  loggedIn: true,
};

// Story: Schedule Set, Not Charging
export const ScheduleSetNotCharging = Template.bind({});
ScheduleSetNotCharging.args = {
  vin: '123456789',
  startTime: '10:00',
  stopTime: '14:00',
  message: '',
  connected: true,
  charging: false,
  batteryLevel: 50,
  schedule: { startTime: '10:00', stopTime: '14:00' },
  imageSrc: 'https://via.placeholder.com/300',
  prices: [],
  hcaptchaToken: '',
  loggedIn: true,
};

// Story: Not logged in
export const NotLoggedIn = Template.bind({});
NotLoggedIn.args = {
  vin: '123456789',
  startTime: '',
  stopTime: '',
  message: '',
  connected: false,
  charging: false,
  batteryLevel: 0,
  schedule: { startTime: '', stopTime: '' },
  imageSrc: 'https://via.placeholder.com/300',
  prices: [],
  hcaptchaToken: '',
  loggedIn: false,
};

export default appUIStory;
