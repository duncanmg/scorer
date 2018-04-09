angular.module("scorer").factory('DeliveryType', ['Wicket', 'Bye', 'LegBye', 'NoBall', 'Wide', 'Delivery',
function(Wicket, Bye, LegBye, NoBall, Wide, Delivery) {

  /** Creates an instance of DeliveryManager
   *
   * @class DeliveryType
   * @memberOf scorer.factory
   * @classdesc - Returns an instance of a correct delivery class..
   * @constructor DeliveryType
   * @param {Wicket}
   * @param {Bye}
   * @param {LegBye}
   * @param {NoBall}
   * @param {Wide}
   * @param {Delivery}
   * @return The an instance of the appropriate Delivery class.
   * @description -
   */
  var DeliveryType = function() {};

  /**
   * @function get
   * @memberOf scorer.factory.DeliveryType
   * @param {string} type - type of delivery.
   */
  this.get = function(type) {
    switch (type) {
      case 'wicket':
        return (new Wicket());
      case 'bye':
        return (new Bye());
      case 'leg_bye':
        return (new LegBye());
      case 'no_ball':
        return (new NoBall());
      case 'wide':
        return (new Wide());
    case 'ball':
      return new Delivery();
    default:
      console.log('Invalid delivery type ' + type);
  };

};

return DeliveryType;
}]);
