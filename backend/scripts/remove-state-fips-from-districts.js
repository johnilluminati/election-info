const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../data/states-and-districts.json');
const geoData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Create a mapping from state abbreviation to FIPS code for reference
const stateAbbrToFips = {};
geoData.states.forEach(state => {
  stateAbbrToFips[state.abbreviation] = state.fips_code;
});

// Remove state_fips_code from each district, keeping only district_code
if (Array.isArray(geoData.districts)) {
  geoData.districts = geoData.districts.map(district => {
    const { state_fips_code, ...rest } = district;
    return rest;
  });
}

fs.writeFileSync(jsonPath, JSON.stringify(geoData, null, 2));

console.log('✅ Removed state_fips_code from districts');
console.log('Districts now only contain: district_code');
console.log('State mapping available for reference:');
console.log(JSON.stringify(stateAbbrToFips, null, 2)); 