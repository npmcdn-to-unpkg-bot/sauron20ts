function chart(chartId,type,cols,rows,chartconfig) {

    if(chartId == null) throw new Error("chartId no puede ser null");
    if(type == null) throw new Error("type no puede ser null");
    if(cols == null) throw new Error("cols no puede ser null");
    if(rows == null) throw new Error("rows no puede ser null");

    var config = _.extend({
        height: '400',
        legend: { position:'labeled' }
    }, chartconfig);


    var datatable = new google.visualization.DataTable();

    _.each(cols, function(c) { return datatable.addColumn(c[0],c[1]) });

    datatable.addRows(rows);

    var chart = new google.visualization[type](document.getElementById(chartId));

    chart.draw(datatable, config);

}