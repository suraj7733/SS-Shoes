$(document).ready(function () {
    
    setcolorincolors();
    //$("#setColor").css('background-color', color);
});

function setcolorincolors(){
    var color = $("#colors").val();
    var i = 0;
    var c = 1;
    for(i;i<=color.length;i++){
        if(color[i] == ","){
            c++;
        }
    }
    for(i=1;i<=c;i++){
        var value = $(`#setColor${i}`).attr("title");
        $(`#setColor${i}`).css('background-color', value);
    }
    //alert(c);
}