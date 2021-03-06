describe('Constant: uuid', function() {
  'use strict';

  var uuid;

  beforeEach(function() {
    // Load the constant's module
    module('pat.utils');

    inject(function(_uuid_) {
      uuid = _uuid_;
    });
  });

  it('should exist', function() {
    expect(!!uuid).toBe(true);
  });

  it('should generate unique uuid', function() {

    var results = [];
    for (var x = 0; x < 100; x++) {
      var result = uuid();
      var exists = results.indexOf(result);
      results.push(result);

      expect(exists).toBe(-1);
    }
  });
});
