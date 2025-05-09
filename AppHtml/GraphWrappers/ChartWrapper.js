import { ChartjsChart } from "./Chartjs/ChartjsController.js";
import { HighChartsChart } from "./HighCharts/HighChartsController.js";
import { SyncfusionChart } from "./Syncfusion/SyncfusionController.js";

df.ChartControl = function ChartControl(sName, oPrnt) {
    df.ChartControl.base.constructor.apply(this, arguments);

    //  Properties
    this.prop(df.tString, "psTitle", "");
    this.prop(df.tString, "psSubtitle", "");
    this.prop(df.tString, "psChartType", "line");
    this.prop(df.tString, "psChartBackgroundColor", "");
    this.prop(df.tString, "psYAxisLabel", "");
    this.prop(df.tString, "psXAxisLabels", "");
    this.prop(df.tString, "psChartingLibrary", "");
    this.prop(df.tString, "psLegendAlignment", "right");
    this.prop(df.tBool, "pbLegendEnabled", true);
    this.prop(df.tBool, "pbZoomable", true);

    //  Events
    this.event("OnClick", df.cCallModeWait);

    this.graphData = null;
    this.graphInBuffer = false;
    this._eGraph = null;
    this.chartController = null;
    this.isSvg = false
}

df.defineClass("df.ChartControl", "df.WebBaseControl", {

    openHtml: function (aHtml) {
        df.ChartControl.base.openHtml.call(this, aHtml);

        aHtml.push('<div class="Graph_Wrp">');
        if (this.isSvg) {
            aHtml.push('<div id="GraphContainer"></div>');
        } else {
            aHtml.push('<Canvas id="GraphContainer" width="100%" height="100%"></canvas>');
        }
    },

    closeHtml: function (aHtml) {
        aHtml.push('</div>');

        df.ChartControl.base.closeHtml.call(this, aHtml);
    },

    afterRender: function () {
        this._eControl = df.dom.query(this._eElem, "div.Graph_Wrp");
        this._eGraph = df.dom.query(this._eElem, "#GraphContainer");

        df.ChartControl.base.afterRender.call(this);

        this.set_psXAxisLabels(this.psXAxisLabels);

        if (this.graphInBuffer) {
            this.graphInBuffer = false;
            this.createChart();
        }

    },

    createChart: function () {
        //Assign the action data to graphdata, only if action data exists
        if (this._tActionData) this.graphData = this._tActionData;

        //Check if the graph element is loaded yet, if not make sure this method is called in the afterrender
        if (!this._eGraph) {
            this.graphInBuffer = true;
            return;
        }

        //Double check to make sure the psXAxisLabel is an array
        if (!(this.psXAxisLabels instanceof Array)) this.set_psXAxisLabels(this.psXAxisLabels);

        //Try catch incase the javascript file cannot be found for whatever reason
        try {
            switch (this.psChartingLibrary) {
                case "Chartjs":
                    this.set_isSvg(false);
                    this.chartController = new ChartjsChart(this);
                    break;
                case "Highcharts":
                    this.set_isSvg(true);
                    this.chartController = new HighChartsChart(this);
                    break;
                case "Syncfusion":
                    this.set_isSvg(true);
                    this.chartController = new SyncfusionChart(this);
                    break;
                default:
                    alert("The library you selected does not yet exist!");
                    return;
            }
        } catch (error) {
            throw new df.Error(999, error.sText);
        }

    },

    addNewSeries: function () {
        //add the data to the list in the control, so incase we switch to a different charting library we still have the information available
        this.graphData.push(this._tActionData);

        //Send the new data to the chart
        this.chartController.addNewSeries(this._tActionData);
    },

    addNewDataPoint: function (datasetName, xAxisLabel, value) {
        let datasetIndex = null;
        value = parseFloat(value)

        this.graphData.forEach(dataseries => {
            // Check if the dataset name exists in graphdata
            if (dataseries.sLabel === datasetName) {
                datasetIndex = this.graphData.indexOf(dataseries)
            }
        });

        if (datasetIndex !== null) {
            this.psXAxisLabels.push(xAxisLabel);
            this.graphData[datasetIndex].nData.push(value);

            this.chartController.addNewDataPoint(datasetIndex, value);
        } else {
            throw new df.Error(999, "Dataset with specified name does not exist");
        }
    },

    changeDataPoint: function (datasetName, valueIndex, newValue) {
        newValue = parseFloat(newValue);
        let exists = false;
        let datasetIndex = null;

        this.graphData.forEach(element => {
            //Check if dataset that was passed exists
            if (element.sLabel === datasetName) {
                //Get the index of the found element
                datasetIndex = this.graphData.indexOf(element);
                //If the dataset is found, check if the old value exists
                if (valueIndex > this.graphData[datasetIndex].length) {
                    throw new df.Error(999, "Index out of bounds!");
                } else {
                    this.graphData[datasetIndex].nData[valueIndex] = newValue;
                    exists = true;
                }
            }
        });

        if (exists) {
            //Change the value in the graphdata monitored by the control itself
            this.graphData[datasetIndex].nData[valueIndex] = newValue;
            //Tell the graphdata inside of the chart to change too
            this.chartController.changeDataPoint(datasetIndex, valueIndex, newValue);
        } else {
            throw new df.Error(999, "The dataset specified does not exist");
        }
    },

    removeDataset: function (datasetName) {
        let exists = false;
        let datasetIndex = null;

        this.graphData.forEach(element => {

            if (element.sLabel === datasetName) {

                datasetIndex = this.graphData.indexOf(element);
                exists = true;
            }
        })

        if (exists) {
            this.graphData.splice(datasetIndex, 1);
            this.chartController.removeDataset(datasetIndex);
        } else {
            throw new df.Error(999, "The dataset specified does not exist");
        }
    },

    sendOnClick: function (dataX, dataY, dataIndex, datasetName) {
        this.fire("OnClick", [dataX, dataY, dataIndex, datasetName]);
    },

    set_psChartingLibrary: function (sVal) {
        this.psChartingLibrary = sVal;

        //If the chartController already exists, remake the chart
        if (this.chartController) {
            this.createChart();
        }
    },

    set_psTitle: function (sVal) {
        this.psTitle = sVal;
    },

    set_psSubtitle: function (sVal) {
        this.psSubtitle = sVal;
    },

    set_isSvg: function (bVal) {
        this.isSvg = bVal;

        //If the graph element already exists, replace it with a canvas/div if necesary
        if (this._eGraph) {
            //Remove the existing element first so that we can rerender a different element
            this._eGraph.remove();
            if (this.isSvg) {
                this._eGraph = document.createElement('div');
            } else {
                this._eGraph = document.createElement('canvas');
                this._eGraph.width = "100%"
                this._eGraph.height = "100%"
            }

            //Pass the id to the element
            this._eGraph.id = "GraphContainer";

            this._eControl.appendChild(this._eGraph);
        }
    },

    set_psChartType: function (sVal) {
        this.psChartType = sVal;
    },

    set_psXAxisLabels: function (sVal) {
        this.psXAxisLabels = sVal.split(', ');
    },

    set_psYAxisLabel: function (sVal) {
        this.psYAxisLabel = sVal;
    },

    set_psLegendAlignment: function (sVal) {
        this.psLegendAlignment = sVal;
    },

    set_pbLegendEnabled: function (bVal) {
        this.pbLegendEnabled = bVal;
    },

    set_psChartBackgroundColor: function (sVal) {
        this.psChartBackgroundColor = sVal;
    },

    set_pbZoomable: function (bVal) {
        this.pbZoomable = bVal;
    },

    updateChart: function () {

        if (!(this.psXAxisLabels instanceof Array)) this.set_psXAxisLabels(this.psXAxisLabels);

        //Send a copy of the array. Because arrays are passed by reference this would mess with the graphData stored in the control itself
        Object.assign(this.chartController, {
            graphLocation: this._eGraph,
            title: this.psTitle,
            backgroundColor: this.psChartBackgroundColor,
            graphData: [...this.graphData],
            subtitle: this.psSubtitle,
            chartType: this.psChartType,
            library: this.psChartingLibrary,
            xAxisLabels: this.psXAxisLabels,
            yAxisLabel: this.psYAxisLabel,
            legendAlignment: this.psLegendAlignment,
            legendEnabled: this.pbLegendEnabled,
            zoomable: this.pbZoomable
        })

        this.chartController.drawChart();
    }
})