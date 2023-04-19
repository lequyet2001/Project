
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
var database=firebase.database();
const dataT=[];
const dataH=[];
const dataTime=[];
// database.ref('/test').set(firebase.database.ServerValue.TIMESTAMP);
database.ref("/test").on("value",function(snapshot){
  var Temp =snapshot.val()
  console.log(Temp)
  document.getElementById("nd").innerHTML= "Nhiệt độ: "+Temp.Temperature+" °C";
  document.getElementById("da").innerHTML="Độ ẩm: " + Temp.Humidity+" %";
  var t=Temp.Temperature;
  var h=Temp.Humidity;
  var time=Temp.Time;
  dataT.push(t);
  dataH.push(h);
  dataTime.push(time);
  new Chart("myChart", {
    type: "line",
    data: {
      labels: dataTime,
      datasets: [{ 
        data: dataH,
        borderColor: "red",
        fill: false
      }]
    },
    options: {
      legend: {display: false}
    }
  });
})


