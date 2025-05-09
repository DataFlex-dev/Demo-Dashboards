import { ChartBase } from "../GraphBase/GraphBaseController.js";


export class ChartjsChart extends ChartBase {

    drawChart() {
        super.drawChart();
        this.clearPreviousGraph();

        //Explicitly set the height and width again to avoid resize issues when the user alt tabs while the page is loading
        this.graphLocation.height = this.control._eControl.clientHeight;
        this.graphLocation.width = this.control._eControl.clientWidth;

        try {

            this.currentChart = new Chart(this.graphLocation, {
                type: this.chartType,
                data: {
                    labels: this.xAxisLabels,
                    datasets: this.graphData
                },
                options: {
                    plugins: {
                        subtitle: {
                            display: this.subtitle ?? false,
                            text: this.subtitle
                        },
                        title: {
                            display: true,
                            text: this.title
                        },
                        legend: {
                            position: this.legendAlignment,
                            display: this.legendEnabled
                        }
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: this.yAxisLabel
                            }
                        }
                    }
                }
            });

            this.graphLocation.onclick = (event) => {
                const res = this.currentChart.getElementsAtEventForMode(
                    event,
                    'nearest',
                    { intersect: true },
                    true
                );
                // If didn't click on a bar, `res` will be an empty array
                if (res.length === 0) {
                    return;
                }

                //Call super class with the acquired info
                this.onClick(
                    this.currentChart.data.labels[res[0].index],
                    this.currentChart.data.datasets[res[0].datasetIndex].data[res[0].index],
                    res[0].index,
                    this.currentChart.data.datasets[res[0].datasetIndex].label
                )
            };

        } catch (error) {
            throw new df.Error(999, error);
        }

    }

    formatData(data) {
        //Modify the data for the specific library

        let newData;

        switch (this.chartType) {
            default:
                newData = {
                    label: data.sLabel,
                    data: data.nData,
                    borderColor: data.sSeriesColor,
                    backgroundColor: data.sSeriesColor,
                    type: data.sType
                }
                break;
            case "pie":
            case "doughnut":
            case "polarArea":
                newData = {
                    label: data.sLabel,
                    data: data.nData,
                    //type: data.sType
                }
                break;
            case "scatter":
            case "bubble":
                newData = {
                    label: data.sLabel,
                    data: [],
                    type: data.sType
                }
                for (let index = 0; index < this.xAxisLabels.length; index++) {
                    newData.data[index] = {
                        x: index,
                        y: data.nData[index],
                    }
                }
                break;
        }



        return newData;
    }

    addNewSeries(data) {
        data = super.addNewSeries(data);

        this.currentChart.data.datasets.push(data);
        this.currentChart.update();
    }

    addNewDataPoint() {
        this.currentChart.update();
    }

    changeDataPoint() {
        this.currentChart.update();
    }

    removeDataset(datasetIndex) {
        this.currentChart.data.datasets.splice(datasetIndex, 1);
        this.currentChart.update();
    }

}