

// Buttons: on clikc redirect to indicated page 
function redirectToPage(pageUrl) {
    window.location.href = pageUrl;
}
http://192.168.1.84/26/on
// GET request 
function sendGetRequest() {
    const url = '???';

    // Use jQuery library to send the GET request
    $.ajax({ // used to send an asynchronous HTTP GET request
      url: url,
      type: 'GET',
      dataType: 'json',
      
      success: function(data) {
        // Handle the data from the response
        console.log('Response:', data);
        alert('Received Data:\n' + JSON.stringify(data, null, 2));
      },

      error: function(jqXHR, textStatus, errorThrown) {
        // Handle errors
        console.error('Error:', textStatus, errorThrown);
        alert('Error: ' + textStatus + ' - ' + errorThrown);
      }
    });
  }