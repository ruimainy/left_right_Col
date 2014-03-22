var controlType = {
    // 1是复制选项, 2是 移动选项; 
    _modeOne: 1,
    _modeTwo: 2
};

(function ($, win, undefined) {
    $.fn.extend({
        exIdbColumn: function (config) {
            var wrapId = $(this);
            // var $left  = wrapId.children("#LeftCol");
            // var $right = wrapId.children("#rightCol");

            $('<h1/>', {
                    'style':'float:left;font-weight:bold;font-size:14px;width:135px;margin-left:13px;color:#585858;border-right: 1px solid #EDEDED;'
                })
                .html(config.left_h1_font)
                .appendTo(wrapId);

            $('<h1/>', {
                    'style':'float:left;font-weight:bold;font-size:14px;width:110px;margin-left:13px;color:#585858;'
                })
                .html(config.right_h1_font)
                .appendTo(wrapId);

            var $left = $('<div/>', {
                'class': 'i_left',
                'id': config.leftDiv
            }).appendTo(wrapId);

            var $right = $('<div/>', {
                'class': 'i_right',
                'id': config.rightDiv
            }).appendTo(wrapId);
            
            var leftDataArray = []; //保存左边的数据obj
            var rightDataArray = []; //保存右边的数据obj

            function createLeftColu(d) {
                //生成左侧栏内容
                for (var i in d) {
                    $left.append(createLi(d[i]));
                }
                attIndex();
                leftDataArray = d;
            }

            function createLi(_dLi) {
                //创建LI

                var _li = $("<li/>",{});
                var _span = $('<span/>',{}).html( _dLi[config.name] ).appendTo( _li );

                var _a = $("<a/>", {
                    'href': 'javascript:;'
                })
							.bind('click', function () {
							    if (config.typeModel == controlType._modeTwo) {
							        twoColu($(this));
							    } else if (config.typeModel == controlType._modeOne) {
							        oneColuClick($(this));
							    }
							});
                _a.appendTo(_li);
                return _li;
            }

            function oneColuClick(_t) {
                //只处理右侧的数组
                var _idx = _t.parent().attr('inx');
                var _liLength = $right.find("li");

                if (_liLength.length != 0) {
                    for (var i = 0; i <= _liLength.length; i++) {
                        if (_idx == _liLength.eq(i).attr('oldinx')) {
                            return false;
                        }
                    }
                    leftData(_t);
                } else {
                    leftData(_t);
                }
            }

            function leftData(_t) {
                //通过左侧的数据，来得到右边的选择结果
                $('<li/>', {
                    'oldinx': _t.parent().attr('inx')
                })
					.html(_t.parent().text() + '<a href="javascript:;"></a>')
					.appendTo($right);

                $right.find("li").each(function (index) {
                    $(this).attr('inx', index);
                });

                rightDataArray.push(leftDataArray[_t.parent().attr('inx')]);
                //console.log(rightDataArray);
                selectChangeCallBack();

                $right.find("li").children().each(function () {
                    $(this).unbind();
                });

                $right.find("li").children().bind('click', function () {
                    var _self = $(this);
                    $(this).parent().remove();

                    $right.find("li").each(function (index) {
                        $(this).attr('inx', index);
                    });

                    rightDataArray = $.grep(rightDataArray, function (n, i) {
                        return i != _self.parent().attr('inx');
                    });
                    //console.log(rightDataArray);
                    selectChangeCallBack();

                    $right.find("li").each(function (index) {
                        $(this).attr('inx', index);
                    });
                });
            }

            function twoColu(_t) {
                //处理左右二侧的数组

                if (!_t.hasClass('i_onSel')) {
                    _t.addClass('i_onSel');
                    $right.append(_t.parent());

                    editLeftArray(leftDataArray, rightDataArray, _t.parent().attr('inx'));

                    console.log(rightDataArray);
                    console.log(leftDataArray);
                } else {
                    _t.removeClass();
                    $left.append(_t.parent());

                    editRightArray(leftDataArray, rightDataArray, _t.parent().attr('inx'));

                    console.log(rightDataArray);
                    console.log(leftDataArray);
                }

                attIndex();
            }

            function editLeftArray(leftArr, rightArr, inx) {
                //编辑左侧数组
                rightArr.push(leftArr[inx]);
                leftArr = $.grep(leftArr, function (n, i) {
                    return i != inx;
                });
                leftDataArray = leftArr;
                rightDataArray = rightArr;
                selectChangeCallBack();
            }

            function editRightArray(leftArr, rightArr, inx) {
                //编辑右侧数组
                leftArr.push(rightArr[inx]);
                rightArr = $.grep(rightArr, function (n, i) {
                    return i != inx;
                });
                leftDataArray = leftArr;
                rightDataArray = rightArr;
                selectChangeCallBack();
            }

            function attIndex() {
                //给Li添加index

                $left.find("li").each(function (index) {
                    $(this).attr('inx', index);
                });

                $right.find("li").each(function (index) {
                    $(this).attr('inx', index);
                });
            }

            function selectChangeCallBack() {
                if (config.rightChange != undefined) {
                    config.rightChange(rightDataArray);
                }
            }

            this.setData = function (d) {
                //接收数据的公共方法
                createLeftColu(d);
            };

            this.getSelectedData = function () {
                //返回被选的数据的obj
                return rightDataArray;
            };

            return this;
        }
    });
})(jQuery, window)