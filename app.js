var budgetController = (function(){
    
    
    return{
        
    }
})();





var UIController = (function(){
    var domstring = {
        typeDom : '.add__type',
        inputDomDescribtion : '.add__description',
        inputDomValue: '.add__value',
        btnAdd : '.add__btn'
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
        }
        
        
    }
})();




var controller = (function(budgetCtrl , UICtrl){
    var SetUpEvent = function () {
        var dom = UICtrl.GetDomString();
        document.querySelector(dom.btnAdd).addEventListener('click' , AddItem);
        document.addEventListener('ketpress' , function(e){
            if(e.keyCode === 13){
                AddItem();
            }
        })
    }
    function AddItem(){
        var input ;
        input = UICtrl.GetDomValue();        
    }
    
    return{
        init:function(){
            console.log("app started");
            SetUpEvent();
        }
    }
    
    
    
})(budgetController , UIController);
controller.init();