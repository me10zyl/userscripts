// ==UserScript==
// @name         Redmine Image Size+
// @namespace    http://me10zyl.github.io/userscripts
// @version      0.1
// @description  Resize Redmin Image Size to proper width
// @author       Zeng Yilun
// @updateURL    http://me10zyl.github.io/userscripts/redmine_img_size+.user.js
// @downloadURL  http://me10zyl.github.io/userscripts/redmine_img_size+.user.js
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @match        http://ecc.group.sunyuki.com/*
// @match        http://ecc.collabs.sunyuki.net/*
// @grant        GM_addStyle
// ==/UserScript==

(function($) {
    'use strict';
    var isTop = (window.top == window);
    if(isTop){
        // var style = ".fancybox-wrap{width:100% !important;}.fancybox-inner{width:100% !important;}";
        //GM_addStyle(style);
        function onImgShow(node){
                 var win = this;
                 var ifr = node;
                var img = $(win.document).find("img");
               var w = img[0].width;
                return w;
        }

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (!mutation.addedNodes) return;

                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    // do things to your newly added nodes here
                    var node = mutation.addedNodes[i];
                    if($(node).hasClass("fancybox-iframe")){
                        var callback = function(records) {
                           // console.log(records);
                           /* records.map(function(record) {
                                console.log('Previous attribute value: ' + record.oldValue);
                            });*/
                           // $(".fancybox-inner")[0].style.width = '1000px';
                            $(".fancybox-inner").trigger("fancy.box.inner.modified");
                             console.log("in");
                        };
                        var option = {
                            'attribute': true,
                            'attributeOldValue': true
                        };
                         var mo = new MutationObserver(callback);
                       /* new MutationObserver(function(){
                                  console.log("wr");
                        }).observe($(".fancybox-wrap")[0], option);*/
                        mo.observe($(".fancybox-inner")[0], option);
                        $(node.contentWindow).load(function(){
                             var w =  onImgShow.call(this, node);
                            $(".fancybox-inner").on("fancy.box.inner.modified", function(){
                                this.style.width = w + 'px';
                                var wrap = $(".fancybox-wrap")[0];
                                wrap.style.width = (w+30) + 'px';
                                wrap.style.left = 0;
                            });
                        });
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true
            , subtree: true
            , attributes: false
            , characterData: false
        });

        // stop watching using:
        //observer.disconnect();
        /*
        $(".thumbnails.images a").on("click",function(){
            var ifr = $(".fancybox-overlay .fancybox-inner iframe");
          //  console.log(ifr);
        });
       */
    }
})($);
