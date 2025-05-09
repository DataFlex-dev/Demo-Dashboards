export class ChartBase {

    constructor(control) {
        this.control = control;
        this.graphLocation = control._eGraph;
        this.title = control.psTitle;
        this.subtitle = control.psSubtitle;
        this.backgroundColor = control.psChartBackgroundColor;
        this.graphData = [...control.graphData];
        this.chartType = control.psChartType;
        this.xAxisLabels = control.psXAxisLabels;
        this.yAxisLabel = control.psYAxisLabel;
        this.legendAlignment = control.psLegendAlignment;
        this.legendEnabled = control.pbLegendEnabled;
        this.zoomable = control.pbZoomable

        this.drawChart();
    }

    //Handles the drawing of the chart
    drawChart() {

        //Parse the data
        for (let index = 0; index < this.graphData.length; index++) {
            this.graphData[index] = this.formatData(this.graphData[index]);
        }

    }

    //Define a empty method that will be implemented in the subclasses
    formatData(data) {

    }

    //Clears the previous graph
    clearPreviousGraph() {
        //If the current chart is null there is no reason to call a destruction
        if (this.currentChart == null) return;

        //Destroy the chart so that we do not keep references to the old chart
        this.currentChart.destroy();
    }

    //Allows for new series to be added to the graph
    addNewSeries(data) {
        data = this.formatData(data);

        return data;
    }

    //Implement in subclasses
    addNewDataPoint(datasetIndex, data) {
    }

    //Implement in subclasses
    changeDataPoint(datasetIndex, valueIndex, newValue) {
    }

    //Implement in subclasses
    removeDataset(datasetIndex) {
    }

    //Handles the onClick event
    onClick(dataX, dataY, dataIndex, datasetName) {
        this.control.sendOnClick(dataX, dataY, dataIndex, datasetName);
    }

}