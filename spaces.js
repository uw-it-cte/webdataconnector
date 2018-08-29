(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "space_id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "space_name",
            alias: "space_name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "formal_name",
            alias: "formal_name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "max_capacity",
            dataType: tableau.dataTypeEnum.int
        }];
    
        var tableSchema = {
            id: "spaces",
            alias: "R25 Spaces",
            columns: cols
        };
    
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {
        $.ajax({
            dataType: 'json',
            url: "http://localhost:8889/webservices.collegenet.com/r25ws/wrd/washington/run/spaces.xml?otransform=json.xsl",
            // url: "https://webservices.collegenet.com/r25ws/wrd/washington/run/spaces.xml?otransform=json.xsl",
            headers: { "Authorization": "Basic " + btoa(tableau.username + ":" + tableau.password) },
            success: function(data) {
                var spaces = data.spaces.space,
                    tableData = [];
        
                // Iterate over the JSON object
                for (var i = 0, len = spaces.length; i < len; i++) {
                    var space = spaces[i];
                    tableData.push({
                        "space_id": space.space_id._text,
                        "space_name": space.space_name._text,
                        "formal_name": space.formal_name._text,
                        "max_capacity": space.max_capacity._text
                    });
                }
        
                table.appendRows(tableData);
                doneCallback();
            },
            error: function(xhr, status, thrownError) {
                tableau.abortWithError(status + ": " + thrownError);
            }
  
        });
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {

        $('#r25form input').change(function() {
            if ($('#r25username').val().trim().length  &&
                $('#r25password').val().trim().length) {
                $('#submitButton').prop('disabled', false);
            } else {
                $('#submitButton').prop('disabled', true);
            }

        });

        $("#submitButton").click(function () {
            tableau.username = $('#r25username').val().trim();
            tableau.password = $('#r25password').val().trim();
            tableau.connectionName = "R25 Spaces";
            tableau.submit();
        });
    });

})();
