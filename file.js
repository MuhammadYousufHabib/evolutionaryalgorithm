function getRandomNumberInclusive(min, max) {
  const random = Math.random() * (max - min) + min;
  return parseFloat(random.toFixed(3));
}

function fitnessfunc(x, y) {
  return parseFloat((11 * x - 7.59 * y).toFixed(3));
}

let avgarray = [];
let random = [];
let selectedParents = [];
let crossoveredChildren = [];

function initialization() {
  for (let i = 0; i < 10; i++) {
    let a = getRandomNumberInclusive(0.5, 7.5);
    let b = getRandomNumberInclusive(-4.0, 2.85);

    random[i] = { id: i, x: a, y: b, fitness: null };
  }
}
function parentSelection() {
  let index1 = Math.floor(getRandomNumberInclusive(0, 9));
  let index2;
  while (true) {
    index2 = Math.floor(getRandomNumberInclusive(0, 9));
    if (index2 !== index1) {
      break;
    }
  }

  let selectedParent1 = { ...random[index1] };
  let selectedParent2 = { ...random[index2] };

  selectedParents.push([selectedParent1, selectedParent2]);
}

function crossover() {
  crossoveredChildren = selectedParents.map((e) => {
    let temp = e[0].y;
    return [
      { ...e[0], y: e[1].y },
      { ...e[1], y: temp },
    ];
  });
}

function mutation() {
  crossoveredChildren = crossoveredChildren.flat();
  mutatedChildren = crossoveredChildren.map((child) => ({ ...child }));
  mutatedChildren.forEach((e) => {
    let random0 = getRandomNumberInclusive(0, 9).toFixed(0);
    let random1 = getRandomNumberInclusive(0, 9).toFixed(0);
    let random2 = getRandomNumberInclusive(0, 9).toFixed(0);

    if (random0 >= 4) {
      // console.log(" mutation hogi");
      if (random1 >= 4) {
        // console.log("x pr");
        if (random2 >= 4) {
          //  console.log(" plus");
          e.x = parseFloat((e.x + 0.15).toFixed(3));
        } else {
          //  console.log("minus");
          e.x = e.x - 0.15;
        }
      } else {
        // console.log("y pr");
        if (random2 >= 4) {
          //   console.log("plus");
          e.y = e.y + 0.15;
        } else {
          //   console.log("minus");
          e.y = e.y - 0.15;
        }

        e.y = parseFloat(e.y.toFixed(3));
      }
    }
  });
}
initialization();
let bestfit = [];
let stoppingcritarea = false;
while (stoppingcritarea === false) {
  random.forEach((e) => {
    e.fitness = fitnessfunc(e.x, e.y);
  });
  for (let i = 0; i < 5; i++) {
    parentSelection();
    crossover();
    mutation();
    mutatedChildren.forEach((e) => {
      if (e.x > 7.5) {
        e.x = 7.5;
      }
      if (e.x < 0.5) {
        e.x = 0.5;
      }
      if (e.y < -4) {
        e.y = -4;
      }
      if (e.y > 2.85) {
        e.y = 2.85;
      }
      e.fitness = fitnessfunc(e.x, e.y);
    });
  }

  let twenty = [...random, ...mutatedChildren];
  twenty.sort((a, b) => b.fitness - a.fitness);
  let top10 = twenty.slice(0, 10);
  random = [];
  random = [...top10];
  twenty = [];
  top10 = [];
  selectedParents = [];
  crossoveredChildren = [];
  let avg = 0;
  for (let i = 0; i < 10; i++) {
    avg = avg + random[i].fitness;
  }

  avg = avg / 10;

  avgarray.push(avg);
  bestfit.push(random[0].fitness);
  console.log(random);
  if (avgarray.length > 10) {
    avgarray.shift();
    let count = 0;
    for (let i = 0; i < 10; i++) {
      if (avgarray[i + 1] - avgarray[i] <= 0.001) {
        count++;
      }
      if (count >= 9) {
        stoppingcritarea = true;
        break;
      }
    }
  }

  console.log("----------------<>----<>----------------------<><>-");
}

console.log("---------------", bestfit, "-------------------");
// ----------------------------------GRAPH----------------------------------
google.charts.load("current", { packages: ["corechart", "line"] });
google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {
  var data = new google.visualization.DataTable();
  data.addColumn("number", "Iteration");
  data.addColumn("number", "Fitness");
  for (let i = 0; i < bestfit.length; i++) {
    data.addRows([[i + 1, bestfit[i]]]);
  }
  var options = {
    hAxis: { title: "Generations" },
    vAxis: {
      title: "F i t n e s s",
    },
  };

  var chart = new google.visualization.LineChart(
    document.getElementById("chart_div")
  );

  chart.draw(data, options);
}
