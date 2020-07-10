function tagDrag(){
var columns = document.querySelectorAll('#columns .column');
  var dragEl = null;
  [].forEach.call(columns,function(column){
    column.addEventListener("dragstart",domdrugstart,false);
    column.addEventListener('dragenter', domdrugenter, false);
    column.addEventListener('dragover', domdrugover, false);
    column.addEventListener('dragleave', domdrugleave, false);
    column.addEventListener('drop', domdrop, false);
    column.addEventListener('dragend', domdrapend, false);    

  });

  function domdrugstart(e) {

    e.target.style.opacity = '0.5';

     

    dragEl = this;

     

    e.dataTransfer.effectAllowed = "move";

    e.dataTransfer.setData("text/html",this.innerHTML);

  }

  function domdrugenter(e) {

    e.target.classList.add('over');

  }

  function domdrugover(e) {

    if (e.preventDefault) {

      e.preventDefault(); 

    }

 

    e.dataTransfer.dropEffect = 'move';

 

    return false;

  }

  function domdrugleave(e) {

    e.target.classList.remove('over'); 

  }   

  function domdrop(e) {

    if (e.stopPropagation) {

      e.stopPropagation();

    }

     

// 位置互换
    if (dragEl != this) {
      var thisParam={
        'id':$(this).attr("data-id"),
        'name':$(this).attr("data-name"),
        'selectname':$(this).attr("data-selectname"),
        'standname':$(this).attr("data-standname"),
      };
      var dragElParam={
        'id':$(dragEl).attr("data-id"),
        'name':$(dragEl).attr("data-name"),
        'selectname':$(dragEl).attr("data-selectname"),
        'standname':$(dragEl).attr("data-standname"),
      };
      var thisHtml=$(this).html();
      var dragElHtml=$(dragEl).html()
      dragEl.innerHTML = thisHtml;
      this.innerHTML = dragElHtml;
      $(dragEl).attr("data-id",thisParam.id);
      $(dragEl).attr("data-name",thisParam.name);
      $(dragEl).attr("data-selectname",thisParam.selectname);
      $(dragEl).attr("data-standname",thisParam.standname);
      $(this).attr("data-id",dragElParam.id);
      $(this).attr("data-name",dragElParam.name);
      $(this).attr("data-selectname",dragElParam.selectname);
      $(this).attr("data-standname",dragElParam.standname);
    }    
    return false;

  }

  //   if (dragEl != this) {

  //     dragEl.innerHTML = this.innerHTML;

  //     this.innerHTML = e.dataTransfer.getData('text/html');

  //   }    

     

  //   return false;

  // }

  function domdrapend(e) {

    [].forEach.call(columns, function (column) {

      column.classList.remove('over');

       column.style.opacity = '1';

    });

  }     
}