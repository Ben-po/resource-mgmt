function addResource() {
    var response = "";
    // Create an object to hold form data
    var jsonData = new Object();
    jsonData.name = document.getElementById("name").value;
    jsonData.location = document.getElementById("location").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.owner = document.getElementById("owner").value;
    // Validate required fields (all must be filled in)
    if (jsonData.name == "" || jsonData.location == "" || jsonData.description == "") {
        alert('All fields are required!');
        return; // Stop execution if validation fails
    }
    // Validate email format for owner
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(jsonData.owner)) {
        alert('Please enter a valid email address for owner!');
        return; // Stop execution if email invalid
    }
    // Configure the request to POST data to /add-resource
    var request = new XMLHttpRequest();
    request.open("POST", "/add-resource", true);
    request.setRequestHeader('Content-Type', 'application/json');
    // Define what happens when the server responds
    request.onload = function () {
        response = JSON.parse(request.responseText); // Parse JSON response
        console.log(response)
        // If no error message is returned → success
        if (response.message == undefined) {
            alert('Added Resource: ' + jsonData.name + '!');
            // Clear form fields after success
            document.getElementById("name").value = "";
            document.getElementById("location").value = "";
            document.getElementById("description").value = "";
            document.getElementById("owner").value = "";
            // Close modal
            $('#resourceModal').modal('hide');
            // Reload table content
            viewResources();
        } else {
            // Show error if resource could not be added
            alert('Unable to add resource!');
        }
    };
    // Send the request with JSON-formatted data
    request.send(JSON.stringify(jsonData));
}