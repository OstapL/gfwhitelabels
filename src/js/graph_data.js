function e() {
    return 10 * Math.random() - 5;
  }

function i(e, i, t) {
    $('<div id="tooltip">' + t + "</div>").css({
        position: "absolute",
        display: "none",
        top: i + 5,
        left: e + 15,
        border: "1px solid #333",
        padding: "4px",
        color: "#fff",
        "border-radius": "3px",
        "background-color": "#333",
        opacity: .8
    }).appendTo("body").fadeIn(200);
}

var t = [
        [1, e()],
        [2, e()],
        [3, 2 + e()],
        [4, 3 + e()],
        [5, 5 + e()],
        [6, 10 + e()],
        [7, 15 + e()],
        [8, 20 + e()],
        [9, 25 + e()],
        [10, 30 + e()],
        [11, 35 + e()],
        [12, 25 + e()],
        [13, 15 + e()],
        [14, 20 + e()],
        [15, 45 + e()],
        [16, 50 + e()],
        [17, 65 + e()],
        [18, 70 + e()],
        [19, 85 + e()],
        [20, 80 + e()],
        [21, 75 + e()],
        [22, 80 + e()],
        [23, 75 + e()],
        [24, 70 + e()],
        [25, 65 + e()],
        [26, 75 + e()],
        [27, 80 + e()],
        [28, 85 + e()],
        [29, 90 + e()],
        [30, 95 + e()]
    ];
var a = [
    [1, e() - 5],
    [2, e() - 5],
    [3, e() - 5],
    [4, 6 + e()],
    [5, 5 + e()],
    [6, 20 + e()],
    [7, 25 + e()],
    [8, 36 + e()],
    [9, 26 + e()],
    [10, 38 + e()],
    [11, 39 + e()],
    [12, 50 + e()],
    [13, 51 + e()],
    [14, 12 + e()],
    [15, 13 + e()],
    [16, 14 + e()],
    [17, 15 + e()],
    [18, 15 + e()],
    [19, 16 + e()],
    [20, 17 + e()],
    [21, 18 + e()],
    [22, 19 + e()],
    [23, 20 + e()],
    [24, 21 + e()],
    [25, 14 + e()],
    [26, 24 + e()],
    [27, 25 + e()],
    [28, 26 + e()],
    [29, 27 + e()],
    [30, 31 + e()]
];
var plotOptions = [{
  data: t,
  label: "Invested amount",
  lines: {
    lineWidth: 1
  },
  shadowSize: 0
}, {
  data: a,
  label: "Page Views",
  lines: {
    lineWidth: 1
  },
  shadowSize: 0
}];

var plotData = {
  series: {
    lines: {
      show: !0,
      lineWidth: 2,
      fill: !0,
      fillColor: {
        colors: [{
          opacity: .05
        }, {
          opacity: .01
        }]
      }
    },
    points: {
      show: !0,
      radius: 3,
      lineWidth: 1
    },
    shadowSize: 2
  },
  grid: {
    hoverable: !0,
    clickable: !0,
    tickColor: "#eee",
    borderColor: "#eee",
    borderWidth: 1
  },
  colors: ["#d12610", "#37b7f3", "#52e136"],
  xaxis: {
    ticks: 11,
    tickDecimals: 0,
    tickColor: "#eee"
  },
  yaxis: {
    ticks: 11,
    tickDecimals: 0,
    tickColor: "#eee"
  }
};

var r = $.plot($("#chart_2"), plotOptions, plotData, null);
$("#chart_2").bind("plothover", function(e, t, a) {
  if ($("#x").text( t.x.toFixed(2)), $("#y").text(t.y.toFixed(2)), a) {
      if (r != a.dataIndex) {
          r = a.dataIndex, $("#tooltip").remove();
          var o = a.datapoint[0].toFixed(2),
              s = a.datapoint[1].toFixed(2);
          i(a.pageX, a.pageY, a.series.label + " of " + o + " = " + s)
      }
  } else $("#tooltip").remove(), r = null
});





