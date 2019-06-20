// Grab the articles as JSon
$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#amazeballs").append("<div class='m-2 p-2 border rounded'><a class='text-dark' href='" + data[i].url + "'>" + data[i].title + "</a> <button type='button' id='" + data[i]._id + "' class='add btn btn-primary' data-toggle='modal' data-target='#exampleModal'>Add Notes</button><div class='notes' id='" + data[i]._id + "'></div></div>")
    }
});

$.getJSON("/notes", function (data) {
    for (var i = 0; i < data.length; i++) {
    $(".notes").append("<div>"+ data[i].body + "</div>")  
    }
})

//Submit Note

$(document).on("click", ".add", function () {
    var done = ($(this).attr("id"));
    console.log("id:")
    console.log(done)
    $('#modalId').attr('id', done);
})

$(document).on("click", ".see", function () {
    var done = ($(this).attr("id"));
    console.log("id:")
    console.log(done)
    $('#modalId').attr('id', done);
})

$(".save").on("click", function () {
    const note = $(".newnote").val();
    const id = ($(this).attr("id"));
    console.log(note)
    console.log(id)
    $(".newnote").val("");
    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            articleid: id,
            body: note
        }
    });
})

$("#scrape").on('click', function(){
    console.log ("clicked")
    $.ajax({
        method:"POST",
        url:"/scrape"
    })
})

