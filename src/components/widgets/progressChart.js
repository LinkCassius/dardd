import React from "react";
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

const progressChart = (props) => {
  console.log("chart data : ", props);
  const data = {
    labels: props.label,
    datasets: [
      {
        label: props.title,
        backgroundColor: props.backgroundColor, //rgba(255,99,132,0.2)
        borderColor: props.borderColor, //rgba(255,99,132,1)
        borderWidth: 1,
        hoverBackgroundColor: props.hoverBackgroundColor, //rgba(255,99,132,0.4)
        hoverBorderColor: props.hoverBorderColor, //'rgba(255,99,132,1)'
        data: props.chartdata,
      },
    ],
  };
  if (props.type === "HorizontalBar") {
    return (
      <div
        // style={{
        //   width: "420px",
        //   height: "300px",
        // }}
        className="col-md-12 canvas"
      >
        <h4>{props.heading}</h4>
        <Bar
          data={data}
          // width={100}
          // height={50}
          plugins={[ChartDataLabels]}
          options={{
            maintainAspectRatio: true,
            indexAxis: "y",
          }}
        />
      </div>
    );
  }
  if (props.type === "Bar") {
    return (
      <div
        // style={{
        //   width: "420px",
        //   height: "300px",
        // }}
        className="col-md-12 canvas"
      >
        <h4>{props.heading}</h4>
        <Bar
          data={data}
          width={500}
          height={400}
          plugins={[ChartDataLabels]}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                display: true,
                title: {
                  display: true,
                  text: "Percentage",
                  color: "black",
                },
              },
            },
          }}
        />
      </div>
    );
  }
  if (props.type === "DoubleBar") {
    data.datasets.push({
      label: props.title1,
      backgroundColor: props.backgroundColor1, //rgba(255,99,132,0.2)
      borderColor: props.borderColor1, //rgba(255,99,132,1)
      borderWidth: 1,
      hoverBackgroundColor: props.hoverBackgroundColor1, //rgba(255,99,132,0.4)
      hoverBorderColor: props.hoverBorderColor1, //'rgba(255,99,132,1)'
      data: props.chartdata1,
    });
    return (
      <div
        // style={{
        //   width: "400px",
        //   height: "300px",
        // }}
        className="col-md-12 canvas"
      >
        <h4>{props.heading}</h4>
        <Bar
          data={data}
          width={100}
          height={100}
          options={{ maintainAspectRatio: true }}
        />
      </div>
    );
  }

  if (props.type === "Pie") {
    return (
      <div
        // style={{
        //   width: "420px",
        //   height: "300px",
        // }}
        className="col-md-10 canvas"
      >
        <h4>{props.heading}</h4>
        <Pie
          data={data}
          // width={100}
          // height={50}
          plugins={[ChartDataLabels]}
          //options={{ maintainAspectRatio: false }}
          options={{ responsive: true }}
        />
      </div>
    );
  }
  if (props.type === "Doughnut") {
    return (
      <div
        // style={{
        //   width: "420px",
        //   height: "300px",
        // }}
        className="col-md-10 canvas"
      >
        <h4>{props.heading}</h4>
        <Doughnut
          data={data}
          // width={100}
          // height={50}
          plugins={[ChartDataLabels]}
          //options={{ maintainAspectRatio: false }}
          options={{ responsive: true }}
        />
      </div>
    );
  }
  if (props.type === "Line") {
    return (
      <div
        // style={{
        //   width: "420px",
        //   height: "300px",
        // }}
        className="col-md-12 canvas"
      >
        <h4>{props.heading}</h4>
        <Line
          data={data}
          // width={100}
          // height={50}
          plugins={[ChartDataLabels]}
          options={{ maintainAspectRatio: true }}
        />
      </div>
    );
  }
};

export default progressChart;
