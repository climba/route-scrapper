//Init
getRoutes();

//When you Scrape New Routes 
$("#snaButton").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(function (data) {
      console.log(data);
      getRoutes();
      $("#scrapeModal").modal();
    });
});

function getRoutes() {
  $.ajax({
    method: "GET",
    url: "/routes"
  })
    .then(function (data) {
      console.log(data);
      if (data.length === 0) {
        $("#routes").append(`<br><br><h2 class="text-center text-muted">Click 'Scrape the latest Routes' to get started.</h2>`);
      } else {
        $("#routes").empty();
        for (var i = 0; i < data.length; i++) {
          var noteBtnText;
          var noteBtnStyle;
          if (data[i].note !== undefined) {
            noteBtnText = "Read Note";
            noteBtnStyle = "btn-success btn-rounded mb-4";
          } else {
            noteBtnText = "Add Note";
            noteBtnStyle = "btn-warning btn-rounded mb-4";
          }
          $("#routes").append(`
            <div class="card mt-3">
              <div class="card-header">${data[i].title}</div>
                <div class="card-body">
                  <div class="card-text">
                    <span class="float-left"><strong>URL:</strong> ${data[i].link}</span>
                    <span class="float-right"><strong>Area:</strong> Coming Soon</span>
                    </div>
                    </div>
                  
                  <div class="card-footer">
                    <a href="${data[i].link}" target="_blank" class="btn btn-primary btn-rounded mb-4">View Route</a>
                    <a href="#" data-id=${data[i]._id} class="btn ${noteBtnStyle} commentButton ">${noteBtnText}</a>
                  </div>
                </div>
            </div>`);
        }
      }
    });
};

//When you click view note button.
$(document).on("click", ".commentButton", function () {
  $("#modal-body").empty();
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/routes/" + thisId
  })
    .then(function (data) {
      console.log(data);

      $("#modal-body").append(`<h4><strong>Route:</strong> ${data.title}</h4>`);
      $("#modal-body").append("<hr>");
      $("#modal-body").append(`<input class="form-control" type="text" placeholder="Note Title" id="titleinput">`);
      $("#modal-body").append(`<textarea class="form-control mt-2" id='bodyinput' placeholder="Note Text Content" name='body' rows="3"></textarea>`);
      $(".saveButton").attr("data-id", data._id);

      if (data.note.body) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
  $("#routeModal").modal();
});

//When you click the save note button.
$(document).on("click", ".saveButton", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/routes/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function (data) {
      console.log(data);
      $('#routeModal').modal('hide');
      getRoutes();
    });
});