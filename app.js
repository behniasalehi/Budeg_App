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
        this.percentage = -1;
    }
    function CalculateBudget(type) {
        var sum = 0;
        data.allItems[type].forEach(function (curr) {
            sum += curr.val;
        });
        data.totalItems[type] = sum;
    }
    expense.prototype.CalculatePercentag = function(totalInc){
        if(totalInc > 0){
            this.percentage = Math.round((this.val / totalInc)*100);    
        }else{
            this.percentage = -1;
        }
    }
    expense.prototype.GetPercentage = function(){
        return this.percentage;
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
    DeleteItem: function (type, Id) {
        var newId, item;
        newId = data.allItems[type].map(function (cur) {
            return cur.id
        });
        item = newId.indexOf(Id);
        data.allItems[type].splice(item, 1);
    },
    CalculatePercentage : function(){
        data.allItems.exp.forEach(function(cur){
            cur.CalculatePercentag(data.totalItems.inc);
        });
    },
    GetPercentage : function(){
        var percent = data.allItems.exp.map(function(cur){
            return    cur.GetPercentage(); 
        });
        return percent;
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
        container: '.container',
        mounth : '.budget__title--month',
        itemPercentage : '.item__percentage'
    }
   var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };
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
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%describtion%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%describtion%", obj.des);
            newHtml = newHtml.replace("%value%", formatNumber(obj.val , type));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        setBudget: function (obj) {
            var type ;
            obj.totalBudget > 0 ? type = 'inc' : type='exp'
            document.querySelector(domstring.budgetIncomeValue).textContent = formatNumber(obj.totalInc , 'inc');
            document.querySelector(domstring.budgetExpenseValue).textContent = formatNumber(obj.totalExp , 'exp');
            document.querySelector(domstring.budgetValue).textContent = formatNumber(obj.totalBudget , type);
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
        },
        SetTime : function(){
            var now,year,mounth , mounths;
             now = new Date();
             year = now.getFullYear();
             mounth = now.getMonth();
            mounths = ['January' , 'February','March','April','May','June','July','August',
                      'September','October','November','December'];
            document.querySelector(domstring.mounth).textContent = mounths[mounth-1]
        },
        GetItemPercentage : function(per){
            var item , itemArr;
            item = document.querySelectorAll(domstring.itemPercentage);
            itemArr =  Array.prototype.slice.call(item);
            for(var i = 0 ; i<itemArr.length ; i++){
                if(per[i] > 0){
                    itemArr[i].textContent = per[i] + '%';
                }else{
                    itemArr[i].textContent = '--';
                }
            }
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
    function UpdatePercentage(){
           budgetCtrl.CalculatePercentage();
           percentage = budgetCtrl.GetPercentage();
           UICtrl.GetItemPercentage(percentage);
    }

    function AddItem() {
        var input, item , percentage;
        input = UICtrl.GetDomValue();
       if (input.des !== "" && !isNaN(input.val) && input.val !== "") {
           item = budgetCtrl.AddItem(input);
           UICtrl.AddToDom(input.type, item);
           CalculateBudget();
           UICtrl.ClearFields();
           budgetCtrl.GetBudget();
           UpdatePercentage();
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
        UpdatePercentage();

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
            UICtrl.SetTime()
        }
    }



})(budgetController, UIController);
controller.init();
