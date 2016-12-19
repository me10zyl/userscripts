// ==UserScript==
// @name         SYK DEVELOP
// @namespace    http://me10zyl.github.io/userscripts
// @version      1.3
// @updateURL    http://me10zyl.github.io/userscripts/sykdev.user.js
// @downloadURL  http://me10zyl.github.io/userscripts/sykdev.user.js
// @description  try to take over the world!
// @author       Zeng YiLun
// @match        http://secure.syk.com/*
// @match        http://ecms.group.qa.sunyuki.com/*
// @match 		 http://oms.qa.sunyuki.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// ==/UserScript==

(function () {

    (function styleInsert() {
        $(function () {
            var sty = $("<style></style>");
            sty.html(".sykdev-btn{ margin-left:10px; } .sykdev-name {color:green;position:relative; } " +
                     ".sykdev-name span {position:absolute} .sykdev-snapshot {margin:10px;height:100px;} " +
                     ".sykdev-snapshot>div:first-child {float:left;padding:5px;outline: dotted thin #0000ff;height:90px;width:58%;display:inline-block;overflow:auto}" +
                     ".sykdev-snapshot>div:nth-child(2) {float:left;padding-top:42px;padding-left:17px;}" +
                     ".sykdev-snapshot>div:nth-child(2)>span:first-child {display:inline-block;margin-top:2px;}" +
                     ".sykdev-snapshot>div:nth-child(2)>a {display:inline-block;margin-left:20px;}" 
                    );
            $("head").append(sty);
        });
    })();

    if (window.top != window) {
        return;
    }

    var Button = function (name, func, id) {
        this.name = name;
        this.func = func;
        this.id = id;
        this.iframe = null;
    };

    var ToggleButton = function (name, func, id, initialize) {
        Button.apply(this, arguments);
        this.init = initialize;
    };


    $ = (window.top == window ? $ : window.top.$);

    $("#tabs").tabs("options").onSelect = function (title, index) {
        mock.onIndexChanged();
    };


    //private methods
    var tool = {
        getIFrameJQuery: function () {
            return $(".tabs-panels .panel:visible").find("iframe")[0].contentWindow.$;
        },
        serializeForm: function () {
            var data = {};
            this.getCurrentPanel().find("[name]:not(:radio)").each(function () {
                var name = $(this).prop("name");
                var value = $(this).prop("value");
                if (name) {
                    data[name] = value;
                }
            });
            this.getCurrentPanel().find(":radio[name]").each(function () {
                var name = $(this).prop("name");
                if (name && $(this).is(":checked")) {
                    data[name] = $(this).val();
                }
            });
            return data;
        },
        getCurrentPanel: function () {
            var iframe = $(".tabs-panels .panel:visible").find("iframe");
            if(iframe.length == 0){
                 return null;
            }
            return iframe[0].contentWindow.jQuery(iframe[0].contentWindow.document);
        },
        getCurrentPanelTitle: function () {
            return $(".tabs-selected .tabs-title").text();
        },
        inertDialog: function (id) {
            if (this.getCurrentPanel().find("#" + id).length <= 0) {
                var dialog = "<div id='" + id + "'></div>";
                this.getCurrentPanel().find("body").append(dialog);
            }
        }
    };

    var mock = {
        getSelectIndex: function () {
            return parseInt(window.localStorage.getItem(tool.getCurrentPanelTitle() + "-index"));
        },
        getDatas: function () {
            return JSON.parse(window.localStorage.getItem(tool.getCurrentPanelTitle() + "-datas"));
        },
        onIndexChanged: function () {
            var index = mock.getSelectIndex();
            if (index >= 0) {
                var text = "mock(快照" + index + ")";
                // $("#sykdev-btn-mock").find(".l-btn-text").text(text);
            } else {
                //$("#sykdev-btn-mock").find(".l-btn-text").text("mock");
            }
        }
    };

    var remSelect = {
        setToggle : function (toggle) {
            localStorage.setItem("sykdev-rem-select-toggle", toggle);
        },
        getToggle : function () {
            return localStorage.getItem("sykdev-rem-select-toggle");
        },
        setIndex : function(index1){
            var acc = $(".easyui-accordion");
            var p = acc.accordion('getSelected');
            if(p){
                var index = acc.accordion('getPanelIndex', p);
                localStorage.setItem("sykdev-rem-select-index", index);
            }
        },
        getIndex : function(){
            return localStorage.getItem("sykdev-rem-select-index");
        },
        setItemIndex: function(index){
             localStorage.setItem("sykdev-rem-select-item-index", index);
        },
         getItemIndex: function(){
             return localStorage.getItem("sykdev-rem-select-item-index");
        },
        onToggle : function(toggle){
            var icon = $("#"+toggle.id).find(".l-btn-icon");
              if(toggle.toggle == "true"){
                  icon.addClass("icon-ok");
                  icon.removeClass("icon-cancel");
              }else{
                    icon.removeClass("icon-ok");
                  icon.addClass("icon-cancel");
              }
        },
        init : function(){
            this.toggle = remSelect.getToggle();
            remSelect.onToggle(this);
             var acc = $(".easyui-accordion");
            acc.accordion("options").onSelect = function(title,index){
                 remSelect.setIndex();
            };
            acc.find("li a").click(function(){
                var tree = $(this).closest(".tree");
                var i = $(this).closest("li").index(".tree li");
                remSelect.setItemIndex(i);
            });
            if(this.toggle == "true"){           
                var index = remSelect.getIndex();
                $("body").append("<script desc='created by sykdev.user.js(tamperMoney)''>$('.easyui-accordion').accordion('select',"+index+")");
                var a = acc.find(".tree li:eq("+remSelect.getItemIndex()+") a");
                var func = a.attr("onclick");
                eval(func);
                a.parent().addClass("selected");
                a.closest("div").addClass("tree-node-selected");
            }
        }
    };

    //callbacks
    function getFieldsOfRequired() {
        var str = "";
        this.find(".require").next("td").find(":input[name]").each(function () {
            str += 'new CheckField("' + $(this).prop("name") + '","' + $(this).closest("td").prev().find("span").text().trim().replace("：", "") + '不能为空")' + ",\r\n";
        });
        prompt("copy it!", str);
    }

    function mockSettings() {
        var id = "sykdev-mock-setting";
        tool.inertDialog(id);
        var mockSetting = this.find('#' + id);

        function setDatas(datas) {
            window.localStorage.setItem(tool.getCurrentPanelTitle() + "-datas", JSON.stringify(datas));
        }

        function setSelectIndex(index) {
            window.localStorage.setItem(tool.getCurrentPanelTitle() + "-index", index + "");
        }

        function updateDialog() {
            var wContent = $("<p class='w-content'></p>");
            var snapshots = [];
            var datas = mock.getDatas();
            if (datas) {
                for (var i in datas) {
                    var data = datas[i];
                    var snapshot = $("<div class='sykdev-snapshot'></div>");
                    var snapshotLeft = $("<div></div>");
                    for (var name in data) {
                        snapshotLeft.append("<div>" + name + "=" + data[name] + "</div>");
                    }
                    var snapshotRight = $("<div><span><input type='radio' name='sykdev_snapshot_choose'/></span></div>");
                    var deleteBtn = $("<a href='javascript:void(0)'>删除</a>");
                    deleteBtn.linkbutton({text: '删除', plain: true, iconCls: 'icon-remove'});
                    snapshotRight.append("<span>(快照" + i + ")</span>");
                    snapshotRight.append(deleteBtn);
                    (function (arg) {
                        function onClickRadio() {
                            setSelectIndex(arg);
                            mock.onIndexChanged();
                        }

                        deleteBtn.click(function (e) {
                            tool.getIFrameJQuery().messager.confirm('Mock 设置', "确定要删除快照" + arg + "？",
                                                                    function (r) {
                                if (r) {
                                    var datas = mock.getDatas();
                                    datas.splice(arg, 1);
                                    setDatas(datas);
                                    if (arg == mock.getSelectIndex()) {
                                        setSelectIndex(-1);
                                    } else {
                                        setSelectIndex(mock.getSelectIndex() - 1);
                                    }
                                    mock.onIndexChanged();
                                    updateDialog();
                                }
                            });
                        });
                        snapshot.click(function (e) {
                            $(this).find(":radio").prop("checked", true);
                            onClickRadio();
                        });
                        snapshotRight.find(":radio").change(function () {
                            onClickRadio();
                        });
                        var index = mock.getSelectIndex();
                        if (index == arg) {
                            snapshotRight.find(":radio").prop("checked", true);
                        }
                    })(i);
                    snapshot.append(snapshotLeft);
                    snapshot.append(snapshotRight);
                    snapshots.push(snapshot);
                }
            }

            for (var j in snapshots) {
                wContent.append(snapshots[j]);
            }
            mockSetting.html(wContent);
        }

        updateDialog();
        mockSetting.dialog({
            title: 'Mock 设置',
            width: 460,
            height: 600,
            iconCls: 'icon-tip',
            closed: false,
            cache: false,
            modal: true,
            toolbar: [{
                text: '应用选择的快照',
                iconCls: 'icon-ok',
                handler: function () {
                    mockData.call(tool.getCurrentPanel());
                }
            }, {
                text: '添加当前快照',
                iconCls: 'icon-add',
                handler: function () {
                    var datas = mock.getDatas();
                    if (!datas) {
                        datas = [];
                    }
                    var data = tool.serializeForm();
                    delete data.sykdev_snapshot_choose;
                    datas.push(data);
                    setDatas(datas);
                    updateDialog();
                }
            },
                      {
                          text: '替换选择的快照',
                          iconCls: 'icon-cut',
                          handler: function () {
                              tool.getIFrameJQuery().messager.confirm('Mock 设置', "确定要替换选择的快照为当前快照？",
                                                                      function (r) {
                                  if (r) {
                                      var index = mock.getSelectIndex();
                                      var datas = mock.getDatas();
                                      datas[index] = tool.serializeForm();
                                      setDatas(datas);
                                      updateDialog();
                                  }
                              });
                          }
                      },
                      {
                          text: '清除所有快照',
                          iconCls: 'icon-clear',
                          handler: function () {
                              tool.getIFrameJQuery().messager.confirm('Mock 设置', "确定要清除所有快照？",
                                                                      function (r) {
                                  if (r) {
                                      setDatas([]);
                                      updateDialog();
                                      setSelectIndex(-1);
                                  }
                              });
                          }
                      }],
            border: 'thin',
            cls: 'c7',
            buttons: [{
                text: '关闭',
                handler: function () {
                    mockSetting.dialog("close");
                }
            }]
        });
    }

    function mockData() {
        var index = mock.getSelectIndex();
        if (index >= 0) {
            var datas = mock.getDatas();
            var data = datas[index];
            for (var name in data) {
                var input = this.find("[name=" + name + "]");
                var span = input.parent("span");
                if (span && span.hasClass("textbox")) {
                    var realInput = span.prev("input");
                    if (realInput.hasClass("combobox-f")) {
                        realInput.combobox("setValue", data[name]);
                    } else if (realInput.hasClass("easyui-textbox")) {
                        realInput.textbox("setValue", data[name]);
                    }
                }
                if (input.is("textarea")) {
                    input.text(data[name]);
                }
                if (input.is(":radio")) {
                    input.each(function () {
                        if ($(this).val() == data[name]) {
                            $(this).prop("checked", true);
                        }
                    });
                }
            }
        } else {
            this.find(".easyui-textbox").textbox("setValue", 1);
            var today = new Date();
            this.find("textarea").each(function (i) {
                $(this).text("fortest" + i + " autogenerated - " + today.toLocaleDateString() + " " + today.toLocaleTimeString());
            });
        }
    }
 
    function rememberSelected(){
        if(this.toggle == "true" || this.toggle == "false"){
            remSelect.setToggle(this.toggle);
            remSelect.onToggle(this);
        }
    }
    

    function toggleNameVisible() {
        var old = null;
        if (!this[0].nameVisible) {
            this.find("[name]").each(function () {
                if ($(this).prop("name")) {
                    var span = $("<span class='sykdev-name'><span></span></span>");
                    span.children("span").append($(this).prop("name"));
                    if ($(this).parent().hasClass("textbox")) {
                        $(this).parent().after(span);
                    } else {
                        $(this).after(span);
                    }
                    //防止重叠
                    if (old && (old[0].offsetTop == span[0].offsetTop)) {
                        var left = span[0].offsetLeft - (span[0].offsetLeft - old[0].offsetLeft) + old.children("span")[0].offsetWidth + 10;
                        var top = span[0].offsetTop;
                        //span[0].offsetLeft = left;
                        // span[0].offsetTop = top;
                        span.offset({left: left, top: top});
                    }
                    old = span;
                }
            });
            this[0].nameVisible = true;
        } else {
            this[0].nameVisible = false;
            this.find(".sykdev-name").remove();
        }
    }
    
    
    //put btns here
    var btns = [
        // new Button('mock', mockData, 'sykdev-btn-mock'),
        new Button('mock', mockSettings),
        new ToggleButton('记忆选择项', rememberSelected, 'sykdev-btn-rem-select',remSelect.init),
        new Button('开/关Name显示', toggleNameVisible),
        new Button('生成校验空Java代码', getFieldsOfRequired)
    ];

    for (var i in btns) {
        var btn = btns[i];
        var jq = $("<a href='javascript:void(0)' class='sykdev-btn'></a>");
        
        if(btn.constructor == Button){
            jq.linkbutton({text: btn.name, plain: true});
        } else  if(btn.constructor == ToggleButton){
            //jq.append("<input type='checkbox'/>" );
           // jq.append(btn.name);
             var mm = $("<div ' style='width:100px;'><div data-options='iconCls:\"icon-ok\",name:\"true\"'>是</div><div data-options='iconCls:\"icon-cancel\",name:\"false\"'>否</div></div>");
             mm.attr("id", "sykdev-mm-" + i);
           (function(arg){
            mm.menu({
                onClick : function(item){
                   //arg.iframe = tool.getCurrentPanel();
                   arg.toggle = item.name;
                   arg.func.call(arg);
                }
            });})(btn);
            $("body").append(mm);
           jq.menubutton({
               text: btn.name,
                iconCls: 'icon-ok',
                menu: '#sykdev-mm-' + i
            });
        }
        if (btn.id) {
            jq.attr("id", btn.id);
        }

        $("#footer").append(jq);
        (function (arg) {
            jq.click(function (evt) {
                btn.iframe = tool.getCurrentPanel();
                arg.func.call(tool.getCurrentPanel());
            });
        })(btn);
        if(btn.init){
            btn.init();
        }
    }
})();


