
//Đối tượng `Validator` 
function Validator (options){

    var selectorRules = {};

    //hàm thực hiện validate
    function validate(inputElement,rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage  = rule.test(inputElement.value);

        //lấy ra rules của selector
        var rules = selectorRules[rule.selector];

        //lặp qua từng rule & check
        //Nếu có lỗi dừng kiểm tra
        for(var i = 0; i < rules.lenght; i++) {
            errorMessage =rules[i](input.value);
            if(errorMessage) break;
        }
        if(errorElement) {
                if(errorMessage) {
                    errorElement.innerText = errorMessage;
                    inputElement.parentElement.classList.add('invalid');
                }else {
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
           return !errorMessage;
        }
     //lấy element của form cần validate
    var formElement= document.querySelector(options.form);

    if(formElement) {

        //Xử lí lặp qua mỗi rule & lắng nghe sự kiện 
        formElement.onsubmit = function(e) {
            e.prevenDefault ();
            var isFormVlaid = true;

            //Lặp qua tung rules & validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                 var isVlaid = validate(inputElement.rule);
                 if(!isVlaid) {
                     isFormVlaid = false;
                 }
            });
            if(isFormVlaid) {
                //Trường hợp submit với javascript
                if(typeof options.onsubmit === 'function') {
                    var enalbleInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.form(enalbleInputs).reduce(function(value, input) {
                        return (value[input.name] =  input.value) && value;
                    }, {});
                    options.onsubmit(formValues);
                    //Trường hợp submit với hành vi mặt định
                }else {
                    formElement.submit();
                }
            }
        }
        //Lặp qua từng rule lắng nghe sự kiện (blur,input,..)
        options.rules.forEach(function(rule) {

            //Lưu lại các rules cho mỗi input 
            //Nếu là mảng gán rule đầu tiên là mảng có 1 phần tử
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)    
            }else{

                selectorRules[rule.selector] = [rule.test]
            }
            var inputElement = formElement.querySelector(rule.selector);
            if(inputElement) {
                //xử lý trường hợp blur ra ngoài input
                inputElement.onblur = function() {
                    validate(inputElement,rule);
                 }

                 //xử lý mỗi khi người dùng nhập vào input
                 inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                 }
            }
      });

    }   
}
//Định nghĩa các rules
//Nguyên tắt của rules
//1.Khi có lỗi trả ra message lỗi
//2.khi hợp lệ không trả ra cái gì cả(undifined)
Validator.isRequired = function (selector,message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined :message || 'Vui lòng nhập trường này';
        }
    };
}
Validator.isEmail = function (selector,message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined :message || 'Trường này phải là email';
        }
    }
}
Validator.minLenght = function (selector,min,message) {
    return {
        selector: selector,
        test: function (value) {
            return value.lenght >= min ? undefined :message || 'Vui lòng nhập ít nhất 6 kí tự';
        }
    }
}
Validator.isConfimed = function (selector,getConfirmValue,message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}