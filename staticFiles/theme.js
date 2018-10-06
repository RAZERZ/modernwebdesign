
sw.theme = {
    options: {
        slideshow: {
            autoPlay: null,
            speed: null
        },
        imageZoom: true, // Enable image zoom effect
        slick: {
            infinite: true,
            dots: true
        },
        productUpsellSlideshow: {
            nrOfSlides: {
                checkoutLayout0: {
                    galleryLayout3: 4,
                    galleryLayout4: 6
                },
                checkoutLayout1: {
                    galleryLayout3: 3,
                    galleryLayout4: 4

                },
                checkoutLayout2: {
                    galleryLayout3: 2,
                    galleryLayout4: 3
                }
            },
            dots: true,
            autoplay: null,
            autoplaySpeed: null
        },
        productFilter: {
            maxFilterItems: 4,
            openFilterGroups: [0, 1],
            rangeSlider: {
                type: 'double',
                input_values_separator: ',',
                prettify_separator: sw.getCurrencyThousandsSeparator()
            }
        }
    },

    /**
     * Initialize theme object.
     */
    init: function init() {
        // Dynamic properties
        sw.theme.options.slick.autoplay = sw.theme.options.slideshow.autoPlay;
        sw.theme.options.slick.autoplaySpeed = sw.theme.options.slideshow.speed;

        sw.theme.setup();
    },

    /**
     * Setup theme components.
     */
    setup: function setup() {
        sw.theme.setupSlideshow();
        sw.theme.setupSidr();
        sw.theme.setupHeaderSearch();
        sw.theme.openTermsLightbox();
        sw.theme.setupCart();
        sw.theme.onDocumentMouseUp();
        sw.theme.setupProductView();
        sw.theme.setupFooter();
        sw.theme.setupYouTubeEmbedded();
        sw.theme.setupCheckout();
        sw.theme.setupProductUpsellSlideshow();
        sw.theme.setupProductFilter();
        $(document).on('productViewInfoUpdate', sw.theme.setupProductView);
        $(document).on('checkoutDataUpdate', sw.theme.setupProductUpsellSlideshow);
        $(document).on('click', '.desktop #terms-link', sw.theme.openTermsLightbox);
        $(document).mouseup(sw.theme.onDocumentMouseUp);
    },

    /**
     * Setup slideshow
     */
    setupSlideshow: function setupSlideshow() {
        if ($.fn.slick) {
            $('.slideshow-media').each(function () {
                var options = $.extend({}, sw.theme.options.slick);

                if (options.autoplay === null) {
                    options.autoplay = $(this).data('sw-autoplay');
                }
                if (options.autoplaySpeed === null) {
                    speed = parseInt($(this).data('sw-speed'));
                    if (speed > 0) {
                        options.autoplaySpeed = speed * 1000;
                    } else {
                        options.autoplaySpeed = 5000;
                    }
                }

                $(this).slick(options);
            });
        }
    },

    /**
     * Setup Sidr (off-canvas menu).
     */
    setupSidr: function setupSidr() {
        if ($('#mobile-nav nav.menu-block').length) {
            $('#menu').sidr({
                name: 'sidr',
                source: function source() {
                    return $('#mobile-nav nav').clone();
                },
                renaming: false
            });
        } else if ($('#site-header nav.menu-block').length || $('#content-sidebar nav.menu-block').length) {
            $('#menu').sidr({
                name: 'sidr',
                source: function source() {
                    var $menuHead = $('#site-header nav.menu-block').clone();
                    var $menuSidebar = $('#content-sidebar nav.menu-block').clone();
                    return $.merge($menuHead, $menuSidebar);
                },
                renaming: false
            });
        } else {
            $('#menu').hide();
        }
        $('#sidr').addClass('off-canvas-nav');
        $(document).on('click', '.sidr-close', sw.theme.closeSidr);
    },

    /**
     * Close Sidr (off-canvas menu).
     */
    closeSidr: function closeSidr(event) {
        if (event) {
            event.preventDefault();
        }
        $.sidr('close', 'sidr');
    },

    /**
     * Setup search block in header.
     */
    setupHeaderSearch: function setupHeaderSearch() {
        // Removed after version: 6.15.0
    },

    /**
     * Open checkout terms in lightbox for desktops.
     */
    openTermsLightbox: function openTermsLightbox(event) {
        $(document).on('click', '.desktop #terms-link', function (event) {
            event.preventDefault();
            $(this).iLightBox([{
                url: $(this).attr('href'),
                type: 'iframe',
                title: $(this).attr('title'),
                caption: $(this).data('caption'),
                options: {
                    width: '90%',
                    height: '90%'
                }
            }], {
                skin: 'mac'
            });
        });
    },

    /**
     * Setup shop cart.
     */
    setupCart: function setupCart() {
        // Show content (header)
        if ($('html').is('.no-touch.desktop')) {
            $(document).on('mouseenter', '#site-header .cart-block .header', sw.theme.showCartContent);
        } else {
            $(document).on('click touchend', '#site-header .cart-block .header', sw.theme.showCartContent);
        }

        // Show content (sidebar & footer)
        $(document).on('click', '#site-footer .cart-block .header, #content-sidebar .cart-block .header', sw.theme.showCartContent);

        // Hide content
        $(document).on('click', '.cart-content .cart-content-close', sw.theme.hideCartContent);

        // Cart hover
        $('.cart-block .header').hover(function () {
            $(this).closest('.cart-block').addClass('header-hover');
        }, function () {
            $(this).closest('.cart-block').removeClass('header-hover');
        });

        // Add-to-cart hover
        $('.desktop .add-to-cart-form button').hover(function () {
            $(this).closest('form').addClass('hover');
        }, function () {
            $(this).closest('form').removeClass('hover');
        });
    },

    /**
     * Show cart content.
     */
    showCartContent: function showCartContent(event) {
        if (event) {
            event.preventDefault();
        }
        $(this).closest('.cart-block').toggleClass('open');
        var $cartContent = $(this).closest('.cart-wrap').find('.cart-content');
        if ($cartContent.is(':animated')) {
            return;
        }
        $cartContent.slideDown();
    },

    /**
     * Hide cart content.
     */
    hideCartContent: function hideCartContent(event) {
        if (event) {
            event.preventDefault();
        }
        $('.cart-content').fadeOut();
        $(this).closest('.cart-block').removeClass('open');
    },

    /**
     * On document mouse up event.
     */
    onDocumentMouseUp: function onDocumentMouseUp(event) {
        // Hide cart content by clicking outside
        $(document).mouseup(function (event) {
            var $container = $(".cart-content");
            if (!$container.is(event.target) && !$container.has(event.target).length) {
                sw.theme.hideCartContent();
            }
        });
    },

    /**
     * Setup product view.
     */
    setupProductView: function setupProductView() {

        sw.theme.setupProductImageZoom();
        sw.theme.setupProductMediaGalleryNavigation();
        sw.theme.setupProductMediaGalleryLightbox();
        sw.theme.setupProductlabels();
    },

    /**
     * Setup product image zoom.
     */
    setupProductImageZoom: function setupProductImageZoom() {
        if (!sw.theme.options.imageZoom) {
            return;
        }

        $('.product-media > figure a.featured img').each(function () {
            // Destroy any previous zoom
            var $image = $(this);
            if ($image.data('CloudZoom')) {
                $image.data('CloudZoom').destroy();
            }

            $image.CloudZoom({
                zoomPosition: 'inside',
                captionSource: 'title',
                zoomOffsetX: 0,
                zoomOffsetY: 0,
                captionPosition: 'top',
                zoomImage: $image.data('largeSize')
            });
        });
    },

    /**
     * Setup product media gallery navigation.
     */
    setupProductMediaGalleryNavigation: function setupProductMediaGalleryNavigation() {
        $('.product-media figure a.featured img').data('index', 0);

        if ($('.product-media figure a').length < 2) {
            return;
        }

        $('.product-media figure a:not(.featured)').hide();

        var $productNav = $('<div class="product-nav"/>');

        $('.product-media figure a').each(function () {
            var $a = $(this).clone(),
                $figure = $('<figure />'),
                $figureContent = $('<div />');
            if ($a.hasClass('featured')) {
                $figure.addClass('current');
            }
            $figureContent.addClass('figure-content');
            $figureContent.appendTo($figure);
            $figureContent.append($a);
            $figure.appendTo($productNav);
        });
        $('.product-media figure a:not(.featured)').remove();
        $('.product-media').append($productNav);
        $('.product-nav a').fadeIn();

        $('.product-media').on('click', '.product-nav a', function (event) {
            event.preventDefault();
            $('.product-nav').find('figure').removeClass('current');
            $(this).closest('figure').addClass('current');
        });

        $('.product-nav img').click(function (event) {
            event.preventDefault();

            var $secondaryImage = $(this);
            var $largeImage = $('.product-media > figure a.featured img');

            $largeImage.attr('src', $secondaryImage.attr('src'));
            $largeImage.data('largeSize', $secondaryImage.data('largeSize'));
            $largeImage.data('index', $secondaryImage.attr('id').replace('media-', ''));

            // Re-init zoom
            sw.theme.setupProductImageZoom();
        });
    },

    /**
     * Setup product media gallery lightbox.
     */
    setupProductMediaGalleryLightbox: function setupProductMediaGalleryLightbox() {
        $('.product-media > figure a').click(function (event) {
            event.preventDefault();
            var startFromIndex = parseInt($(this).find('img').data('index'));
            var largeUrl = [];

            // Several images
            if ($('.product-media img').length > 1) {
                $(".product-nav img").each(function () {
                    largeUrl.push({ url: $(this).data('largeSize'), type: 'image' });
                });
                // Single image
            } else {
                largeUrl.push({ url: $(this).find('img').data('largeSize'), type: 'image' });
            }

            // Open lightbox
            $.iLightBox(largeUrl, {
                path: 'horizontal',
                skin: 'mac',
                startFrom: startFromIndex,
                controls: {
                    arrows: true
                }
            });
        });
    },

    /**
     * Setup product labels.
     */
    setupProductlabels: function setupProductlabels() {
        $('.product-media .product-label').appendTo('.product-media > figure');
    },

    /**
     * Setup site footer.
     */
    setupFooter: function setupFooter() {
        sw.theme.setupFooterPosition($('#site-footer'));
    },

    /**
     * Setup footer position.
     */
    setupFooterPosition: function setupFooterPosition($footer) {
        $(window).on('load resize scroll', function () {
            var documentHeight = $(document.body).height() - $('#sticky-footer-push').height();
            if (documentHeight < $(window).height()) {
                var diff = $(window).height() - documentHeight;
                if (!$('#sticky-footer-push').length) {
                    $($footer).before('<div id="sticky-footer-push"></div>');
                }
                $('#sticky-footer-push').height(diff);
            }
        });
    },

    /**
     * Setup YouTube embedded videos to be responsive.
     */
    setupYouTubeEmbedded: function setupYouTubeEmbedded() {
        $('iframe[src*="youtube.com"]').each(function () {
            $(this).removeAttr('width').removeAttr('height').wrap('<div class="video">');
        });
    },

    /**
     * Setup checkout.
     */
    setupCheckout: function setupCheckout() {
        // Change Vewrifone logo to white with dark theme
        $('#checkout-page.theme-color-scheme-0 img[src$="verifone-all.png"]').attr('src', '/img/default-payment-method-logos/verifone-all-negative.png');
    },

    /**
     * Setup product upsell slideshow.
     */
    setupProductUpsellSlideshow: function setupProductUpsellSlideshow() {
        if ($.fn.slick && sw.atMedia.minWidth(767)) {
            var options = $.extend({}, sw.theme.options.productUpsellSlideshow);

            // Number of slides with default checkout-layout
            var nrOfSlides = {
                // Gallery layout 3 (Admin layout B)
                galleryLayout3: options.nrOfSlides.checkoutLayout0.galleryLayout3,
                // Gallery layout 4 (Admin layout A)
                galleryLayout4: options.nrOfSlides.checkoutLayout0.galleryLayout4
            };

            if ($('html').hasClass('theme-checkout-layout-1')) {
                nrOfSlides.galleryLayout3 = options.nrOfSlides.checkoutLayout1.galleryLayout3;
                nrOfSlides.galleryLayout4 = options.nrOfSlides.checkoutLayout1.galleryLayout4;
            } else if ($('html').hasClass('theme-checkout-layout-2')) {
                nrOfSlides.galleryLayout3 = options.nrOfSlides.checkoutLayout2.galleryLayout3;
                nrOfSlides.galleryLayout4 = options.nrOfSlides.checkoutLayout2.galleryLayout4;
            }

            if (options.autoplay === null) {
                options.autoplay = $('.product-upsell-wrap .gallery').data('sw-autoplay');
            }

            if (options.autoplaySpeed === null) {
                speed = parseInt($('.product-upsell-wrap .gallery').data('sw-speed'));
                if (speed > 0) {
                    options.autoplaySpeed = speed * 1000;
                } else {
                    options.autoplaySpeed = 5000;
                }
            }

            $('.product-upsell-wrap .gallery-layout-4').slick({
                slide: 'li',
                dots: options.dots,
                slidesToShow: nrOfSlides.galleryLayout4,
                slidesToScroll: nrOfSlides.galleryLayout4,
                autoplay: options.autoplay,
                autoplaySpeed: options.autoplaySpeed
            });

            $('.product-upsell-wrap .gallery-layout-3').slick({
                slide: 'li',
                dots: options.dots,
                slidesToShow: nrOfSlides.galleryLayout3,
                slidesToScroll: nrOfSlides.galleryLayout3,
                autoplay: options.autoplay,
                autoplaySpeed: options.autoplaySpeed
            });
        }
    },

    /**
     * Setup product filter.
     */
    setupProductFilter: function setupProductFilter() {
        var options = sw.theme.options.productFilter;

        // Create range sliders
        sw.theme.createRangeSlider();

        // Truncate long lists of filtering values
        $('.filter-items').each(function (index) {
            var $truncatedValues = $(this).find('.filter-item:gt(' + (options.maxFilterItems - 1) + ')');
            $truncatedValues.hide();

            // Show truncation link
            if ($truncatedValues.length) {
                $(this).find('.see-more-filter-items').show();
            }
        });

        $('#search-filter').on('click', '.see-more-filter-items', function (event) {
            event.preventDefault();
            $(this).hide().closest('.filter-items').find('.filter-item:hidden, .see-less-filter-items').show();
        });

        $('#search-filter').on('click', '.see-less-filter-items', function (event) {
            event.preventDefault();
            var $filterItems = $(this).closest('.filter-items');
            $(this).hide();
            $filterItems.find('.filter-item:gt(' + (options.maxFilterItems - 1) + ')').hide();
            $filterItems.find('.see-more-filter-items').show();
        });

        // Open selected filtergroups on desktop
        if (sw.atMedia.minWidth(800) && $('html').hasClass('has-sidebar') === false) {
            $('.filter-group').filter(function (index) {
                return $.inArray(index, options.openFilterGroups) > -1;
            }).toggleClass('filter-group-open filter-group-closed');
        }

        // Toggle active filters
        $('#search-filter').on('click', '.toggle-active-filters', function () {
            var $block = $(this).closest('.block');
            $block.toggleClass('filter-menu-show-filters');
            $block.removeClass('filter-menu-show-sort-order');
            $(this).toggleClass('current-filter-menu-item').siblings().removeClass('current-filter-menu-item');
        });

        // Toggle sort order
        $('#search-filter').on('click', '.toggle-sort-order', function () {
            var $block = $(this).closest('.block');
            $block.toggleClass('filter-menu-show-sort-order');
            $block.removeClass('filter-menu-show-filters');
            $(this).toggleClass('current-filter-menu-item').siblings().removeClass('current-filter-menu-item');
        });

        // Close open filtergroup on click outside
        if ($('html').hasClass('has-sidebar') === true) {
            $(document).mouseup(function (e) {
                var container = $('.filter-group-open');
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    container.toggleClass('filter-group-open filter-group-closed');
                }
            });
        }
    },

    /**
     * Create range slider
     */
    createRangeSlider: function createRangeSlider() {
        var options = sw.theme.options.productFilter;
        $('.filter-type-range').each(function () {
            var $range = $(this);
            var settings = {
                onFinish: function onFinish(data) {
                    var isNewFilterValue = sw.productFilter.isPriceRangeChanged($range.prop("value")),
                        parameters;
                    if (isNewFilterValue) {
                        sw.productFilter.addToActiveFilters($range.data('filterItemTitle', sw.getFormattedCurrencyAmount(data.from) + '-' + sw.getFormattedCurrencyAmount(data.to)));
                    } else {
                        $('.active-filter-type-range').click();
                    }
                    parameters = sw.productFilter.updateQueryParameters(isNewFilterValue);
                    sw.productFilter.updateProductListAndFilters(parameters);
                }
            };

            $range.ionRangeSlider($.extend(settings, options.rangeSlider));
        });
    },

    /**
     * Reset range slider
     */
    resetRangeSlider: function resetRangeSlider(filterItemId) {
        var $range = $('#' + filterItemId);
        var rangeSlider = $range.data("ionRangeSlider");
        rangeSlider.update({
            from: parseFloat($range.data('min')),
            to: parseFloat($range.data('max'))
        });
    }
};

$(document).ready(sw.theme.init);