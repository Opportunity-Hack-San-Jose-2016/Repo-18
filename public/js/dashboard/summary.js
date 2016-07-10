/**
 * Created by Crystal on 7/9/16.
 */
app.controller("PieCtrl", function ($scope) {


    $scope.ageLabels = ["Male, Age under 10", "Female, Age under 10", "Male, Age 11-20", "Female, Age 11-20", "Male, Age 21-35", "Female, Age 21-35"
        , "Male, Age 36-60", "Female, Age 36-60", "Male, Age 60+", "Female, Age 60+"];
    $scope.ageData = [300, 500, 100, 980, 32526, 342, 1245, 3573, 234, 2123];
    $scope.requestLabels = ["Health", "Water", "Shelter"];
    $scope.requestData = [200, 400, 122];
    $scope.number = [30, 20, 20];

    $(document).ready(function () {
        $.fn.jQuerySimpleCounter = function (options) {
            var settings = $.extend({
                start: 0,
                end: 100,
                easing: 'swing',
                duration: 400,
                complete: ''
            }, options);

            var thisElement = $(this);

            $({count: settings.start}).animate({count: settings.end}, {
                duration: settings.duration,
                easing: settings.easing,
                step: function () {
                    var mathCount = Math.ceil(this.count);
                    thisElement.text(mathCount);
                },
                complete: settings.complete
            });
        };

        $.get("/api/statistics/summary", function (data) {
            $('#number1').jQuerySimpleCounter({end: data.new, duration: 3000});
            $('#number2').jQuerySimpleCounter({end: data.ongoing, duration: 3000});
            $('#number3').jQuerySimpleCounter({end: data.done, duration: 2000});
        });


        /* AUTHOR LINK */
        $('.about-me-img img, .authorWindowWrapper').hover(function () {
            $('.authorWindowWrapper').stop().fadeIn('fast').find('p').addClass('trans');
        }, function () {
            //$('.authorWindowWrapper').stop().css('display', 'none').find('p').removeClass('trans');
        });
    });

});




