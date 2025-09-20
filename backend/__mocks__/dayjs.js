// __mocks__/dayjs.js
const originalDayjs = jest.requireActual('dayjs');
const originalUtc = jest.requireActual('dayjs/plugin/utc');
const originalTz = jest.requireActual('dayjs/plugin/timezone');

function mockDayjs(...args) {
  return args.length === 0
    ? originalDayjs('2025-01-01T00:00:00Z')
    : originalDayjs(...args);
}

// copy all props except extend
Object.keys(originalDayjs).forEach((key) => {
  if (key !== 'extend') {
    mockDayjs[key] = originalDayjs[key];
  }
});

// override extend
mockDayjs.extend = (plugin) => {
  if (plugin === originalUtc || plugin === originalTz) {
    return; // skip utc/timezone in tests
  }
  return originalDayjs.extend(plugin);
};

// preserve utc helper
mockDayjs.utc = originalDayjs.utc;

// freeze Date.now
mockDayjs.now = () => new Date('2025-01-01T00:00:00Z').getTime();

module.exports = mockDayjs;
