var myHeaders = new Headers();

var myInit = {
  method: "GET",
  headers: myHeaders,
};

var myRequest = new Request("http://localhost:2000/api/estatisticas", myInit);

const test = fetch(myRequest)
  .then(function (response) {
    if (!response.ok) {
     
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json(); 
  })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log("There was a problem with the fetch operation:", error); 
  });



const ctx = document.getElementById('myChart');

let month = ['Abril', 'Maio', 'Junho'];

let reports  = [
    {
        label: 'Nº de Zonas de Baixos risco',
        data: [1],
        borderWidth: 1,
    },
    {
        label: 'Nº de Zonas de Médio risco',
        data: [3],
        borderWidth: 1,
    },
    {
        label: 'Nº de Zonas de Alto risco',
        data: [3],
        borderWidth: 1,
    }
];

new Chart(ctx, {
    type: 'bar',
    data: {
    labels: month,
    datasets: reports
    },
        options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});