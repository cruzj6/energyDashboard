'use strict';

describe('Service: Parser', function () {

  // load the service's module
  beforeEach(module('energydashApp'));

  // instantiate service
  var Parser;
  beforeEach(inject(function (_Parser_) {
    Parser = _Parser_;
  }));

  it('should do something', function () {
    expect(!!Parser).toBe(true);
  });

});
