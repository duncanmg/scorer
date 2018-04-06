angular.module("scorer").factory('Match', ['Storage', function(Storage) {

  /**
   * @class Match
   * @memberOf scorer.factory
   * @constructor Match
   * @returns {Match}
   * @description The Match object does the hard work. The constructor does very little,
   * the object must be set up before it can do much.
   */
  return function() {
    this.storage = new Storage();

    /**
     * @function setup
     * @memberOf scorer.factory.Match
     * @param {Settings} settings -  The Settings object which will dictate the format of the match.
     * @param {TeamData} home_team - The home team.
     * @param {TeamData} away_team - The away team.
     */
    this.setup = function(settings, home_team, away_team) {
       this.settings = settings;
       this.home_team = home_team;
       this.away_team = away_team;
    };

    /**
     * @function set_batting_team
     * @memberOf scorer.factory.Match
     * @param {TeamData} batting_team - The batting team.
     * @description Sets the team given as the batting team and the other as the bowling team.
     */
    this.set_batting_team = function(batting_team) {
       // http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
       if (JSON.stringify(this.home_team) === JSON.stringify(batting_team)){
         this.batting_team = this.home_team;
         this.bowling_team = this.away_team;
       }
       else {
         this.batting_team = this.away_team;
         this.bowling_team = this.home_team;
       }
    };

    /**
     * @function set_bowler_end_1
     * @memberOf scorer.factory.Match
     * @param {TeamData.Player} bowler - The bowler at end 1.
     * @description Sets the bowler at end 1, overwriting the current bowler at that end.
     */
    this.set_bowler_end_1 = function(bowler) {
       this.bowler_end_1 = bowler;
    };

    /**
     * @function set_bowler_end_2
     * @memberOf scorer.factory.Match
     * @param {TeamData.Player} bowler - The bowler at end 2.
     * @description Sets the bowler at end 2, overwriting the current bowler at that end.
     */
    this.set_bowler_end_2 = function(bowler) {
       this.bowler_end_2 = bowler;
    };

    /**
     * @function set_batsman_end_1
     * @memberOf scorer.factory.Match
     * @param {TeamData.Player} batsman - The batsman at end 1.
     * @description Sets the batsman who will face the next ball at end 1, overwriting the current batsman at that end.
     */
    this.set_batsman_end_1 = function(batsman) {
       this.batsman_end_1 = batsman;
    };

    /**
     * @function set_batsman_end_2
     * @memberOf scorer.factory.Match
     * @param {TeamData.Player} batsman - The batsman at end 2.
     * @description Sets the batsman who will face the next ball at end 2, overwriting the current batsman at that end.
     */
    this.set_batsman_end_2 = function(batsman) {
       this.batsman_end_2 = batsman;
    };

  };

}]);
