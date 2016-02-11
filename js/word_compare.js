$('#get_value').click(function() {
  var count = 0;
  var res = new Array();
  var src = $('#source').val().split('\n');
  var excp = $('#exception').val().split('\n');
  // Compare Element
  src.some(function(val, index) {
   excp.some(function(val2, index2) {
     if(val==val2) src[index] = 'null';
   });
  });
  // Create Array of Concordance Word
  for( var i = 0; i < src.length; i++ ) {
   if(src[i]!='null') {
     res.push(src[i]);
   } else {
     count++;
   }
  }
  // Output
  for( var i = 0; i <= res.length; i++ ) {
   $('#res_word').append(res.pop()+'<br>');
  }
  $('#res_num').html(count);
  $('#res_rate').html((count/src.length).toFixed(3));
});
