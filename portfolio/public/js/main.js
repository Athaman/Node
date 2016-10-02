$(document).ready(function(){
  $('.delete-project').on('click', function(){
    var id = $(this).data('id');
    var url = '/admin/delete/'+id;
    if(confirm('Delete Project?')){
      $.ajax({
        url: url,
        type: 'DELETE',
        success: function(result){
          console.log('this is a redirect');
          window.location = '/admin';
        }, error: function(err){
          console.log(err);
        }
      });
    }
  });
});