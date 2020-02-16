describe("DeliveryTypeTest", function() {

  beforeEach(module('scorer'));

  var deliveryType = {};

  var mockWicket;
  var mockBye;
  var mockLegBye;
  var mockNoBall;
  var mockWide;
  var mockDelivery;

  beforeEach(module(function($provide) {
    console.log('provide');
    $provide.factory('Wicket', function() {
      return function() {
        this.test = 'Wicket';
      };
    });
    $provide.factory('Bye', function() {
      return function() {
        this.test = 'Bye';
      };
    });
    $provide.factory('LegBye', function() {
      return function() {
        this.test = 'LegBye';
      };
    });
    $provide.factory('NoBall', function() {
      return function() {
        this.test = 'NoBall';
      };
    });
    $provide.factory('Wide', function() {
      return function() {
        this.test = 'Wide';
      };
    });
    $provide.factory('Delivery', function() {
      return function() {
        this.test = 'Delivery';
      };
    });

    console.log('End provide');
  }));

  beforeEach(inject(function(DeliveryType, Wicket, Bye, LegBye, NoBall, Wide, Delivery) {
    deliveryType = new DeliveryType(Wicket, Bye, LegBye, NoBall,
      Wide, Delivery);
  }));

  it("A DeliveryType object can be created.", function() {
    expect(typeof(deliveryType)).toEqual('object');
  });

  it("The get method of a DeliveryType object returns an object.", function() {
    //   expect(typeof(deliveryType)).toEqual('object');
    expect(typeof(deliveryType.get('wicket'))).toEqual('object');
    expect(typeof(deliveryType.get('bye'))).toEqual('object');
    expect(typeof(deliveryType.get('leg_bye'))).toEqual('object');
    expect(typeof(deliveryType.get('no_ball'))).toEqual('object');
    expect(typeof(deliveryType.get('wide'))).toEqual('object');
    expect(typeof(deliveryType.get('ball'))).toEqual('object');
  });

});
