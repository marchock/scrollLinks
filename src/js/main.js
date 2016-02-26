var MobileNav = (function($) {

    var $navBtn = $('.mobile-nav-button'),
        $nav = $('.mobile-nav'),
        $links = $nav.find('a');

    function MobileNav() {

        this.init = function () {
            this.setupEvents();
        }

        this.setupEvents =function () {
            var me = this;
            $navBtn.on('click', function (e) {
                me.scrollLock($('html').hasClass('scroll-lock'));
                me.openMobileNav($('body').hasClass('open-nav'));
            });

            $links.on('click', function () {
                me.scrollLock($('html').hasClass('scroll-lock'));
                me.openMobileNav($('body').hasClass('open-nav'));
            })
        }

        this.openMobileNav = function (b) {
            if (b) {
                $('body').removeClass('open-nav');
            } else {
                $('body').addClass('open-nav');
            }
        }

        this.scrollLock = function (b) {
            if (b) {
                $('html').removeClass('scroll-lock');
            } else {
                $('html').addClass('scroll-lock');
            }
        }

        this.init();
    }

    return MobileNav;

})($);




(function() {

  // Initialise function
  function init() {

    var mobileNav = new MobileNav();

    if ($('.anchor-point').length > 0) {
      var scroll = new Scroll();
    }
  };
  init();

})();




























