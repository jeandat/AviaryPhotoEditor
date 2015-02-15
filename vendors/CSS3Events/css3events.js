(function () {
    var $document = $(document);

    // csstransitionend + csstransitionend:property-name
    $document.on('oTransitionEnd otransitionend webkitTransitionEnd transitionend', function (event) {
        var originalEvent = event.originalEvent;
        var target = event.target;
        var propertyName = originalEvent.propertyName;
        var eventProperties = {
            originalEvent: originalEvent,
            target: target,
            propertyName: propertyName,
            currentTarget: event.currentTarget,
            relatedTarget: event.relatedTarget
        };

        var csstransitionend = $.Event('csstransitionend', eventProperties);
        $(target).trigger(csstransitionend);

        var csstransitionendPropertyName = $.Event('csstransitionend:' + propertyName, eventProperties);
        $(target).trigger(csstransitionendPropertyName);
    });

    // cssanimationend + cssanimationend:property-name
    $document.on('oAnimationEnd oanimationend webkitAnimationEnd animationend', function (event) {
        var originalEvent = event.originalEvent;
        var target = event.target;

        var animationName = originalEvent.animationName;
        var eventProperties = {
            originalEvent: originalEvent,
            target: target,
            animationName: animationName,
            currentTarget: event.currentTarget,
            relatedTarget: event.relatedTarget
        };

        var cssanimationend = $.Event('cssanimationend', eventProperties);
        $(target).trigger(cssanimationend);

        var cssanimationendAnimationName = $.Event('cssanimationend:' + animationName, eventProperties);
        $(target).trigger(cssanimationendAnimationName);
    });
}());