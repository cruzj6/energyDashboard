'use strict';

describe('Service: chartSettings', function () {

  // load the service's module
  beforeEach(module('energydashApp'));

  // instantiate service
  var chartSettings;
  beforeEach(inject(function (_chartSettings_) {
    chartSettings = _chartSettings_;
  }));

  it('should do something', function () {
    expect(!!chartSettings).toBe(true);
  });

});
