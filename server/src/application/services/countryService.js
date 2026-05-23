'use strict';

const countryRepository = require('../../infrastructure/repositories/countryRepository');

class CountryService {
  async getAllCountries() {
    return countryRepository.findAll();
  }

  async getCountryById(id) {
    const country = await countryRepository.findById(id);
    if (!country) {
      const error = new Error('Країну не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }
    return country;
  }

  async getTeamsByCountry(id) {
    await this.getCountryById(id); // перевірка що країна існує
    return countryRepository.findTeamsByCountryId(id);
  }
}

module.exports = new CountryService();
