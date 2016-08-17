var Validators,
  slice = [].slice;

Validators = require('./validators');

module.exports = function() {
  return {
    initialize: function() {
      return this.buildValidations();
    },

    /**
    * @function Build validations. Call it only when validations change.
     */
    buildValidations: function() {
      var fieldRestrictions, name, params, prio, restriction;
      return this.validations = (function() {
        var ref, results;
        ref = this.restrictions;
        results = [];
        for (name in ref) {
          fieldRestrictions = ref[name];
          results.push((function() {
            var ref1, results1;
            results1 = [];
            for (restriction in fieldRestrictions) {
              ref1 = fieldRestrictions[restriction], prio = ref1[0], params = 2 <= ref1.length ? slice.call(ref1, 1) : [];
              if (!Validators[restriction]) {
                continue;
              }
              results1.push({
                name: name,
                prio: prio,
                fn: Validators[restriction](params, this)
              });
            }
            return results1;
          }).call(this));
        }
        return results;
      }).call(this);
    },
    validate: function(opts) {
      var changedAttributes, result;
      if (opts == null) {
        opts = {};
      }
      changedAttributes = this.changedAttributes();
      result = {};
      this.validations.reduce(function(memo, arr) {
        return memo.concat(arr, []);
      }).filter(function(arg) {
        var name;
        name = arg.name;
        return opts.validateAll || name in changedAttributes;
      }).sort(function(p1, p2) {
        if (p1.name === p2.name) {
          return p1.prio < p2.prio;
        } else {
          return p1.name < p2.name;
        }
      }).reduce((function(_this) {
        return function(memo, arg) {
          var fn, key, last, name, prio;
          name = arg.name, prio = arg.prio, fn = arg.fn;
          last = memo[memo.length - 1];
          if ((!last || last.name !== name || last.prio === prio) && (key = fn(_this.get(name, _this)))) {
            memo.push({
              key: key,
              name: name,
              prio: prio,
              fn: fn
            });
          }
          return memo;
        };
      })(this), []).forEach(function(arg) {
        var key, name;
        name = arg.name, key = arg.key;
        return result[name] = key;
      });
      if (Object.keys(result).length) {
        return result;
      }
    }
  };
};
