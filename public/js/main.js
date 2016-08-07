$(function(){
  $(document).ready(function(){
    $("#search").on('keyup', function(e){
      if(e.keyCode === 13 && $(this).val() != ""){
        $.get("/documents/search/" + $(this).val(), function(data){
          /*
          * Object {took: 81, timed_out: false, _shards: Object, hits: Object}
            _shards : Object
            hits : Object
              hits : Array[4]
                0 : Object
                  _id : "AVZjP6Bnu7bssuZUhIrd"
                  _index : "message_index"
                  _score : 0.16090071
                  _source : Object
                  channel : "rtm-test"
                  date : "1470543930.000007"
                  suggest : Object
                  text : "text here"
                  user  : "maxim.zaytsev"
           max_score : 0.16090071
           total : 4
           timed_out : false
           took : 81
          * */
          $("#results").empty();
          $(data.hits.hits).each(function(hit){
            var date = convertToReadable(this._source.date);
            var string = "[" + date + "] [" + this._source.user + "] [" + this._source.channel + "] : " + this._source.text;
            $("#results").append("<p>" + string + "</p>");
          });
        })
      }
    });
  });
  function convertToReadable(timestamp) {
    var a = new Date(timestamp* 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
});
