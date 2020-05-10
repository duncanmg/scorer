describe("Logger", function() {
  beforeEach(module("scorer"));

  it("Unknown Logger", function() {
    var logger = new sc.Logger('Test');

    expect(logger.name).toEqual('Test');
    expect(logger.get_level()).toBeUndefined();
  });

  it("Known Logger. PlayerManager", function() {

    var logger = new sc.Logger('PlayerManager');
    expect(logger).toBeDefined();

    expect(logger.name).toBeDefined('PlayerManager');
    expect(logger.get_level()).toEqual(sc.LoggerLevels.DEBUG);

    expect(logger.log(sc.LoggerLevels.DEBUG)).toEqual(true);

    logger.set_level(sc.LoggerLevels.WARN);
    expect(logger.log(sc.LoggerLevels.DEBUG)).toEqual(true);
    expect(logger.log(sc.LoggerLevels.ERROR)).toEqual(false);

    logger.set_level(undefined);
    expect(logger.log(sc.LoggerLevels.DEBUG)).toEqual(true);

  });
});
