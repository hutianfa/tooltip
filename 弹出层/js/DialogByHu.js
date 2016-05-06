;(function ($) {
    //默认参数
    var PARAMS;
    var DEFAULTPARAMS = {
        Title: "弹出层demo",
        Content: "",
        Width: 400,
        Height: 300,
        ConfirmFun: new Object,
        CancelFun: new Object
    };
    var ContentWidth = 0,ContentHeight = 0;
    $.DialogByHu = {
        //弹出提示框
        Alert: function (params) {Show(params, "Alert"); },
        //弹出确认框
        Confirm: function (params) { Show(params, "Confirm"); },
        //关闭弹出框
        Close: function () { $("#DialogByHuLayer,#DialogByHu").remove();}
    };
    //初始化参数
    function Init(params) {
        if (params != undefined && params != null) {
            PARAMS = $.extend({},DEFAULTPARAMS, params);
        }
        ContentWidth = PARAMS.Width - 10; ContentHeight = PARAMS.Height - 40;
    };    
    //显示弹出框
    function Show(params, caller) {
        Init(params);
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();
        //在屏幕中显示的位置（正中间）
        var positionLeft = (screenWidth - PARAMS.Width) / 2 + $(document).scrollLeft();
        var positionTop = (screenHeight - PARAMS.Height) / 2 + $(document).scrollTop();
        var Content = [];
        Content.push("<div id=\"DialogByHuLayer\"></div>");
        Content.push("<div id=\"DialogByHu\" style=\"width:" + PARAMS.Width + "px;height:" + PARAMS.Height + "px;left:" + positionLeft + "px;top:" + positionTop + "px;\">");
        Content.push("<div id=\"Title\"><span>" + PARAMS.Title + "</span><span id=\"Close\">&#10005;</span></div>");
        Content.push("<div id=\"Container\" style=\"width:" + ContentWidth + "px;height:" + ContentHeight + "px;\">");
            var TipLineHeight = ContentHeight - 60;
            Content.push("<table>");
            Content.push("<tr><td id=\"TipLine\" style=\"height:" + TipLineHeight + "px;\">" + PARAMS.Content + "</td></tr>");
            Content.push("<tr>");
            Content.push("<td id=\"BtnLine\">");
            Content.push("<input type=\"button\" id=\"btnDialogByHuConfirm\" value=\"确定\" />");
            if (caller == "Confirm") {
                Content.push("<input type=\"button\" id=\"btnDialogByHuCancel\" value=\"取消\" />");
            }
            Content.push("</td>");
            Content.push("</tr>");
            Content.push("</table>");
        Content.push("</div>");
        Content.push("</div>");
        $("body").append(Content.join("\n"));
        SetDialogEvent(caller);
    }
    //设置弹窗事件
    function SetDialogEvent(caller) {
        //添加按钮关闭事件
        $("#DialogByHu #Close").click(function () { $.DialogByHu.Close();});
         //添加ESC关闭事件
        $(window).keydown(function(event){
            var event = event||window.event;
            if(event.keyCode===27){
                $.DialogByHu.Close();
            }
        });
        //窗口改变时，重置弹出窗位置
        $(window).resize(function(){
            var screenWidth = $(window).width();
            var screenHeight = $(window).height();           
            var positionLeft = parseInt((screenWidth - PARAMS.Width) / 2+ $(document).scrollLeft());
            var positionTop = parseInt((screenHeight - PARAMS.Height) / 2+ $(document).scrollTop());
            $("#DialogByHu").css({"top":positionTop+"px","left":positionLeft+"px"});
        });
        $("#DialogByHu #Title").DragByHu($("#DialogByHu"));
        if (caller != "Dialog") {
            $("#DialogByHu #btnDialogByHuConfirm").click(function () {
                $.DialogByHu.Close();
                if ($.isFunction(PARAMS.ConfirmFun)) {
                    PARAMS.ConfirmFun();
                }
            })
        }
        if (caller == "Confirm") {
            $("#DialogByHu #btnDialogByHuCancel").click(function () {
                $.DialogByHu.Close();
                if ($.isFunction(PARAMS.CancelFun)) {
                    PARAMS.CancelFun();
                }
            })
        }
    }
})(jQuery);
//拖动层
(function ($) {
    $.fn.extend({
        DragByHu: function (objMoved) {
            return this.each(function () {
                //鼠标按下时的位置 //移动的对象的初始位置   //是否处于移动状态  //鼠标移动时计算移动的位置
                var mouseDownPosiX,mouseDownPosiY,objPosiX,objPosiY,status = false,tempX,tempY;
                //移动的对象
                var obj = $(objMoved) == undefined ? $(this) : $(objMoved);
                $(this).mousedown(function (e) {
                    status = true;
                    mouseDownPosiX = e.pageX;
                    mouseDownPosiY = e.pageY;
                    objPosiX = obj.css("left").replace("px", "");
                    objPosiY = obj.css("top").replace("px", "");
                }).mouseup(function () {
                    status = false;
                });
                $("body").mousemove(function (e) {
                    if (status) { 
                        tempX = parseInt(e.pageX) - parseInt(mouseDownPosiX) + parseInt(objPosiX);
                        tempY = parseInt(e.pageY) - parseInt(mouseDownPosiY) + parseInt(objPosiY);
                        obj.css({ "left": tempX + "px", "top": tempY + "px" }); 
                    }
                    //判断是否超出窗体
                    //计算出弹出层距离右边的位置
                    var dialogRight = parseInt($(window).width())-(parseInt(obj.css("left"))+parseInt(obj.width()));
                    //计算出弹出层距离底边的位置
                    var dialogBottom = parseInt($(window).height())-(parseInt(obj.css("top"))+parseInt(obj.height()));
                    var maxLeft = $(window).width()-obj.width();
                    var maxTop = $(window).height()-obj.height();
                    parseInt(obj.css("left"))<=0 ? obj.css("left","0px") : parseInt(obj.css("top"))<=0 ? obj.css("top","0px") :dialogRight <=0 ? obj.css("left",maxLeft+'px') :'';
                }).mouseup(function () {
                    status = false;
                }).mouseleave(function () {
                    status = false;
                });
            });
        }
    })
})(jQuery);