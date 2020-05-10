var sc = sc || {};

sc.Utils = {
  // Deep copy of simple JSON object.
  clone: function(o) {
    return JSON.parse(JSON.stringify(o))
  }
};
