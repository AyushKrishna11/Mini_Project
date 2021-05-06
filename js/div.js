$(document).ready(()=>{
    $.ajax({
      url:"http://localhost:3008/posts",
      method:"GET",
      data:{get_param :'value'},
      success:(posts) =>{
        $.each(posts,function(key,record){
            
           
            $("#blog").append(createView(record));
            //createView(record);
        });
      }
    })
})

function createButton(v)
{
  let editBtn =document.createElement('a');
   editBtn.textContent="read more..";
    editBtn.setAttribute('target','_blank');
    editBtn.setAttribute('href','abc.html?id='+v.id);
    editBtn.onclick = function(){
    console.log(v.id);
    var ids= v.id;

     $.ajax({
      url:"http://localhost:3008/posts"+ids,
      method:"GET",
      data:{get_param :'value'},
      success:(blogs) =>{
        console.log(posts);
        $("#show").append(posts.title);
        // $.each(blogs,function(key,record){
        //   $("#cardId").append(createView(record));
        // });
      }
    });   
  }
  return editBtn;
}

function createView(record){
            var ab= record.description;
            console.log(ab.slice(0,300));
            var c=ab.slice(0,300);
            let div1 =document.createElement('div');
            let para =document.createElement('p');
            let para1 =document.createElement('p');
            para.innerHTML = c;
            para1.innerHTML = record.title;
            let mb=createButton(record);
            
            div1.appendChild(para);
            div1.appendChild(para1);
            div1.appendChild(mb);
            return div1;

}
