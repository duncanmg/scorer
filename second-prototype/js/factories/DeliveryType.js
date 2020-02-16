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
    var DeliveryType = function(Wicket, Bye, LegBye, NoBall, Wide, Delivery) {

      console.log('DeliveryType called');
      this.Wicket = Wicket;
      this.Bye = Bye;
      this.LegBye = LegBye;
      this.NoBall = NoBall;
      this.Wide = Wide;
      this.Delivery = Delivery;

      /**
       * @function get
       * @memberOf scorer.factory.DeliveryType
       * @param {string} type - type of delivery.
       */
      this.get = function(type) {
        switch (type) {
          case 'wicket':
            return (new this.Wicket());
          case 'bye':
            return (new this.Bye());
          case 'leg_bye':
            return (new this.LegBye());
          case 'no_ball':
            return (new this.NoBall());
          case 'wide':
            return (new this.Wide());
          case 'ball':
            return new this.Delivery();
          default:
            console.log('Invalid delivery type ' + type);
        }
      };
      this.test = function() {
        console.log('DeliveryType went BANG');
      };
    };

    return DeliveryType;
  }
]);
