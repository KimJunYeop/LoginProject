var data_script = "<%= data %>";
var split_data = Object.keys(data_script).toString().split(",");
var row;

$('#my_submit').click(function() {
  var data = {};
  data.title = $('#title').val();
  data.author = $('#author').val();
  data.country = $('#country').val();
  data.description = $('#description').val();

  $.ajax({
    type: "post",
    data: JSON.stringify(data),
    dataType: 'json',
    url: "/write",
    contentType: 'application/json',
    success: function(result) {
      if (result.success == true) {
        console.log('data 등록 성공');
        console.log(result);
        $('#contents_table > tbody:last').append('<tr>' +
          '<td>' + result.data.title + '</td>' +
          '<td>' + result.data.author + '</td>' +
          '<td>' + result.data.country + '</td>' +
          '</tr>');
      } else {
        console.log('data 등록 실패');
      }
    },
    complete: function() {
      console.log('complete!');
    },
  });
})

$('#contents_table tr td:first-child').click(function() {
  row = $(this).parent('tr');
  var value = $(this).text();
  getTitleDesc(value, '/write/desc', function(result) {
    $('#desc_p').text(result);
  })
});

$('#next_btn').click(function() {
  if (str == "") {
    var title = $('#contents_table tr:eq(1) td:eq(0)').text();
    // var title = $("td:eq(0)").text();
    getTitleDesc(title, '/write/desc', function(result) {
      $('#desc_p').text(result);
      row = $('#contents_table tr:eq(1)');
    });
  } else {
    console.log(row.next().length);
    if (row.next().length != 0) {
      var title = row.next().find('td').eq(0).text();
      getTitleDesc(title, '/write/desc', function(result) {
        $('#desc_p').text(result);
        row = row.next();
      });
    } else {
      row = $('#contents_table tr:eq(1)');
    }
  }
});

function getTitleDesc(title, url, callback) {
  var desc;
  $.ajax({
    type: 'post',
    data: title,
    url: url,
    success: function(result) {
      var result_data = JSON.parse(result);
      if (result_data.success == true) {
        desc = result_data.description;
        callback(desc);
      }
    },
    complete: function() {
      console.log('complete');
    },
    error: function(error) {
      console.log(error);
    }
  })
};
