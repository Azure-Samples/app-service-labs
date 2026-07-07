// Seed catalog served when no database is configured (learning path step 1).
// Later steps move this data into Azure SQL and read it with a managed identity.
const products = [
  {
    id: 1,
    name: 'Aurora Smart Bulb',
    category: 'Lighting',
    price: 24.99,
    description: 'Tunable-white LED bulb with app and voice control.',
  },
  {
    id: 2,
    name: 'Nimbus Wi-Fi Plug',
    category: 'Power',
    price: 14.99,
    description: 'Energy-monitoring smart plug with scheduling.',
  },
  {
    id: 3,
    name: 'Terra Door Sensor',
    category: 'Security',
    price: 19.99,
    description: 'Contact sensor that alerts you when a door opens.',
  },
  {
    id: 4,
    name: 'Solis Thermostat',
    category: 'Climate',
    price: 89.99,
    description: 'Learning thermostat that trims your heating bill.',
  },
  {
    id: 5,
    name: 'Vega Motion Camera',
    category: 'Security',
    price: 59.99,
    description: 'Battery camera with on-device motion detection.',
  },
  {
    id: 6,
    name: 'Cirro Leak Detector',
    category: 'Safety',
    price: 29.99,
    description: 'Water-leak sensor that pings you before damage spreads.',
  },
];

module.exports = { products };
