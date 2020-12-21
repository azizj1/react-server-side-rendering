(function(document) {
    document.addEventListener('DOMContentLoaded', function() {
        var fx = {
            animate: function(options) {
                var start = new Date;
                var id = setInterval(function() {
                    var timePassed = new Date - start;
                    var progress = timePassed / options.duration;
                    if (progress > 1) {
                        progress = 1;
                    }
                    options.progress = progress;
                    var delta = options.delta(progress);
                    options.step(delta);
                    if (progress == 1) {
                        clearInterval(id);
                        if (options.complete) options.complete();
                    }
                }, options.delay || 10);
            },
            fadeOut: function(element, options) {
                var to = 1;
                this.animate({
                    duration: options.duration,
                    delta: function(progress) {
                        progress = this.progress;
                        return 0.5 - Math.cos(progress * Math.PI);
                    },
                    complete: options.complete,
                    step: function(delta) {
                        element.style.opacity = to - delta;
                    }
                });
            }
        };
        fx.fadeOut(
            document.getElementById('preloader'), {
                duration: 1000,
                complete: function() { document.getElementById('preloader').style.display = 'none' } });
    });
}(document));
