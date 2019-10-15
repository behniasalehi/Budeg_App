var budgetController = (function () {
    var incom = function (id, des, val) {
        this.id = id;
        this.des = des;
        this.val = val;
    }
    var expense = function (id, des, val) {
        this.id = id;
        this.des = des;
        this.val = val;
    }
    function CalculateBudget(type) {
        var sum = 0;
        data.allItems[type].forEach(function (curr) {
            sum += curr.val;
        });
        data.totalItems[type] = sum;
    }
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totalItems: {
            inc: 0,
            exp: 0
        },
        total: 0,
        percentage: -1
    }

    return {
        AddItem: function (obj) {
                var instanse, ID;
                if (data.allItems[obj.type].length > 0) {
                    ID = data.allItems[obj.type][data.allItems[obj.type].length - 1].id + 1;
                } else {
                    ID = 0;
                }

                if (obj.type === 'inc') {
                    instanse = new incom(ID, obj.des, obj.val)
                } else if (obj.type === 'exp') {
                    instanse = new expense(ID, obj.des, obj.val);
                }
                data.allItems[obj.type].push(instanse);
                return instanse;

            },
            GetBudget: function () {
                CalculateBudget('inc');
                CalculateBudget('exp');
                data.total = data.totalItems.inc - data.totalItems.exp;
                if (data.totalItems.inc > 0) {
                    data.percentage = Math.round((data.totalItems.exp / data.totalItems.inc) * 100);
                } else {
                    data.percentage = -1;
                }
                return {
                    totalInc: data.totalItems.inc,
                    totalExp: data.totalItems.exp,
                    totalBudget: data.total,
                    percentage: data.percentage
                }
            },
            DeleteItem: function (type, Id){
                var newId , item;
                newId = data.allItems[type].map(function(cur){
                    return cur.id
                });
                item = newId.indexOf(Id);
                data.allItems[type].splice(item , 1);
            },
        Get :function(){
            return data.allItems;
        }

}
})();





var UIController = (function () {
    var domstring = {
        typeDom: '.add__type',
        inputDomDescribtion: '.add__description',
        inputDomValue: '.add__value',
        btnAdd: '.add__btn',
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        budgetIncomeValue: '.budget__income--value',
        budgetExpenseValue: '.budget__expenses--value',
        budgetPercentageValue: '.budget__expenses--percentage',
        budgetValue: '.budget__value',
        container: '.container'
    }
    return {
        GetDomValue: function () {
            var type, describtion, value;
            typedata = document.querySelector(domstring.typeDom).value;
            describtion = document.querySelector(domstring.inputDomDescribtion).value;
            value = parseFloat(document.querySelector(domstring.inputDomValue).value);
            return {
                type: typedata,
                des: describtion,
                val: value
            }
        },
        GetDomString: function () {
            return domstring;
        },
        AddToDom: function (type, obj) {
            var html, newHtml, element;
            if (type === 'inc') {
                element = domstring.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%describtion%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {
                element = domstring.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%describtion%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percent%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%describtion%", obj.des);
            newHtml = newHtml.replace("%value%", obj.val);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        setBudget: function (obj) {
            document.querySelector(domstring.budgetIncomeValue).textContent = obj.totalInc;
            document.querySelector(domstring.budgetExpenseValue).textContent = obj.totalExp;
            document.querySelector(domstring.budgetValue).textContent = obj.totalBudget;
            if (obj.percentage > 0) {
                document.querySelector(domstring.budgetPercentageValue).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(domstring.budgetPercentageValue).textContent = '---';
            }
        },
        RemoveFromDom: function (type, dom) {
            dom.parentNode.removeChild(dom);
        },
        ClearFields : function(){
            document.querySelector(domstring.inputDomDescribtion).value = "";
            document.querySelector(domstring.inputDomValue).value = "";
            document.querySelector(domstring.inputDomDescribtion).focus();
        }


    }
})();




var controller = (function (budgetCtrl, UICtrl) {
    var SetUpEvent = function () {
        var dom = UICtrl.GetDomString();
        document.querySelector(dom.btnAdd).addEventListener('click', AddItem);
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {
                AddItem();
            }
        });
        document.querySelector(dom.container).addEventListener('click', DeleteItem);
        document.querySelector(dom.typeDom).addEventListener('change', function () {
            var field, fieldArr;
            document.querySelector(dom.btnAdd).classList.toggle('red');
            field = document.querySelectorAll(dom.inputDomDescribtion + ' ,' + dom.inputDomValue + ' ,' + dom.typeDom);
            fieldArr = Array.prototype.slice.call(field);
            fieldArr.forEach(function (curr) {
                curr.classList.toggle('red-focus');
            });

        });
    }

    function CalculateBudget() {
        var budget;
        budget = budgetCtrl.GetBudget();
        UICtrl.setBudget(budget);
    }

    function AddItem() {
        var input, item;
        input = UICtrl.GetDomValue();
       if (input.des !== "" && !isNaN(input.val) && input.val !== "") {
           item = budgetCtrl.AddItem(input);
           UICtrl.AddToDom(input.type, item);
           CalculateBudget();
           UICtrl.ClearFields();
       }
    }

    function DeleteItem(e) {
        var courrentDom ,item, splItem, Id, type;
        courrentDom = e.target.parentNode.parentNode.parentNode.parentNode;
        item = courrentDom.id;
        if (item) {
            splItem = item.split('-');
            type = splItem[0];
            Id = splItem[1];
        }
        budgetCtrl.DeleteItem(type , Id);
        UICtrl.RemoveFromDom(type,courrentDom);
        CalculateBudget();

    }

    return {
        init: function () {
            console.log("app started");
            SetUpEvent();
            UICtrl.setBudget({
                totalInc: 0,
                totalExp: 0,
                totalBudget: 0,
                percentage: -1
            });
        }
    }



})(budgetController, UIController);
controller.init();
