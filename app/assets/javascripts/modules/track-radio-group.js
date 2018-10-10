window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (global, GOVUK) {
  'use strict'

  var $ = global.jQuery

  GOVUK.Modules.TrackRadioGroup = function () {
    this.start = function (element) {
      track(element)

      if (crossDomainEnabled(element)) {
        addCrossDomainTracking(element)
      }

      checkVerifyUser(element)
    }

    function track (element, withHint) {
      element.on('submit', function (event) {

        var options = { transport: 'beacon' }

        var $submittedForm = $(event.target)

        var $checkedOption = $submittedForm.find('input:checked')

        GOVUK.analytics.trackEvent('Radio button chosen', eventTrackingValue($checkedOption, withHint), options)

        if (crossDomainEnabled(element)) {
          var name = element.attr('data-tracking-name')
          var eventOptions = $.extend({ 'trackerName': name }, options)
          GOVUK.analytics.trackEvent('Radio button chosen', eventTrackingValue($checkedOption, withHint), eventOptions)
        }
      })
    }

    function checkVerifyUser (element) {
      $.ajax({
        url: 'https://www.signin.service.gov.uk/hint',
        cache: false,
        dataType: 'jsonp',
        timeout: 3000
      }).then(function(data){
          reportVerifyUser(element, data);
      }, function(e){console.log("error", e)})
    }

    this.trackVerifyUser = function (element, data) {
      reportVerifyUser(element, data);
    }

    function reportVerifyUser(element, data) {
      if (data != null && data.value === true) {
        GOVUK.analytics.trackEvent('verify-hint', 'shown', { transport: 'beacon'});
        track(element, data.value);
      }
    }

    function eventTrackingValue(element, withHint) {
      var value = element.val()

      if (typeof value === 'undefined') {
        value = 'submitted-without-choosing'
      }

      if (withHint) {
        value += '-with-hint'
      }
      return value
    }

    function addCrossDomainTracking(element) {
      var code = element.attr('data-tracking-code')
      var domain = element.attr('data-tracking-domain')
      var name = element.attr('data-tracking-name')

      GOVUK.analytics.addLinkedTrackerDomain(code, name, domain)
    }

    function crossDomainEnabled(element) {
      return (
        typeof element.attr('data-tracking-code') !== 'undefined' &&
        typeof element.attr('data-tracking-domain') !== 'undefined' &&
        typeof element.attr('data-tracking-name') !== 'undefined'
      )
    }
  }
})(window, window.GOVUK);
