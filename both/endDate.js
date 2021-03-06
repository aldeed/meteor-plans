/**
 * Get's the end date of the plan subscription, if applicable
 *
 * @method  AppPlans.endDate
 * @public
 * @param   {String}  planName                 The plan name, as registered with AppPlans.define
 * @param   {Object}  [options]                Options. This argument can be omitted.
 * @param   {String}  [options.userId]         You can specify a different user ID. Otherwise the current user is assumed.
 * @param   {String}  [options.email]          The email address to remove a plan for. Required if no userId specified and not logged in. Ignored if userId is specified or if logged in.
 * @param {Function}  [callback]               Optional callback function. Required if looking up by email address in client code. Will be passed an error argument if there was an error.
 * @returns {Date|undefined} The end date if there is one
 */
AppPlans.endDate = Meteor.wrapAsync(function (planName, options, callback) {
  // options argument can be omitted. If so, make some adjustments.
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = _.extend({
    // If no userId argument provided, use the current user.
    userId: Meteor.isClient && Meteor.userId(),
    email: null
  }, options || {});

  if (Meteor.isServer) {
    Utility.checkOptions(options);
  }

  // Throw error if plan with this name has not been defined
  Utility.getPlan(planName);

  var planObject = Utility.getUserPlanObject(options, planName, function (error, result) {
    if (!result) {
      callback(error);
      return;
    }
    callback(error, result.endDate);
  });

  return planObject && planObject.endDate;
});
