import { ChartBase } from "../GraphBase/GraphBaseController.js";

export class HighChartsChart extends ChartBase {

    drawChart() {
        super.drawChart();
        
        try {

            this.currentChart = Highcharts.chart(this.graphLocation, {
                chart: {
                    type: this.chartType == "doughnut"? "pie" : this.chartType,
                    backgroundColor: this.backgroundColor,
                    height: this.control._eControl.clientHeight,
                    width: this.control._eControl.clientWidth,
                    panning: this.zoomable,
                    panKey: "shift",

                    zooming: {
                        type: this.zoomable? "xy" : undefined,
                    }
                },

                credits: {
                    enabled: false
                },

                accessibility: {
                    enabled: false
                },

                subtitle: {
                    text: this.subtitle
                },

                title: {
                    text: this.title
                },

                yAxis: {
                    title: {
                        text: this.yAxisLabel
                    }
                },

                xAxis: {
                    categories: this.xAxisLabels
                },

                legend: {
                    layout: 'vertical',
                    align: this.legendAlignment,
                    enabled: this.legendEnabled,
                    verticalAlign: 'middle'
                },

                plotOptions: {
                    series: {
                        point: {
                            events: {
                                click: (e) => {
                                    if (e.point.category !== undefined) {
                                        this.onClick(e.point.category, e.point.y, e.point.index, e.point.series.name);
                                    } else {
                                        this.onClick(e.point.dataLabel.textStr, e.point.y, e.point.index, e.point.series.name);
                                    }
                                }
                            }
                        }
                    }
                },

                series: this.graphData,
            });
        } catch (error) {
            throw new df.Error(999, error);
        }
    }

    formatData(data) {
        //Modify the data for the specific library and charttype
        let newData;

        switch (this.chartType) {
            default:
                newData = {
                    name: data.sLabel,
                    data: data.nData,
                    color: data.sSeriesColor,
                    type: data.sType
                }
                break;
            case "pie":
            case "pyramid":
            case "funnel":
            case "doughnut":
                newData = {
                    name: data.sLabel,
                    data: [],
                    type: data.sType,
                    innerSize: this.chartType == "doughnut"? '50%' : '0%'
                }
                for (let index = 0; index < this.xAxisLabels.length; index++) {
                    newData.data[index] = {
                        name: this.xAxisLabels[index],
                        y: data.nData[index]
                    }
                }
                break;

        }

        return newData;
    }

    addNewSeries(data) {
        data = super.addNewSeries(data);
        this.currentChart.addSeries(data);
    }

    addNewDataPoint(datasetIndex, data) {
        this.currentChart.series[datasetIndex].addPoint(data);
    }

    changeDataPoint(datasetIndex, valueIndex, newValue) {
        this.currentChart.series[datasetIndex].data[valueIndex].update(newValue);
    }

    removeDataset(datasetIndex) {
        this.currentChart.series[datasetIndex].remove();
    }

}