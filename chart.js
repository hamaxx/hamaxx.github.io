
var width = document.body.clientWidth,
    height = document.body.clientHeight;

var color = d3.scale.category20();

var force = d3.layout.force()
        .charge(-120)
        //.linkDistance(500)
        .charge(-5000)
        .size([width, height]);

var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

d3.json("jureham.json", function(error, graph) {
    force
        .nodes(graph.nodes)
        .links(graph.links)
        .linkStrength(function (d) {return d.strength / 10})
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
            .style("stroke-width", function(d) { return Math.sqrt(d.value); })
            .attr("class", "link");

    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append('g')
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .attr("class", "node")
            .attr("id", function (d) {return d.id})
            .call(force.drag);

    force.on("tick", function() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    });

    graph.nodes.forEach(function (d) {
        var elm = svg.select("#" + d.id);
        if (d.type == 'text') {
            elm.append('text')
                .attr()
                .style("text-anchor", "middle")
                .text(d.name)
        } else {
            d3.xml("icons/" + d.id + ".svg", "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

                var width = d.width || 100;
                var height = d.height || 100;

                if (d.type === 'link') {
                    elm.append('a')
                        .attr('xlink:href', function(d) {return d.url})
                    elm = elm.select('a');
                }

                elm[0][0].appendChild(importedNode);
                elm.select('svg')
                    .attr('href', d.url)
                    .attr('x', -width / 2)
                    .attr('y', -height / 2)
                    .attr('height', height)
                    .attr('width', width);
            });
        }
    });

});
