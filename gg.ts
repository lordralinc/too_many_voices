import { getRandomInt } from './src/renderer/utils';

const results: { [key: string]: number } = {
  '1': 0,
  '2': 0,
  '3': 0,
  '4': 0,
  '5': 0,
  '6': 0,
  '7': 0,
  '8': 0,
  '9': 0,
  '10': 0,
  '11': 0,
  '12': 0,
  '13': 0,
  '14': 0,
  '15': 0,
  '16': 0,
  '17': 0,
  '18': 0,
  '19': 0,
  '20': 0,
};

for (let index = 0; index < 10_000; index += 1) {
  const result = getRandomInt(1, 20);
  results[result.toString()] += 1;
}

Object.keys(results).forEach((key) => console.log(`${key},${results[key]}`));
