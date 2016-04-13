import {bindable} from 'aurelia-framework';

export class Chart {

    @bindable type;

    @bindable cols;

    @bindable rows;

    @bindable config;

    chartId = Math.floor((Math.random() * 100000) + 1);

    bind() {

        if(this.type == null) throw new Error("type no puede ser null");
        if(this.cols == null) throw new Error("cols no puede ser null");
        if(this.rows == null) throw new Error("rows no puede ser null");

        this.config = this.config || {};

        this.config = Object.assign(this.config, {
            height: '400',
            legend: { position:'labeled' }
        });


        this.datatable = new google.visualization.DataTable();

        this.cols.forEach(c => this.datatable.addColumn(c[0],c[1]));
        this.datatable.addRows(this.rows);

    }

    attached() {

        var chart = new google.visualization[this.type](document.getElementById(this.chartId));

        chart.draw(this.datatable, this.config);
    }

}