/**
*
*  Author: Ryan Marchock
*  Date: Feb 2016
*
*/

// TODO: if side panel is greater than window then ad styles to side-panel__content-wrapper 100% height overflow-y: auto;

var Scroll = (function($) {

    var $elements = $('.anchor-point'),
        $links = $('.anchor-links'),
        $footer = $('#maia-footer'),
        $sidePanel = $('.side-panel'),
        $dropdown = $('.anchor-dropdown'),
        $dropdownLabel = $('.anchor-dropdown').find('label'),
        anchorElements = [],
        previousAnchorPositions = [],
        previousPosition = 0,
        counter = 0,
        eof = 0,
        sidePanelScrollPoint = 0,
        scroll = true,
        offsetTop = 200,
        delay = null,
        initInnerWidth = window.innerWidth,
        linksTapped = false;

    function Scroll() {

        this.init = function () {
            this.setupEvents();
            this.getAnchorPositions();
        }

        /*
         *
         * get all anchor elements offset positions and store in an array
         */
        this.getAnchorPositions = function () {
            var b = false,
                anchorElemntsHaveRendered = true;
                eof = $elements.length,
                me = this;

            anchorElements = [];
            $links.removeClass('active');

            $elements.map(function (i) {

                anchorElements.push({
                    position: $elements[i].offsetTop ? ($elements[i].offsetTop - offsetTop) : 0
                });

                // highlight active link on the side panel
                if (window.scrollY <= $elements[i].offsetTop && !b) {
                    counter = i;
                    $links[counter].setAttribute('class', 'active anchor-links');
                    me.updateDropdownLabel(counter);

                    b = true;
                }
            });

            // compare element positions are the same, if not loop through again until it does
            $elements.map(function (i) {
                if (previousAnchorPositions.length > 0 &&
                        previousAnchorPositions[i].position !== ($elements[i].offsetTop - offsetTop)) {
                    anchorElemntsHaveRendered = false;
                }
            });


            if (previousAnchorPositions.length > 0 && anchorElemntsHaveRendered) {
                console.log("ELEMENTS LOADED");
                previousAnchorPositions = [];
            } else {
                previousAnchorPositions = anchorElements.slice(0);

                var me = this;
                setTimeout(function () {
                    me.getAnchorPositions();
                }, 500);
            }
        }

        /*
         * Identify if scrolling is up or down
         */
        this.scroll = function (y) {
            if (previousPosition < y) {
                this.down(y);
            } else {
                this.up(y);
            }
            previousPosition = y;

            /*
             * Side menu should slide up tablet and greater
             */
            if ($(window).width() > 767) {
                this.slideSideMenu(y);
            }
        }

        this.up = function (y) {
            if (y < anchorElements[counter].position) {
                counter -= 1;
                this.updateSideLinks(counter);
                this.updateDropdownLabel(counter);
            }
        }

        this.down = function (y) {
            if (y > anchorElements[counter].position) {
                this.updateSideLinks(counter);
                this.updateDropdownLabel(counter);
                counter = (counter < (eof - 1)) ? counter += 1 : (eof - 1);
            }
        }

        this.updateSideLinks = function (index) {
            // Desktop tablet
            // issue - clicking on a anchor link the page scrolls to anchored position while updating side links
            //         anchor links are not updating corectly and it looks like flickering randomly.
            // fix - block update side links
            if (!linksTapped) {
                $links.removeClass('active');
                $links[index].setAttribute('class', 'active anchor-links');
            }
        }

        this.updateDropdownLabel = function (index) {
            // if the same string do nothing.
            if ($dropdownLabel[0].innerHTML === $links[index].innerHTML) {
                return;
            }

            clearTimeout(delay);
            $dropdown.addClass('slideOut');
            $dropdown.removeClass('slideIn');

            delay = setTimeout(function () {
                $dropdownLabel[0].innerHTML = $links[index].innerHTML;
                $dropdown.addClass('slideIn');
                $dropdown.removeClass('slideOut');
            }, 300);
        }

        this.setupEvents = function () {
            var me = this;

            $links.on('click', function (e) {
                linksTapped = true;
                scroll = true;
                counter = Number(e.currentTarget.getAttribute('data-link'));
                $links.removeClass('active');
                $links[counter].setAttribute('class', 'active anchor-links');
                $sidePanel.removeClass('show');
                $('html').removeClass('scroll-lock');
                $dropdown.removeClass('open');
                me.updateDropdownLabel(counter);

                // Animate scroll
                $('html, body').animate({
                    scrollTop: $( $.attr(this, 'href') ).offset().top
                },

                400,

                function () {
                    linksTapped = false;
                });
                return false;
            });

            $dropdown.on('click', function (e) {
                if (scroll) {
                    $sidePanel.addClass('show');
                    $dropdown.addClass('open');
                    scroll = false;
                    $('html').addClass('scroll-lock');
                } else {
                    $sidePanel.removeClass('show');
                    $dropdown.removeClass('open');
                    scroll = true;
                    $('html').removeClass('scroll-lock');
                }
            });

            //touchmove mousewheel
            $(window).on('scroll', function(e){
                me.scroll(e.currentTarget.scrollY)
            });

            $(window).on('resize', function(e) {
                // ios native function - scrolling up and down resizes url address bar
                // issue - the browser resize listener triggers and updates incorrect anchor element positioning
                // fix - only update when inner width changes
                if (initInnerWidth !== e.currentTarget.innerWidth) {
                    initInnerWidth = e.currentTarget.innerWidth;
                    me.getAnchorPositions();
                }
            });
        }

        this.slideSideMenu = function (y) {



            var h = this.getDocHeight(),
                s = $(window).scrollTop(),
                w = window.innerHeight;  //$(window).height(); this broke and replaced with window



            sidePanelScrollPoint = (h-w) - ($footer.height() + 178);


            console.log('slideSideMenu', h)
            console.log('slideSideMenu', w)
            console.log('slideSideMenu', $footer.height())




            if (s - sidePanelScrollPoint >= 0) {
                $sidePanel[0].style.top = 0 - (s - sidePanelScrollPoint) + 'px';
            } else {
                $sidePanel[0].style.top = '0px';
            }
        }

        this.getDocHeight = function () {
            var doc = document;
            return Math.max(
                Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
                Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
                Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
            );
        }

        this.init();
    }

    return Scroll;
})($);