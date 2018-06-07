const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const allCountries = require('all-countries');

function noExcepetion (number) {
  let ret;
  try {
    ret = phoneUtil.isValidNumber(number);
  } catch (err) {
    console.log(err);
  } finally {
    return ret;
  }
}

function getCountryCode (countryName) {
  const country = allCountries.getCountryCodeByCountryName(countryName);
  return country;
}

export function checkNumber (number, country) {
  let num = 'error';
  const cc = country === 'US' ? 'US' : getCountryCode(country);
  try {
    num = phoneUtil.parse(number, cc);
  } catch (err) {
    return 'error';
  }
  if (noExcepetion(num)) {
    return num;
  } else if (cc === 'US') {
    return 'error';
  }
  num = phoneUtil.parse(number, 'US');
}

export function toPnf (number) {
  return phoneUtil.format(number, PNF.E164);
}
