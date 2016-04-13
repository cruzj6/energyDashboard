'use strict';

describe('Service: energyDatabaseService', function () {

  // load the service's module
  beforeEach(module('energydashApp'));

  // instantiate service
  var energyDatabaseService;
  beforeEach(inject(function (_energyDatabaseService_) {
    energyDatabaseService = _energyDatabaseService_;
  }));

  it('should do something', function () {
    expect(!!energyDatabaseService).toBe(true);
  });

});
