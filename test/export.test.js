import { Export, Convert } from '../dist/csvxjs';

const array = [
  {
    firstname:'Galileo',
    lastname:'Galiléi',
    born:1564,
    died:1642
  },
  {
    firstname:'Nikola',
    lastname:'Tesla',
    city:'Smiljan',
    born:1856,
    died:1943
  }
];
const customLabels = {
  firstname: 'First name',
  lastname: 'Last name', 
  city: 'City',
  born: 'Born',
  died: 'Died'
};

test("sends null to createTable", () => {
  expect(createTable(array)).toBe(false);
});
