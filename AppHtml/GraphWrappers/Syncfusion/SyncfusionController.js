import { ChartBase } from "../GraphBase/GraphBaseController.js";

export class SyncfusionChart extends ChartBase {

    drawChart() {
        super.drawChart();
        this.clearPreviousGraph();

        try {

            switch (this.chartType) {
                case "pie":
                case "doughnut":
                    this.currentChart = new ej.charts.AccumulationChart();
                    break;
                default:
                    this.currentChart = new ej.charts.Chart();
                    this.currentChart.primaryXAxis.valueType = 'Category';
                    this.currentChart.primaryYAxis.title = this.yAxisLabel;
                    this.currentChart.chartArea.border.width = 0;
                    this.currentChart.chartArea.background = this.backgroundColor;
                    //Zooming options for the chart
                    this.currentChart.zoomSettings.enableMouseWheelZooming = this.zoomable;
                    this.currentChart.zoomSettings.enablePinchZooming = this.zoomable;
                    this.currentChart.zoomSettings.enableSelectionZooming = this.zoomable;
                    break;
            }
        } catch (error) {
            throw new df.Error(999, error);
        }

        this.currentChart.series = this.graphData;
        this.currentChart.title = this.title;
        this.currentChart.subTitle = this.subtitle;
        this.currentChart.legendSettings.visible = this.legendEnabled;
        this.currentChart.legendSettings.position = this.legendAlignment.charAt(0).toUpperCase() + this.legendAlignment.slice(1);
        this.currentChart.tooltip.enable = true;

        this.currentChart.pointClick = (event) => {

            if (this.chartType !== "pie" && "doughnut") {
                this.onClick(event.point.x, event.point.y, event.point.index, event.point.series.name);
            } else {
                this.onClick(event.point.x, event.point.y, event.point.index, event.series.properties.name);
            }

        }

        this.currentChart.appendTo(this.graphLocation);
        //Disable the animations for the series that are currently rendered. This way they wont be redrawn when the chart is updated.
        //This allows for nice animations to only play for new series that are being inserted
        this.currentChart.series.forEach(series => {
            series.animation.enable = false;
        });

    };

    formatData(data) {
        //Modify the data for the specific library and charttype
        let newData, type, innerRadius;

        //Get the type and capitalize the first letter because syncfusion is case sensitive
        type = data.sType ? data.sType : this.chartType;
        type = type.charAt(0).toUpperCase() + type.slice(1);

        //Check if the type is a doughnut chart, if it is set the inner radius to 40%
        if (type === 'Doughnut') {
            innerRadius = '40%';
            type = undefined;
        }

        switch (this.chartType) {
            default:
                newData = {
                    type: type,
                    name: data.sLabel,
                    fill: data.sSeriesColor,
                    width: 2,
                    marker: {
                        visible: true
                    },
                    xName: 'label',
                    yName: 'data',
                    dataSource: [],
                    innerRadius: innerRadius,
                    animation: {
                        enable: true
                    },
                    dataLabel: {
                        visible: true, position: 'Outside',
                        connectorStyle: { length: '10%' }, name: 'label',
                        font: { size: '14px' }
                    },
                }
                for (let index = 0; index < this.xAxisLabels.length; index++) {
                    newData.dataSource[index] = {
                        label: this.xAxisLabels[index],
                        data: data.nData[index]
                    }
                }
                break;
        }

        return newData;
    }

    addNewSeries(data) {
        data = super.addNewSeries(data);

        this.currentChart.addSeries([data]);

        //Disable the animation of the series that was just added, this way it isnt fully redrawn when an item is added to the chart again
        this.currentChart.series[this.currentChart.series.length - 1].animation.enable = false;

    }

    addNewDataPoint(datasetIndex, data) {

        const dataObject = {
            label: this.xAxisLabels[this.xAxisLabels.length - 1],
            data: data
        }

        this.currentChart.series[datasetIndex].dataSource.push(dataObject);

        this.currentChart.refresh();
    }

    changeDataPoint(datasetIndex, valueIndex, newValue) {
        //Get the old value and calculate the difference
        console.log(this.currentChart.series[datasetIndex].dataSource[valueIndex].data);
        this.currentChart.series[datasetIndex].dataSource[valueIndex].data = newValue
        this.currentChart.refresh();

        // const oldValue = this.currentChart.series[datasetIndex].dataSource[valueIndex].data;
        // let difference = newValue > oldValue ? (newValue - oldValue) : (oldValue - newValue);
        // const stepValue = Math.round(difference / 200);

        // //Slowly increment/decrement the data by 1 untill it hits the desired point to simulate animation.
        // const animateInterval = setInterval(() => {

        //     difference -= stepValue
        //     if (oldValue > newValue) {
        //         this.currentChart.series[datasetIndex].dataSource[valueIndex].data -= stepValue;
        //     } else {
        //         this.currentChart.series[datasetIndex].dataSource[valueIndex].data += stepValue;
        //     }

        //     this.currentChart.refresh();

        //     //Interval stops itself when the goal has been reached
        //     if (difference <= 0) clearInterval(animateInterval);
        // }, 5);

    }

    removeDataset(datasetIndex) {
        this.currentChart.removeSeries(datasetIndex);
        this.currentChart.refresh();
    }
}