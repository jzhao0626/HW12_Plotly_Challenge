// Read in the json and find the list of sample ID, then append it to the dropdown menu
d3.json("data/samples.json").then(data => {
    
    var sampleNames = data.names;
    
    var dropdownMenu = d3.select("#selDataset");
    
    sampleNames.forEach(item => {
        var optionTag = dropdownMenu.append("option");
        optionTag.text(item);
        optionTag.attr("id", item);
        })

    init()
});

d3.selectAll("#selDataset").on("change", getData);


// Set the initial plot to show
function init() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
    
    getData(dataset)
}



function getData() {
    var dropdownMenu = d3.select("#selDataset");
    var dataset = dropdownMenu.property("value");
    console.log(dataset)

    d3.json("data/samples.json").then(data => {

        // Demographio Info
        var selectedMetaData = data.metadata.filter(data => {return data.id == dataset})
        
        var demographicInfo = d3.select("#sample-metadata");
        demographicInfo.html("");

        console.log(selectedMetaData)
        Object.entries(selectedMetaData[0]).forEach(function([key, value]) {
        demographicInfo.append("p").text(`${key}: ${value}`);
        });

        // Top 10 OTUs 
        var selectedSample = data.samples.filter(data => {return data.id == dataset})
        
        var sortedOTU = selectedSample.sort((a, b) => a.sample_values - b.sample_values);
        OTUID = sortedOTU[0].otu_ids
        namedOTUID = sortedOTU[0].otu_ids.map(item => `OTU ${item}`);
        OTUValue = sortedOTU[0].sample_values
        OTULabel = sortedOTU[0].otu_labels;
        console.log(OTUID)
        console.log(namedOTUID)
        console.log(OTUValue)
        console.log(OTULabel)
        

        // Plot
        var trace1 = {
            y: namedOTUID.slice(0, 10).reverse(),
            x: OTUValue.slice(0, 10).reverse(),
            text: OTULabel.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var trace2 = {
            x: OTUID,
            y: OTUValue,
            mode: 'markers',
            text: OTULabel,
            marker: {
                size: OTUValue,
                color: OTUID
              }
        };

        var trace3 = {
              value: selectedMetaData[0].wfreq,
              title: { text: "Belly Button Washing Frequency" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: { 
                    range: [null, 9] },
                steps: [
                { range: [0, 1], color: "rgb(248, 243, 236)"},
                { range: [1, 2], color: "rgb(240, 234, 220)" },
                { range: [2, 3], color: "rgb(230, 225, 205)" },
                { range: [3, 4], color: "rgb(218, 217, 190)" },
                { range: [4, 5], color: "rgb(204, 209, 176)" },
                { range: [5, 6], color: "rgb(189, 202, 164)" },
                { range: [6, 7], color: "rgb(172, 195, 153)" },
                { range: [7, 8], color: "rgb(153, 188, 144)" },
                { range: [8, 9], color: "rgb(132, 181, 137)" }
                ]
            }
        }
        
        var layout2 = {
            xaxis: { title: "OTU ID"}
        }

        data1 = [trace1]
        Plotly.newPlot("bar", data1);

        data2 = [trace2]
        Plotly.newPlot("bubble", data2, layout2);

        data3 = [trace3]
        Plotly.newPlot("gauge", data3);

  })
};