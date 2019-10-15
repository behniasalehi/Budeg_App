var budgetController = (function(){
    var incom = function(id , des , val){
        this.id = id ;
        this.des = des;
        this.val = val;
    }
    var expense = function(id , des , val){
        this.id = id ;
        this.des = des;
        this.val = val;
    }
    var data = {
        allItems : {
            inc : [],
            exp : []
        },
        totalItems : {
            inc : 0,
            exp : 0
        },
        total : 0,
        percentage:0
    }
    
    return{
        AddItem:function(obj){
            var instanse , ID;
            if(data.allItems[obj.type].length > 0){
                ID = data.allItems[obj.type][data.allItems[obj.type].length -1].id + 1;
            }else{
                ID = 0;
            }
            
            if(obj.type === 'inc'){
                instanse = new incom(ID , obj.des , obj.val)
            }else if(obj.type === 'exp'){
                instanse = new expense(ID , obj.des , obj.val);
            }
            data.allItems[obj.type].push(instanse);
            return instanse;
           
        }
        
    }
})();





var UIController = (function(){
    var domstring = {
        typeDom : '.add__type',
        inputDomDescribtion : '.add__description',
        inputDomValue: '.add__value',
        btnAdd : '.add__btn',
        incomeList : '.income__list',
        expenseList : '.expenses__list'
    }
    return{
        GetDomValue:function(){
            var type , describtion , value;
            typedata = document.querySelector(domstring.typeDom).value;
            describtion = document.querySelector(domstring.inputDomDescribtion).value;
            value = document.querySelector(domstring.inputDomValue).value;
            return{
                type :typedata,
                des : describtion,
                val : value
            }
        },
        GetDomString : function(){
            return domstring;
        },
        AddToDom : function(type,obj){
            var html , newHtml , element;
            if(type === 'inc'){
                element = domstring.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%describtion%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            }else if(type === 'exp'){
                element = domstring.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%describtion%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace("%id%" , obj.id);
            newHtml = newHtml.replace("%describtion%", obj.des);
            newHtml = newHtml.replace("%value%" , obj.val);
            document.querySelector(element).insertAdjacentHTML('beforeend' , newHtml);
        },
        
        
    }
})();




var controller = (function(budgetCtrl , UICtrl){
    var SetUpEvent = function () {
        var dom = UICtrl.GetDomString();
        document.querySelector(dom.btnAdd).addEventListener('click' , AddItem);
        document.addEventListener('keypress' , function(e){
            if(e.keyCode === 13){
                AddItem();
            }
        })
    }
    function AddItem(){
        var input , item;
        input = UICtrl.GetDomValue();         
        item = budgetCtrl.AddItem(input); 
        UICtrl.AddToDom(input.type,item);
        
    }
    
    return{
        init:function(){
            console.log("app started");
            SetUpEvent();
        }
    }
    
    
    
})(budgetController , UIController);
controller.init();