// https://mappa.js.org/docs/getting-started.html


// Other possible interesting videos:
// Subscribers data: https://www.youtube.com/watch?v=Ae73YY_GAU8&feature=youtu.be
// Earthquake Data: https://www.youtube.com/watch?v=ZiYdOwOrGyc&t=1083s

// For integrating images: https://www.youtube.com/watch?v=FVYGyaxG4To


let myMap;
let canvas;
const mappa = new Mappa('Leaflet');

let options = {
  lat: 42.90908,
  lng: -78.8541,
  zoom: 12,
  style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
}


function preload() {
  // With this code, you will need to convert your GPX file to CSV
  // Google search online converters and select one to test
  firstPath = loadTable('track_points.csv', 'csv', 'header');
  secondPath = loadTable('track_points-02.csv', 'csv', 'header');

  // Open Data Buffalo provides locations of fire hydrants
  // https://data.buffalony.gov/Public-Safety/Fire-Hydrants/jxqq-q5cq
//  hydrantLocations = loadTable('Buffalo_Public_Schools_2017-2018.csv', 'csv', 'header');
  schoolLocations = loadTable('Buffalo_Public_Schools_2017-2018.csv', 'csv', 'header');
}


function setup() {
  rectMode(CENTER);
  canvas = createCanvas(800, 800);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  myMap.onChange(clear);


  // myMap.onChange(drawPath.bind(null, firstPath));
  // myMap.onChange(drawPath.bind(null, secondPath));

  // Create a new function of drawing the hydrants that differs from the drawPath
  // myMap.onChange(drawHydrant.bind(null, hydrantLocations));
  myMap.onChange(drawSchools.bind(null, schoolLocations));
}


function draw() {
}

function drawSchools(path) {
  // noStroke();
  // fill(0, 0, 0, 20)
  // ellipse(400, 400, 800)
  for (let i = 0; i < path.getRowCount() - 1; i++) {
    const latitude = Number(path.getString(i, 'LATITUDE'));
    const longitude = Number(path.getString(i, 'LONGITUDE'));
    // const elevation = Number(path.getString(i, 'ele'));
    const schoolName = path.getString(i, 'SCHOOL NAME');
        const schoolType = path.getString(i, 'TYPE');
    // const gradeMax = path.getString(i, 'GRADE MAX');

    if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {
      const pos = myMap.latLngToPixel(latitude, longitude);

      let size = Number(path.getString(i, 'GRADE MAX'));
      console.log(typeof size);
      // let size = 10;
      // size = map(size, 173.0133, 182.1649, 1, 25) + myMap.zoom();
      size = map(size, 4, 12, 3, 15);


      noStroke();
      fill(255,128,0);
      rect(pos.x, pos.y, 3, 2);

      stroke(255, 255, 255);
      strokeWeight(size);
      point(pos.x, pos.y);

      if (schoolType === 'ELEMENTARY') {
        triangle(pos.x, pos.y, pos.x-10, pos.y-10, pos.x-50, pos.y-50)
      }

      noStroke();
      fill(255);
      textSize(15);
      text(schoolName, pos.x, pos.y);
    }
  }
}

function drawPath(path) {
  // noStroke();
  // fill(0, 0, 0, 20)
  // ellipse(400, 400, 800)
  for (let i = 0; i < path.getRowCount() - 1; i++) {
    const latitude = Number(path.getString(i, 'reclat'));
    const longitude = Number(path.getString(i, 'reclon'));
    const elevation = Number(path.getString(i, 'ele'));

    if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {
      const pos = myMap.latLngToPixel(latitude, longitude);

      let size = path.getString(i, 'ele');
      // size = map(size, 173.0133, 182.1649, 1, 25) + myMap.zoom();
      size = map(size, 173.0133, 182.1649, 3, 15);

      noStroke();
      fill(255,128,0);
      rect(pos.x, pos.y, 3, 2);

      stroke(1);
      strokeWeight(1);
      point(pos.x, pos.y);
    }
  }
}

function drawHydrant(path) {
  // for (let i = 0; i < 5; i++) { // Note, when  parsing through data, it helps to isolate a few lines before loading the entire dataset
  for (let i = 0; i < path.getRowCount() - 1; i++) {

    // Accessing the column with the header 'the_geom'
    // You can also open the csv file to see what the different headers are
    const hydrantLatLng = path.getString(i, 'the_geom');
    // console.log(hydrantLng); // Tip: sometimes it is helpful to see how your data is written
    // console.log(typeof hydrantLatLng); // typeof reveals how the computer understands hydrantLatLng. In this case, it is a string.


    // The data comes in as a string.
    // A string is a data primitive.
    // p5.js info on strings: https://p5js.org/reference/#/p5/string
    // For a more expansive list in handling strings in JS: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

    // I am splitting up the string to try and access the number value. First, I split with a space which is written as ' '.
    var segments = hydrantLatLng.split(' ');
    // console.log(segments) // You will see that the segments will be returned as an array.
    // console.log(segments[1].replace('(', '')) // You can access the array to get the longitude.
    // console.log(segments[2].replace(')', '')) // You can access the array to get the latitude.

    // When you console.log the typeof, you can still see the computer reads this as a STRING and not a NUMERICAL VALUE.
    // console.log(typeof segments[1]);
    // console.log(typeof segments[2]);


    // There are 2 operations in the following:
    // 1. I am getting rid of the paranethesis in each by replacing the symbol with nothing.
    // 2. I am turning the resultant STRING into a NUMBER. This is a JavaScript method: https://gomakethings.com/converting-strings-to-numbers-with-vanilla-javascript/
    // It may be helpful to read up on NaN or 'Not a Number'
    const hydrantLng = Number(segments[1].replace('(', ''));
    const hydrantLat = Number(segments[2].replace(')', ''));


    // Assignment: Interact and show every single piece of data
    const objectID = path.getString(i, 'OBJECTID');
    const globalID = path.getString(i, 'GlobalID');
    const location = path.getString(i, 'Location');
    const hydrantID = path.getString(i, 'Hydrant_ID');
    const hydrantNumber = path.getString(i, 'Hydrant Number');
    const streetNumber = path.getString(i, 'Street Number');
    const hydrantType = path.getString(i, 'Hydrant Type');
    const streetName = path.getString(i, 'Street Name');
    const hydrantColorAndSize = path.getString(i, 'Hydrant Color & Main Size');
    const lastUsed = path.getString(i, 'Last Used');
    const nozzleDiameter = path.getString(i, 'Nozzle Diameter');
    const mainDiameter = path.getString(i, 'Main Diameter');
    const crossStreet = path.getString(i, 'Cross Street');
    const dateCollected = path.getString(i, 'Date Collected');
    const mapQuad = path.getString(i, 'Map Quad');
    const hydrantColor = path.getString(i, 'Hydrant Color');
    const hydrantValve = path.getString(i, 'Hydrant Valve');
    const yValue = path.getString(i, 'Y');
    const deadEnd = path.getString(i, 'Dead End');
    const xValue = path.getString(i, 'X');
    const mapNumber = path.getString(i, 'Map Number');
    const inspectionDistrict = path.getString(i, 'Inspection District');
    const lastUsedBy = path.getString(i, 'Last Used By');
    const supplyDiameter = path.getString(i, 'Supply Diameter');
    const comments = path.getString(i, 'Comments');


    // Convert the hydrantLat and hydrantLng into an X and Y coordinate on the screen.
    if (myMap.map.getBounds().contains({lat: hydrantLat, lng: hydrantLng})) {
      const pos = myMap.latLngToPixel(hydrantLat, hydrantLng);
      // Control and design the graphics here.

      // Draw position of hydrants
      // The diameter of circle is linked to main diameter
      stroke(255);
      strokeWeight(0.25);
      fill(255, 255, 255);
      ellipse(pos.x, pos.y, mainDiameter*1.25, mainDiameter*1.25);

      // Draw nozzle diameter as triangles
      // The diameter of circle is linked to main diameter
      push();
      stroke(0);
      strokeWeight(0.25);
      fill(0);
      translate(pos.x, pos.y);
      rotate(random(360));
      triangle(-mainDiameter/1.5, mainDiameter/1.5, mainDiameter/1.5, mainDiameter/1.5, 0, 0);
      pop();

      // Write street names with positions at every hydrant position
      // Text size is linked to main diameter
      noStroke();
      fill(255, 255, 255, 60);
      textSize(mainDiameter/1.5);
      text(streetName, pos.x, pos.y)

      // Write hydrant numbers
      fill(0);
      textSize(mainDiameter*1.5);
      text(hydrantNumber, pos.x-4, pos.y+4)
    }
  }
}
