// ==UserScript==
// @name         ECMS Login Keep
// @namespace    http://me10zyl.github.io/userscripts
// @version      0.4
// @updateURL    http://me10zyl.github.io/userscripts/ecms_login.user.js
// @downloadURL  http://me10zyl.github.io/userscripts/ecms_login.user.js
// @description  Login Save Password!
// @author       Zeng YiLun
// @match        http://secure.syk.com:8080/login*
// @match        http://ecms.group.qa.sunyuki.com/login*
// @match        http://oms.qa.sunyuki.net/login*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function($) {
    'use strict';
     var key = "elo-form";
    var btn = $('<a herf="javascript:void(0)" style="position: absolute;left: 136px;z-index:20;" class="elo-btn">卍</a>');
    var ul = $('<ul style="position: absolute;z-index:10;width:222px;background:#ccc;margin-top:-4px;font-size:11px;" id="elo-ul"></ul>');
    var styles = ".elo-btn:hover{ cursor:pointer;} .elo-btn{} #elo-ul li:hover{ background:#ddd;cursor:pointer; }";
    GM_addStyle(styles);
     var u = $("#username");
     var us = $("#username+span");
     var ust = $("#username+span input[type=text]");
     var list = GM_getValue(key);
     function setUP(o){
         $("#username").textbox("setValue", o.username);
         $("#password").textbox("setValue", o.password);
         /*
         $("[name=username]").val(o.username);
         $("#username").val(o.username);
         $("#username+span input[type=text]").val(o.username);
         $("[name=password]").val(o.password);
         $("#password").val(o.username);
         $("#password+span input[type=password]").val(o.password);
         */
     }
     if(list && list.length > 0){
         var first = list[0];
         setUP(first);
     }
     ust.after(btn);
     btn.hover(function(){
         $(this).text("卐");
     }, function(){ $(this).text("卍");});
    btn.click(function(){
        var list = GM_getValue(key);
        ul.html("");
        for(var i in list){
            var li = $("<li>"+list[i].username+"|"+list[i].password+"</li>");
            var del = $("<a href='javascript:void(0)' style='float:right;margin-right:5px;'>删除</a>");
            del.click(function(){
                 var p = $(this).parent("li");
                 var u = p.data("elo-li").username;
                 var l = GM_getValue(key);
                var index = -1; 
                for(var j in l){
                     if(l[j].username == u){
                           index = j;
                           break;
                     }
                 }
                 if(index > 0){
                    l.splice(index,1);
                 }
                GM_setValue(key, l);
                 p.remove();
            });
            li.append(del);
            li.data("elo-li", list[i]);
            ul.append(li);
        }
        var toggle = btn.data("toggle");
        if(!toggle){
            $(this).after(ul);
            $("#elo-ul").hover(function(){}, function(){ ul.remove();  btn.data("toggle", false);});
        }else{
            ul.remove();
        }
        ul.find("li").click(function(){
             var o = $(this).data("elo-li");
             setUP(o);
             ul.remove();
             btn.data("toggle", false);
        });
        btn.data("toggle", !toggle);
    });
    $("body").click(function(e){
          if(e.target != btn[0]){
          ul.remove();  btn.data("toggle", false); 
          }
    });
    $("#formLogin").on("submit", function(){
         var u = $("[name=username]").val();
         var p = $("[name=password]").val();
         var o = {
          username : u, password : p
         };
          var list = GM_getValue(key);
          if(!list){
             list = [];
          }
         var index = -1;
          for(var i in list){
            var el = list[i];
              if(el.username == o.username){
                  index = i;
                  break;
              }
          }
         if(index > -1){
             list.splice(index, 1);
         }
         list.unshift(o);
         GM_setValue(key, list);
    });
})($);
