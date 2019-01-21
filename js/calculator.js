$(function() {

  // All necessary values
  var timesClicked = 0;
  var moonCirc = 6783;
  var subType = "mover"; // Base value of the subscriptions
  var stepsPerCoin = 1053;
  var colors;
  // Maps that hold step information
  var maxEarn = new Map(); // Both maps coordinate with subType
  var monthFee = new Map();

  init();

  function changeSubProperties() {
    subType = $("#subType").val().toLowerCase();
    $("#maxEarn").text(maxEarn.get(subType).toFixed(2));
    $("#monthFee").text(monthFee.get(subType).toFixed(2));
    $("#maxSteps").text(numberWithCommas(maxEarn.get(subType) * 1053));
  }

  // Will enable the buttons if all inputs are filled
  function checkInputs() {
    if ($("#curBalanceCount").val() >= 0) {
      if ($("#stepsPerDayCount").val() > 1053) {
        if ($("#goalCount").val() > 0) {
          $("#calcButton").removeAttr("disabled");
        } else {
          $("#calcButton").prop('disabled', true);
        }
      } else {
        $("#calcButton").prop('disabled', true);
      }
    } else {
      $("#calcButton").prop('disabled', true);
    }
  }

  function calcSteps() {
    var balance = Number($("#curBalanceCount").val());
    var stepsPerDay = Number($("#stepsPerDayCount").val());
    var goal = Number($("#goalCount").val());
    subType = $("#subType").val().toLowerCase();


    var earn = 0;
    var feeLoss = 0;
    var totalDays = 0;
    var totalSteps = 0;

    if (stepsPerDay > (maxEarn.get(subType) * 1053)) {
      stepsPerDay = maxEarn.get(subType) * 1053;
    }
    var earnDaily = stepsPerDay / 1053;

    // console.log(subType, balance, stepsPerDay, goal);
    // console.log(earnDaily, maxEarn.get(subType), monthFee.get(subType));

    while (balance + earn <= goal) {
      totalDays += 1;
      totalSteps += stepsPerDay;
      earn += earnDaily;

      if (totalDays % 30 == 0) {
        earn -= monthFee.get(subType);
        feeLoss += monthFee.get(subType);
      }
    }
    // console.log(feeLoss, totalDays, totalSteps);

    $("#goalDiff").text(numberWithCommas((goal - balance).toFixed(2)));
    $("#feeLoss").text(numberWithCommas(feeLoss.toFixed(2)));
    $("#totalEarn").text(numberWithCommas((feeLoss + earn).toFixed(2)));
    $("#totalSteps").text(numberWithCommas(totalSteps));
    $("#totalDistance").text(numberWithCommas((totalSteps / 2000).toFixed(2)));

    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + totalDays);
    $("#totalDays").text(numberWithCommas(totalDays));
    $("#calcDate").text(futureDate.toJSON().slice(0, 10));

    animateBar((totalSteps / 2000) / moonCirc);
  }

  function animateBar(times) {
    $("#circPercent").text((times * 100).toFixed(2));
    $("#container").empty();
    var progress = Math.floor(times);
    if (progress > 3) {
      progress = 3;
    }
    var progBar = new ProgressBar.Circle(container, {
      strokeWidth: 3,
      easing: 'easeInOut',
      duration: 1400,
      color: colors[progress],
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null
    });
    progBar.animate(times % 1);
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function init() {
    // // Implement the progress bar
    // var bar = new ProgressBar.Circle(container, {
    //   strokeWidth: 3,
    //   easing: 'easeInOut',
    //   duration: 1400,
    //   color: '#4ffc05',
    //   trailColor: '#eee',
    //   trailWidth: 1,
    //   svgStyle: null
    // });
    //
    // // Test the bar
    // var ran = Math.random();
    // console.log(ran);
    // bar.animate(ran);

    $("#curBalanceCount").change(function() {
      checkInputs();
    });
    $("#stepsPerDayCount").change(function() {
      checkInputs();
    });
    $("#goalCount").change(function() {
      checkInputs();
    });
    $("#subType").change(function() {
      changeSubProperties();
      checkInputs();
    });

    $("#moon").on("click", function() {
      if (timesClicked == 6) {
        $("#card").flip();
        $("#darkSide").show();
      } else {
        timesClicked++;
      }
    });

    $("#calcButton").on("click", function() {
      calcSteps();
    });

    $("#todayDate").text(new Date().toJSON().slice(0, 10));

    colors = ["#4ffc05", "#edfc11", "#fe7509", "#fe0900"];

    maxEarn.set("mover", 5.00);
    maxEarn.set("shaker", 10.00);
    maxEarn.set("quaker", 15.00);
    maxEarn.set("breaker", 20.00);

    monthFee.set("mover", 0.00);
    monthFee.set("shaker", 4.75);
    monthFee.set("quaker", 20.00);
    monthFee.set("breaker", 30.00);
  }

});
