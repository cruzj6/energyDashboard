'use strict';

describe('Service: buildingInfoService', function () {

  // load the service's module
  beforeEach(module('energydashApp'));

  // instantiate service
  var buildingInfoService;
  beforeEach(inject(function (_buildingInfoService_) {
    buildingInfoService = _buildingInfoService_;
  }));

  it('should do something', function () {
    expect(!!buildingInfoService).toBe(true);
  });

});
