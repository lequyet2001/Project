const firebaseConfig = {
  apiKey: "AIzaSyBrbO30q3ttwcHCiNmnZ8nUFC_AGlQwfM4",
  authDomain: "esp-firebase-demo-e5255.firebaseapp.com",
  databaseURL: "https://esp-firebase-demo-e5255-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp-firebase-demo-e5255",
  storageBucket: "esp-firebase-demo-e5255.appspot.com",
  messagingSenderId: "927097021814",
  appId: "1:927097021814:web:e974803337cce671868657"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const t=[[,"%","°C","time"]]
const dataT = [["Thời gian", "Nhiệt độ"]];
const dataH = [["Thời gian", "Độ ẩm"]];
const dataTime = [];
const maxDataPoints = 20;
database.ref("/test").on("value", function(snapshot) {
  var Temp =snapshot.val()

    const timestamp = Temp.Time;
    const temperature = Temp.Temperature;
    const humidity = Temp.Humidity;
    const time = new Date(`2000-01-01T${timestamp}Z`);
    time.setHours(time.getHours() );
    t.push([,humidity,temperature,time.toTimeString().slice(0, 8)])

    dataT.push([time.toTimeString().slice(0, 8), temperature]);
    dataH.push([time.toTimeString().slice(0, 8),humidity])
    // dataH.push(humidity);
    // dataTime.push(new Date(timestamp));


  // Remove data points if more than maximum number
  if (dataT.length > maxDataPoints &&dataH.length >maxDataPoints) {
    dataT.splice(1, dataT.length - maxDataPoints);
    dataH.splice(1, dataH.length - maxDataPoints);
  }

  // Load Google Charts library and draw chart
  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    // Convert data array to DataTable object
    const dataTableT = google.visualization.arrayToDataTable(dataT);
    const dataTableH = google.visualization.arrayToDataTable(dataH);
    // Set chart options
    const optionsT = {
      title: "Biểu đồ nhiệt độ theo thời gian",
      curveType: "function",
      legend: { position: "bottom" },
      hAxis: {
        title: "Thời gian",
        format: "HH:mm:ss",
        gridlines: { count: -1, units: { minutes: { format: ["HH:mm"] } } },
      },
      vAxis: {
        title: "Nhiệt độ (°C)",
        viewWindow: {
          // min: 0,
          // max: 50,
        },
        format: "#,##0.00°C"
      },
    };
    const optionsH={
      title: "Biểu đồ độ ẩm theo thời gian",
      curveType: "function",
      legend: { position: "bottom" },
      hAxis: {
        title: "Thời gian",
        format: "DD/MM/YYYY HH:mm:ss",
        gridlines: { count: -1, units: { minutes: { format: ["HH:mm"] } } },
      },
      vAxis: {
        title: "Độ ẩm (%)",
        viewWindow: {
          // min: 0,
          // max: 50,
        },
        // format: "#,##0.00%"
      },
    };
    // Instantiate and draw the chart
    const chartT = new google.visualization.LineChart(
      document.getElementById("myChartT")
    );
     const chartH = new google.visualization.LineChart(
      document.getElementById("myChartH")
    );
    chartT.draw(dataTableT, optionsT);
    chartH.draw(dataTableH, optionsH);
   
  }
  console.table(t)
});
